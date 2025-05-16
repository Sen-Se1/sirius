"use client";

import { CardWithList } from "@/types";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";
import { AlignLeft, CheckSquare, Clock } from "lucide-react";
import { FaComment } from "react-icons/fa";

interface CardItemProps {
  data: CardWithList;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  const cardModal = useCardModal();

  const formattedDueDate = data.dueDate
    ? new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "long",
      }).format(data.dueDate)
    : null;

  // Get today's date and tomorrow's date for comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to start of day
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Check if dueDate is today or overdue (red) or tomorrow (yellow)
  let dueDateClass = "flex items-center text-gray-500 text-xs p-1 rounded-md";
  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    dueDate.setHours(0, 0, 0, 0); // Normalize to start of day
    if (dueDate <= today) {
      dueDateClass += " bg-red-300"; // Overdue or today
    } else if (dueDate.getTime() === tomorrow.getTime()) {
      dueDateClass += " bg-yellow-300"; // Due tomorrow
    }
  }

  const priorityBgMap: Record<string, string> = {
    high: "bg-red-100",
    medium: "bg-white",
    low: "bg-green-50",
  };

  // Compute background class based on priority
  const priorityKey = data.priority?.toLowerCase();
  const priorityBgClass = priorityKey ? priorityBgMap[priorityKey] : undefined;
  const bgClass = priorityBgClass || "bg-white";

  // Define card class with dynamic background
  const cardClass = `truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm ${bgClass} rounded-md shadow-sm`;

  // Calculate total and checked items
  const totalItems = data.checklists.reduce((sum, checklist) => sum + checklist.items.length, 0);
  const checkedItems = data.checklists.reduce((sum, checklist) => sum + checklist.items.filter(item => item.checked).length, 0);
  const checklistDisplay = totalItems > 0 ? `${checkedItems}/${totalItems}` : "0/0";

  // Determine checklist background class based on all items checked
  const checklistBgClass = totalItems > 0 && checkedItems === totalItems ? "bg-green-300" : "";

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className={cardClass}
        >
          {data.title}
          {(formattedDueDate || data.description || totalItems > 0) && (
            <div className="flex items-center gap-2 text-xs mt-1 overflow-hidden">
              {formattedDueDate && (
                <div className={dueDateClass}>
                  <Clock className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{formattedDueDate}</span>
                </div>
              )}
              {data.description && (
                <div className="flex items-center text-gray-500 truncate p-1 rounded-md">
                  <AlignLeft className="w-4 h-4 mr-1 flex-shrink-0" />
                </div>
              )}
              {totalItems > 0 && (
                <div className={`flex items-center text-gray-500 truncate p-1 rounded-md ${checklistBgClass}`}>
                  <CheckSquare className="w-4 h-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{checklistDisplay}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
};