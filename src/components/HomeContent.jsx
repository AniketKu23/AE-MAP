import React from 'react';
import { ArrowRight, CheckCircle2, XCircle, Sparkles, RefreshCw, BarChart2, ShieldAlert } from 'lucide-react';
import ExplainerFlow from './ExplainerFlow';
import UploadAnalysis from './UploadAnalysis';

export const WhyItMatters = () => (
  <section id="how-it-works" className="py-24 bg-slate-800/90 border-t border-slate-700/60 scroll-mt-24">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4">
        The Core Problem
      </div>
      <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">
        Why Multi-Omics Integration Matters
      </h2>
      <p className="text-lg text-slate-200 mb-8 leading-relaxed">
        Cancer isn't just one disease—it's thousands of different diseases hiding under the same histological label. 
        Traditional clinical genomics looks at a single piece of the puzzle at a time, such as just DNA mutations or just RNA expression. 
        Crucial therapeutic vulnerabilities only become visible when biological layers are analyzed as a unified whole.
      </p>
      <div className="p-6 bg-gradient-to-r from-fuchsia-950/40 via-purple-900/30 to-indigo-950/40 rounded-2xl border border-fuchsia-500/30 shadow-xl inline-block max-w-3xl text-left sm:text-center">
        <div className="flex items-center gap-2 justify-center text-fuchsia-300 font-semibold mb-2 text-sm">
          <Sparkles className="w-4 h-4" /> The Untapped Opportunity
        </div>
        <p className="text-slate-200 font-medium text-base sm:text-lg leading-snug">
          There are petabytes of unused multi-omics profiles in public repositories like TCGA and CPTAC simply because cross-modal datasets are mathematically incompatible to combine using classical single-view statistics.
        </p>
      </div>
    </div>
  </section>
);

