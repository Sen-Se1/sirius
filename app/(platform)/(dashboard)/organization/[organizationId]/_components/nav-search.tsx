import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ChangeEvent } from "react";

interface NavbarSearchProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const NavbarSearch = ({ value, onChange }: NavbarSearchProps) => {
  return (
    <div className="flex items-center space-x-2 max-w-md">
      <div className="relative w-64">
        <Input
          placeholder="Search..."
          className="h-8 w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white pl-8"
          value={value}
          onChange={onChange}
        />
        <Search
          className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400"
        />
      </div>
    </div>
  );
};

export default NavbarSearch;