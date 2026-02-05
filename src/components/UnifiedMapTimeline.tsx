'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

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

interface UnifiedMapTimelineProps {
  events: Event[];
}

function getEventStatus(segments: Segment[]): 'active' | 'paused' | 'completed' {
  const last = segments[segments.length - 1];
  if (!last.end && last.status === 'active') return 'active';
  if (!last.end && last.status === 'paused') return 'paused';
  return 'completed';
}

// 地图位置
const MAP_POSITIONS: Record<string, { x: number; y: number; connections?: string[] }> = {
  'momo-birth': { x: 50, y: 90, connections: ['momo-dashboard', 'slidejot'] },
  'slidejot': { x: 15, y: 70, connections: ['jotjot'] },
  'momo-dashboard': { x: 80, y: 75, connections: ['daily-brief'] },
  'webgpu-3dgs': { x: 85, y: 35, connections: [] },
  'ios-app-switcher': { x: 25, y: 40, connections: ['webgpu-3dgs'] },
  'jotjot': { x: 40, y: 25, connections: [] },
  'daily-brief': { x: 70, y: 15, connections: [] },
};

const STATUS_COLORS = {
  active: { bg: 'bg-violet-500', border: 'border-violet-400', glow: 'rgba(139,92,246,0.4)' },
  paused: { bg: 'bg-amber-500', border: 'border-amber-400', glow: 'rgba(245,158,11,0.4)' },
  completed: { bg: 'bg-emerald-500', border: 'border-emerald-400', glow: 'rgba(16,185,129,0.4)' },
};

export function UnifiedMapTimeline({ events }: UnifiedMapTimelineProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const now = Date.now();

  // 计算全局时间范围
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

  // 处理节点数据
  const nodes = useMemo(() => {
    return events.map((event, i) => {
      const pos = MAP_POSITIONS[event.id] || { x: 20 + (i % 4) * 20, y: 20 + Math.floor(i / 4) * 25 };
      return { ...event, ...pos, status: getEventStatus(event.segments) };
    });
  }, [events]);

  // 连接线
  const connections = useMemo(() => {
    const lines: { from: typeof nodes[0]; to: typeof nodes[0] }[] = [];
    nodes.forEach(node => {
      const conns = MAP_POSITIONS[node.id]?.connections || [];
      conns.forEach(targetId => {
        const target = nodes.find(n => n.id === targetId);
        if (target) lines.push({ from: node, to: target });
      });
    });
    return lines;
  }, [nodes]);

  const selectedNode = nodes.find(n => n.id === selectedId);

  return (
    <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/10 overflow-hidden" style={{ minHeight: 550 }}>
      {/* 网格背景 */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      {/* 迷雾 */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 30%, rgba(15,23,42,0.9) 100%)'
      }} />

      {/* 连接线 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ height: 450 }}>
        {connections.map((conn, i) => (
          <motion.line
            key={i}
            x1={`${conn.from.x}%`} y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`} y2={`${conn.to.y}%`}
            stroke="rgba(139,92,246,0.3)"
            strokeWidth="2"
            strokeDasharray="6 4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}
      </svg>

      {/* 地图区域 */}
      <div className="relative" style={{ height: 450 }}>
        {nodes.map((node, i) => {
          const isSelected = selectedId === node.id;
          const isActive = node.status === 'active';
          const colors = STATUS_COLORS[node.status];

          return (
            <motion.div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.08, type: 'spring' }}
              onClick={() => setSelectedId(isSelected ? null : node.id)}
            >
              {/* 发光 */}
              {(isActive || isSelected) && (
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ background: colors.glow, filter: 'blur(15px)', transform: 'scale(2.5)' }}
                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}

              {/* 节点 */}
              <motion.div
                className={`relative flex items-center justify-center rounded-full border-2 ${colors.bg} ${colors.border}`}
                animate={{ width: isSelected ? 56 : 48, height: isSelected ? 56 : 48 }}
              >
                <span className="text-xl">{node.emoji}</span>
              </motion.div>

              {/* 标签 */}
              <div className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center" style={{ top: '100%', marginTop: 6 }}>
                <div className="text-xs font-medium text-white/80">{node.title}</div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 底部时间条面板 */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 p-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="flex items-center gap-4 mb-3">
              <span className="text-2xl">{selectedNode.emoji}</span>
              <div>
                <div className="font-medium">{selectedNode.title}</div>
                <div className="text-xs text-white/50">
                  {selectedNode.status === 'active' ? '🔥 进行中' : 
                   selectedNode.status === 'paused' ? '⏸️ 暂停' : '✅ 完成'}
                </div>
              </div>
            </div>
            
            {/* 时间条 */}
            <div className="relative h-6 bg-white/10 rounded-full overflow-hidden">
              {selectedNode.segments.map((seg, i) => {
                const start = new Date(seg.start).getTime();
                const end = seg.end ? new Date(seg.end).getTime() : now;
                const left = toPercent(start);
                const width = toPercent(end) - left;
                const colors = STATUS_COLORS[seg.status];
                
                return (
                  <motion.div
                    key={i}
                    className={`absolute top-0 bottom-0 ${colors.bg} ${!seg.end ? 'animate-pulse' : ''}`}
                    style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: i * 0.1 }}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 图例 */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur rounded-lg p-3 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-white/60">进行中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-white/60">暂停</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-white/60">完成</span>
        </div>
      </div>

      {/* 提示 */}
      <div className="absolute bottom-4 left-4 text-xs text-white/30">
        点击节点查看时间线
      </div>
    </div>
  );
}