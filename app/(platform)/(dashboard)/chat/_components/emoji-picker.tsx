"use client";

import { useRef, useEffect } from "react";
import Picker from "emoji-picker-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
}

export default function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full right-0 mb-2 z-20 bg-white rounded-lg shadow-lg"
    >
      <Picker
        skinTonesDisabled
        previewConfig={{ showPreview: false }}
        onEmojiClick={(emojiObject) => {
          onEmojiSelect(emojiObject.emoji);
          onClose();
        }}
      />
    </div>
  );
}