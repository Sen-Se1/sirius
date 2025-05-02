import { Input } from "@/components/ui/input";

interface NavbarSearchProps {
  bgColor: string;
  textColor: string;
}

const NavbarSearch = ({ bgColor, textColor }: NavbarSearchProps) => {
  const inputBgColor = textColor === "black" ? "#f0f0f0" : "#333333";

  return (
    <div className="flex items-center space-x-2 max-w-md">
      <Input
        placeholder="Search..."
        className="h-8 w-64"
        style={{
          backgroundColor: inputBgColor,
          color: textColor,
          borderColor: textColor === "black" ? "#d1d5db" : "#4b5563",
        }}
      />
    </div>
  );
};

export default NavbarSearch;
