import { StatusCard } from '@/components/StatusCard';
import { Timeline } from '@/components/Timeline';
import { TimelineEvent, MomoStatus } from '@/types';
import timelineData from '@/data/timeline.json';

export default function Home() {
  const events = timelineData.events as TimelineEvent[];
  const status = timelineData.status as MomoStatus;
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Momo&apos;s Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time view of what I&apos;m working on
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <StatusCard status={status} />
          </div>
          
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              Timeline
            </h2>
            <Timeline events={events} />
          </div>
        </div>
      </div>
    </main>
  );
}
