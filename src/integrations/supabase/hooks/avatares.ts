import { supabase } from "../client";
import {
  createByIdHook,
  createListHook,
  unwrap,
  useInvalidator,
  useMutation,
} from "./_helpers";

const SELECT = "*, fotos:avatar_fotos(*)";

export const useAvatares = createListHook("avatares", "avatares", { select: SELECT, orderBy: "nome" });
export const useAvatar = createByIdHook("avatares", "avatares", { select: SELECT });

export const useUpdateAvatar = () => {
  const invalidate = useInvalidator(["avatares"]);
  return useMutation({
    mutationFn: async ({ id, ...patch }: { id: string } & Record<string, any>) =>
      unwrap(await (supabase as any).from("avatares").update(patch).eq("id", id).select().single()),
    onSuccess: (_d, v) => invalidate([["avatares", v.id]]),
  });
};

export const useCreateAvatar = () => {
  const invalidate = useInvalidator(["avatares"]);
  return useMutation({
    mutationFn: async (payload: Record<string, any>) =>
      unwrap(await (supabase as any).from("avatares").insert(payload).select().single()),
    onSuccess: () => invalidate(),
  });
};

export const useUpsertAvatarFoto = () => {
  const invalidate = useInvalidator(["avatares"]);
  return useMutation({
    mutationFn: async (payload: {
      avatar_id: string;
      posicao: string;
      storage_path: string;
      ordem?: number | null;
    }) => {
      const existing = await (supabase as any)
        .from("avatar_fotos")
        .select("id")
        .eq("avatar_id", payload.avatar_id)
        .eq("posicao", payload.posicao)
        .maybeSingle();
      if (existing.data?.id) {
        return unwrap(
          await (supabase as any)
            .from("avatar_fotos")
            .update({ storage_path: payload.storage_path, ordem: payload.ordem ?? null })
            .eq("id", existing.data.id)
            .select()
            .single(),
        );
      }
      return unwrap(
        await (supabase as any)
          .from("avatar_fotos")
          .insert({
            avatar_id: payload.avatar_id,
            posicao: payload.posicao,
            storage_path: payload.storage_path,
            ordem: payload.ordem ?? null,
          })
          .select()
          .single(),
      );
    },
    onSuccess: (_d, v) => invalidate([["avatares", v.avatar_id]]),
  });
};

export const useDeleteAvatarFoto = () => {
  const invalidate = useInvalidator(["avatares"]);
  return useMutation({
    mutationFn: async ({ id }: { id: string; avatar_id: string }) =>
      unwrap(await (supabase as any).from("avatar_fotos").delete().eq("id", id).select().single()),
    onSuccess: (_d, v) => invalidate([["avatares", v.avatar_id]]),
  });
};
