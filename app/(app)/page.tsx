import Link from "next/link";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import ScrollingCards from "./_components/scrolle-cards";

const headingFont = localFont({
  src: "../../public/fonts/font.woff2",
});

const textFont = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const MarketingPage = () => {
  return (
    <main className="flex-grow bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row items-center bg-gray-50 dark:bg-gray-900">
        <div className="px-6 lg:px-8 py-24 sm:py-32 w-full lg:w-2/3">
          <div className="mx-auto max-w-7xl text-center lg:text-left">
            <h1
              className={cn(
                "text-4xl font-bold tracking-tight sm:text-6xl text-gray-900 dark:text-white",
                headingFont.className
              )}
            >
              Transform the way you collaborate
            </h1>
            <p
              className={cn(
                "mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl",
                textFont.className
              )}
            >
              Sirius is a modular platform that combines project management and
              real-time communication for more efficient and flexible
              collaboration.
            </p>
            <div className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
              <Button asChild>
                <Link href="/sign-up">
                  Start for free <ArrowRight className="inline h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3 flex items-center justify-center p-8">
          <Image
            src="/dash.png"
            alt="Dashboard preview"
            width={500}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <h2
              className={cn(
                "text-sm font-medium text-indigo-600 dark:text-indigo-400 uppercase tracking-widest",
                headingFont.className
              )}
            >
              Optimize your productivity
            </h2>
            <p
              className={cn(
                "mt-2 text-xl font-extrabold tracking-tight sm:text-4xl text-gray-800 dark:text-gray-100",
                headingFont.className
              )}
            >
              Impact of Sirius according to Forrester
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
            <div className="p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <p
                className={cn(
                  "text-2xl font-extrabold text-indigo-600 dark:text-indigo-400",
                  textFont.className
                )}
              >
                +288%
              </p>
              <p
                className={cn(
                  "mt-2 text-md text-gray-700 dark:text-gray-300 font-medium",
                  textFont.className
                )}
              >
                Return on investment
              </p>
              <span className="mt-3 inline-block text-2xl text-indigo-500 dark:text-indigo-300">
                📈
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <p
                className={cn(
                  "text-2xl font-extrabold text-green-600 dark:text-green-400",
                  textFont.className
                )}
              >
                15,600
              </p>
              <p
                className={cn(
                  "mt-2 text-md text-gray-700 dark:text-gray-300 font-medium",
                  textFont.className
                )}
              >
                Hours saved
              </p>
              <span className="mt-3 inline-block text-2xl text-green-500 dark:text-green-300">
                ⏳
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <p
                className={cn(
                  "text-2xl font-extrabold text-yellow-600 dark:text-yellow-400",
                  textFont.className
                )}
              >
                -50%
              </p>
              <p
                className={cn(
                  "mt-2 text-md text-gray-700 dark:text-gray-300 font-medium",
                  textFont.className
                )}
              >
                Reduction in meetings
              </p>
              <span className="mt-3 inline-block text-2xl text-yellow-500 dark:text-yellow-300">
                📉
              </span>
            </div>

            <div className="p-5 bg-white dark:bg-gray-700 rounded-2xl shadow-md hover:shadow-lg transition duration-300">
              <p
                className={cn(
                  "text-2xl font-extrabold text-blue-600 dark:text-blue-400",
                  textFont.className
                )}
              >
                €489K
              </p>
              <p
                className={cn(
                  "mt-2 text-md text-gray-700 dark:text-gray-300 font-medium",
                  textFont.className
                )}
              >
                Net value
              </p>
              <span className="mt-3 inline-block text-2xl text-blue-500 dark:text-blue-300">
                💰
              </span>
            </div>
          </div>
        </div>
      </div>
      <ScrollingCards />
    </main>
  );
};

export default MarketingPage;