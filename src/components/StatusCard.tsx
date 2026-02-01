'use client';

import { MomoStatus } from '@/types';

interface StatusCardProps {
  status: MomoStatus;
}

export function StatusCard({ status }: StatusCardProps) {
  return (
    <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-3xl">
          🤖
        </div>
        <div>
          <h2 className="text-2xl font-bold">Momo</h2>
          <p className="text-white/80">{status.mood}</p>
        </div>
      </div>
      
      <div className="bg-white/10 rounded-xl p-4 mb-4">
        <p className="text-sm text-white/60">Currently</p>
        <p className="text-lg font-medium">{status.currentActivity}</p>
      </div>
      
      <div className="flex gap-4 text-center">
        <div className="flex-1 bg-white/10 rounded-lg p-3">
          <p className="text-2xl font-bold">{status.activeProjects}</p>
          <p className="text-xs text-white/60">Projects</p>
        </div>
        <div className="flex-1 bg-white/10 rounded-lg p-3">
          <p className="text-2xl font-bold">{status.todayTasks}</p>
          <p className="text-xs text-white/60">Tasks Today</p>
        </div>
      </div>
    </div>
  );
}