export const Pipeline = () => {
  const steps = [
    { num: '01', title: 'Raw Patient Data', desc: 'Genomics (mutations), transcriptomics (RNA), and proteomics (RPPA).' },
    { num: '02', title: 'Clean & Impute', desc: 'KNN imputation fills missing features across biological modalities.' },
    { num: '03', title: 'Deep Compression', desc: 'Three specialized neural encoders map multi-omics to a 128-dim latent space.' },
    { num: '04', title: 'Unsupervised Subtyping', desc: 'Hierarchical & spectral clustering discover genuine disease phenotypes.' },
    { num: '05', title: 'Pathway Enrichment', desc: 'Statistical validation linking clusters to known cellular pathways.' },
    { num: '06', title: 'Clinical Validation', desc: 'Kaplan-Meier survival curves verify outcomes differ in the real world.' }
  ];

  return (
    <section className="py-24 bg-slate-900 border-y border-slate-700/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3">
            End-To-End Methodology
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">The AE-MAP Analysis Pipeline</h2>
          <p className="text-slate-300 text-base sm:text-lg">
            From raw multi-omic sequencing matrices to clinically interpretable cancer subtypes in 6 automated steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              className="relative p-6 bg-slate-800/80 rounded-2xl border border-slate-700/70 hover:border-indigo-500/60 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-black text-indigo-400 font-mono opacity-80 group-hover:opacity-100 transition-opacity">
                  {step.num}
                </span>
                <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Comparison = () => (
  <section className="py-24 bg-slate-800/90 border-t border-slate-700/60">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-3xl mx-auto mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Traditional Analysis vs. AE-MAP</h2>
        <p className="text-slate-300 text-base sm:text-lg">
          Why deep multi-view representation learning outperforms single-layer statistics.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-700/80 shadow-2xl bg-slate-900/60">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-700">
              <th className="py-5 px-6 font-bold text-slate-300 text-sm uppercase tracking-wider w-1/2">
                Traditional Analysis
              </th>
              <th className="py-5 px-6 font-bold text-indigo-300 text-sm uppercase tracking-wider w-1/2 bg-indigo-950/40 border-l border-slate-700">
                AE-MAP Multi-View Engine
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {[
              ['Analyzes one data modality in a silo (e.g. only DNA)', 'Simultaneously embeds DNA, RNA, and protein measurements into a shared space', true],
              ['Requires known labels to discover subgroups (supervised)', 'Uncovers novel subgroups completely unsupervised without human bias', true],
              ['Cannot capture non-linear relationships across layers', 'Learns deep cross-modal interactions through deep neural encoder branches', true],
              ['Drops patients with incomplete test records', 'Tolerates incomplete multi-omics via robust latent reconstruction & imputation', true],
              ['Opaque statistical grouping without biological rationale', 'Provides automatic pathway enrichment & feature importance verification', true]
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-4 px-6 text-slate-300 text-sm flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <span>{row[0]}</span>
                </td>
                <td className="py-4 px-6 text-white text-sm font-medium bg-indigo-950/20 border-l border-slate-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{row[1]}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export const InteractiveDemo = () => {
  const [activeCohort, setActiveCohort] = React.useState('BRCA');
  const [plotData, setPlotData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [hoveredCluster, setHoveredCluster] = React.useState(null);

  // Animation state
  const [isClustered, setIsClustered] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setIsClustered(false);
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/clusters?cohort=${activeCohort}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch clusters');
        return res.json();
      })
      .then(data => {
        const fallbackColors = ['#3b82f6', '#8b5cf6', '#14b8a6', '#f43f5e', '#f59e0b'];
        
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        data.forEach(cluster => {
          cluster.x.forEach(x => { if (x < minX) minX = x; if (x > maxX) maxX = x; });
          cluster.y.forEach(y => { if (y < minY) minY = y; if (y > maxY) maxY = y; });
        });

        const padding = 0.1;
        const xRange = maxX - minX || 1.0;
        const yRange = maxY - minY || 1.0;
        minX -= xRange * padding;
        maxX += xRange * padding;
        minY -= yRange * padding;
        maxY += yRange * padding;

        const processedClusters = data.map((cluster, i) => {
          const color = cluster.meta.markerColor || fallbackColors[i % fallbackColors.length];
          let sumX = 0, sumY = 0;
          
          const points = cluster.x.map((x, j) => {
            const y = cluster.y[j];
            sumX += x;
            sumY += y;
            
            return {
              id: `${i}-${j}`,
              clusterIdx: i,
              targetX: ((x - minX) / (maxX - minX)) * 100,
              targetY: ((maxY - y) / (maxY - minY)) * 100,
              color: color,
              startX: Math.random() * 80 + 10,
              startY: Math.random() * 80 + 10,
              delay: Math.random() * 0.6
            };
          });
          
          return {
            ...cluster,
            color,
            points,
            centroidX: ((sumX / points.length - minX) / (maxX - minX)) * 100,
            centroidY: ((maxY - (sumY / points.length)) / (maxY - minY)) * 100,
            patientCount: points.length,
            meta: cluster.meta
          };
        });
        
        setPlotData(processedClusters);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [activeCohort]);

  return (
    <React.Fragment>
    <section id="live-demo" className="py-24 bg-slate-900 text-white scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-4">
            Interactive Visualization
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold mb-4">
            Discovered Patient Subtypes
          </h2>
          
          {/* Cohort Toggle */}
          <div className="flex flex-col items-center justify-center gap-4 mb-6">
            <div className="bg-slate-800 p-1.5 rounded-xl inline-flex relative shadow-inner border border-slate-700/80">
              <button 
                onClick={() => setActiveCohort('BRCA')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                  activeCohort === 'BRCA' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Breast Cancer (TCGA-BRCA)
              </button>
              <button 
                onClick={() => setActiveCohort('LUAD')}
                className={`px-6 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                  activeCohort === 'LUAD' 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Lung Cancer (TCGA-LUAD)
              </button>
            </div>
            <div className="text-xs text-slate-300 bg-slate-800/80 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <strong className="text-white">Portability Demonstrated:</strong> Same model architecture evaluated across different cancer types without hyperparameter retuning.
            </div>
          </div>

          <p className="text-slate-300 text-base sm:text-lg mb-2">
            Each dot represents an individual patient. Patients close together share hidden biological signatures discovered autonomously by AE-MAP.
          </p>
        </div>
        
        {/* Plot Card */}
        <div className="bg-slate-800/90 p-3 sm:p-4 rounded-3xl shadow-2xl border border-slate-700/80 mb-12">
          <div className="relative w-full h-[520px] overflow-hidden bg-slate-950 border border-slate-800 rounded-2xl">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 animate-pulse font-medium">
                Loading live cluster data from AE-MAP backend...
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-rose-400 text-sm font-medium">
                Error loading data: {error} (Please verify the backend server is running on port 8000)
              </div>
            ) : (
              <>
                {/* Cluster Legend in Top-Right */}
                <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-xl pointer-events-none">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {activeCohort} Subtypes ({plotData.reduce((acc, c) => acc + c.patientCount, 0)} Patients)
                  </div>
                  <div className="space-y-1.5">
                    {plotData.map((cluster, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-200">
                        <span 
                          className="w-3 h-3 rounded-full shrink-0 shadow-sm" 
                          style={{ backgroundColor: cluster.color }}
                        />
                        <span className="font-medium truncate max-w-[180px]">{cluster.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({cluster.patientCount})</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Patient Dots */}
                {plotData.map((cluster, cIdx) => (
                  <React.Fragment key={cIdx}>
                    {cluster.points.map((pt) => {
                      const isHovered = hoveredCluster === null || hoveredCluster === cIdx;
                      return (
                        <div
                          key={pt.id}
                          className="absolute rounded-full transition-all duration-[1200ms] ease-out pointer-events-none"
                          style={{
                            width: hoveredCluster === cIdx ? '10px' : '7px',
                            height: hoveredCluster === cIdx ? '10px' : '7px',
                            left: `${isClustered ? pt.targetX : pt.startX}%`,
                            top: `${isClustered ? pt.targetY : pt.startY}%`,
                            backgroundColor: isClustered ? pt.color : '#64748b',
                            opacity: isClustered ? (isHovered ? 0.9 : 0.15) : 0.5,
                            transform: 'translate(-50%, -50%)',
                            transitionDelay: isClustered ? `${pt.delay}s` : '0s',
                            boxShadow: isClustered && hoveredCluster === cIdx ? `0 0 10px ${pt.color}` : 'none'
                          }}
                        />
                      );
                    })}

                    {/* Centroid Label Pill */}
                    <div 
                      className="absolute transition-all duration-700 px-3.5 py-1.5 bg-slate-900/95 backdrop-blur border rounded-xl text-xs sm:text-sm font-bold pointer-events-none shadow-2xl z-10"
                      style={{
                        left: `${cluster.centroidX}%`,
                        top: `${cluster.centroidY}%`,
                        transform: 'translate(-50%, -50%)',
                        color: cluster.color,
                        borderColor: cluster.color,
                        opacity: isClustered ? (hoveredCluster === null || hoveredCluster === cIdx ? 1 : 0.15) : 0,
                        transitionDelay: isClustered ? '1.0s' : '0s'
                      }}
                    >
                      {cluster.name}
                    </div>
                  </React.Fragment>
                ))}
                
                {/* Control Action Button */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-30">
                  {!isClustered ? (
                    <button 
                      onClick={() => setIsClustered(true)}
                      className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full shadow-xl shadow-indigo-600/40 hover:shadow-indigo-500/60 transition-all transform hover:scale-105 flex items-center gap-2 text-base animate-pulse"
                    >
                      <Sparkles className="w-5 h-5" /> Run AI Clustering
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsClustered(false)}
                      className="px-6 py-2.5 bg-slate-800/90 backdrop-blur hover:bg-slate-700 text-slate-200 font-semibold rounded-full shadow-lg border border-slate-600 transition-all text-sm flex items-center gap-2"
                    >
                      <RefreshCw className="w-4 h-4" /> Reset Positions
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Insight Cards */}
        {!loading && !error && plotData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plotData.map((cluster, idx) => {
              const card = cluster.meta;
              if (!card) return null;
              const isSelected = hoveredCluster === idx;
              return (
                <div 
                  key={idx} 
                  className={`bg-slate-800/90 rounded-2xl p-6 border-t-4 transition-all duration-300 cursor-pointer ${card.colorClass} ${
                    hoveredCluster !== null && !isSelected ? 'opacity-40' : 'opacity-100 shadow-xl hover:-translate-y-1'
                  } ${isSelected ? 'ring-2 ring-indigo-400/50 bg-slate-800' : ''}`}
                  onMouseEnter={() => setHoveredCluster(idx)}
                  onMouseLeave={() => setHoveredCluster(null)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-xl font-bold ${card.titleColor}`}>{card.name}</h3>
                    <span 
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: cluster.color }}
                    />
                  </div>
                  <div className="text-xs text-slate-400 mb-4 font-mono font-bold uppercase tracking-wider">
                    {cluster.patientCount} Validated Patients
                  </div>
                  <div className="space-y-3 text-sm text-slate-200">
                    <p><strong className="text-white">What this means:</strong> {card.means}</p>
                    <p><strong className="text-white">Biological drivers:</strong> {card.driving}</p>
                    <p><strong className="text-white">Clinical impact:</strong> {card.helps}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
    
    <ExplainerFlow activeCohort={activeCohort} selectedCluster={hoveredCluster !== null ? hoveredCluster.toString() : '0'} />
    <UploadAnalysis />
    </React.Fragment>
  );
};
