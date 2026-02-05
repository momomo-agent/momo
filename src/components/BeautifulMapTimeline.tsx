'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface Segment {
  start: string;
  end: string | null;
  status: 'active' | 'paused' | 'completed';
}

interface Event {
  id: string;
  title: string;
  emoji: string;
  segments: Segment[];
  category: string;
}

interface Props {
  events: Event[];
}

function getStatus(segments: Segment[]): 'active' | 'paused' | 'completed' {
  const last = segments[segments.length - 1];
  if (!last.end && last.status === 'active') return 'active';
  if (!last.end && last.status === 'paused') return 'paused';
  return 'completed';
}

const POSITIONS: Record<string, { x: number; y: number; labelSide: 'left' | 'right' }> = {
  'momo-birth': { x: 50, y: 88, labelSide: 'right' },
  'slidejot': { x: 18, y: 68, labelSide: 'right' },
  'momo-dashboard': { x: 78, y: 72, labelSide: 'left' },
  'webgpu-3dgs': { x: 82, y: 32, labelSide: 'left' },
  'ios-app-switcher': { x: 28, y: 38, labelSide: 'right' },
  'jotjot': { x: 45, y: 22, labelSide: 'right' },
  'daily-brief': { x: 68, y: 12, labelSide: 'left' },
};

const COLORS = {
  active: { main: '#8b5cf6', glow: 'rgba(139,92,246,0.5)' },
  paused: { main: '#f59e0b', glow: 'rgba(245,158,11,0.4)' },
  completed: { main: '#10b981', glow: 'rgba(16,185,129,0.4)' },
};

export function BeautifulMapTimeline({ events }: Props) {
  const now = Date.now();

  const { minTime, maxTime } = useMemo(() => {
    let min = Infinity, max = -Infinity;
    events.forEach(e => e.segments.forEach(s => {
      min = Math.min(min, new Date(s.start).getTime());
      max = Math.max(max, s.end ? new Date(s.end).getTime() : now);
    }));
    return { minTime: min, maxTime: max };
  }, [events, now]);

  const duration = maxTime - minTime;
  const toPercent = (t: number) => ((t - minTime) / duration) * 100;

  const nodes = useMemo(() => {
    return events.map((event, i) => {
      const pos = POSITIONS[event.id] || { x: 15 + (i % 4) * 22, y: 15 + Math.floor(i / 4) * 25, labelSide: 'right' as const };
      return { ...event, ...pos, status: getStatus(event.segments) };
    });
  }, [events]);

  return (
    <div className="relative rounded-3xl overflow-hidden" style={{ height: 520, background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>
      {/* 星空背景 */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* 柔和光晕 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)', left: '10%', top: '20%' }} />
        <div className="absolute w-64 h-64 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', right: '15%', bottom: '30%' }} />
      </div>

      {/* 节点 */}
      {nodes.map((node, i) => {
        const color = COLORS[node.status];
        const isLeft = node.labelSide === 'left';
        
        return (
          <motion.div
            key={node.id}
            className="absolute"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
          >
            {/* 发光效果 */}
            {node.status === 'active' && (
              <motion.div
                className="absolute rounded-full -inset-4"
                style={{ background: color.glow, filter: 'blur(12px)' }}
                animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* 节点圆点 */}
            <div 
              className="relative w-10 h-10 rounded-full border-2 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
              style={{ background: color.main, borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <span className="text-lg">{node.emoji}</span>
            </div>

            {/* 标签 + 时间条 */}
            <div 
              className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'right-full mr-4' : 'left-full ml-4'}`}
              style={{ width: 140 }}
            >
              <div className="text-sm font-medium text-white mb-1">{node.title}</div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
                {node.segments.map((seg, j) => {
                  const start = new Date(seg.start).getTime();
                  const end = seg.end ? new Date(seg.end).getTime() : now;
                  const left = toPercent(start);
                  const width = toPercent(end) - left;
                  return (
                    <motion.div
                      key={j}
                      className={`absolute top-0 bottom-0 rounded-full ${!seg.end ? 'animate-pulse' : ''}`}
                      style={{ left: `${left}%`, width: `${Math.max(width, 2)}%`, background: COLORS[seg.status].main }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: i * 0.1 + j * 0.05 }}
                    />
                  );
                })}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* 图例 */}
      <div className="absolute bottom-4 right-4 flex items-center gap-4 text-xs text-white/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.active.main }} />
          <span>进行中</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.paused.main }} />
          <span>暂停</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ background: COLORS.completed.main }} />
          <span>完成</span>
        </div>
      </div>
    </div>
  );
}
