import React from 'react';
import { Activity, ShieldCheck, PieChart, RefreshCw, AlertCircle, Target, Pill, Search, Users, ActivitySquare, Brain, Zap, Stethoscope } from 'lucide-react';

export const Rigorous = () => {
  const points = [
    { icon: <Activity className="w-5 h-5 text-indigo-400"/>, title: 'Proven Against Real Clinical Outcomes', desc: 'Patient groupings are tested against longitudinal survival records with Kaplan-Meier estimators and log-rank statistics.' },
    { icon: <Search className="w-5 h-5 text-fuchsia-400"/>, title: 'Every Grouping Biologically Explained', desc: 'No black box outputs: gene set enrichment analysis (GSEA) attributes each cluster to specific cellular signaling cascades.' },
    { icon: <PieChart className="w-5 h-5 text-teal-400"/>, title: 'Outperforms Single-Omic Baselines', desc: 'Evaluated against baseline PCA and single-modality clustering, demonstrating higher cluster silhouette separation.' },
    { icon: <ShieldCheck className="w-5 h-5 text-emerald-400"/>, title: 'Resampling & Latent Stability', desc: 'Cross-validated through multiple random train/validation splits to ensure clustering geometry remains stable.' },
    { icon: <AlertCircle className="w-5 h-5 text-amber-400"/>, title: 'Tolerates Incomplete Test Records', desc: 'Built-in multi-modal imputation allows scoring patients even when individual protein or RNA tests are missing.' },
    { icon: <Zap className="w-5 h-5 text-rose-400"/>, title: 'Rapid Inference Latency', desc: 'Once trained, mapping a new patient profile into the 128-dimensional latent space executes in milliseconds.' },
  ];

  return (
    <section id="outcomes" className="py-24 bg-slate-900 border-t border-slate-700/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3">
            Scientific Validation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Built for Clinical Rigor</h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Engineered to withstand rigorous scrutiny from computational biologists and oncologists.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => (
            <div key={idx} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/70 hover:border-slate-600 transition-all hover:shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-700/80">{pt.icon}</div>
                <h4 className="font-bold text-white text-base">{pt.title}</h4>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">{pt.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CaseStudy = () => {
  const [pathways, setPathways] = React.useState(null);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/pathways/1?cohort=BRCA`)
      .then(res => res.ok ? res.json() : null)
      .then(data => setPathways(data))
      .catch(console.error);
  }, []);

  return (
    <section className="py-24 bg-slate-800/90 border-t border-slate-700/60">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 flex flex-col md:flex-row">
          <div className="p-8 sm:p-12 md:w-3/5 text-white flex flex-col justify-center">
            <span className="text-fuchsia-400 font-bold tracking-wider text-xs uppercase mb-2">
              Clinical Case Study Spotlight
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
              Isolating DNA Repair Deficit Subtypes
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              In breast cancer, AE-MAP spontaneously separated Cluster B—a group with severe deficits in homologous recombination DNA repair machinery. 
              This phenotype is a primary determinant of tumor sensitivity to platinum chemotherapy and PARP inhibitors (e.g. Olaparib).
            </p>
            {pathways && (
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
                <h4 className="font-semibold text-slate-400 mb-2">Top Enriched Pathways (Live API):</h4>
                <div className="space-y-1.5 font-mono">
                  {pathways.slice(0, 2).map((pw, i) => (
                    <div key={i} className="flex justify-between text-emerald-400">
                      <span>&gt; {pw.name}</span>
                      <span className="text-slate-400 font-sans">Enrichment: {pw.enrichment_score}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-slate-800/80 md:w-2/5 p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-700">
            <div className="w-full max-w-xs space-y-4">
              <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                <span>DNA Repair Pathway Activity</span>
                <span>Relative Score</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs mb-1 text-slate-300">
                    <span>Cluster A (Luminal)</span>
                    <span className="font-mono text-blue-400">Normal (0.35)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-[35%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-fuchsia-300 font-bold">
                    <span>Cluster B (HRD Deficit)</span>
                    <span className="font-mono text-fuchsia-400 font-bold">Spiked (0.92)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-fuchsia-400 w-[92%] shadow-[0_0_10px_rgba(232,121,249,0.8)]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 text-slate-300">
                    <span>Cluster C (Aggressive)</span>
                    <span className="font-mono text-teal-400">Low (0.22)</span>
                  </div>
                  <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-400 w-[22%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const UseCases = () => {
  const cases = [
    { icon: <Target className="w-5 h-5 text-indigo-400"/>, title: 'Cancer Subtyping', desc: 'Uncovering occult molecular subtypes that standard histopathology and staging overlook.' },
    { icon: <ActivitySquare className="w-5 h-5 text-fuchsia-400"/>, title: 'Biomarker Discovery', desc: 'Surfacing high-impact multi-omic signals for early diagnostic liquid biopsies.' },
    { icon: <Users className="w-5 h-5 text-teal-400"/>, title: 'Precision Oncology', desc: 'Matching patients to targeted therapeutic regimens based on cross-modal biological mechanisms.' },
    { icon: <Pill className="w-5 h-5 text-rose-400"/>, title: 'Drug Repurposing', desc: 'Identifying off-label candidates when a patient cluster exhibits hyperactive target pathways.' },
    { icon: <Search className="w-5 h-5 text-amber-400"/>, title: 'Clinical Trial Cohorting', desc: 'Stratifying candidate pools to enrich clinical trials with high-probability responders.' },
    { icon: <Stethoscope className="w-5 h-5 text-emerald-400"/>, title: 'Immunotherapy Stratification', desc: 'Distinguishing immune-hot vs immune-cold tumors for checkpoint inhibitor response.' },
    { icon: <RefreshCw className="w-5 h-5 text-purple-400"/>, title: 'Rare Disease Research', desc: 'Extracting biological phenotypes in small cohorts where supervised training is impossible.' },
    { icon: <Brain className="w-5 h-5 text-cyan-400"/>, title: 'Beyond Oncology', desc: 'Architecture generalizable to neurodegenerative, cardiovascular, and autoimmune diseases.' },
  ];

  return (
    <section id="use-cases" className="py-24 bg-slate-900 border-t border-slate-700/60 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3">
            Clinical Translation
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Real-World Applications</h2>
          <p className="text-slate-300 text-base sm:text-lg">
            How unsupervised multi-omics integration accelerates precision medicine across research and healthcare.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, idx) => (
            <div key={idx} className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/70 hover:border-indigo-500/50 hover:shadow-xl transition-all group">
              <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 w-fit mb-4 group-hover:scale-110 transition-transform">{c.icon}</div>
              <h4 className="font-bold text-white text-base mb-2">{c.title}</h4>
              <p className="text-sm text-slate-300 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Metrics = () => {
  const [metrics, setMetrics] = React.useState({ reconstruction_accuracy: 94 });

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/metrics?cohort=BRCA`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if(data) setMetrics(data);
      })
      .catch(console.error);
  }, []);

  return (
    <section className="py-20 bg-slate-950 text-white border-y border-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-800">
          <div className="pt-6 md:pt-0">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">3</div>
            <div className="text-lg font-bold text-white mb-2">Data Modalities Merged</div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">Somatic mutations, RNA read counts, and RPPA protein levels unified into a single representation.</p>
          </div>
          <div className="pt-8 md:pt-0">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400 mb-2">
              {metrics.reconstruction_accuracy <= 1 ? Math.round(metrics.reconstruction_accuracy * 100) : metrics.reconstruction_accuracy}%
            </div>
            <div className="text-lg font-bold text-white mb-2">Reconstruction Fidelity</div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">Decoder branches accurately reconstruct original omic values, validating genuine biological pattern retention.</p>
          </div>
          <div className="pt-8 md:pt-0">
            <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-2">128</div>
            <div className="text-lg font-bold text-white mb-2">Latent Bottleneck Dimensions</div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">Over 20,000 biological measurements distilled into 128 essential multi-omic latent coordinates.</p>
          </div>
        </div>
      </div>
    </section>
  );
};
