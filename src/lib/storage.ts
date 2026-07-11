import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

/** Faz upload de um arquivo e devolve o path (chave dentro do bucket). */
export async function uploadToBucket(
  bucket: string,
  file: File,
  opts: { prefix?: string } = {},
): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${opts.prefix ? opts.prefix.replace(/\/+$/, "") + "/" : ""}${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: false,
    contentType: file.type || undefined,
  });
  if (error) throw error;
  return path;
}

/** Gera signed URL (padrão 1h). Retorna null se path for vazio. */
export async function getSignedUrl(
  bucket: string,
  path: string | null | undefined,
  expiresIn = 3600,
): Promise<string | null> {
  if (!path) return null;
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);
  if (error) return null;
  return data?.signedUrl ?? null;
}

/** Hook: obtém signed URL com cache. */
export function useSignedUrl(bucket: string, path: string | null | undefined) {
  return useQuery({
    queryKey: ["signed-url", bucket, path],
    queryFn: () => getSignedUrl(bucket, path),
    enabled: !!path,
    staleTime: 55 * 60 * 1000,
  });
}
