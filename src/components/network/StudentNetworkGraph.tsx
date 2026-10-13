import React, { useEffect, useRef, useState, useMemo } from 'react';
import cytoscape, { Core, NodeSingular, EventObject } from 'cytoscape';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  SlidersHorizontal,
  Palette,
  Eye,
  Filter,
  Search,
  Users,
  Building,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { Student } from '../../types';
import { useNetwork } from '../../context/NetworkContext';
import { fetchApi } from '../../utils/api';

interface StudentNetworkGraphProps {
  initialFocusNodeId?: string | null;
  onSelectStudent?: (student: Student) => void;
}

export const StudentNetworkGraph: React.FC<StudentNetworkGraphProps> = ({
  initialFocusNodeId,
  onSelectStudent
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { allStudents, fetchStudentDetail, theme } = useNetwork();

  // Control states
  const [colorMode, setColorMode] = useState<'community' | 'department' | 'connectivity'>('community');
  const [sizeMode, setSizeMode] = useState<'degree' | 'pagerank' | 'uniform'>('degree');
  const [layoutName, setLayoutName] = useState<'cose' | 'concentric' | 'circle' | 'grid'>('cose');
  
  // Filters
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [selectedComm, setSelectedComm] = useState<string>('all');
  const [selectedConn, setSelectedConn] = useState<string>('all');
  const [minDegree, setMinDegree] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Graph metrics
  const [visibleNodesCount, setVisibleNodesCount] = useState<number>(0);
  const [visibleEdgesCount, setVisibleEdgesCount] = useState<number>(0);
  const [isGraphLoading, setIsGraphLoading] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeHoverNode, setActiveHoverNode] = useState<any | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize and update Cytoscape
  useEffect(() => {
    if (!containerRef.current) return;

    setIsGraphLoading(true);

    const params = new URLSearchParams();
    if (selectedDept !== 'all') params.append('department', selectedDept);
    if (selectedComm !== 'all') params.append('community', selectedComm);
    if (selectedConn !== 'all') params.append('connectivity', selectedConn);
    if (minDegree > 0) params.append('min_degree', minDegree.toString());
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    fetchApi(`/api/network?${params.toString()}`)
      .then((data) => {
        if (!containerRef.current) return;

        // Cleanup previous instance
        if (cyRef.current) {
          cyRef.current.destroy();
        }

        const isDark = theme === 'dark';

        const cy = cytoscape({
          container: containerRef.current,
          elements: data.elements,
          style: [
            {
              selector: 'node',
              style: {
                'label': 'data(label)',
                'font-size': '9px',
                'font-family': 'Plus Jakarta Sans, sans-serif',
                'color': isDark ? '#94a3b8' : '#475569',
                'text-valign': 'bottom',
                'text-margin-y': 4,
                'min-zoomed-font-size': 12,
                'background-color': (ele: NodeSingular) => {
                  if (colorMode === 'department') return ele.data('dept_color') || '#64748b';
                  if (colorMode === 'connectivity') return ele.data('conn_color') || '#64748b';
                  return ele.data('comm_color') || '#6366f1';
                },
                'width': (ele: NodeSingular) => {
                  if (sizeMode === 'uniform') return 16;
                  if (sizeMode === 'pagerank') {
                    const pr = ele.data('pagerank') || 0.001;
                    return Math.max(12, Math.min(38, pr * 10000));
                  }
                  const deg = ele.data('degree') || 0;
                  return Math.max(10, Math.min(36, 10 + deg * 1.1));
                },
                'height': (ele: NodeSingular) => {
                  if (sizeMode === 'uniform') return 16;
                  if (sizeMode === 'pagerank') {
                    const pr = ele.data('pagerank') || 0.001;
                    return Math.max(12, Math.min(38, pr * 10000));
                  }
                  const deg = ele.data('degree') || 0;
                  return Math.max(10, Math.min(36, 10 + deg * 1.1));
                },
                'border-width': 1.5,
                'border-color': isDark ? '#1e293b' : '#ffffff',
                'transition-property': 'background-color, line-color, target-arrow-color, opacity, width, height',
                'transition-duration': 0.2
              }
            },
            {
              selector: 'edge',
              style: {
                'width': 1,
                'line-color': isDark ? '#334155' : '#cbd5e1',
                'curve-style': 'straight',
                'opacity': 0.35
              }
            },
            {
              selector: 'node:selected',
              style: {
                'border-width': 3,
                'border-color': '#f59e0b',
                'opacity': 1
              }
            },
            {
              selector: '.highlighted',
              style: {
                'opacity': 1,
                'z-index': 999
              }
            },
            {
              selector: 'edge.highlighted',
              style: {
                'width': 2.5,
                'line-color': '#6366f1',
                'opacity': 0.9,
                'z-index': 998
              }
            },
            {
              selector: '.dimmed',
              style: {
                'opacity': 0.08
              }
            }
          ],
          layout: {
            name: layoutName,
            animate: false,
            // layout specific parameters
            ...(layoutName === 'cose' && {
              nodeRepulsion: () => 450000,
              idealEdgeLength: () => 60,
              edgeElasticity: () => 80,
              gravity: 0.25,
              numIter: 400
            })
          }
        });

        // Event: Hover tooltip
        cy.on('mouseover', 'node', (e: EventObject) => {
          const node = e.target as NodeSingular;
          const renderedPos = node.renderedPosition();
          setActiveHoverNode(node.data());
          setTooltipPos({ x: renderedPos.x, y: renderedPos.y });
        });

        cy.on('mouseout', 'node', () => {
          setActiveHoverNode(null);
        });

        // Event: Click node
        cy.on('tap', 'node', (e: EventObject) => {
          const node = e.target as NodeSingular;
          const reg = node.data('id');

          // Highlight immediate neighbors and edges
          cy.elements().removeClass('highlighted dimmed');
          const neighborhood = node.neighborhood().add(node);
          neighborhood.addClass('highlighted');
          cy.elements().not(neighborhood).addClass('dimmed');

          // Fetch full student detail
          fetchStudentDetail(reg);
          if (onSelectStudent) {
            onSelectStudent(node.data());
          }
        });

        // Event: Tap background reset highlights
        cy.on('tap', (e: EventObject) => {
          if (e.target === cy) {
            cy.elements().removeClass('highlighted dimmed');
          }
        });

        cyRef.current = cy;
        setVisibleNodesCount(data.total_nodes);
        setVisibleEdgesCount(data.total_edges);
        setIsGraphLoading(false);

        // Focus initial node if passed
        if (initialFocusNodeId) {
          const target = cy.getElementById(initialFocusNodeId);
          if (target && target.length > 0) {
            cy.animate({
              center: { eles: target },
              zoom: 1.8,
              duration: 500
            });
            target.select();
            const neighborhood = target.neighborhood().add(target);
            neighborhood.addClass('highlighted');
            cy.elements().not(neighborhood).addClass('dimmed');
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load network graph:', err);
        setIsGraphLoading(false);
      });

    return () => {
      if (cyRef.current) {
        cyRef.current.destroy();
        cyRef.current = null;
      }
    };
  }, [
    selectedDept,
    selectedComm,
    selectedConn,
    minDegree,
    searchQuery,
    colorMode,
    sizeMode,
    layoutName,
    theme
  ]);

  // Handle Zoom In
  const handleZoomIn = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 1.3);
    }
  };

  // Handle Zoom Out
  const handleZoomOut = () => {
    if (cyRef.current) {
      cyRef.current.zoom(cyRef.current.zoom() * 0.7);
    }
  };

  // Handle Fit to Screen
  const handleFit = () => {
    if (cyRef.current) {
      cyRef.current.fit(undefined, 30);
    }
  };

  // Handle Reset Layout
  const handleResetLayout = () => {
    if (cyRef.current) {
      cyRef.current.elements().removeClass('highlighted dimmed');
      const layout = cyRef.current.layout({
        name: layoutName,
        animate: true,
        animationDuration: 400
      });
      layout.run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Auto-resize Cytoscape canvas when container or window size changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(() => {
      if (cyRef.current) {
        cyRef.current.resize();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`relative flex flex-col rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm ${
      isFullscreen ? 'fixed inset-4 z-50 rounded-2xl shadow-2xl' : 'h-[500px] sm:h-[620px] lg:h-[720px] w-full'
    }`}>
      
      {/* Top Filter and Controls Toolbar */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 flex flex-wrap items-center justify-between gap-3 text-xs z-10">
        
        {/* Left Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Department filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Building className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Departments</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Data Science">Data Science</option>
              <option value="Big Data Analytics">Big Data Analytics</option>
              <option value="CSE Core">CSE Core</option>
              <option value="AI/ML">AI/ML</option>
              <option value="Computer Networking">Computer Networking</option>
            </select>
          </div>

          {/* Community filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedComm}
              onChange={(e) => setSelectedComm(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Communities</option>
              <option value="Community 1">Community 1</option>
              <option value="Community 2">Community 2</option>
              <option value="Community 3">Community 3</option>
              <option value="Community 4">Community 4</option>
              <option value="Isolated / No Community">Isolated Singletons</option>
            </select>
          </div>

          {/* Connectivity category filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Activity className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedConn}
              onChange={(e) => setSelectedConn(e.target.value)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="all">All Connectivity Tiers</option>
              <option value="Completely Isolated">Completely Isolated (0)</option>
              <option value="Low Connectivity">Low (1-2)</option>
              <option value="Moderately Connected">Moderate (3-10)</option>
              <option value="Highly Connected">High (&gt;10)</option>
            </select>
          </div>

          {/* Min Degree Filter */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 font-medium">Min Friends:</span>
            <input
              type="range"
              min="0"
              max="20"
              value={minDegree}
              onChange={(e) => setMinDegree(parseInt(e.target.value))}
              className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="font-bold text-indigo-600 dark:text-indigo-400 w-4">{minDegree}</span>
          </div>
        </div>

        {/* Right Layout & Style Selectors */}
        <div className="flex items-center gap-2">
          
          {/* Color by */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="community">Color: Communities</option>
              <option value="department">Color: Departments</option>
              <option value="connectivity">Color: Connectivity Tier</option>
            </select>
          </div>

          {/* Size by */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sizeMode}
              onChange={(e) => setSizeMode(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="degree">Size: Degree (Friends)</option>
              <option value="pagerank">Size: PageRank</option>
              <option value="uniform">Size: Uniform</option>
            </select>
          </div>

          {/* Layout type */}
          <div className="flex items-center gap-1 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value as any)}
              className="bg-transparent text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer"
            >
              <option value="cose">Force-directed (CoSE)</option>
              <option value="concentric">Concentric Circles</option>
              <option value="circle">Circular</option>
              <option value="grid">Grid</option>
            </select>
          </div>

        </div>

      </div>

      {/* Main Cytoscape Canvas Area */}
      <div className="relative flex-1 bg-slate-50/50 dark:bg-[#0a0f1d] overflow-hidden">
        
        {/* Cytoscape DOM element */}
        <div ref={containerRef} className="cytoscape-container" />

        {/* Floating Controls Overlay (Zoom, Fit, Reset, Fullscreen) */}
        <div className="absolute bottom-5 right-5 flex flex-col gap-1.5 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
          <button
            onClick={handleZoomIn}
            title="Zoom in"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom out"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            title="Fit to Screen"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetLayout}
            title="Re-run Layout Algorithm"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Floating Status Badge (Node & Edge Counts) */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-xs shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-900 dark:text-white">
            {visibleNodesCount} Nodes
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-600 dark:text-slate-400">
            {visibleEdgesCount} Edges
          </span>
        </div>

        {/* Legend Overlay at bottom-left */}
        <div className="absolute bottom-5 left-5 z-20 max-w-xs bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-[11px] shadow-lg hidden md:block">
          <div className="font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center justify-between">
            <span>Coloring: {colorMode.toUpperCase()}</span>
            <span className="text-[10px] text-slate-400">Click node to inspect</span>
          </div>
          {colorMode === 'community' && (
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6366f1]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">Community 1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">Community 2</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">Community 3</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ec4899]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">Community 4</span>
              </div>
            </div>
          )}
          {colorMode === 'connectivity' && (
            <div className="grid grid-cols-2 gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">Isolated (0)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">Low (1-2)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3b82f6]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">Moderate (3-10)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                <span className="text-slate-600 dark:text-slate-400 truncate">High (&gt;10)</span>
              </div>
            </div>
          )}
          {colorMode === 'department' && (
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#06b6d4]" /><span className="truncate">Cloud</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f43f5e]" /><span className="truncate">Cyber</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8b5cf6]" /><span className="truncate">Data Sci</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#f59e0b]" /><span className="truncate">Big Data</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#3b82f6]" /><span className="truncate">CSE Core</span></div>
              <div className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#10b981]" /><span className="truncate">AI/ML</span></div>
            </div>
          )}
        </div>

        {/* Loading Spinner */}
        {isGraphLoading && (
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-30">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin" />
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Calculating force-directed network layout...
              </div>
            </div>
          </div>
        )}

        {/* Hover Tooltip Overlay */}
        {activeHoverNode && (
          <div
            ref={tooltipRef}
            style={{
              position: 'absolute',
              left: `${Math.min(tooltipPos.x + 15, (containerRef.current?.clientWidth || 800) - 240)}px`,
              top: `${Math.max(tooltipPos.y - 80, 20)}px`,
              pointerEvents: 'none',
              zIndex: 40
            }}
            className="w-56 p-3 rounded-xl bg-slate-900/95 dark:bg-black/95 text-white border border-slate-700 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="font-bold text-xs truncate text-indigo-300">
              {activeHoverNode.student_name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              {activeHoverNode.registration_number}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-800 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Department:</span>
                <span className="font-medium truncate max-w-[110px]">{activeHoverNode.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Friends (Degree):</span>
                <span className="font-bold text-white">{activeHoverNode.degree}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Community:</span>
                <span className="font-medium text-teal-300">{activeHoverNode.community}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Connectivity Tier:</span>
                <span className="font-medium text-amber-300">{activeHoverNode.connectivity_category}</span>
              </div>
              {activeHoverNode.pagerank && (
                <div className="flex justify-between">
                  <span className="text-slate-400">PageRank:</span>
                  <span className="font-mono text-cyan-300">{activeHoverNode.pagerank.toFixed(5)}</span>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
