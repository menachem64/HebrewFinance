import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { rejects } from "assert";

export const useConfirm = (
    title: string,
    message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
   const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null);

   const confirm = () => new Promise((resolve, rejects) => {
    setPromise({ resolve });
   });

   const handleClose = () => {
    setPromise(null);
   };

   const handleConfirm = () => {
    promise?.resolve(true);
    handleClose();
   };

   const handleCancel = () => {
    promise?.resolve(false);
    handleClose();
   };

   const ConfirmationDialog = () => (
    <Dialog open={promise != null}>
    <DialogContent className="text-right">  
        <DialogHeader className="mr-3">
            <DialogTitle className="text-right">{title}</DialogTitle> 
            <DialogDescription className="text-right">{message}</DialogDescription>  
        </DialogHeader>
        <DialogFooter className="pt-2 flex justify-start space-x-2"> 
            <Button
              onClick={handleCancel}
              variant="outline"
            >
                ביטול
            </Button>
            <Button
              onClick={handleConfirm}
            >
                אישור
            </Button>
        </DialogFooter>
    </DialogContent>
</Dialog>

   );

   return [ConfirmationDialog, confirm];
};