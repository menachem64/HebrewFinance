import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient} from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

export const useBulkDeleteAccount = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
    ResponseType,
     Error,
     RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("החשבונות נמחקו");
            queryClient.invalidateQueries({ queryKey: ["accounts"]});
            //TO DO Also invalidate summary
        },
        onError: () => {
            toast.error("מחיקת החשבונות נכשלה")
        }
    })
    return mutation;
}