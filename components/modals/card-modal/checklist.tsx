"use client";

import { useState, useRef, ElementRef } from "react";
import { toast } from "sonner";
import { CheckSquare, Trash2, Check } from "lucide-react";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/form/form-input";
import { FormSubmit } from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { updateChecklist } from "@/actions/update-checklist";
import { deleteChecklist } from "@/actions/delete-checklist";
import { createChecklistItem } from "@/actions/create-checklist-item";
import { updateChecklistItem } from "@/actions/update-checklist-item";
import { deleteChecklistItem } from "@/actions/delete-checklist-item";

interface ChecklistProps {
  data: CardWithList;
}

export const Checklist = ({ data }: ChecklistProps) => {
  const params = useParams();
  const queryClient = useQueryClient();
  const boardId = params.boardId as string;

  if (data.checklists.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {data.checklists.sort((a, b) => a.order - b.order).map((checklist) => (
        <ChecklistItem
          key={checklist.id}
          checklist={checklist}
          boardId={boardId}
          cardId={data.id}
        />
      ))}
    </div>
  );
};

interface ChecklistItemProps {
  checklist: CardWithList["checklists"][0];
  boardId: string;
  cardId: string;
}

const ChecklistItem = ({ checklist, boardId, cardId }: ChecklistItemProps) => {
  const queryClient = useQueryClient();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const titleFormRef = useRef<ElementRef<"form">>(null);
  const titleInputRef = useRef<ElementRef<"input">>(null);
  const itemFormRef = useRef<ElementRef<"form">>(null);
  const itemInputRef = useRef<ElementRef<"input">>(null);

  const enableTitleEditing = () => {
    setIsEditingTitle(true);
    setTimeout(() => {
      titleInputRef.current?.focus();
    });
  };

  const disableTitleEditing = () => {
    setIsEditingTitle(false);
  };

  const enableItemAdding = () => {
    setIsAddingItem(true);
    setTimeout(() => {
      itemInputRef.current?.focus();
    });
  };

  const disableItemAdding = () => {
    setIsAddingItem(false);
  };

  const onTitleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableTitleEditing();
    }
  };

  const onItemKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableItemAdding();
    }
  };

  useEventListener("keydown", onTitleKeyDown);
  useEventListener("keydown", onItemKeyDown);
  useOnClickOutside(titleFormRef, disableTitleEditing);
  useOnClickOutside(itemFormRef, disableItemAdding);

  const { execute: executeUpdateChecklist } = useAction(updateChecklist, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      toast.success(`Checklist "${data.title}" updated`);
      disableTitleEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeDeleteChecklist } = useAction(deleteChecklist, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      toast.success(`Checklist "${data.title}" deleted`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeCreateItem, fieldErrors: itemFieldErrors } = useAction(createChecklistItem, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      toast.success(`Item "${data.title}" added`);
      disableItemAdding();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onUpdateTitle = (formData: FormData) => {
    const title = formData.get("title") as string;
    executeUpdateChecklist({ id: checklist.id, title, boardId });
  };

  const onDeleteChecklist = () => {
    executeDeleteChecklist({ id: checklist.id, boardId });
  };

  const onAddItem = (formData: FormData) => {
    const title = formData.get("title") as string;
    executeCreateItem({ checklistId: checklist.id, title });
  };

  const totalItems = checklist.items.length;
  const checkedItems = checklist.items.filter((item) => item.checked).length;
  const progress = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-x-2 w-full">
          <CheckSquare className="h-5 w-5 text-neutral-700" />
          {isEditingTitle ? (
            <form action={onUpdateTitle} ref={titleFormRef} className="flex items-center gap-x-2 w-full">
              <FormInput
                id="title"
                className="flex-1 mt-0 h-8"
                defaultValue={checklist.title}
                ref={titleInputRef}
              />
              <div className="flex items-center gap-x-2">
                <FormSubmit>Save</FormSubmit>
                <Button
                  type="button"
                  onClick={disableTitleEditing}
                  size="sm"
                  variant="ghost"
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <p
              onClick={enableTitleEditing}
              role="button"
              className="font-semibold text-neutral-700 text-base ml-[2px]"
            >
              {checklist.title}
            </p>
          )}
        </div>
        {!isEditingTitle && (
          <Button
            onClick={onDeleteChecklist}
            variant="destructive"
            size="sm"
            className="bg-red-500 text-white hover:bg-red-600 transition-all duration-200 rounded-md px-3 py-1 flex items-center gap-x-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        )}
      </div>
      <div className="rounded-md py-3 px-3.5">
        <div className="w-full bg-neutral-300 rounded-full h-2.5 mb-2">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-neutral-700 mb-2">{progress}%</p>
        {checklist.items.sort((a, b) => a.order - b.order).map((item) => (
          <ChecklistItemRow
            key={item.id}
            item={item}
            boardId={boardId}
            cardId={cardId}
          />
        ))}
        {isAddingItem ? (
          <form action={onAddItem} ref={itemFormRef} className="space-y-2">
            <FormInput
              id="title"
              className="w-full mt-2"
              errors={itemFieldErrors}
              ref={itemInputRef}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Add</FormSubmit>
              <Button
                type="button"
                onClick={disableItemAdding}
                size="sm"
                variant="ghost"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={enableItemAdding}
            variant="gray"
            className="w-full justify-start"
            size="sm"
          >
            Add an item
          </Button>
        )}
      </div>
    </div>
  );
};

interface ChecklistItemRowProps {
  item: CardWithList["checklists"][0]["items"][0];
  boardId: string;
  cardId: string;
}

const ChecklistItemRow = ({ item, boardId, cardId }: ChecklistItemRowProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

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

  const { execute: executeUpdateItem } = useAction(updateChecklistItem, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      toast.success(`Item "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeDeleteItem } = useAction(deleteChecklistItem, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", cardId] });
      toast.success(`Item "${data.title}" deleted`);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onUpdateItem = (formData: FormData) => {
    const title = formData.get("title") as string;
    executeUpdateItem({ id: item.id, title, boardId });
  };

  const onToggleCheck = () => {
    executeUpdateItem({ id: item.id, checked: !item.checked, boardId });
  };

  const onDeleteItem = () => {
    executeDeleteItem({ id: item.id, boardId });
  };

  return (
    <div
      className="flex items-center gap-x-2 w-full mb-2 py-2 rounded-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Button
        onClick={onToggleCheck}
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0"
      >
        {item.checked ? (
          <Check className="h-4 w-4 text-blue-600" />
        ) : (
          <div className="h-4 w-4 border border-neutral-600 rounded-sm" />
        )}
      </Button>
      {isEditing ? (
        <form action={onUpdateItem} ref={formRef} className="flex-1">
          <FormInput
            id="title"
            className="w-full"
            defaultValue={item.title}
            ref={inputRef}
          />
        </form>
      ) : (
        <>
          <p
            onClick={enableEditing}
            role="button"
            className={`text-sm flex-1 ${item.checked ? "line-through text-neutral-500" : "text-neutral-700"}`}
          >
            {item.title}
          </p>
          {isHovered && (
            <Button
              onClick={onDeleteItem}
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 text-neutral-600 hover:text-red-500 transition-colors duration-200"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </>
      )}
    </div>
  );
};

Checklist.Skeleton = function ChecklistSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-2.5 mb-2 bg-neutral-200" />
        <Skeleton className="w-16 h-4 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-8 bg-neutral-200" />
      </div>
    </div>
  );
};