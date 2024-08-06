"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
    id: string;
};

export const Actions = ({ id }: Props) => {
    const [ConfirmDialog, confirm] = useConfirm(
        "!זהירות ",
        "לחיצה על אישור תמחוק את הפעולה הזאת"
    )

    const deleteMutation = useDeleteTransaction(id);
    const { onOpen } = useOpenTransaction();

    const handleDelete = async () => {
          const ok = await confirm();

          if (ok) {
            deleteMutation.mutate();
          }
    };

    return (
        <>
            <ConfirmDialog/>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                       <MoreHorizontal className="size-4"/>
                    </Button>
                </DropdownMenuTrigger>
                 <DropdownMenuContent align="end">
                    <DropdownMenuItem
                       disabled={deleteMutation.isPending}
                       onClick={() => onOpen(id)}
                    >
                        <Edit className="size-4 mr-2"/>
                        עריכה
                    </DropdownMenuItem>
                    <DropdownMenuItem
                       disabled={deleteMutation.isPending}
                       onClick={handleDelete}
                    >
                        <Trash className="size-4 mr-2"/>
                        מחיקה
                    </DropdownMenuItem>
                 </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}