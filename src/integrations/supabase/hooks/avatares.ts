import { createByIdHook, createListHook } from "./_helpers";

const SELECT = "*, fotos:avatar_fotos(*)";

export const useAvatares = createListHook("avatares", "avatares", { select: SELECT, orderBy: "nome" });
export const useAvatar = createByIdHook("avatares", "avatares", { select: SELECT });
