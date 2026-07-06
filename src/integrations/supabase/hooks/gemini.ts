import { createListHook } from "./_helpers";

export const useGeminiAccounts = createListHook("gemini_accounts", "gemini_accounts", {
  orderBy: "prioridade",
  ascending: true,
});
