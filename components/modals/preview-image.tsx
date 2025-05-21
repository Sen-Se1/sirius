"use client";

import { useRef, useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface PreviewImageProps {
  src: string;
  alt: string;
  onClose: () => void;
  width?: number;
  height?: number;
}

export default function PreviewImage({
  src,
  alt,
  onClose,
  width = 1000,
  height = 800,
}: PreviewImageProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownload = () => {
    const downloadUrl = src.includes("drive.google.com/uc?export=view")
      ? src.replace("export=view", "export=download")
      : src;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = alt || "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
      onClick={handleClickOutside}
      role="dialog"
      aria-label="Image preview modal"
      aria-modal="true"
    >
      <div ref={contentRef} className="relative p-4 max-w-[90vw] max-h-[90vh]">
        <Button
          className="absolute top-[-40px] right-[-40px] bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 md:top-[-48px] md:right-[-48px]"
          aria-label="Close image preview"
          onClick={onClose}
        >
          <X size={24} />
        </Button>
        <Button
          className="absolute top-[-40px] right-[8px] bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2 md:top-[-48px] md:right-[8px]"
          aria-label="Download image"
          onClick={handleDownload}
        >
          <Download size={24} />
        </Button>
        {error ? (
          <div className="text-center text-red-500 bg-white/80 p-4 rounded">
            <p>Failed to load image</p>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="max-w-full max-h-[80vh] object-contain rounded"
            onError={() => setError("Failed to load image")}
            priority
          />
        )}
      </div>
    </div>
  );
}