"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  FaTasks, FaUsers, FaPuzzlePiece, FaChartLine,
  FaSlack, FaGoogleDrive, FaJira, FaArrowRight, FaCircle
} from 'react-icons/fa';

const features = [
  {
    id: 1,
    icon: <FaTasks className="w-8 h-8" />,
    title: "Project Management",
    description: "Organize tasks, meet deadlines, and keep team members aligned with Trello.",
    color: "bg-blue-100 dark:bg-blue-900/30",
    accent: "text-blue-600 dark:text-blue-400",
    elements: [
      "Customizable Kanban boards",
      "Deadlines with reminders",
      "Task assignment",
      "Real-time tracking"
    ]
  },
  {
    id: 2,
    icon: <FaUsers className="w-8 h-8" />,
    title: "Productive Meetings",
    description: "Host dynamic and engaging meetings with clear follow-up on decided actions.",
    color: "bg-green-100 dark:bg-green-900/30",
    accent: "text-green-600 dark:text-green-400",
    elements: [
      "Shared agenda",
      "Meeting timer",
      "Action assignment",
      "Calendar integration"
    ]
  },
  {
    id: 3,
    icon: <FaPuzzlePiece className="w-8 h-8" />,
    title: "Seamless Integration",
    description: "Instant process visualization and seamless integration with your tool ecosystem.",
    color: "bg-purple-100 dark:bg-purple-900/30",
    accent: "text-purple-600 dark:text-purple-400",
    elements: [
      "100+ integrations available",
      "Unified dashboards",
      "Pre-configured templates",
      "Powerful API"
    ]
  },
  {
    id: 4,
    icon: <FaChartLine className="w-8 h-8" />,
    title: "Team Management",
    description: "Optimize collaboration and boost your teams' productivity.",
    color: "bg-orange-100 dark:bg-orange-900/30",
    accent: "text-orange-600 dark:text-orange-400",
    elements: [
      "Workload visibility",
      "Performance analytics",
      "Real-time feedback",
      "Document space"
    ]
  }
];

export default function ScrollingCards() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleNavigation = useCallback((direction: 'up' | 'down') => {
    setActiveIndex(prev => {
      const newIndex = direction === 'down'
        ? Math.min(prev + 1, features.length - 1)
        : Math.max(prev - 1, 0);
      return newIndex;
    });
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isScrolling) return;
    if (Math.abs(e.deltaY) < 70) return;

    setIsScrolling(true);
    handleNavigation(e.deltaY > 0 ? 'down' : 'up');

    setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  }, [handleNavigation, isScrolling]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (isScrolling) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) < 100) return;

    setIsScrolling(true);
    handleNavigation(diff > 0 ? 'down' : 'up');

    setTimeout(() => {
      setIsScrolling(false);
    }, 1000);
  }, [touchStart, handleNavigation, isScrolling]);

  useEffect(() => {
    document.addEventListener('wheel', handleWheel, { passive: false });
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('wheel', handleWheel);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleWheel, handleTouchStart, handleTouchEnd]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4 relative overflow-y-auto">
      <div className="max-w-4xl mx-auto text-center mb-9">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">Sirius in Action</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">Workflows tailored to all your projects</p>
      </div>

      <div id="cards-container" className="mx-auto max-w-6xl h-[400px] overflow-hidden relative touch-none group">
        {features.map((feature, index) => (
          <div
            key={feature.id}
            className={`absolute w-full h-full p-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] 
              ${activeIndex === index ? 'translate-y-0 opacity-100 z-30 scale-100 shadow-xl' :
                index < activeIndex ? '-translate-y-[150%] opacity-20 z-20 scale-75 shadow-lg' :
                  'translate-y-[150%] opacity-20 z-10 scale-75 shadow-lg'}`}
          >
            <div className={`w-full h-full rounded-2xl p-4 flex flex-col ${feature.color}`}>
              <div className="flex items-start gap-6 mb-4">
                <div className={`p-1 rounded-2xl ${feature.accent} bg-white dark:bg-gray-800 shadow-sm`}>
                  {feature.icon}
                </div>
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">{feature.title}</h2>
                  <p className="text-md text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-grow mb-2">
                {feature.elements.map((element, i) => (
                  <div
                    key={i}
                    className="flex items-center px-2 py-1 bg-white dark:bg-gray-800 rounded-lg transition-all hover:scale-[101%] hover:shadow-md cursor-pointer"
                  >
                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${feature.accent} bg-current`} />
                    <span className="text-gray-700 dark:text-gray-300 text-sm">{element}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center">
                    <span className="mr-2 text-gray-500 dark:text-gray-400">Integrations :</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center">
                        <FaSlack className="text-purple-600 dark:text-purple-400 text-lg" />
                      </div>
                      <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center">
                        <FaGoogleDrive className="text-blue-600 dark:text-blue-400 text-lg" />
                      </div>
                      <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-full shadow-sm flex items-center justify-center">
                        <FaJira className="text-blue-400 dark:text-blue-300 text-lg" />
                      </div>
                    </div>
                  </div>
                  <button className={`px-6 py-3 ${feature.accent} bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-all flex items-center gap-2`}>
                    <span>Discover</span>
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-2 pt-[-2px]">
        {features.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`p-1 transition-all ${activeIndex === index ? 'opacity-100 scale-125' : 'opacity-40 hover:opacity-70'}`}
          >
            <FaCircle className={`w-2 h-2 ${features[activeIndex].accent}`} />
          </button>
        ))}
      </div>
    </div>
  );
}