import { useState, useRef } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { useGetAccounts } from "../api/use-get-accounts";
import { useCreateAccount } from "../api/use-create-account";
import { Select } from "@/components/select";

export const useSelectAccount = (
): [() => JSX.Element, () => Promise<unknown>] => {
    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreatAccount = (name: string) => accountMutation.mutate({
        name
    });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id,
    }));

   const [promise, setPromise] = useState<{ resolve: (value: string | undefined) => void } | null>(null);
   const selectValue = useRef<string>();

   const confirm = () => new Promise((resolve, rejects) => {
    setPromise({ resolve });
   });

   const handleClose = () => {
    setPromise(null);
   };

   const handleConfirm = () => {
    promise?.resolve(selectValue.current);
    handleClose();
   };

   const handleCancel = () => {
    promise?.resolve(undefined);
    handleClose();
   };

   const ConfirmationDialog = () => (
    <Dialog open={promise != null}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    בחירת חשבון
                </DialogTitle>
                <DialogDescription>
                    בחר חשבון על מנת להמשיך
                </DialogDescription>
            </DialogHeader>
            <Select
              placeholder="בחר חשבון"
              options={accountOptions}
              onCreate={onCreatAccount}
              onChange={(value) => selectValue.current = value}
              disabled={accountQuery.isLoading || accountMutation.isPending}
            />
            <DialogFooter className="pt-2">
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