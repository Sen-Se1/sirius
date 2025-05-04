import { useState } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UIMessage } from "@/types";

interface SearchPanelProps {
  setShowSearch: (show: boolean) => void;
  setShowProfile: (show: boolean) => void;
  isVisible?: boolean;
  realtimeMessages: UIMessage[];
  setSearchResults: (results: UIMessage[]) => void;
}

export default function SearchPanel({ setShowSearch, setShowProfile, isVisible = true, realtimeMessages, setSearchResults }: SearchPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setLocalSearchResults] = useState<UIMessage[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const results = realtimeMessages.filter((msg) =>
        msg.text?.toLowerCase().includes(searchTerm.toLowerCase()) || false
      );
      setLocalSearchResults(results);
      setSearchResults(results);
      setHasSearched(true);
    } else {
      setLocalSearchResults([]);
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleInputChange = (value: string) => {
    setSearchTerm(value);
    if (!value.trim()) {
      setLocalSearchResults([]);
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const clearInput = () => {
    setSearchTerm("");
    setLocalSearchResults([]);
    setSearchResults([]);
    setHasSearched(false);
  };

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
        <div className="p-4 flex-1 flex flex-col">
          <div className="relative w-full mb-2">
            <Input
              type="text"
              placeholder="Search in conversation"
              className="w-full pl-10 pr-10 py-2 border-0 rounded-lg bg-gray-100"
              value={searchTerm}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearInput}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:bg-gray-200"
                aria-label="Clear search"
              >
                <X size={20} />
              </Button>
            )}
          </div>
          {searchTerm && !hasSearched && (
            <p className="text-center text-gray-500 text-sm mb-2">Press "Enter" to search.</p>
          )}
          {searchTerm && hasSearched && (
            <ScrollArea className="h-[calc(100vh-160px)]">
              <div className="space-y-4 p-2">
                {searchResults.length > 0 ? (
                  searchResults.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-lg ${
                        msg.isFromCurrentUser
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p>{msg.text || "No text"}</p>
                      <p className="text-xs text-gray-500">{msg.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500">No results found</p>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}