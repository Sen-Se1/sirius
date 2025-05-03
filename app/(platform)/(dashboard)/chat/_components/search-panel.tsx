import { useState } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchPanelProps {
  setShowSearch: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  isVisible?: boolean;
}

export default function SearchPanel({ setShowSearch, setShowProfile, isVisible = true }: SearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div
      className={`h-[80px] transition-opacity duration-300 border-l-2 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="w-full md:w-80 h-full flex flex-col rounded-lg">
        <div className="p-2 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowSearch(false);
              setShowProfile(true);
            }}
            className="rounded-full"
            aria-label="Close search"
          >
            <X size={20} />
          </Button>
          <div className="flex-1 flex justify-center">
            <h3 className="text-sm font-medium text-black">Search</h3>
          </div>
          <div className="w-10" />
        </div>
        <div className="p-4 flex-1 flex items-center">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search in conversation"
              className="w-full pl-10 pr-4 py-2 border-0 rounded-lg bg-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}