import { createEvent, EventAttributes, DateArray } from 'ics';
import dayjs from 'dayjs';
import type { EventDocument } from './mongodb';

/**
 * Generates and triggers a download of an .ics file for the given event.
 */
export function downloadEventICS(item: EventDocument) {
  if (!item.is_event || !item.event || !item.event.event_start) {
    console.error('Cannot generate ICS for non-event or missing start time');
    return;
  }

  const start = dayjs(item.event.event_start);
  const startDate: DateArray = [
    start.year(),
    start.month() + 1, // dayjs months are 0-11, ics expects 1-12
    start.date(),
    start.hour(),
    start.minute(),
  ];

  const title = item.event.title || item.caption?.split('\n')[0] || 'Event';
  
  // Calculate duration or use default (1 hour)
  let duration: { hours: number; minutes: number } = { hours: 1, minutes: 0 };
  if (item.event.event_end) {
    const end = dayjs(item.event.event_end);
    const diffMin = end.diff(start, 'minute');
    if (diffMin > 0) {
      duration = {
        hours: Math.floor(diffMin / 60),
        minutes: diffMin % 60,
      };
    }
  }

  const location = item.event.location_name 
    ? `${item.event.location_name}${item.event.location_details ? ` (${item.event.location_details})` : ''}`
    : 'See description';

  const event: EventAttributes = {
    start: startDate,
    duration,
    title: title,
    description: item.caption,
    location: location,
    url: item.url,
    productId: 'event-treasure/ics',
  };

  createEvent(event, (error, value) => {
    if (error) {
      console.error('Error creating ICS event:', error);
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
}
