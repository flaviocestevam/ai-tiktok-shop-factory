// Login desativado — operador único, acesso direto.
export function useAuth() {
  return {
    session: { user: { id: "local-operator" } } as any,
    loading: false,
    user: { id: "local-operator" } as any,
  };
}
