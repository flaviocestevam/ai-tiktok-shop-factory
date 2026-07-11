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
