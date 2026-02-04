'use client';

import { MomoStatus } from '@/types';

interface StatusCardProps {
  status: MomoStatus;
}

export function StatusCard({ status }: StatusCardProps) {
  const lastUpdated = new Date(status.lastUpdated).toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xl">
          ✨
        </div>
        <div>
          <h3 className="font-semibold text-lg">Momo</h3>
          <p className="text-white/50 text-sm">{status.mood}</p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="text-white/40 text-sm">Active Projects</span>
          <span className="text-xl font-bold">{status.activeProjects}</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-white/5">
          <span className="text-white/40 text-sm">Today&apos;s Tasks</span>
          <span className="text-xl font-bold">{status.todayTasks}</span>
        </div>
        <div className="pt-2">
          <span className="text-white/30 text-xs">Updated {lastUpdated}</span>
        </div>
      </div>
    </div>
  );
}
