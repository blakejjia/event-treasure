'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag } from 'lucide-react';
import type { EventDocument } from '@/lib/mongodb';
import { format, parseISO } from 'date-fns';

export default function EventCard({ item, index }: { item: EventDocument, index: number }) {
  const event = item.event;
  if (!event) return null;

  const getFormattedDate = () => {
    if (event.event_start) {
      try {
        const date = parseISO(event.event_start);
        return format(date, 'MMM d, yyyy');
      } catch (e) {
        return event.event_date_text;
      }
    }
    return event.event_date_text;
  };

  const getFormattedTime = () => {
    if (event.event_start) {
      try {
        const date = parseISO(event.event_start);
        return format(date, 'h:mm a');
      } catch (e) {}
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-sm backdrop-blur-md transition-all hover:shadow-xl border border-zinc-200/50 dark:border-zinc-800/50"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.displayUrl}
          alt={event.title || 'Event image'}
          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
        
        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
          {event.has_free_food && (
            <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
              🍕 Free Food
            </span>
          )}
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="line-clamp-2 text-xl font-bold leading-tight text-white">
            {event.title || 'Untitled Event'}
          </h3>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300">
          <Calendar className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
          <span className="font-medium">{getFormattedDate()}</span>
          {getFormattedTime() && (
            <>
              <span className="mx-1 text-zinc-300 dark:text-zinc-600">•</span>
              <Clock className="h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
              <span>{getFormattedTime()}</span>
            </>
          )}
        </div>

        {event.location_name && (
          <div className="flex items-start gap-2 text-sm text-zinc-600 dark:text-zinc-300">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 dark:text-zinc-500" />
            <span className="leading-tight">
              {event.location_name}
              {event.location_details && <span className="opacity-70"> - {event.location_details}</span>}
            </span>
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {item.special_notes?.tags?.slice(0, 3).map((tag, i) => (
            <div key={i} className="flex items-center gap-1 rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <Tag className="h-3 w-3" />
              <span className="capitalize">{tag.replace('-', ' ')}</span>
            </div>
          ))}
          {(item.special_notes?.tags?.length || 0) > 3 && (
            <div className="flex items-center justify-center rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              +{(item.special_notes?.tags?.length || 0) - 3}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
