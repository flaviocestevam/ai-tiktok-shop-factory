import { supabase } from "../client";
import { createListHook, unwrap, useInvalidator, useMutation } from "./_helpers";

export const useCustos = createListHook("custos", "custos", {
  orderBy: "created_at",
  ascending: false,
});

export const useCreateCusto = () => {
  const invalidate = useInvalidator(["custos"]);
  return useMutation({
    mutationFn: async (payload: Record<string, any>) =>
      unwrap(await (supabase as any).from("custos").insert(payload).select().single()),
    onSuccess: () => invalidate(),
  });
};
