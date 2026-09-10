"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

/**
 * Campo de subida de imagen para el panel admin: sube el archivo directamente
 * al bucket "media" de Supabase Storage y guarda la URL pública resultante
 * en el campo (mismo formato que antes tenían las URLs pegadas a mano, así
 * que el resto del sitio que ya consume esa columna no necesita cambios).
 */
export function ImageUploadField({
  value,
  onChange,
  folder,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  async function handleFile(file: File) {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen (PNG, JPG, WEBP...).");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setError("La imagen no puede superar 5 MB.");
      return;
    }

    setUploading(true);
    const ext = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
    const path = `${folder}/${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("media").upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    setUploading(false);

    if (uploadError) {
      setError(uploadError.message);
      return;
    }

    const { data } = supabase.storage.from("media").getPublicUrl(path);
    onChange(data.publicUrl);
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
            {/* Imagen ya subida: preview directa, sin optimización de Next
                porque la URL es dinámica y viene de Supabase Storage. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Quitar imagen"
              className="focus-ring absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/20 text-current/40">
            <ImagePlus size={20} />
          </div>
        )}

        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="focus-ring glass-panel flex items-center gap-2 rounded-xl px-3 py-2 text-sm disabled:opacity-60"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {uploading ? "Subiendo..." : value ? "Cambiar imagen" : "Subir imagen"}
          </button>
          <p className="mt-1 text-xs opacity-60">PNG, JPG, WEBP o GIF. Máx. 5 MB.</p>
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
