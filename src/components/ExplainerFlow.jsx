import React, { useState, useEffect } from 'react';

const ExplainerFlow = ({ activeCohort = 'BRCA', selectedCluster = '0' }) => {
  const [pathways, setPathways] = useState(null);
  const [survival, setSurvival] = useState(null);
  const [geneImportance, setGeneImportance] = useState(null);
  
  useEffect(() => {
    // Fetch Pathways
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/pathways/${selectedCluster}?cohort=${activeCohort}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setPathways(data))
      .catch(() => setPathways(null));
      
    // Fetch Survival
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/survival/${selectedCluster}?cohort=${activeCohort}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setSurvival(data))
      .catch(() => setSurvival(null));
      
    // Fetch Gene Importance
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/gene-importance/${selectedCluster}?cohort=${activeCohort}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setGeneImportance(data))
      .catch(() => setGeneImportance(null));
  }, [activeCohort, selectedCluster]);

  return (
    <section className="py-20 bg-slate-900 border-t border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-6">What AE-MAP Actually Outputs</h2>
          <p className="text-xl text-fuchsia-300 font-medium">
            The AI doesn't just sort patients into groups — it explains its own reasoning in four connected pieces, from raw pattern to medical meaning.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[2.5rem] left-0 w-full h-1 bg-slate-700/50 z-0"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {/* Card 1: Patient group */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-xl flex flex-col h-full relative">
              <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-md mx-auto">1</div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 text-center">Patient group (cluster assignment)</h3>
              <p className="text-sm text-slate-300 mb-4 flex-grow">
                <strong className="text-white">What it is:</strong> Every patient is assigned to one of a small number of groups based on shared hidden patterns across their DNA, RNA, and protein data — like matching a biological fingerprint.
              </p>
              <div className="bg-indigo-500/10 p-4 rounded-lg border border-indigo-500/20 mt-auto">
                <p className="text-sm text-indigo-200">
                  <strong className="text-indigo-400">How it's found:</strong> Discovered automatically by comparing patients' compressed data profiles. No human decided the groups in advance — the AI found them on its own.
                </p>
              </div>
            </div>

            {/* Card 2: Pathways */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-xl flex flex-col h-full relative">
              <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-md mx-auto">2</div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 text-center">Why they're grouped together (pathway enrichment)</h3>
              <p className="text-sm text-slate-300 mb-4 flex-grow">
                <strong className="text-white">What it is:</strong> For each group, the system checks which biological processes — called pathways, essentially assembly lines inside cells — are unusually active or inactive.
              </p>
              {pathways && pathways.length > 0 ? (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4 text-xs font-mono text-emerald-400 overflow-hidden">
                  {pathways.slice(0, 2).map((p, i) => <div key={i} className="truncate">&gt; {p.name}</div>)}
                </div>
              ) : (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4 text-xs font-mono text-slate-500 overflow-hidden">
                  &gt; Computing pathways...
                </div>
              )}
              <div className="bg-fuchsia-500/10 p-4 rounded-lg border border-fuchsia-500/20 mt-auto">
                <p className="text-sm text-fuchsia-200">
                  <strong className="text-fuchsia-400">Why it matters:</strong> This turns "these patients look statistically similar" into "these patients are similar because of this specific biological reason."
                </p>
              </div>
            </div>

            {/* Card 3: Survival */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-xl flex flex-col h-full relative">
              <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-md mx-auto">3</div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 text-center">What it means for the patient (outcome / survival data)</h3>
              <p className="text-sm text-slate-300 mb-4 flex-grow">
                <strong className="text-white">What it is:</strong> Each group is checked against real, recorded patient outcomes to see whether it actually corresponds to different survival patterns — not just different math.
              </p>
              {survival && Object.keys(survival).length > 0 ? (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4 text-xs font-mono text-emerald-400 overflow-hidden">
                  &gt; Median survival: {survival.median_months || 'N/A'} mo
                </div>
              ) : (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4 text-xs font-mono text-slate-500 overflow-hidden">
                  &gt; Survival analysis pending...
                </div>
              )}
              <div className="bg-fuchsia-500/10 p-4 rounded-lg border border-fuchsia-500/20 mt-auto">
                <p className="text-sm text-fuchsia-200">
                  <strong className="text-fuchsia-400">Why it matters:</strong> This is what connects an abstract data pattern to something a patient and doctor actually care about.
                </p>
              </div>
            </div>

            {/* Card 4: Gene Importance */}
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-600 shadow-xl flex flex-col h-full relative">
              <div className="bg-indigo-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4 shadow-md mx-auto">4</div>
              <h3 className="text-lg font-bold text-slate-100 mb-3 text-center">Proof it's not a black box (gene/feature importance)</h3>
              <p className="text-sm text-slate-300 mb-4 flex-grow">
                <strong className="text-white">What it is:</strong> The system can point to the exact genes and proteins responsible for a group's pattern.
              </p>
              {geneImportance && geneImportance.length > 0 ? (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4 text-xs font-mono text-emerald-400 overflow-hidden">
                  {geneImportance.slice(0, 2).map((g, i) => <div key={i} className="truncate">&gt; {g.feature}: {g.importance}</div>)}
                </div>
              ) : (
                <div className="bg-slate-900 p-3 rounded-lg border border-slate-700 mb-4 text-xs font-mono text-slate-500 overflow-hidden">
                  &gt; Extracting key features...
                </div>
              )}
              <div className="bg-fuchsia-500/10 p-4 rounded-lg border border-fuchsia-500/20 mt-auto">
                <p className="text-sm text-fuchsia-200">
                  <strong className="text-fuchsia-400">Why it matters:</strong> "The AI decided this" always comes with a "here's why" — not just an unexplained label.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainerFlow;
