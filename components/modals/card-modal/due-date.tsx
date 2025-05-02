"use client";

import { toast } from "sonner";
import { Calendar } from "lucide-react";
import { useState, useRef, ElementRef } from "react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";
import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";

interface DueDateProps {
  data: CardWithList;
}

export const DueDate = ({ data }: DueDateProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  // Convert data.dueDate (string | null) to a Date object or null
  const dueDate = data.dueDate ? new Date(data.dueDate) : null;

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const dueDateStr = formData.get("dueDate") as string;
    const newDueDate = dueDateStr ? new Date(dueDateStr) : null;
    const boardId = params.boardId as string;

    execute({
      id: data.id,
      dueDate: newDueDate,
      boardId,
    });
  };

  const formatDate = (date: Date | null) => {
    return date ? date.toLocaleDateString() : "No due date";
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <Calendar className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Due Date</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              defaultValue={
                dueDate ? dueDate.toISOString().split("T")[0] : ""
              }
              ref={inputRef}
              className="w-full mt-2 p-2 border rounded-md"
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {formatDate(dueDate)}
          </div>
        )}
      </div>
    </div>
  );
};

DueDate.Skeleton = function DueDateSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};