import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(calendar);
dayjs.extend(relativeTime);

export const formatEventDate = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  
  try {
    const d = dayjs(dateString);
    const now = dayjs();
    
    // For anything beyond a week in the past, use relative time (e.g. "last month", "2 weeks ago")
    if (d.isValid() && d.isBefore(now.subtract(6, 'day'))) {
      return d.fromNow();
    }
    
    if (d.isValid()) {
      return d.calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: '[Next] dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'MMM D, YYYY'
      });
    }
    return null;
  } catch (e) {
    return null;
  }
};

export const formatEventTime = (dateString?: string | null): string | null => {
  if (!dateString) return null;
  try {
    const d = dayjs(dateString);
    if (!d.isValid()) return null;
    return d.format('h:mm a');
  } catch (e) {
    return null;
  }
};
