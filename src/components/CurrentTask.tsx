'use client';

import { MomoStatus, TimelineEvent } from '@/types';

interface CurrentTaskProps {
  status: MomoStatus;
  activeEvents: TimelineEvent[];
}

export function CurrentTask({ status, activeEvents }: CurrentTaskProps) {
  const mainProject = activeEvents[0];
  
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 border border-white/10 p-8">
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-fuchsia-500/20 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-white/60">Currently working on</span>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold mb-2">
          {status.currentActivity}
        </h2>
        
        {mainProject && (
          <p className="text-white/50 mb-6">
            {mainProject.description}
          </p>
        )}
        
        {mainProject?.progress !== undefined && (
          <div className="max-w-md">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/40">Progress</span>
              <span className="text-white/60">{mainProject.progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full transition-all duration-500"
                style={{ width: `${mainProject.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
