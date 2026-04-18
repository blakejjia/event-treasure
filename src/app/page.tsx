import { getEvents } from "@/lib/mongodb";
import EventsExplorer from "@/components/EventsExplorer";
import Link from "next/link";

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#050505] font-sans selection:bg-indigo-500/30">
      <main className="flex-1 w-full pt-8">
        <EventsExplorer initialEvents={events} />
      </main>
      <footer className="py-8 mt-12 text-center text-sm text-zinc-500 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800/30">
        <p>All event data is summarized by AI.</p>
        <p className="mt-2">
          <Link href="/privacy" className="hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors underline underline-offset-4">
            Privacy Policy
          </Link>
        </p>
      </footer>
    </div>
  );
}
