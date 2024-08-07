import { useNewAccount } from "../hooks/use-new-account";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { AccountForm } from "./account-form";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "../api/use-create-account";
import { Mutation } from "@tanstack/react-query";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccount();

    const mutation = useCreateAccount();

    const onSubmit = (values: FormValues) => {
      mutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      })
    }
    
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
           <SheetContent className="space-y-4">
             <SheetHeader>
               <SheetTitle
                className="text-right ml-auto"
                >
                 חשבון חדש
               </SheetTitle>
                  <SheetDescription
                   className="text-right ml-auto"
                   >
                  צור חשבון חדש כדי לעקוב אחר הפעולות שלך     
                 </SheetDescription>
              </SheetHeader>
              <AccountForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{name: ""}}/>
           </SheetContent>
        </Sheet>
    )
}