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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useBulkDeleteCategories } from "@/features/categories/api/use-bulk-delete-categories";
import { useNewCategory } from "@/features/categories/hooks/use-new-category";



const CategoriesPage = () => {
    const newCategory = useNewCategory();
    const deleteCategories = useBulkDeleteCategories();
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data || [];

    const isDisabled = 
       categoriesQuery.isLoading ||
       deleteCategories.isPending;

    if (categoriesQuery.isLoading) {
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
           <Button onClick={newCategory.onOpen} size="sm">
                <Plus className="size-4 mr-2"/>
                הוספת חדש
               </Button>
               <CardTitle className="text-xl line-clamp-1">
                קטגוריות
               </CardTitle> 
            </CardHeader>
            <CardContent>
               <DataTable 
                  filterKey="name" 
                  placeholderFilter="שם" 
                  columns={columns} 
                  data={categories}
                  onDelete={(row) => {
                    const ids = row.map((r) => r.original.id);
                    deleteCategories.mutate({ ids });
                  }}
                  disabled={isDisabled}
                   />
            </CardContent>
        </Card>
        </div>
    );
};

export default CategoriesPage;