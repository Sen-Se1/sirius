import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center h-screen bg-white dark:bg-gray-900 text-center px-4">
      <h1 className="text-6xl font-extrabold text-blue-600 dark:text-blue-400 mb-4">
        404
      </h1>
      <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
        Page Not Found
      </p>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Sorry, the page you&apos;re looking for doesn&apos;t exist or has been
        moved.
      </p>
      <Link
        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        href="/"
      >
        Go Back Home
      </Link>
    </main>
  );
}
