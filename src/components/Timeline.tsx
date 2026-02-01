'use client';

import { TimelineEvent } from '@/types';
import { EventCard } from './EventCard';

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
      <div className="space-y-4">
        {sortedEvents.map((event) => (
          <div key={event.id} className="relative pl-10">
            <div className="absolute left-2.5 w-3 h-3 rounded-full bg-violet-500 border-2 border-white dark:border-gray-900" />
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </div>
  );
}
