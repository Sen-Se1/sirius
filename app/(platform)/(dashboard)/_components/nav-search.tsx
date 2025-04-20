import { Input } from "@/components/ui/input";

const NavbarSearch = () => {
  return (
    <div className="flex items-center space-x-2 max-w-md">
      <Input
        placeholder="Search..."
        className="h-8 w-64 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
      />
    </div>
  );
};

export default NavbarSearch;