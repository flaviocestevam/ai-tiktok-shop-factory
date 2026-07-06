import { createByIdHook, createListHook } from "./_helpers";

const SELECT = "*, conectores:conectores_api(*)";

export const usePerfis = createListHook("perfis", "perfis", { select: SELECT, orderBy: "nome" });
export const usePerfil = createByIdHook("perfis", "perfis", { select: SELECT });
