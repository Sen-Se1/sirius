import { CheckCircle2 } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    users: "5",
    storage: "5 GB",
    features: [
      "Comments in the feed",
      "Share with colleagues",
      "Video announcements",
      "Likes and reactions",
      "Appreciation badges",
      "CoPilot in feed",
    ],
    calendarFeatures: [
      "Custom event location (manual)",
      "Calendar access permissions",
    ],
    WorkgroupsFeatures: [],
    bgColor: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  },
  {
    id: "standard",
    name: "Standard",
    users: "10",
    storage: "10 GB",
    features: [
      "Comments in the feed",
      "Share with colleagues",
      "Video announcements",
      "Likes and reactions",
      "Appreciation badges",
      "CoPilot in feed",
      "Announcements",
      "Polls",
    ],
    calendarFeatures: [
      "Custom event location (manual)",
      "Calendar access permissions",
    ],
    WorkgroupsFeatures: [
      "Public workgroups",
      "Private workgroups",
      "Hidden workgroups",
    ],
    bgColor: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  },
  {
    id: "professional",
    name: "Professional",
    users: "50",
    storage: "50 GB",
    features: [
      "Comments in the feed",
      "Share with colleagues",
      "Video announcements",
      "Likes and reactions",
      "Appreciation badges",
      "CoPilot in feed",
      "Announcements",
      "Polls",
    ],
    calendarFeatures: [
      "Custom event location (manual)",
      "Calendar access permissions",
      "Shared slots",
      "Event invitation by email (iCalendar)",
    ],
    WorkgroupsFeatures: [
      "Public workgroups",
      "Private workgroups",
      "Hidden workgroups",
      "Workgroup access permissions",
    ],
    bgColor: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    users: "Unlimited",
    storage: "Unlimited",
    features: [
      "Comments in the feed",
      "Share with colleagues",
      "Video announcements",
      "Likes and reactions",
      "Appreciation badges",
      "CoPilot in feed",
      "Announcements",
      "Polls",
    ],
    calendarFeatures: [
      "Custom event location (manual)",
      "Calendar access permissions",
      "Shared slots",
      "Event invitation by email (iCalendar)",
    ],
    WorkgroupsFeatures: [
      "Public workgroups",
      "Private workgroups",
      "Hidden workgroups",
      "Workgroup access permissions",
    ],
    bgColor: "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
  },
];

export default function PlanComparison() {
  return (
    <div className="bg-gray-50 sm:px-6 lg:px-8 pt-24 px-4 pb-20 dark:bg-gray-900 min-h-screen p-10">
      {/* Main Heading */}
      <div className="py-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
        Comparison Plan
        </h1>
      </div>

      {/* Grid Container */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-lg p-6 shadow-lg ${plan.bgColor} min-w-[250px]`}
            >
              {/* Plan Name */}
              <h2 className="text-xl font-bold text-center text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                {plan.name}
              </h2>

              {/* Users and Storage */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Users: {plan.users}
                </p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                  Online Storage: {plan.storage}
                </p>
              </div>

              {/* Feed Features */}
              <div className="mb-4">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  Feed:
                </p>
                <div className="mt-2">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Calendar Features */}
              <div className="mb-4">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  Calendar:
                </p>
                <div className="mt-2">
                  {plan.calendarFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workgroups Features (Conditional) */}
              {plan.WorkgroupsFeatures.length > 0 && (
                <div className="mb-4">
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    Workgroups:
                  </p>
                  <div className="mt-2">
                    {plan.WorkgroupsFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-green-500 dark:text-green-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-200">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}