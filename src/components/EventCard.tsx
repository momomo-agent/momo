'use client';

import { TimelineEvent } from '@/types';

interface EventCardProps {
  event: TimelineEvent;
}

const statusConfig = {
  active: { color: 'bg-green-500', label: 'Active' },
  completed: { color: 'bg-blue-500', label: 'Done' },
  planned: { color: 'bg-yellow-500', label: 'Planned' },
  paused: { color: 'bg-white/30', label: 'Paused' },
};

export function EventCard({ event }: EventCardProps) {
  const config = statusConfig[event.status];
  const date = new Date(event.startTime).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group bg-white/5 hover:bg-white/8 border border-white/10 rounded-xl p-5 transition-all">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate">{event.title}</h3>
            <span className={`w-2 h-2 rounded-full ${config.color}`} />
          </div>
          <p className="text-sm text-white/50 line-clamp-2">{event.description}</p>
        </div>
        <span className="text-xs text-white/30 whitespace-nowrap">{date}</span>
      </div>

      {event.progress !== undefined && event.status !== 'completed' && (
        <div className="mb-3">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full"
              style={{ width: `${event.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        {event.tags && (
          <div className="flex flex-wrap gap-1.5">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs bg-white/5 text-white/40 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {event.links && (
          <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
            {event.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                {link.label} →
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
