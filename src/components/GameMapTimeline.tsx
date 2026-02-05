'use client';

import { motion } from 'framer-motion';
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

interface GameMapTimelineProps {
  events: Event[];
}

function getEventStatus(segments: Segment[]): 'active' | 'paused' | 'completed' {
  const last = segments[segments.length - 1];
  if (!last.end && last.status === 'active') return 'active';
  if (!last.end && last.status === 'paused') return 'paused';
  return 'completed';
}

// 地图上的位置 - 散布在地图各处
const MAP_POSITIONS: { [key: string]: { x: number; y: number; connections?: string[] } } = {
  'momo-birth': { x: 50, y: 85, connections: ['momo-dashboard', 'slidejot'] },
  'slidejot': { x: 20, y: 65, connections: ['jotjot'] },
  'momo-dashboard': { x: 75, y: 70, connections: ['daily-brief'] },
  'webgpu-3dgs': { x: 85, y: 40, connections: [] },
  'ios-app-switcher': { x: 30, y: 35, connections: ['webgpu-3dgs'] },
  'jotjot': { x: 45, y: 25, connections: [] },
  'daily-brief': { x: 70, y: 20, connections: [] },
};

export function GameMapTimeline({ events }: GameMapTimelineProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  
  // 为每个事件分配位置
  const nodes = useMemo(() => {
    return events.map((event, i) => {
      const pos = MAP_POSITIONS[event.id] || { x: 20 + (i % 4) * 25, y: 20 + Math.floor(i / 4) * 30 };
      return { ...event, ...pos, status: getEventStatus(event.segments) };
    });
  }, [events]);

  // 生成连接线
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

  return (
    <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/10 overflow-hidden" style={{ height: 500 }}>
      {/* 地图网格背景 */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }} />

      {/* 迷雾效果 - 边缘渐变 */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(15,23,42,0.8) 100%)'
      }} />

      {/* 起点标记 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/30 flex items-center gap-2">
        <span>⚑</span>
        <span>起点：2026.02.01</span>
      </div>

      {/* SVG 连接线 */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {connections.map((conn, i) => (
          <motion.line
            key={i}
            x1={`${conn.from.x}%`}
            y1={`${conn.from.y}%`}
            x2={`${conn.to.x}%`}
            y2={`${conn.to.y}%`}
            stroke="rgba(139, 92, 246, 0.4)"
            strokeWidth="2"
            strokeDasharray="6 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1, delay: i * 0.2 }}
          />
        ))}
      </svg>

      {/* 地点节点 */}
      {nodes.map((node, i) => {
        const isHovered = hoveredId === node.id;
        const isActive = node.status === 'active';
        
        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            onMouseEnter={() => setHoveredId(node.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* 发光效果 */}
            {(isActive || isHovered) && (
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{
                  background: isActive ? 'rgba(139, 92, 246, 0.4)' : 'rgba(255,255,255,0.2)',
                  filter: 'blur(12px)',
                  transform: 'scale(2)',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}

            {/* 节点主体 */}
            <motion.div
              className={`relative flex items-center justify-center rounded-full border-2 transition-all
                ${node.status === 'completed' ? 'bg-emerald-500/90 border-emerald-400' : 
                  node.status === 'active' ? 'bg-violet-500/90 border-violet-400' : 
                  'bg-amber-500/90 border-amber-400'}`}
              style={{ width: isHovered ? 52 : 44, height: isHovered ? 52 : 44 }}
            >
              <span className="text-xl">{node.emoji}</span>
            </motion.div>

            {/* 标签 */}
            <motion.div
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-center"
              style={{ top: '100%', marginTop: 8 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0.7 }}
            >
              <div className="text-xs font-medium text-white">{node.title}</div>
              {isHovered && (
                <div className="text-[10px] text-white/50 mt-1">
                  {node.status === 'active' ? '🔥 探索中' : 
                   node.status === 'paused' ? '⏸️ 休息中' : '✅ 已征服'}
                </div>
              )}
            </motion.div>
          </motion.div>
        );
      })}

      {/* 图例 */}
      <div className="absolute top-4 right-4 bg-black/30 backdrop-blur rounded-lg p-3 text-xs space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-violet-500" />
          <span className="text-white/60">探索中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-white/60">休息中</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-white/60">已征服</span>
        </div>
      </div>
    </div>
  );
}
