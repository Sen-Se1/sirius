"use client";

import { useRef } from "react";
import { X } from "lucide-react";
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

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
    if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
      onClick={handleClickOutside}
    >
      <div ref={contentRef} className="relative p-4 max-w-[90vw] max-h-[90vh]">
        <Button
          className="absolute top-[-50px] right-[-50px] bg-white/80 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full p-2"
          aria-label="Close modal"
          onClick={onClose}
        >
          <X size={24} />
        </Button>
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="max-w-full max-h-[80vh] object-contain"
        />
      </div>
    </div>
  );
}