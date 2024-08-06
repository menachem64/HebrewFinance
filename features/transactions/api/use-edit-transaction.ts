import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient} from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
     Error,
     RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({ 
                json,
                param: { id }
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("הפעולה התעדכנה");
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }]});
            queryClient.invalidateQueries({ queryKey: ["transactions"]});
            queryClient.invalidateQueries({ queryKey: ["summary"]});
        },
        onError: () => {
            toast.error("נכשל בלערוך את הפעולה");
        }
    })
    return mutation;
}