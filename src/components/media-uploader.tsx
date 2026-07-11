import { useRef, useState } from "react";
import { Upload, Loader2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadToBucket, useSignedUrl } from "@/lib/storage";

type Props = {
  bucket: string;
  path: string | null | undefined;
  onUploaded: (newPath: string) => Promise<void> | void;
  prefix?: string;
  label?: string;
  aspect?: "square" | "portrait" | "video";
  accept?: string;
};

const ASPECT: Record<NonNullable<Props["aspect"]>, string> = {
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  video: "aspect-video",
};

export function MediaUploader({
  bucket,
  path,
  onUploaded,
  prefix,
  label = "Enviar imagem",
  aspect = "portrait",
  accept = "image/*",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { data: url, isLoading } = useSignedUrl(bucket, path);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const newPath = await uploadToBucket(bucket, file, { prefix });
      await onUploaded(newPath);
      toast.success("Imagem enviada.");
    } catch (e: any) {
      toast.error(e?.message || "Falha no upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div
        className={`${ASPECT[aspect]} w-full rounded-lg border border-dashed border-border bg-muted/30 overflow-hidden grid place-items-center relative`}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        ) : url ? (
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground text-xs">
            <ImageOff className="h-5 w-5" />
            Sem imagem
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-background/60 grid place-items-center">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="h-4 w-4" />
        {url ? "Trocar imagem" : label}
      </Button>
    </div>
  );
}
