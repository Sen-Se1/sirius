"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { toggleFavorite } from "@/actions/favorite";
import { useAction } from "@/hooks/use-action";

interface BoardFavoriteProps {
  boardId: string;
  isFavorite: boolean;
}

export const BoardFavorite = ({ boardId, isFavorite: initialIsFavorite }: BoardFavoriteProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);

  const { execute, isLoading } = useAction(toggleFavorite, {
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite);
      toast.success(
        data.isFavorite ? "Board added to favorites!" : "Board removed from favorites!"
      );
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleToggle = () => {
    execute({ boardId });
  };

  return (
    <Button
      variant="transparent"
      className="h-auto w-auto p-2"
      onClick={handleToggle}
      disabled={isLoading}
    >
      <Star
        className={`h-4 w-4 ${isFavorite ? "text-yellow-500 fill-yellow-500" : ""}`}
      />
    </Button>
  );
};