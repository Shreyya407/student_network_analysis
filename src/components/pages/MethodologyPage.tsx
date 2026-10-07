import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Network, CheckCircle, Lightbulb, Calculator, HelpCircle } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const [openDetail, setOpenDetail] = useState<string | null>('01');

  const toggleDetail = (id: string) => {
    setOpenDetail(openDetail === id ? null : id);
  };

  const methods = [
    {
      num: '01',
      title: 'Degree Centrality (Direct Popularity)',
      shortDesc: 'Counts how many direct peers a student interacts with.',
      simpleMeaning: 'If student A has 25 friends and student B has 4 friends, student A has a higher degree centrality.',
      whyItMatters: 'Quickly shows who is socially active and directly connected in the cohort.',
      simpleFormula: 'Degree Centrality = (Number of direct connections) ÷ (Total other students in network)',
      mathFormula: 'C_D(v) = deg(v) / (N - 1)',
      example: 'In a college of 636 students (635 potential peers), a student connected to 30 peers has: 30 ÷ 635 = 0.0472 (4.72%)'
    },
    {
      num: '02',
      title: 'Betweenness Centrality (Bridge Brokerage)',
      shortDesc: 'Measures how often a student acts as a bridge between different groups.',
      simpleMeaning: 'A student who is friends with both CSE Core and Cybersecurity departments acts as an essential communication bridge between them.',
      whyItMatters: 'Bridge students are critical for spreading news, inter-departmental collaboration, and project teamwork.',
      simpleFormula: 'Betweenness = Proportion of shortest paths between all pairs of students that pass through this student',
      mathFormula: 'C_B(v) = Σ [ σ_st(v) / σ_st ] for all pairs (s, t)',
      example: 'If 100 shortest paths exist between various students and 15 must pass through Student X, Student X has high brokerage.'
    },
    {
      num: '03',
      title: 'Closeness Centrality (Speed of Reach)',
      shortDesc: 'Measures how quickly a student can reach everyone else in the network.',
      simpleMeaning: 'A student with high closeness needs fewer "hops" (friend-of-a-friend) on average to send a message to any student on campus.',
      whyItMatters: 'Identifies centrally positioned students who can rapidly disseminate information across the whole student body.',
      simpleFormula: 'Closeness = 1 ÷ (Average distance to all reachable peers)',
      mathFormula: 'C_C(v) = (Reachable Peers) ÷ (Sum of shortest path distances to all peers)',
      example: 'If Student A can reach all peers in an average of 2.1 steps, their closeness score is higher than Student B who needs 4.5 steps.'
    },
    {
      num: '04',
      title: 'PageRank (Prestige & Quality of Ties)',
      shortDesc: 'Measures importance based on who you are connected to, not just how many.',
      simpleMeaning: 'Being connected to 3 class leaders / club presidents gives you more network influence than being connected to 3 isolated students.',
      whyItMatters: 'Borrowed from Google\'s search algorithm to measure true structural authority and endorsement in academic networks.',
      simpleFormula: 'PageRank = Base Score + Sum of (Neighbor PageRank ÷ Neighbor Connections)',
      mathFormula: 'PR(u) = (1 - d)/N + d × Σ [ (w_vu ÷ out_deg(v)) × PR(v) ]',
      example: 'A student connected to 5 highly influential student leaders achieves a top PageRank score despite modest total connections.'
    },
    {
      num: '05',
      title: 'Network Isolation (Zero Connections)',
      shortDesc: 'Identifies students who have zero recorded interactions in the observed network.',
      simpleMeaning: 'A student with Degree = 0 who has not participated in any recorded project, academic tie, event, or social connection.',
      whyItMatters: 'Helps advisors identify students who may benefit from study groups, mentorship circles, or club onboarding.',
      simpleFormula: 'Degree = 0 (No links to any other node in the graph)',
      mathFormula: 'Isolates = { v ∈ Network | degree(v) = 0 }',
      example: 'In this dataset, exactly 27 students have Degree = 0 and are highlighted for supportive academic engagement.'
    },
    {
      num: '06',
      title: 'Louvain Communities (Natural Peer Clusters)',
      shortDesc: 'Detects natural groups or friendship circles within the larger college.',
      simpleMeaning: 'Students who interact frequently with each other form tightly knit communities or study circles.',
      whyItMatters: 'Visualizes how computing departments naturally cluster together or collaborate across disciplines.',
      simpleFormula: 'Modularity Q = (Actual ties inside groups) − (Expected random ties)',
      mathFormula: 'Q = (1/2m) Σ [ A_ij - (k_i · k_j)/2m ] δ(c_i, c_j)',
      example: 'Our algorithm automatically identified 7 distinct academic communities with a strong modularity score of Q > 0.80.'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">How the Analysis Works</h1>
        <p className="text-xs text-slate-500 mt-0.5">Beginner-friendly guide to Social Network Analysis concepts and formulas.</p>
      </div>

      {/* Composite Influence Score Card */}
      <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/80 to-purple-50/90 border border-blue-200/90 rounded-xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Calculator className="w-5 h-5 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900">The Composite Influence Formula Explained</h2>
        </div>
        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          No single metric tells the whole story. To find the most impactful students, we combine 4 different centralities after scaling each to a fair score between <strong>0.0</strong> (lowest) and <strong>1.0</strong> (highest):
        </p>

        {/* Visual Formula Box */}
        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-2xs mb-4">
          <div className="text-xs font-mono text-slate-900 font-bold mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
            <span className="text-blue-700">Influence Score =</span>
            <span className="text-slate-700">(30% × Degree) + (30% × Betweenness) + (20% × Closeness) + (20% × PageRank)</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-blue-50/70 border border-blue-200/80 rounded-lg p-2.5 text-center">
              <span className="text-blue-800 font-bold block text-sm">30%</span>
              <span className="text-slate-600 text-[11px] font-medium">Direct Connections</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">Raw Popularity</span>
            </div>
            <div className="bg-purple-50/70 border border-purple-200/80 rounded-lg p-2.5 text-center">
              <span className="text-purple-800 font-bold block text-sm">30%</span>
              <span className="text-slate-600 text-[11px] font-medium">Bridge Brokerage</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">Connecting Groups</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-2.5 text-center">
              <span className="text-emerald-800 font-bold block text-sm">20%</span>
              <span className="text-slate-600 text-[11px] font-medium">Closeness Reach</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">Speed of Reach</span>
            </div>
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-lg p-2.5 text-center">
              <span className="text-indigo-800 font-bold block text-sm">20%</span>
              <span className="text-slate-600 text-[11px] font-medium">PageRank Score</span>
              <span className="text-slate-400 block text-[10px] mt-0.5">Quality of Friends</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Model Overview */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-sm">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Network className="w-4 h-4 text-blue-600" />
          <span>Basic Graph Terminology</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-slate-400 block text-[11px]">Node (Vertex)</span>
            <strong className="text-slate-800 text-sm font-semibold">One Student</strong>
            <p className="text-[10px] text-slate-500 mt-0.5">Identified by Registration Number</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-slate-400 block text-[11px]">Edge (Link)</span>
            <strong className="text-slate-800 text-sm font-semibold">Interaction Tie</strong>
            <p className="text-[10px] text-slate-500 mt-0.5">Project, academic, social tie</p>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
            <span className="text-slate-400 block text-[11px]">Weight</span>
            <strong className="text-slate-800 text-sm font-semibold">Tie Strength</strong>
            <p className="text-[10px] text-slate-500 mt-0.5">Number of interactions recorded</p>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <span className="text-blue-600 block text-[11px]">Topology</span>
            <strong className="text-blue-900 text-sm font-semibold">Undirected Weighted</strong>
            <p className="text-[10px] text-blue-700 mt-0.5">Two-way mutual ties</p>
          </div>
        </div>
      </div>

      {/* 6 Step-by-Step Methodology Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((m) => {
          const isOpen = openDetail === m.num;
          return (
            <div 
              key={m.num}
              className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm hover:border-blue-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    Step {m.num}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">SNA Fundamental</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">{m.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium mb-3">{m.shortDesc}</p>

                {/* Plain English Meaning */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-xs space-y-1.5 mb-3">
                  <div className="flex items-start gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700"><strong>Simple Idea:</strong> {m.simpleMeaning}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-slate-700"><strong>Why it matters:</strong> {m.whyItMatters}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => toggleDetail(m.num)}
                  className="w-full flex items-center justify-between text-[11px] font-semibold text-blue-600 hover:text-blue-800 transition-colors py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5" />
                    <span>{isOpen ? 'Hide Formula & Example' : 'View Formula & Practical Example'}</span>
                  </span>
                  {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {isOpen && (
                  <div className="mt-2.5 p-3 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-800 space-y-2 animate-in fade-in">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Plain English Formula:</span>
                      <div className="font-mono text-blue-900 font-semibold bg-white p-2 rounded border border-blue-100 mt-1">
                        {m.simpleFormula}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Formal Math:</span>
                      <div className="font-mono text-slate-700 text-[11px] bg-white p-1.5 rounded border border-slate-200 mt-1">
                        {m.mathFormula}
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Practical Example:</span>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed bg-white p-2 rounded border border-slate-100">
                        {m.example}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Academic Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
        <strong className="text-slate-800 block mb-0.5">Synthetic Dataset Disclaimer:</strong>
        This synthetic dataset demonstrates graph analytics for educational and planning purposes. Network isolation (degree = 0) is strictly a structural property describing unrecorded interactions in this dataset and does not represent psychological or real-world judgments about students.
      </div>
    </div>
  );
};
