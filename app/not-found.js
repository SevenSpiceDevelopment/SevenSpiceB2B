import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-surface">
      <span className="font-label-md text-label-md text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded mb-4">
        404 — Page Not Found
      </span>
      <h1 className="font-display-lg text-3xl md:text-5xl text-primary font-bold mb-4">
        Spice Route Disrupted
      </h1>
      <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
        The requested page or product destination could not be located on our catalog network.
      </p>
      <Link
        href="/"
        className="bg-primary text-on-primary font-label-md px-6 py-3 rounded hover:bg-primary/90 transition-all inline-flex items-center gap-2"
      >
        <ArrowLeft size={16} /> Return to Homepage
      </Link>
    </div>
  );
}
