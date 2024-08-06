import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { columns } from "./columns";
import { cn } from "@/lib/utils";

type Props = {
    columnIndex: number;
    selectedColumns: Record<string, string | null>;
    onChange: (
        columnIndex: number,
        value: string | null
    ) => void;
};

const options = [
   {name: "סכום", value: "amount"},
   {name: "מקבל התשלום", value: "payee"},
   {name: "יום", value: "date"}
]

export const TableHeadSelect = ({
    columnIndex,
    selectedColumns,
    onChange,
}: Props) => {
    const currentSelection = selectedColumns[`column_${columnIndex}`];

    return (
        <Select
          value={currentSelection || ""}
          onValueChange={(value) => onChange(columnIndex, value)}
        >
            <SelectTrigger
              className={cn(
                "focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",
                currentSelection && "text-blue-500"
              )}
            >
                <SelectValue placeholder="דלג" />
            </SelectTrigger>
             <SelectContent>
                <SelectItem value="skip">דלג</SelectItem>
                  {options.map((option, index) => {
                      const disabled =
                        Object.values(selectedColumns).includes(option.value)
                        && selectedColumns[`column_${columnIndex}`] !== option.value;

                    return (
                      <SelectItem
                        key={index}
                        value={option.value}
                        disabled={disabled}
                        className="capitalize"
                      >
                        {option.name}
                      </SelectItem>
                    )
                  })}
               </SelectContent>
        </Select>
    )
}