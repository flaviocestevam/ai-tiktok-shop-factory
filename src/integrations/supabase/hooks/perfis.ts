import { supabase } from "../client";
import {
  createByIdHook,
  createListHook,
  unwrap,
  useInvalidator,
  useMutation,
} from "./_helpers";

const SELECT = "*, conectores:conectores_api(*)";
const KEY = "perfis";
const TABLE = "perfis" as const;

export const usePerfis = createListHook(KEY, TABLE, { select: SELECT, orderBy: "nome" });
export const usePerfil = createByIdHook(KEY, TABLE, { select: SELECT });

export type NovoPerfilPayload = {
  nome: string;
  nicho?: string | null;
  pais?: string | null;
  plataforma?: string | null;
  descricao?: string | null;
  status?: string;
};

export const useCreatePerfil = () => {
  const invalidate = useInvalidator([KEY]);
  return useMutation({
    mutationFn: async (payload: NovoPerfilPayload) =>
      unwrap(
        await (supabase as any)
          .from(TABLE)
          .insert({ status: "ativo", ...payload })
          .select()
          .single(),
      ),
    onSuccess: () => invalidate(),
  });
};
