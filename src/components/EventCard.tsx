'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import type { EventDocument } from '@/lib/mongodb';
import { formatEventDate, formatEventTime } from '@/lib/formatters';

export default function EventCard({ item, index, onSelect }: { item: EventDocument, index: number, onSelect: () => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isEvent = item.is_event;
  const event = item.event;

  const displayTitle = isEvent && event?.title ? event.title : (item.caption?.split('\\n')[0] || 'Community Post');

  const getFormattedDate = () => {
    if (!mounted || !isEvent || !event) return null;
    return formatEventDate(event.event_start);
  };

  const getFormattedTime = () => {
    if (!mounted || !isEvent || !event) return null;
    return formatEventTime(event.event_start);
  };

  // Image aspect ratio constraint for Masonry layout
  const aspectRatio = item.width && item.height ? `${item.width} / ${item.height}` : '4 / 3';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.05 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onSelect}
      className={`cursor-pointer group relative flex flex-col overflow-hidden rounded-3xl bg-white/80 dark:bg-zinc-900/80 shadow-md backdrop-blur-xl transition-all hover:shadow-2xl border border-zinc-200/50 dark:border-zinc-800/80`}
    >
      <div 
        className="relative w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800"
        style={{ aspectRatio }}
      >
        <Image
          src={item.displayUrl}
          alt={displayTitle || 'Event image'}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
          {event?.has_free_food && (
            <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              🍕 Free Food
            </span>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="line-clamp-2 text-xl md:text-2xl font-bold leading-tight text-white mb-2 shadow-black/50">
            {displayTitle}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 bg-white dark:bg-zinc-900 shrink-0">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <Calendar className="h-4 w-4 shrink-0 text-zinc-400 dark:text-indigo-400" />
          <span className="font-medium h-5 min-w-[80px]">{getFormattedDate()}</span>
          {mounted && getFormattedTime() && (
            <>
              <span className="mx-1 text-zinc-300 dark:text-zinc-700">•</span>
              <Clock className="h-4 w-4 shrink-0 text-zinc-400 dark:text-emerald-400" />
              <span className="h-5">{getFormattedTime()}</span>
            </>
          )}
        </div>

        {event?.location_name && (
          <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-rose-400" />
            <span className="leading-tight">
              {event?.location_name}
              {event?.location_details && <span className="opacity-70"> - {event.location_details}</span>}
            </span>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {item.special_notes?.tags?.slice(0, 3).map((tag, i) => (
            <div key={i} className="flex items-center gap-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 border border-zinc-200/50 dark:border-zinc-700/50">
              <Tag className="h-3 w-3 opacity-70" />
              <span className="capitalize">{tag.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
