import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-serif mb-4">404</h1>
      <p className="text-neutral-600 mb-8">This page could not be found.</p>
      <Link
        href="/"
        className="inline-block bg-neutral-900 text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors"
      >
        Back to shop
      </Link>
    </div>
  );
}
