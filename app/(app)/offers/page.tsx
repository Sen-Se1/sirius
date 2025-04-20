import Link from "next/link";

export default function OffersPage() {
    return (
        <>
            {/* Contenu principal */}
            <div className="sm:px-6 lg:px-8 pt-24 px-4 pb-20 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                    Compare Plans and Pricing
                    </h1>
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-16">
                    Whether your team has 2 or 2,000 members, our flexible pricing model allows you to pay only for what you need.
                    </p>

                    {/* Section des cartes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Carte Standard */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                                <span className="text-blue-500 dark:text-blue-400">💡</span> Standard
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                            For teams that need to handle more work and enhance collaboration.
                            </p>
                        </div>

                        {/* Carte Premium */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                                <span className="text-pink-500 dark:text-pink-400">⭐</span> Premium
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                            Ideal for teams of up to 100 members who need to track multiple projects and visualize work in different ways.
                            </p>
                        </div>

                        {/* Carte Enterprise */}
                        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
                                <span className="text-blue-400 dark:text-blue-300">🏢</span> Enterprise
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                            All the features enterprise teams and administrators need to manage projects.
                            </p>
                        </div>
                    </div>

                    {/* Section Offre Free */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 rounded-lg p-6 mt-16 text-center">
                        <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 flex items-center gap-2 justify-center mb-4">
                            <span>⚡</span> Free Plan
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                        For individuals or small teams looking to organize their work.
                        </p>
                        <Link
                            href="/about"
                            className="inline-block px-6 py-3 text-yellow-600 dark:text-yellow-400 border border-yellow-600 dark:border-yellow-400 rounded-lg font-semibold hover:bg-yellow-100 dark:hover:bg-yellow-800/30 transition"
                        >
                            Discover Sirius
                        </Link>
                    </div>

                    {/* Bouton Consulter les tarifs */}
                    <div className="text-center mt-16">
                        <Link
                            href="/pricing"
                            className="inline-block px-8 py-3 text-indigo-600 dark:text-indigo-400 border border-indigo-600 dark:border-indigo-400 rounded-lg font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-800/30 transition"
                        >
                            View Sirius Pricing
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}