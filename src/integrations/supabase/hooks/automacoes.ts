import { supabase } from "../client";
import { createListHook, unwrap, useInvalidator, useMutation } from "./_helpers";

export const useAutomacoes = createListHook("automacoes", "automacoes");

export const useToggleAutomacao = () => {
  const invalidate = useInvalidator(["automacoes"]);
  return useMutation({
    mutationFn: async ({ id, ativo }: { id: string; ativo: boolean }) =>
      unwrap(
        await (supabase as any)
          .from("automacoes")
          .update({ ativo })
          .eq("id", id)
          .select()
          .single(),
      ),
    onSuccess: () => invalidate(),
  });
};
