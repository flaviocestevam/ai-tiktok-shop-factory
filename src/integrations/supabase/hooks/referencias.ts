import { supabase } from "../client";
import {
  createByIdHook,
  createListHook,
  unwrap,
  useInvalidator,
  useMutation,
} from "./_helpers";

const KEY = "videos_referencia";
const TABLE = "videos_referencia" as const;

export const useReferencias = createListHook(KEY, TABLE, {
  select: "*, produto:produtos(nome), perfil:perfis(nome), avatar:avatares(nome)",
  orderBy: "created_at",
  ascending: false,
});

export const useReferencia = createByIdHook(KEY, TABLE, {
  select: "*, produto:produtos(id, nome), perfil:perfis(id, nome), avatar:avatares(id, nome)",
});

export type NovaReferenciaPayload = {
  url_tiktok: string;
  produto_id?: string | null;
  perfil_id?: string | null;
  avatar_id?: string | null;
  tipo_criativo?: "video" | "carrossel";
};

export const useCreateReferencia = () => {
  const invalidate = useInvalidator([KEY]);
  return useMutation({
    mutationFn: async (payload: NovaReferenciaPayload) =>
      unwrap(await supabase.from(TABLE).insert(payload).select().single()),
    onSuccess: () => invalidate(),
  });
};

export const useUpdateReferencia = () => {
  const invalidate = useInvalidator([KEY]);
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Record<string, any>) =>
      unwrap(await supabase.from(TABLE).update(patch as any).eq("id", id).select().single()),
    onSuccess: (_data, v) => invalidate([[KEY, v.id]]),
  });
};
