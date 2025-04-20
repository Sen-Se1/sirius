import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";

import { cn } from "@/lib/utils";

const headingFont = localFont({
  src: "../public/fonts/font.woff2",
});

export const Logo = () => {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/Sirius_bg_removed.png"
        alt="Logo Sirius"
        width={120}
        height={32}
        priority
      />
    </Link>
  );
};
