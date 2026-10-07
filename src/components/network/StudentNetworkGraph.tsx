import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Student, InteractionEdge } from '../../types';
import { DEPARTMENT_COLORS, COMMUNITY_COLORS } from '../../utils/formatting';
import { ZoomIn, ZoomOut, RotateCcw, Maximize2 } from 'lucide-react';

interface StudentNetworkGraphProps {
  students: Student[];
  edges: InteractionEdge[];
  colorBy?: 'department' | 'community';
  onSelectStudent: (student: Student) => void;
  selectedStudent: Student | null;
  height?: number;
}

interface NodePosition {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  student: Student;
}

export const StudentNetworkGraph: React.FC<StudentNetworkGraphProps> = ({
  students,
  edges,
  colorBy = 'department',
  onSelectStudent,
  selectedStudent,
  height = 580
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<Student | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Fast lookup for edges and students
  const studentMap = useMemo(() => {
    return new Map(students.map(s => [s.registration_number, s]));
  }, [students]);

  // Adjacency map for instant neighbor lookup
  const neighborMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    students.forEach(s => map.set(s.registration_number, new Set()));
    edges.forEach(e => {
      if (map.has(e.registration_number_1) && map.has(e.registration_number_2)) {
        map.get(e.registration_number_1)!.add(e.registration_number_2);
        map.get(e.registration_number_2)!.add(e.registration_number_1);
      }
    });
    return map;
  }, [students, edges]);

  // Generate force layout positions deterministically
  const nodePositions = useMemo(() => {
    const width = 1000;
    const height = 700;
    const centerX = width / 2;
    const centerY = height / 2;

    const positions = new Map<string, NodePosition>();

    // Position communities in radial clusters
    const commAngles: Record<string, number> = {
      'Community 1': 0,
      'Community 2': (2 * Math.PI) / 6,
      'Community 3': (4 * Math.PI) / 6,
      'Community 4': (6 * Math.PI) / 6,
      'Community 5': (8 * Math.PI) / 6,
      'Community 6': (10 * Math.PI) / 6,
      'Isolated': Math.PI / 4
    };

    students.forEach((s, idx) => {
      const isIso = s.degree === 0;
      let x = centerX;
      let y = centerY;

      if (isIso) {
        // Position isolated nodes in a ring on top right
        const isoAngle = (idx * 0.8) + Math.PI;
        x = centerX + 400 * Math.cos(isoAngle);
        y = centerY + 280 * Math.sin(isoAngle);
      } else {
        const comm = s.community_id;
        const baseAngle = commAngles[comm] || (idx / students.length) * 2 * Math.PI;
        // Pseudo-random deterministic jitter
        const pseudoRand = ((idx * 9301 + 49297) % 233280) / 233280;
        const pseudoRand2 = ((idx * 49297 + 9301) % 233280) / 233280;
        
        const dist = 120 + pseudoRand * 200;
        const angle = baseAngle + (pseudoRand2 - 0.5) * 1.0;

        x = centerX + dist * Math.cos(angle);
        y = centerY + dist * Math.sin(angle);
      }

      // Radius scaled by influence score (4px to 14px)
      const radius = 3.5 + Math.max(0, s.influence_score) * 10;

      positions.set(s.registration_number, {
        id: s.registration_number,
        x,
        y,
        vx: 0,
        vy: 0,
        radius,
        student: s
      });
    });

    return positions;
  }, [students]);

  // Main Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI display
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 800;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Center layout by default if not transformed
    const offsetX = (width - 1000 * transform.k) / 2 + transform.x;
    const offsetY = (height - 700 * transform.k) / 2 + transform.y;

    ctx.translate(offsetX, offsetY);
    ctx.scale(transform.k, transform.k);

    const activeReg = hoveredNode?.registration_number || selectedStudent?.registration_number;
    const activeNeighbors = activeReg ? neighborMap.get(activeReg) : null;

    // 1. Draw Edges
    edges.forEach(e => {
      const u = nodePositions.get(e.registration_number_1);
      const v = nodePositions.get(e.registration_number_2);
      if (!u || !v) return;

      const isConnectedToActive = activeReg && (
        (e.registration_number_1 === activeReg && activeNeighbors?.has(e.registration_number_2)) ||
        (e.registration_number_2 === activeReg && activeNeighbors?.has(e.registration_number_1))
      );

      ctx.beginPath();
      ctx.moveTo(u.x, u.y);
      ctx.lineTo(v.x, v.y);

      if (isConnectedToActive) {
        ctx.strokeStyle = '#2563EB';
        ctx.lineWidth = Math.min(3, 1 + e.interaction_count * 0.3);
        ctx.globalAlpha = 0.85;
      } else if (activeReg) {
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 0.5;
        ctx.globalAlpha = 0.15;
      } else {
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = Math.min(2, 0.4 + e.interaction_count * 0.15);
        ctx.globalAlpha = 0.35;
      }
      ctx.stroke();
    });

    // 2. Draw Nodes
    nodePositions.forEach(node => {
      const s = node.student;
      const isSelected = selectedStudent?.registration_number === s.registration_number;
      const isHovered = hoveredNode?.registration_number === s.registration_number;
      const isNeighbor = activeNeighbors?.has(s.registration_number);
      const isIsolated = s.degree === 0;

      let color = colorBy === 'department'
        ? (DEPARTMENT_COLORS[s.department] || '#3B82F6')
        : (COMMUNITY_COLORS[s.community_id] || '#3B82F6');

      if (isIsolated) {
        color = '#E11D48'; // Rose for isolated
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI);

      if (activeReg && !isSelected && !isHovered && !isNeighbor) {
        ctx.fillStyle = '#CBD5E1';
        ctx.globalAlpha = 0.35;
      } else {
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.95;
      }
      ctx.fill();

      // Border highlight
      if (isSelected || isHovered) {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#0F172A';
        ctx.globalAlpha = 1;
        ctx.stroke();
      } else if (s.influence_rank <= 15) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#F59E0B'; // Gold border for top 15 influencers
        ctx.globalAlpha = 0.9;
        ctx.stroke();
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#FFFFFF';
        ctx.globalAlpha = 0.7;
        ctx.stroke();
      }
    });

    ctx.restore();
  }, [nodePositions, edges, transform, hoveredNode, selectedStudent, colorBy, height, neighborMap]);

  // Mouse Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (isDragging) {
      setTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      }));
      return;
    }

    // Hit testing for hover
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setMousePos({ x: e.clientX, y: e.clientY });

    const offsetX = (width - 1000 * transform.k) / 2 + transform.x;
    const offsetY = (height - 700 * transform.k) / 2 + transform.y;

    const graphX = (mouseX - offsetX) / transform.k;
    const graphY = (mouseY - offsetY) / transform.k;

    let found: Student | null = null;
    for (const node of nodePositions.values()) {
      const dx = node.x - graphX;
      const dy = node.y - graphY;
      if (dx * dx + dy * dy <= (node.radius + 4) * (node.radius + 4)) {
        found = node.student;
        break;
      }
    }
    setHoveredNode(found);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    if (hoveredNode) {
      onSelectStudent(hoveredNode);
    }
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setTransform(prev => ({
      ...prev,
      k: Math.max(0.4, Math.min(3.5, prev.k * zoomFactor))
    }));
  };

  const resetView = () => {
    setTransform({ x: 0, y: 0, k: 1 });
  };

  const zoomIn = () => {
    setTransform(prev => ({ ...prev, k: Math.min(3.5, prev.k * 1.2) }));
  };

  const zoomOut = () => {
    setTransform(prev => ({ ...prev, k: Math.max(0.4, prev.k * 0.8) }));
  };

  return (
    <div ref={containerRef} className="relative w-full rounded-xl bg-slate-50/70 border border-slate-200/90 overflow-hidden select-none">
      {/* Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
        <button
          onClick={zoomIn}
          title="Zoom In"
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={zoomOut}
          title="Zoom Out"
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset View"
          className="p-1.5 hover:bg-slate-100 rounded text-slate-600 hover:text-slate-900 transition-colors border-t border-slate-100"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Legend Badge */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-lg px-3 py-1.5 text-xs shadow-sm flex items-center gap-3">
        <span className="text-slate-500 font-medium">Nodes: <strong>{students.length}</strong></span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-500 font-medium">Ties: <strong>{edges.length}</strong></span>
        <span className="text-slate-300">•</span>
        <span className="text-slate-400 text-[11px]">Click node for details</span>
      </div>

      {/* Canvas Element */}
      <canvas
        ref={canvasRef}
        style={{ height: `${height}px`, width: '100%', cursor: hoveredNode ? 'pointer' : isDragging ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        onWheel={handleWheel}
      />

      {/* Hover Tooltip Popup */}
      {hoveredNode && mousePos && (
        <div
          className="fixed pointer-events-none z-50 bg-slate-900/95 text-white rounded-lg px-3 py-2 text-xs shadow-xl border border-slate-700 -translate-x-1/2 -translate-y-full -mt-2"
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          <div className="font-mono font-bold text-blue-400">{hoveredNode.registration_number}</div>
          <div className="text-[11px] text-slate-300 mt-0.5">
            {hoveredNode.department} • {hoveredNode.year}
          </div>
          <div className="flex items-center gap-2 mt-1 pt-1 border-t border-slate-800 text-[11px] text-slate-400">
            <span>Connections: <strong className="text-white">{hoveredNode.degree}</strong></span>
            <span>•</span>
            <span>Score: <strong className="text-amber-400">{hoveredNode.influence_score.toFixed(2)}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
};
