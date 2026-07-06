import { createListHook } from "./_helpers";

export const useCriativos = createListHook("criativos", "criativos", {
  select: "*, produto:produtos(nome), avatar:avatares(nome), referencia:videos_referencia(url_tiktok)",
  orderBy: "created_at",
  ascending: false,
});
