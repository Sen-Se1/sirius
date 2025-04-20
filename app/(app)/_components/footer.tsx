import { Globe2, BookOpen, Puzzle, Mail, Instagram, Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="h-[350px] bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-6 lg:px-8 py-6">
        {/* Main Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Our Vision */}
          <Link href="/about" className="group hover:bg-gray-200/50 dark:hover:bg-gray-800/50 p-4 rounded-xl transition-all duration-300">
            <div className="flex flex-col items-start">
              <div className="mb-3 p-3 bg-indigo-500/20 rounded-lg">
                <Globe2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Our Vision
              </h2>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                Redefining team collaboration through smart project management.
              </p>
            </div>
          </Link>

          {/* Resources */}
          <Link href="/resources" className="group hover:bg-gray-200/50 dark:hover:bg-gray-800/50 p-4 rounded-xl transition-all duration-300">
            <div className="flex flex-col items-start">
              <div className="mb-3 p-3 bg-blue-500/20 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Resources
              </h2>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                Practical guides, templates, and best practices.
              </p>
            </div>
          </Link>

          {/* Integrations */}
          <Link href="/integrations" className="group hover:bg-gray-200/50 dark:hover:bg-gray-800/50 p-4 rounded-xl transition-all duration-300">
            <div className="flex flex-col items-start">
              <div className="mb-3 p-3 bg-purple-500/20 rounded-lg">
                <Puzzle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                Integrations
              </h2>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                Connect your favorite tools (Slack, Trello, Google Workspace).
              </p>
            </div>
          </Link>

          {/* Support */}
          <Link href="/contact" className="group hover:bg-gray-200/50 dark:hover:bg-gray-800/50 p-4 rounded-xl transition-all duration-300">
            <div className="flex flex-col items-start">
              <div className="mb-3 p-3 bg-rose-500/20 rounded-lg">
                <Mail className="w-6 h-6 text-rose-600 dark:text-rose-400" />
              </div>
              <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                Support
              </h2>
              <p className="text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors">
                24/7 assistance and comprehensive help center.
              </p>
            </div>
          </Link>
        </div>

        {/* Footer Section */}
        <div className="border-t border-gray-300/50 dark:border-gray-700/50 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">
              <Globe2 className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              <span className="text-sm text-gray-700 dark:text-gray-300">English</span>
            </div>

            <div className="flex flex-wrap gap-4 text-xs text-center">
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                Data Security
              </Link>
              <Link href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                SLA
              </Link>
              <span className="text-gray-500 dark:text-gray-500">© 2025 Sirius Technologies</span>
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-4">
              {[
                { icon: Instagram, color: "hover:text-pink-500 dark:hover:text-pink-400" },
                { icon: Facebook, color: "hover:text-blue-600 dark:hover:text-blue-400" },
                { icon: Linkedin, color: "hover:text-blue-500 dark:hover:text-blue-300" },
                { icon: Twitter, color: "hover:text-sky-500 dark:hover:text-sky-400" },
                { icon: Youtube, color: "hover:text-red-600 dark:hover:text-red-400" },
              ].map((SocialIcon, index) => (
                <Link
                  key={index}
                  href="#"
                  className={`text-gray-600 dark:text-gray-400 ${SocialIcon.color} transition-colors`}
                  aria-label={`Visit our ${SocialIcon.icon.name}`}
                >
                  <SocialIcon.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}