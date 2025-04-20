"use client";

import { motion } from "framer-motion";
import { SparklesIcon, UserGroupIcon, LightBulbIcon, ChartBarIcon, HeartIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Section Hero */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight drop-shadow-lg">
          Discover Sirius, the revolution in project management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
          At <span className="font-semibold text-gray-800 dark:text-gray-200">Sirius</span>, we turn your project management into a smooth and dynamic process. Our innovative platform offers powerful tools to plan, collaborate, and execute projects of any size with unprecedented efficiency.
          </p>
        </motion.div>
      </section>

      {/* Section Vision */}
      <motion.section
        className="py-16 bg-gradient-to-r from-gray-200 to-white dark:from-gray-800 dark:to-gray-700"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sirius represents the future of project management. We believe in optimizing every aspect of a project by combining cutting-edge technology with human expertise. Whether you're an ambitious startup or a large enterprise, our platform adapts to your needs to ensure your project's success.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Section Valeurs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {[{
              icon: LightBulbIcon, title: "Innovation", color: "text-blue-600 dark:text-blue-400", text: "We constantly invest in R&D to anticipate future developments and respond to emerging challenges in project management."
            }, {
              icon: HeartIcon, title: "Commitment", color: "text-purple-600 dark:text-purple-400",  text: "We are committed to supporting you throughout the process, ensuring success at every stage of your project."
            }, {
              icon: ShieldCheckIcon, title: "Security", color: "text-green-600 dark:text-green-400", text: "Your data is our top priority, with enterprise-level security to provide maximum protection."
            }, {
              icon: ChartBarIcon, title: "Performance", color: "text-orange-600 dark:text-orange-400",  text: "Continuous optimization of the platform to provide tangible and measurable results tailored to each project."
            }].map((value, idx) => (
              <motion.div
                key={idx}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                whileHover={{ y: -5 }}
              >
                <value.icon className={`h-12 w-12 mb-6 ${value.color}`} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Section Offre */}
      <section className="py-10 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Notre Solution</h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Sirius is more than just a project management platform. It's an intelligent ecosystem that allows you to control all aspects of your projects with powerful tools, an intuitive interface, and advanced collaboration capabilities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[{
              title: "Intuitive project management", text: "An easy-to-use interface for clear and precise project planning and tracking.", icon: SparklesIcon
            }, {
              title: "Smooth collaboration", text: "Real-time communication tools and collaborative workspaces to facilitate idea and document sharing.", icon: UserGroupIcon
            }, {
              title: "Predictive analytics", text: "In-depth analysis of project data to anticipate risks and optimize decision-making with interactive dashboards.", icon: ChartBarIcon
            }].map((feature, idx) => (
              <motion.div
                key={idx}
                className="relative bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <feature.icon className="h-10 w-10 text-blue-600 dark:text-blue-400 mb-4" />
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pourquoi choisir Sirius */}
      <section className="py-16 bg-gradient-to-r from-gray-200 to-white dark:from-gray-800 dark:to-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8">
            Why Choose Sirius?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[{
              icon: SparklesIcon,
              text: "97% customer satisfaction with a high retention rate"
            }, {
              icon: HeartIcon,
              text: "24/7 support with dedicated experts to ensure your success"
            }, {
              icon: ShieldCheckIcon,
              text: "Scalable platform that grows with your needs, no matter the scale of your projects"
            }].map((item, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-300"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
              >
                <div className="relative flex items-center justify-center mb-6">
                  <motion.div
                    className="h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 text-white"
                    whileHover={{ scale: 1.2 }}
                  >
                    <item.icon className="h-16 w-16" />
                  </motion.div>
                  <motion.div
                    className="absolute bottom-0 w-24 h-2 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-400 dark:to-purple-400 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-all duration-300"
                  />
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}