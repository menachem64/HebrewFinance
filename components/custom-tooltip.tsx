import { format } from "date-fns";

import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { he } from "date-fns/locale";

export const CustomTooltip = ({ active, payload}: any) => {
    if (!active) return null;

    const date = payload[0].payload.date;
    const income = payload[0].value;
    const expenses = payload[1].value;

    return (
        <div className="rounded-sm bg-white shadow-sm border overflow-hidden">
            <div className="text-sm p-2 px-3 bg-muted text-muted-foreground">
                {format(date, "MMM dd, yyyy", {locale: he})}
            </div>
            <Separator />
            <div className="flex flex-col items-end p-2 px-3 space-y-1">
  <div className="flex items-center justify-between gap-x-4">
    <div className="flex items-center justify-end gap-x-2">
      <p className="text-sm font-medium">
        {formatCurrency(income)}
      </p>
      <p className="text-sm text-muted-foreground">
        הכנסות
      </p>
      <div className="size-1.5 bg-blue-500 rounded-full"/>
    </div>
  </div>
  <div className="flex items-center justify-between gap-x-4">
    <div className="flex items-center justify-end gap-x-2">
      <p className="text-sm font-medium">
        {formatCurrency(expenses * -1)}
      </p>
      <p className="text-sm text-muted-foreground">
        הוצאות
      </p>
      <div className="size-1.5 bg-rose-500 rounded-full"/>
    </div>
  </div>
</div>
</div>
    )

};