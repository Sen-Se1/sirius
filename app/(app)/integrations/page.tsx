
"use client";

import Image from "next/image";
import { useState } from "react";

type Integration = {
  id: string;
  name: string;
  description: string;
  logo: string;
  category: string;
};

const integrations: Integration[] = [
  {
    id: "slack",
    name: "Slack Power-Up",
    description:
      "Partagez des cartes et une activité, épinglez un canal Slack sur un tableau.",
    logo: "/slack-logo.png",
    category: "Communication et collaboration",
  },
  {
    id: "jira",
    name: "Jira Cloud",
    description:
      "Associez facilement des cartes Sirius aux tickets Jira pour consulter l'avancement en temps réel.",
    logo: "/jira-logo.png",
    category: "Informatique et gestion de projet",
  },
  {
    id: "miro",
    name: "Miro",
    description:
      "Joignez et créez facilement des tableaux Miro Boards sans quitter Sirius.",
    logo: "/miro-logo.png",
    category: "Communication et collaboration",
  },
];

const categories = [
  "Toutes les intégrations",
  "Communication et collaboration",
  "Informatique et gestion de projet",
  "Marketing et réseaux sociaux",
  "Analyses et rapports",
  "Automatisation",
  "Équipes RH et opérationnelles",
  "Gestion des fichiers",
  "Outils pour développeurs",
];

export default function IntegrationsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Toutes les intégrations");

  const filtered = selectedCategory === "Toutes les intégrations"
    ? integrations
    : integrations.filter((i) => i.category === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white p-6 flex gap-6">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 space-y-4">
        <input
          type="text"
          placeholder="Rechercher parmi toutes les intégrations"
          className="w-full px-4 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
        />
        <div className="space-y-2 mt-4">
          <p className="text-sm font-semibold">Filtrer par :</p>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`block w-full text-left px-4 py-2 rounded-md ${
                selectedCategory === cat
                  ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-600 dark:text-white"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <section className="flex-1">
        <h1 className="text-2xl font-bold mb-6">Intégrations en vedette</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((integration) => (
            <div
              key={integration.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 flex flex-col justify-between"
            >
              <div className="flex justify-center mb-4">
                <Image
                  src={integration.logo}
                  alt={integration.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">{integration.name}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {integration.description}
                </p>
              </div>
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                Activer
              </button>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}