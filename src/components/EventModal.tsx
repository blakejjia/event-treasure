'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, X, ExternalLink, Info } from 'lucide-react';
import type { EventDocument } from '@/lib/mongodb';
import { formatEventDate, formatEventTime } from '@/lib/formatters';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface EventModalProps {
  item: EventDocument;
  onClose: () => void;
}

export default function EventModal({ item, onClose }: EventModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Prevent scrolling on the body when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden md:p-12">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative flex flex-col md:flex-row w-full max-w-5xl max-h-[90vh] bg-white dark:bg-zinc-900 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden z-10 border border-zinc-200/50 dark:border-zinc-800/80"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Image */}
        <div className="relative w-full md:w-2/5 min-h-[300px] shrink-0 bg-zinc-100 dark:bg-zinc-800">
          <Image
            src={item.displayUrl}
            alt={displayTitle || 'Event image'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
          {event?.has_free_food && (
            <div className="absolute top-4 left-4">
              <span className="rounded-full bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-sm flex items-center gap-1.5">
                🍕 Free Food Available
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-6">
            
            {/* Header */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
                {displayTitle}
              </h2>

              {isEvent && (
                <div className="flex flex-col gap-3 text-sm md:text-base text-zinc-600 dark:text-zinc-300">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 shrink-0 text-indigo-500" />
                    <span className="font-medium h-6">{getFormattedDate()}</span>
                  </div>
                  {mounted && getFormattedTime() && (
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 shrink-0 text-emerald-500" />
                      <span className="h-6">{getFormattedTime()}</span>
                    </div>
                  )}
                  {event?.location_name && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
                      <span>
                        {event.location_name}
                        {event.location_details && <span className="opacity-70"> • {event.location_details}</span>}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {item.special_notes?.tags?.map((tag, i) => (
                <div key={i} className="flex items-center gap-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:text-indigo-300">
                  <Tag className="w-4 h-4 opacity-70" />
                  <span className="capitalize">{tag.replace('-', ' ')}</span>
                </div>
              ))}
            </div>

            <hr className="border-zinc-200 dark:border-zinc-800" />

            {/* Caption Section */}
            {item.caption && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                  From the Post Details
                </h3>
                <div className="text-zinc-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                  {item.caption}
                </div>
              </div>
            )}

            {/* Special Notes Section */}
            {item.special_notes?.notes && (
              <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 md:p-5 border border-amber-200/50 dark:border-amber-700/30">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-900 dark:text-amber-400 mb-1">Moderator Notes</h4>
                    <p className="text-sm text-amber-800 dark:text-amber-300/80 leading-relaxed">
                      {item.special_notes.notes}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Link out */}
            {item.url && (
              <div className="mt-4 pb-4">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full gap-2 px-6 py-3 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold hover:opacity-90 transition-opacity"
                >
                  <ExternalLink className="w-5 h-5" />
                  View Original Post
                </a>
              </div>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  );
}
