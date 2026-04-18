import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-[#050505] font-sans selection:bg-indigo-500/30 p-6 md:p-12 lg:p-24">
      <div className="max-w-3xl mx-auto w-full flex-1 mt-12 md:mt-0">
        <div className="mb-12">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors inline-flex items-center gap-2"
          >
            <span>&larr;</span> Back to Home
          </Link>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 dark:text-zinc-100 mb-8">
          Privacy Policy
        </h1>
        
        <div className="text-zinc-600 dark:text-zinc-300 space-y-6 leading-relaxed">
          <p>
            All events and posts on this platform are aggregated from public networks and summarized by AI to provide a centralized, easy-to-browse view of community gatherings.
          </p>
          <p>
            We strictly respect privacy. No private or personal account information is collected, stored, or displayed on this site. Our sole purpose is to highlight publicly available community resources.
          </p>
          <p>
            If you are an event organizer and would like to feature your events more prominently, or if you prefer to have your events removed from this platform entirely, please connect with us and we will promptly accommodate your request.
          </p>
        </div>
      </div>
      
      <footer className="mt-24 pb-8 text-center text-sm text-zinc-500 dark:text-zinc-500">
         <p>All content summarized by AI.</p>
      </footer>
    </div>
  );
}
