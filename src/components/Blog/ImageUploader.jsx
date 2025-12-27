import { useState, useCallback, useRef } from "react";
import { X } from "lucide-react";

export default function ImageUploader({ value, onChange, isUploading }) {
  const [previewUrl, setPreviewUrl] = useState(value);
  const fileInputRef = useRef(null);

  const handleFileUpload = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        // Validate file type
        if (!file.type.startsWith("image/")) {
          alert("Please select a valid image file");
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert("Image size must be less than 5MB");
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const base64 = event.target?.result;
          if (typeof base64 === "string") {
            setPreviewUrl(base64);
            onChange(base64);
          }
        };
        reader.readAsDataURL(file);
      }
    },
    [onChange]
  );

  const handleUrlPaste = useCallback(
    (e) => {
      const url = e.target.value;
      setPreviewUrl(url);
      onChange(url);
    },
    [onChange]
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      setPreviewUrl("");
      onChange("");
    },
    [onChange]
  );

  return (
    <div
      className="group relative w-full h-48 bg-zinc-900 border-2 border-dashed border-zinc-800 rounded-xl overflow-hidden flex flex-col items-center justify-center transition-colors hover:border-zinc-700 hover:bg-zinc-800/50 cursor-pointer"
      onClick={() => fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
    >
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="hidden"
      />

      {previewUrl ? (
        <>
          <img
            src={previewUrl}
            className="w-full h-full object-cover"
            alt="Cover preview"
          />
          {!isUploading && (
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </>
      ) : (
        <div className="text-center p-6">
          <div className="w-10 h-10 text-zinc-600 mx-auto mb-2 group-hover:text-zinc-400">
            <svg
              className="w-full h-full"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-sm text-zinc-500 mb-4">
            {isUploading
              ? "Uploading image..."
              : "Click to upload cover image or paste URL below"}
          </p>
          {!isUploading && (
            <input
              type="text"
              placeholder="Or paste image URL here..."
              value={previewUrl}
              onChange={handleUrlPaste}
              onClick={(e) => e.stopPropagation()}
              className="w-64 bg-black border border-zinc-700 rounded px-3 py-2 text-xs text-white text-center focus:outline-none focus:border-zinc-500"
            />
          )}
        </div>
      )}
    </div>
  );
}
