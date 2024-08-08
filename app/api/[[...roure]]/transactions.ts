import { Hono } from "hono";
import { z } from "zod";
import { parse, subDays } from "date-fns";
import { he } from 'date-fns/locale';

import { eq, and, inArray, gte, lte, desc, sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { zValidator } from "@hono/zod-validator";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";

import { db } from "@/db/drizzle"
import { transactions, insertTransactionSchema, accounts, categories, extendedSchema } from "@/db/schema";
import { convertAmountFromMiliunits } from "@/lib/utils";


const app = new Hono()
  .get(
    "/",
    zValidator("query", z.object({
      from: z.string().optional(),
      to: z.string().optional(),
      accountId: z.string().optional(),
    })),
   clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { from, to, accountId } = c.req.valid("query");

    if (!auth?.userId) {
        return c.json({ error: "לא מוגדר"}, 401)
    }

    const defaultTo = new Date();
    const defaultFrom = subDays(defaultTo, 30);

    const startDate = from
       ? parse(from, "yyyy-MM-dd", new Date(), { locale: he })
       : defaultFrom;

    const endDate = to
       ? parse(to, "yyyy-MM-dd", new Date(), { locale: he })
       : defaultTo;

    const data = await db
    .select({
        id: transactions.id,
        date: transactions.date,
        category: categories.name,
        categoryId: transactions.categoryId,
        payee: transactions.payee,
        amount: transactions.amount,
        notes: transactions.notes,
        account: accounts.name,
        accountId: transactions.accountId
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        accountId ? eq(transactions.accountId, accountId) : undefined,
        eq(accounts.userId, auth.userId), 
        gte(transactions.date, startDate),       
        lte(transactions.date, endDate) 
       )
    )
    .orderBy(desc(transactions.date));

    return c.json({ data });
  })
  .get(
  "/:id",
  zValidator("param", z.object({
    id: z.string().optional(),
  })),
  clerkMiddleware(),
  async (c) => {
    const auth = getAuth(c);
    const { id } = c.req.valid("param");

    if (!id) {
      return c.json({ error: "חסר מזהה"}, 400);
    }

    if (!auth?.userId) {
      return c.json({ error: "לא מוגדר"}, 401);
    }

    const [data] = await db
    .select({
      id: transactions.id,
      date: transactions.date,
      categoryId: transactions.categoryId,
      payee: transactions.payee,
      amount: transactions.amount,
      notes: transactions.notes,
      accountId: transactions.accountId
    })
    .from(transactions)
    .innerJoin(accounts, eq(transactions.accountId, accounts.id))
    .where(
      and(
        eq(transactions.id, id),
        eq(accounts.userId, auth.userId),
      ),
    );

    if (!data) {
      return c.json({ error: "לא נמצא" }, 404);
    }

    return c.json({ data });
  }
  )
  .post("/",
    clerkMiddleware(),
    zValidator("json",
      extendedSchema.omit({
        id: true,
    }),
  ),

  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
        return c.json({ error: "לא מוגדר"}, 401)
    }

    const [data] = await db.insert(transactions).values({
        id: createId(),
        date: values.date,
        amount: values.amount,
        payee: values.payee,
        notes: values.notes,
        accountId: values.account.value,
        categoryId: values.category?.value
    }).returning();

        //post data at google sheet
        const dataForSheet = {
          date: values.date,
          amount: convertAmountFromMiliunits(data.amount),
          payee: values.payee,
          notes: values.notes,
          category: values.category?.label,
          accounts: values.account.label
        };

        const responseFromSheet = await fetch("https://sheet.best/api/sheets/d3890db6-508d-4cf7-92f8-9363bf079b7f", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              // אם יש צורך, ניתן להוסיף כאן עוד headers
          },
          body: JSON.stringify(dataForSheet)
      });
  
      const result = await responseFromSheet.json(); // במידה ואתה רוצה לעבד את התשובה מהשרת השני
      console.log( "responseFromSheet:", result );
      console.log("transactionData:",{ data })

      return c.json({ data }); 
    })
  .post(
    "/bulk-create",
    clerkMiddleware(),
    zValidator(
      "json",
      z.array(
        insertTransactionSchema.omit({
          id: true,
        }),
      ),
    ),
    async (c) => {
      const auth = getAuth(c);
      const values = c.req.valid("json");

      if (!auth?.userId) {
        return c.json({ error: "לא מוגדר" }, 401);
      }

      const data = await db
        .insert(transactions)
        .values(
          values.map((value) => ({
            id: createId(),
            ...value,
          }))
        )
        .returning();

        return c.json({ data });
    },
  )
  .post(
  "/bulk-delete",
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      ids: z.array(z.string()),
    }),
  ),
  async (c) => {
    const auth = getAuth(c);
    const values = c.req.valid("json");

    if (!auth?.userId) {
      return c.json({ error: "לא מוגדר" }, 401);
    }

    const transactionsToDelete = db.$with("transactions_to_delete").as(
      db.select({ id: transactions.id }).from(transactions)
      .innerJoin(accounts, eq(transactions.accountId, accounts.id))
      .where(and(
        inArray(transactions.id, values.ids),
        eq(accounts.userId, auth.userId),
      ))
    )

    const data = await db
      .with(transactionsToDelete)
      .delete(categories)
      .where(
        inArray(transactions.id, sql`(select id from${transactionsToDelete})`)
      )
      .returning({
        id: transactions.id,
      });

      return c.json({ data });
  }
  )
  .patch(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    zValidator("json",
       insertTransactionSchema.omit({
         id: true,
    })),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");
      const values = c.req.valid("json");

      if (!id) {
        return c.json({ error: "חסר מזהה" }, 400);
      }

      if (!auth?.userId){
        return c.json({ error: "לא מוגדר" }, 401)
      }

      const transactionsToUpdate = db.$with("transactions_to_update").as(
        db.select({ id: transactions.id }).from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
        ))
      )

      const [data] = await db
       .with(transactionsToUpdate)
       .update(transactions)
       .set(values)
       .where(
          inArray(transactions.id, sql`(select id from${transactionsToUpdate})`)
       )
       .returning();

        if (!data) {
          return c.json({ error: "לא נמצא" }, 404);
        }

        return c.json({ data });
    }
  )
  .delete(
    "/:id",
    clerkMiddleware(),
    zValidator(
      "param",
      z.object({
        id: z.string().optional(),
      }),
    ),
    async (c) => {
      const auth = getAuth(c);
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ error: "חסר מזהה" }, 400);
      }

      if (!auth?.userId){
        return c.json({ error: "לא מוגדר" }, 401)
      }

      const transactionsToDelete = db.$with("transactions_to_delete").as(
        db.select({ id: transactions.id }).from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .where(and(
          eq(transactions.id, id),
          eq(accounts.userId, auth.userId),
        ))
      )

      const [data] = await db
        .with(transactionsToDelete)
        .delete(transactions)
        .where(
          inArray(
            transactions.id,
            sql`(select id from ${transactionsToDelete})`
          ),
        )
        .returning({
          id: transactions.id,
        });

        if (!data) {
          return c.json({ error: "לא נמצא" }, 404);
        }

        return c.json({ data });
    }
  );


export default app;