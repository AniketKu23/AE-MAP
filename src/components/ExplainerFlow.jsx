import React, { useState, useEffect } from 'react';
import { Network, Activity, Clock, ShieldCheck } from 'lucide-react';

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

  const clusterLabel = activeCohort === 'BRCA' 
    ? (selectedCluster === '0' ? 'Cluster A (Good Prognosis)' : (selectedCluster === '1' ? 'Cluster B (DNA Repair Deficit)' : 'Cluster C (Aggressive)'))
    : (selectedCluster === '0' ? 'Cluster 1 (Immune Active)' : (selectedCluster === '1' ? 'Cluster 2 (KRAS/EGFR Driven)' : 'Cluster 3 (Proliferative)'));

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Explainable AI Architecture
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            How AE-MAP Explains Its Discoveries
          </h2>
          <p className="text-lg text-slate-300 mb-2">
            The platform doesn't just categorize patients—it provides complete biological and clinical provenance for every decision.
          </p>
          <div className="inline-block mt-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-indigo-300">
            Currently Inspecting: <span className="font-bold text-white">{clusterLabel}</span> ({activeCohort})
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Patient group */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col h-full hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-indigo-950">
                1
              </span>
              <Network className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Multi-Omic Fingerprint
            </h3>
            <p className="text-xs text-slate-300 mb-4 flex-grow leading-relaxed">
              <strong className="text-slate-100">Mechanism:</strong> Every patient is projected into the 128-dimensional latent space by compressing somatic mutations, RNA transcript counts, and protein levels simultaneously.
            </p>
            <div className="bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20 mt-auto text-xs text-indigo-200">
              <strong className="text-indigo-300 block mb-1">Unsupervised Discovery:</strong>
              No pre-existing clinical labels are used. The autoencoder extracts the latent geometry independently.
            </div>
          </div>

          {/* Card 2: Pathways */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col h-full hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-indigo-950">
                2
              </span>
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Biological Pathways
            </h3>
            <p className="text-xs text-slate-300 mb-3 flex-grow leading-relaxed">
              <strong className="text-slate-100">Mechanism:</strong> Gene Set Enrichment Analysis (GSEA) evaluates which metabolic and signaling cascades are significantly altered.
            </p>
            {pathways && pathways.length > 0 ? (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 space-y-1.5 text-xs font-mono">
                {pathways.slice(0, 3).map((p, i) => (
                  <div key={i} className="flex justify-between text-emerald-400">
                    <span className="truncate">&gt; {p.name}</span>
                    <span className="text-slate-400 shrink-0 font-sans ml-1 text-[11px]">Score: {p.enrichment_score}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs font-mono text-slate-500">
                &gt; Computing pathway signatures...
              </div>
            )}
            <div className="bg-fuchsia-500/10 p-3.5 rounded-xl border border-fuchsia-500/20 mt-auto text-xs text-fuchsia-200">
              <strong className="text-fuchsia-300 block mb-1">Clinical Context:</strong>
              Converts raw mathematical coordinates into actionable cellular biochemistry.
            </div>
          </div>

          {/* Card 3: Survival */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col h-full hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-indigo-950">
                3
              </span>
              <Clock className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Outcome Verification
            </h3>
            <p className="text-xs text-slate-300 mb-3 flex-grow leading-relaxed">
              <strong className="text-slate-100">Mechanism:</strong> Real patient overall survival months and vital events are fitted with Kaplan-Meier estimators and tested with log-rank statistics.
            </p>
            {survival && Object.keys(survival).length > 0 ? (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs font-mono text-emerald-400 space-y-1">
                <div>&gt; Median: <span className="text-white font-bold">{survival.median_months}</span> mo</div>
                <div className="text-[11px] text-slate-400">&gt; Log-rank p: {survival.p_value < 0.001 ? '< 0.001' : survival.p_value}</div>
              </div>
            ) : (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs font-mono text-slate-500">
                &gt; Calculating survival curve...
              </div>
            )}
            <div className="bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-500/20 mt-auto text-xs text-indigo-200">
              <strong className="text-indigo-300 block mb-1">Prognostic Power:</strong>
              Ensures clusters represent differing patient survival, not just statistical artifacts.
            </div>
          </div>

          {/* Card 4: Gene Importance */}
          <div className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 shadow-xl flex flex-col h-full hover:border-indigo-500/50 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-indigo-950">
                4
              </span>
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">
              Driver Biomarkers
            </h3>
            <p className="text-xs text-slate-300 mb-3 flex-grow leading-relaxed">
              <strong className="text-slate-100">Mechanism:</strong> Gradient-based feature attributions identify the top genes and proteins responsible for subtype separation.
            </p>
            {geneImportance && geneImportance.length > 0 ? (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 space-y-1.5 text-xs font-mono text-emerald-400">
                {geneImportance.slice(0, 3).map((g, i) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className="truncate">&gt; {g.feature.split(' ')[0]}</span>
                    <span className="text-indigo-300 font-sans ml-1">{Math.round(g.importance * 100)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4 text-xs font-mono text-slate-500">
                &gt; Extracting key drivers...
              </div>
            )}
            <div className="bg-fuchsia-500/10 p-3.5 rounded-xl border border-fuchsia-500/20 mt-auto text-xs text-fuchsia-200">
              <strong className="text-fuchsia-300 block mb-1">Targetable Insights:</strong>
              Points oncologists and drug developers to specific druggable biomarkers.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExplainerFlow;
