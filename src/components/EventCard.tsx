'use client';

import { TimelineEvent } from '@/types';

interface EventCardProps {
  event: TimelineEvent;
}

const statusColors = {
  active: 'bg-green-500',
  completed: 'bg-blue-500',
  planned: 'bg-yellow-500',
  paused: 'bg-gray-400',
};

const categoryIcons = {
  project: '🚀',
  task: '✅',
  thought: '💭',
  learning: '📚',
};

export function EventCard({ event }: EventCardProps) {
  const time = new Date(event.startTime).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
      <div className="flex items-start gap-3">
        <span className="text-2xl">{categoryIcons[event.category]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {event.title}
            </h3>
            <span className={`w-2 h-2 rounded-full ${statusColors[event.status]}`} />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            {event.description}
          </p>
        </div>
      </div>

      {event.progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{event.progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-500 rounded-full transition-all"
              style={{ width: `${event.progress}%` }}
            />
          </div>
        </div>
      )}

      {event.tags && (
        <div className="flex flex-wrap gap-1 mt-3">
          {event.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {event.links && (
        <div className="flex gap-2 mt-3">
          {event.links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-violet-600 hover:text-violet-800 dark:text-violet-400"
            >
              {link.label} →
            </a>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-2">{time}</p>
    </div>
  );
}
