"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/actions/favorite";

interface BoardFavoriteProps {
  boardId: string;
  isFavorite: boolean;
}

export const BoardFavorite = ({ boardId, isFavorite: initialIsFavorite }: BoardFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleFavorite({ boardId });
      if (result.data) {
        setIsFavorite(result.data.isFavorite);
        toast.success(
          result.data.isFavorite
            ? "Board added to favorites!"
            : "Board removed from favorites!"
        );
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Button
      variant="transparent"
      className="h-auto w-auto p-2"
      onClick={handleToggle}
      disabled={isPending}
    >
      <Star
        className={`h-4 w-4 ${isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`}
      />
    </Button>
  );
};