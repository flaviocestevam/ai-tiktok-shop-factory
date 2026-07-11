import { supabase } from "../client";
import {
  createByIdHook,
  createListHook,
  unwrap,
  useInvalidator,
  useMutation,
} from "./_helpers";

export const useProdutos = createListHook("produtos", "produtos", { orderBy: "nome" });
export const useProduto = createByIdHook("produtos", "produtos", {
  select: "*, perfil:perfis(nome)",
});

export const useUpdateProduto = () => {
  const invalidate = useInvalidator(["produtos"]);
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Record<string, any>) =>
      unwrap(await (supabase as any).from("produtos").update(patch).eq("id", id).select().single()),
    onSuccess: (_d, v) => invalidate([["produtos", v.id]]),
  });
};

export const useCreateProduto = () => {
  const invalidate = useInvalidator(["produtos"]);
  return useMutation({
    mutationFn: async (payload: Record<string, any>) =>
      unwrap(await (supabase as any).from("produtos").insert(payload).select().single()),
    onSuccess: () => invalidate(),
  });
};
