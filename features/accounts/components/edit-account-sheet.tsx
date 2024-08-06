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
import { Mutation } from "@tanstack/react-query";
import { useOpenAccount } from "../hooks/use-open-account";
import { useGetAccount } from "../api/use-get-account";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "../api/use-edit-account";
import { useDeleteAccount } from "../api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

const formSchema = insertAccountSchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
    const { isOpen, onClose, id } = useOpenAccount();

    const [ConfirmDialog, confirm] = useConfirm(
      "!זהירות",
      "הפעולה תמחוק את החשבון הזה"
    )

    const accountQuery = useGetAccount(id);
    const editMutation = useEditAccount(id);
    const deleteMutation = useDeleteAccount(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = accountQuery.isLoading;

    const onSubmit = (values: FormValues) => {
      editMutation.mutate(values, {
        onSuccess: () => {
          onClose();
        },
      })
    };

    const onDelete = async () => {
      const ok = await confirm();

      if (ok) {
        deleteMutation.mutate(undefined, {
          onSuccess: () => {
            onClose();
          }
        })
      }
    }

    const defaultValues = accountQuery.data ? {
      name: accountQuery.data.name
    } : {
      name: "",
    };
    
    return (
      <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
           <SheetContent className="space-y-4">
             <SheetHeader>
               <SheetTitle>
                 עריכת חשבון
               </SheetTitle>
                  <SheetDescription>
                    עריכת החשבון הנוכחי   
                   </SheetDescription>
              </SheetHeader>
              {isLoading
                ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-4 text-muted-foreground"/>
                  </div>
                ) : (
                  <AccountForm
                  id={id}
                  onSubmit={onSubmit}
                  disabled={isPending}
                  defaultValues={defaultValues}
                  onDelete={onDelete}
                  />
                )}
           </SheetContent>
        </Sheet>
      </>
    )
}