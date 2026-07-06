import { createByIdHook, createListHook } from "./_helpers";

export const useProdutos = createListHook("produtos", "produtos", { orderBy: "nome" });
export const useProduto = createByIdHook("produtos", "produtos", {
  select: "*, perfil:perfis(nome)",
});
