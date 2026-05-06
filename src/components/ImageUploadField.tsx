import { useRef } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ImageUploadFieldProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  aspect?: "square" | "video" | "wide";
  className?: string;
}

const aspectMap = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[21/9]",
};

export default function ImageUploadField({ value, onChange, label = "Image", aspect = "video", className = "" }: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-xs font-medium text-admin-text-muted block">{label}</label>
      <div className="flex gap-3 items-start">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
          className={`relative ${aspectMap[aspect]} w-32 rounded-lg overflow-hidden border-2 border-dashed border-admin-border hover:border-primary/60 transition-colors group bg-admin-surface flex items-center justify-center shrink-0`}
        >
          {value ? (
            <>
              <img src={value} alt="preview" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Upload className="h-5 w-5 text-primary-foreground" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-1 text-admin-text-muted">
              <ImageIcon className="h-6 w-6" />
              <span className="text-xs">Upload</span>
            </div>
          )}
        </button>
        <div className="flex-1 space-y-2">
          <Input
            placeholder="Or paste image URL"
            value={value.startsWith("data:") ? "" : value}
            onChange={(e) => onChange(e.target.value)}
            className="bg-admin-surface border-admin-border text-admin-text text-sm"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
            >
              <X className="h-3 w-3" /> Remove
            </button>
          )}
          {value.startsWith("data:") && (
            <p className="text-xs text-admin-text-muted">Uploaded from device</p>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
