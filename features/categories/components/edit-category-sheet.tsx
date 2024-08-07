import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle
} from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { Mutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";
import { CategoryForm } from "./category-form";
import { useGetCategory } from "../api/use-get-category";
import { useOpenCategory } from "../hooks/use-open-category";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";

const formSchema = insertCategorySchema.pick({
  name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory();

    const [ConfirmDialog, confirm] = useConfirm(
      "!זהירות",
      "הפעולה תמחוק את הקטגוריה הזאת"
    )

    const categoryQuery = useGetCategory(id);
    const editMutation = useEditCategory(id);
    const deleteMutation = useDeleteCategory(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = categoryQuery.isLoading;

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

    const defaultValues = categoryQuery.data ? {
      name: categoryQuery.data.name
    } : {
      name: "",
    };
    
    return (
      <>
        <ConfirmDialog />
        <Sheet open={isOpen} onOpenChange={onClose}>
           <SheetContent className="space-y-4">
             <SheetHeader>
               <SheetTitle 
                className="text-right ml-auto"
                >
                 עריכת קטגוריה
               </SheetTitle>
                  <SheetDescription
                   className="text-right ml-auto"
                   >
                    עריכת הקטגוריה הנוכחית             
                  </SheetDescription>
              </SheetHeader>
              {isLoading
                ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="size-4 text-muted-foreground"/>
                  </div>
                ) : (
                  <CategoryForm
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