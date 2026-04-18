'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Pizza, LayoutList } from 'lucide-react';
import type { EventDocument } from '@/lib/mongodb';
import EventCard from './EventCard';
import EventModal from './EventModal';

export default function EventsExplorer({ initialEvents }: { initialEvents: EventDocument[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string>('All');
  const [freeFoodOnly, setFreeFoodOnly] = useState(false);
  const [showNonEvents, setShowNonEvents] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventDocument | null>(null);

  // Extract unique popular tags from all events
  const popularTags = useMemo(() => {
    const counts: Record<string, number> = {};
    initialEvents.forEach(e => {
      e.special_notes?.tags?.forEach(t => {
        counts[t] = (counts[t] || 0) + 1;
      });
    });
    // Sort tags by frequency and pick top 5
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(entry => entry[0]);
  }, [initialEvents]);

  const filteredEvents = useMemo(() => {
    return initialEvents.filter(e => {
      // Event filtering mode
      if (!showNonEvents && !e.is_event) return false;

      // Free food filter
      if (freeFoodOnly && !e.event?.has_free_food) return false;
      
      // Tag filter
      if (activeTag !== 'All' && !e.special_notes?.tags?.includes(activeTag)) return false;

      // Search filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const displayTitle = e.is_event && e.event?.title ? e.event.title : (e.caption || '');
        const titleMatch = displayTitle.toLowerCase().includes(query);
        const locationMatch = e.event?.location_name?.toLowerCase().includes(query);
        const tagsMatch = e.special_notes?.tags?.some(t => t.toLowerCase().includes(query));
        
        if (!titleMatch && !locationMatch && !tagsMatch) return false;
      }

      return true;
    });
  }, [initialEvents, searchQuery, activeTag, freeFoodOnly, showNonEvents]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
            Discover Events
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400">
            Find the perfect events to relax, network, and save your precious time.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row shrink-0 gap-3">
          {/* Search Bar */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 transition-colors group-focus-within:text-indigo-500" />
            <input
              type="text"
              placeholder="Search title, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 h-10 pl-10 pr-4 rounded-full bg-white dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:placeholder-zinc-500 transition-all shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <div className="flex items-center gap-2 bg-white dark:bg-zinc-800/50 p-1.5 rounded-full border border-zinc-200 dark:border-zinc-700/50 shadow-sm overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTag('All')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTag === 'All' 
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm' 
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            All Events
          </button>
          
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeTag === tag
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700'
              }`}
            >
              <span className="capitalize">{tag.replace('-', ' ')}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => setFreeFoodOnly(!freeFoodOnly)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border ${
            freeFoodOnly
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
              : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50 dark:hover:bg-zinc-800'
          }`}
        >
          <Pizza className="h-4 w-4" />
          Free Food
        </button>

        <button
          onClick={() => setShowNonEvents(!showNonEvents)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-sm border ${
            showNonEvents
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30'
              : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50 dark:hover:bg-zinc-800'
          }`}
        >
          <LayoutList className="h-4 w-4" />
          Include Other Posts
        </button>
      </div>

      {/* Grid */}
      {filteredEvents.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-[250px] gap-6 grid-flow-dense"
        >
          <AnimatePresence mode='popLayout'>
            {filteredEvents.map((item, index) => (
              <EventCard key={item._id} item={item} index={index} onSelect={() => setSelectedEvent(item)} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="py-24 text-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 border-dashed dark:border-zinc-800"
        >
          <Filter className="h-12 w-12 mx-auto text-zinc-300 dark:text-zinc-600 mb-4" />
          <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No events found</h3>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto text-sm">
            We couldn't find any events matching your current filters. Try adjusting your search or clearing the active tags.
          </p>
          <button
            onClick={() => {
              setActiveTag('All');
              setFreeFoodOnly(false);
              setSearchQuery('');
            }}
            className="mt-6 px-5 py-2 inline-flex items-center rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Clear all filters
          </button>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <EventModal 
            item={selectedEvent} 
            onClose={() => setSelectedEvent(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
