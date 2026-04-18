import { getEvents } from "@/lib/mongodb";
import EventsExplorer from "@/components/EventsExplorer";

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#050505] font-sans selection:bg-indigo-500/30">
      <main className="flex-1 w-full pt-8">
        <EventsExplorer initialEvents={events} />
      </main>
    </div>
  );
}
