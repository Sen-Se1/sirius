"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBox,
  faTag,
  faTools,
  faPuzzlePiece,
} from "@fortawesome/free-solid-svg-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  FileText,
  Globe2,
  Settings,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen1, setMenuOpen1] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const styles = `
  .no-focus-outline:focus {
    outline: none;
    box-shadow: none;
  }
`;
  return (
    <>
      <style>{styles}</style>
      <header
        className={`fixed top-0 w-full flex justify-between h-[62px] items-center pr-6 pl-6 pt-[-1px] pb-[-1px]
border-b-2 border-black dark:border-white transition-all duration-300 ease-in-out z-50 shadow-lg
${
  scrolled
    ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-md"
    : "bg-white dark:bg-gray-900"
}`}
      >
        <div className="flex items-center gap-24">
          <div className="pb-2">
            <Logo />
          </div>
          <div className="flex items-center gap-10">
            <Link
              href="/pricing"
              className="relative text-gray-900 dark:text-gray-100 text-base font-bold 
      after:content-[''] after:absolute after:left-0 after:top-6  
      after:w-0 after:h-[4px] after:bg-indigo-900 after:rounded-sm
      after:transition-[width] after:duration-300 after:ease-in-out 
      hover:after:w-full"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faTag}
                  className="text-gray-900 dark:text-gray-100 text-sm w-4 h-4"
                />
                <span>Pricing</span>
              </div>
            </Link>
            <Link
              href="/offers"
              className="relative text-gray-900 dark:text-gray-100 text-base font-bold 
      after:content-[''] after:absolute after:left-0 after:top-6
      after:w-0 after:h-[4px] after:bg-indigo-900 after:rounded-sm
      after:transition-[width] after:duration-300 after:ease-in-out 
      hover:after:w-full"
            >
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faBox}
                  className="text-gray-900 dark:text-gray-100 text-sm w-4 h-4"
                />
                <span>Offers</span>
              </div>
            </Link>

            {/* Fonctionnalités Dropdown */}
            <DropdownMenu
              open={menuOpen1}
              onOpenChange={(open) => {
                setMenuOpen1(open);
                if (open) setMenuOpen(false);
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-x-2 text-gray-900 dark:text-gray-100 font-bold hover:text-indigo-900 dark:hover:text-indigo-300 no-focus-outline"
                >
                  <FontAwesomeIcon
                    icon={faTools}
                    className="text-gray-900 dark:text-gray-100 text-sm h-4 w-4"
                  />
                  Features
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-screen mt-2 bg-gray-800 text-white shadow-lg border-t-2 border-indigo-400"
                side="bottom"
                align="center"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="py-8 px-6 max-w-7xl mx-auto"
                >
                  <div className="text-center">
                    <h2 className="text-sm font-semibold leading-6 text-indigo-400">
                      Main Features
                    </h2>
                    <p className="mt-6 text-base leading-8 text-gray-300">
                      A comprehensive suite of tools designed to optimize your
                      productivity and streamline collaboration.
                    </p>
                  </div>
                  <div className="mt-8 max-w-2xl mx-auto lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-indigo-400">
                          <Users className="h-5 w-5 text-indigo-400" />
                          Real-Time Collaboration
                        </dt>
                        <dd className="mt-4 text-base leading-7 text-gray-300">
                          Work together instantly with seamless communication
                          and live updates.
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-indigo-400">
                          <Zap className="h-5 w-5 text-indigo-400" />
                          Advanced Project Management
                        </dt>
                        <dd className="mt-4 text-base leading-7 text-gray-300">
                          Powerful tools to plan, track, and achieve your goals
                          efficiently.
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-indigo-400">
                          <Globe2 className="h-5 w-5 text-indigo-400" />
                          Full Accessibility
                        </dt>
                        <dd className="mt-4 text-base leading-7 text-gray-300">
                          Access your projects from anywhere, on all your
                          devices.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Solutions Dropdown */}
            <DropdownMenu
              open={menuOpen}
              onOpenChange={(open) => {
                setMenuOpen(open);
                if (open) setMenuOpen1(false);
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-x-2 text-gray-900 dark:text-gray-100 font-bold hover:text-indigo-900 dark:hover:text-indigo-300 no-focus-outline"
                >
                  <FontAwesomeIcon
                    icon={faPuzzlePiece}
                    className="text-gray-900 dark:text-gray-100 text-sm h-4 w-4"
                  />
                  Solutions
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-screen mt-2 bg-gray-800 text-white shadow-lg border-t-2 border-indigo-400"
                side="bottom"
                align="center"
              >
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="py-8 px-6 max-w-7xl mx-auto"
                >
                  <div className="text-center">
                    <h2 className="text-sm font-semibold leading-6 text-indigo-400">
                      Project Management Solutions
                    </h2>
                    <p className="mt-4 text-base leading-6 text-gray-300">
                      Plan, track, and collaborate effectively with a
                      comprehensive solution.
                    </p>
                  </div>
                  <div className="mt-8 max-w-2xl mx-auto lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-6 gap-y-12 lg:max-w-none lg:grid-cols-3">
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-400">
                          <Calendar className="h-5 w-5 text-indigo-400" />
                          Task Planning
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-gray-300">
                          Organize your projects with smart deadlines and
                          reminders.
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-400">
                          <Users className="h-5 w-5 text-indigo-400" />
                          Team Collaboration
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-gray-300">
                          Work together in real-time and share files easily.
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-400">
                          <BarChart3 className="h-5 w-5 text-indigo-400" />
                          Performance Tracking
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-gray-300">
                          Analyze your results with detailed charts and reports.
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-400">
                          <FileText className="h-5 w-5 text-indigo-400" />
                          Centralized Documentation
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-gray-300">
                          Store and share all your documents in one place.
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-400">
                          <Settings className="h-5 w-5 text-indigo-400" />
                          Process Automation
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-gray-300">
                          Automate repetitive tasks and optimize your workflow.
                        </dd>
                      </div>
                      <div className="flex flex-col">
                        <dt className="flex items-center gap-x-2 text-sm font-semibold leading-6 text-indigo-400">
                          <CheckCircle className="h-5 w-5 text-indigo-400" />
                          Risk Management
                        </dt>
                        <dd className="mt-2 text-sm leading-6 text-gray-300">
                          Identify and mitigate risks to ensure project success.
                        </dd>
                      </div>
                    </dl>
                  </div>
                </motion.div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* <ThemeToggle /> */}

        <div>
          <Link
            href="/sign-in"
            className="group flex items-center text-sm bg-white dark:bg-gray-800 text-black dark:text-white border-2 border-black dark:border-white rounded-[15px] font-extrabold no-underline py-2 pl-3 pr-2.5 cursor-pointer hover:bg-[#0c1242] active:scale-[0.95]"
          >
            <div className="svg-wrapper-1">
              <div className="svg-wrapper transition-transform duration-500 ease-linear group-hover:scale-125">
                <svg
                  className="block transition-transform duration-300 ease-in-out group-hover:translate-x-[2.8em] group-hover:scale-110 fill-black dark:fill-white group-hover:fill-white"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                  width="20"
                  height="20"
                >
                  <path d="M416 448h-84c-6.6 0-12-5.4-12-12v-40c0-6.6 5.4-12 12-12h84c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32h-84c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h84c53 0 96 43 96 96v192c0 53-43 96-96 96zm-47-201L201 79c-15-15-41-4.5-41 17v96H24c-13.3 0-24 10.7-24 24v96c0 13.3 10.7 24 24 24h136v96c0 21.5 26 32 41 17l168-168c9.3-9.4 9.3-24.6 0-34z"></path>
                </svg>
              </div>
            </div>
            <span className="block ml-[0.3em] transition-all duration-300 ease-in-out group-hover:opacity-0">
              Sign In
            </span>
          </Link>
        </div>
      </header>
    </>
  );
};
