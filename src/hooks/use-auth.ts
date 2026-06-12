import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Set this to true to bypass authentication globally
  const DISABLE_AUTH = true;

  useEffect(() => {
    if (DISABLE_AUTH) {
      setLoading(false);
      return;
    }

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, [DISABLE_AUTH]);

  // Mock session/user when auth is disabled to prevent crashes
  const mockUser = DISABLE_AUTH ? {
    id: "mock-user-id",
    email: "admin@video-factory.ai",
    user_metadata: { full_name: "Administrador (Modo Livre)" },
    aud: "authenticated",
    role: "authenticated",
    app_metadata: {},
    created_at: new Date().toISOString(),
  } : null;

  const mockSession = DISABLE_AUTH ? {
    access_token: "mock-token",
    refresh_token: "mock-refresh",
    expires_in: 3600,
    token_type: "bearer",
    user: mockUser as any,
  } : null;

  return { 
    session: DISABLE_AUTH ? mockSession : session, 
    loading: DISABLE_AUTH ? false : loading, 
    user: DISABLE_AUTH ? mockUser : (session?.user ?? null) 
  };
}
