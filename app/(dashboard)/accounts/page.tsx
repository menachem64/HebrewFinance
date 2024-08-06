"use client"

import { useNewAccount } from "@/features/accounts/hooks/use-new-account";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useBulkDeleteAccount } from "@/features/accounts/api/use-bulk-delete-accounts";
import { Skeleton } from "@/components/ui/skeleton";



const AccountsPage = () => {
    const newAccount = useNewAccount();
    const deleteAccounts = useBulkDeleteAccount();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled = 
       accountsQuery.isLoading ||
       deleteAccounts.isPending;

    if (accountsQuery.isLoading) {
        return (
          <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
          <Card className="border-none drop-shadow-sm">
            <CardHeader className="grid grid-cols-2">
              <div /> {/* Empty div to push the Skeleton to the right */}
              <Skeleton className="h-8 w-48 justify-self-end"/>
            </CardHeader>
            <CardContent>
              <div className="h-[500px] w-full flex items-center justify-center">
                <Loader2 className="size-6 text-slate-300 animate-spin"/>
              </div>
            </CardContent>
          </Card>
        </div>        
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
        <Card className="broder-none drop-shadow-sm">
            <CardHeader className="gep-y-2 flex-row items-center justify-between">
               <Button onClick={newAccount.onOpen} size="sm">
                <Plus className="size-4 mr-2"/>
               הוספת חדש
               </Button>
               <CardTitle className="text-xl line-clamp-1">   
                 חשבונות
               </CardTitle> 
            </CardHeader>
            <CardContent>
               <DataTable 
                  filterKey="name" 
                  placeholderFilter="שם"  
                  columns={columns} 
                  data={accounts}
                  onDelete={(row) => {
                    const ids = row.map((r) => r.original.id);
                    deleteAccounts.mutate({ ids });
                  }}
                  disabled={isDisabled}
                   />
            </CardContent>
        </Card>
        </div>
    );
};

export default AccountsPage;