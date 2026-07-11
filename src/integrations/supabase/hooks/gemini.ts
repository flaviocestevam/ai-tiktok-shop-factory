import { supabase } from "../client";
import { createListHook, unwrap, useInvalidator, useMutation } from "./_helpers";

const KEY = "gemini_accounts";
const TABLE = "gemini_accounts" as const;

export const useGeminiAccounts = createListHook(KEY, TABLE, {
  orderBy: "prioridade",
  ascending: true,
});

export type NovaGeminiPayload = {
  nome: string;
  api_key_masked: string;
  gcp_project?: string | null;
  prioridade?: number;
  orcamento?: number;
  limite_diario?: number;
  alerta_pct?: number;
  status?: string;
};

export const useCreateGeminiAccount = () => {
  const invalidate = useInvalidator([KEY]);
  return useMutation({
    mutationFn: async (payload: NovaGeminiPayload) =>
      unwrap(
        await (supabase as any)
          .from(TABLE)
          .insert(payload)
          .select()
          .single(),
      ),
    onSuccess: () => invalidate(),
  });
};

export const useUpdateGeminiAccount = () => {
  const invalidate = useInvalidator([KEY]);
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Record<string, any>) =>
      unwrap(
        await (supabase as any)
          .from(TABLE)
          .update(patch)
          .eq("id", id)
          .select()
          .single(),
      ),
    onSuccess: () => invalidate(),
  });
};
