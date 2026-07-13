import React from 'react';
import ExplainerFlow from './ExplainerFlow';

export const WhyItMatters = () => (
  <section id="how-it-works" className="py-20 bg-slate-800">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold text-white mb-6">Why This Matters</h2>
      <p className="text-lg text-slate-100 mb-6 leading-relaxed">
        Cancer isn't just one disease—it's thousands of different diseases hiding under the same name. 
        Traditional approaches look at a single piece of the puzzle at a time, like just the DNA or just the proteins. 
        But to truly understand and treat these complex diseases, we need to combine all these data types.
      </p>
      <div className="p-6 bg-fuchsia-500/10 rounded-2xl inline-block mt-4">
        <p className="text-fuchsia-200 font-medium text-lg">
          Fact: There are petabytes of unused multi-omics data in public databases simply because they are too mathematically incompatible to combine using standard statistics.
        </p>
      </div>
    </div>
  </section>
);

export const Pipeline = () => {
  const steps = [
    { icon: '📄', title: 'Raw Patient Data', desc: 'Genomics, transcriptomics, and proteomics data from public databases.' },
    { icon: '🧹', title: 'Clean & Prepare', desc: 'We fill in missing values and put all data on a comparable scale.' },
    { icon: '🧠', title: 'AI Learns Hidden Patterns', desc: 'Three AI networks — one per data type — learn to compress each patient\'s data into a shared code.' },
    { icon: '🧩', title: 'Group Similar Patients', desc: 'Patients with similar AI-generated codes are automatically grouped together.' },
    { icon: '🔬', title: 'Explain the Biology', desc: 'We trace back which specific biological pathways drive each group.' },
    { icon: '📊', title: 'Explore Results', desc: 'An interactive dashboard to explore the discovered patient subtypes.' }
  ];

  return (
    <section className="py-20 bg-slate-900 border-y border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white mb-12 text-center">The AE-MAP Process</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative flex flex-col items-center text-center p-4 bg-slate-800 rounded-xl shadow-none hover:shadow-md transition-all border border-slate-700/50">
              <div className="text-4xl mb-4 bg-slate-900 w-16 h-16 flex items-center justify-center rounded-full group-hover:bg-fuchsia-500/10 transition-colors">
                {step.icon}
              </div>
              <h3 className="font-semibold text-slate-100 text-sm mb-2">{step.title}</h3>
              <p className="text-sm text-slate-200 opacity-0 group-hover:opacity-100 absolute bottom-[-10px] translate-y-full bg-slate-800 border border-slate-600 text-white p-3 rounded-lg shadow-xl z-20 pointer-events-none w-48 transition-all">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Comparison = () => (
  <section className="py-20 bg-slate-800">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-12 text-center">Old Way vs. AE-MAP</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-700/50 shadow-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-700/50">
              <th className="py-5 px-6 font-semibold text-slate-200 w-1/2">Traditional Approach</th>
              <th className="py-5 px-6 font-semibold text-indigo-300 bg-indigo-500/10 w-1/2 border-l border-slate-700/50">AE-MAP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/50">
            {[
              ['Studies one data type at a time', 'Combines DNA, RNA, and protein data at once'],
              ['Needs labeled data to find patient groups', 'Finds hidden groups on its own (unsupervised)'],
              ['Misses connections between data types', 'Learns the connections automatically'],
              ['Manual, slow pattern-spotting', 'Automated, scalable pattern discovery']
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-4 px-6 text-slate-200">{row[0]}</td>
                <td className="py-4 px-6 text-white font-medium bg-indigo-500/5 border-l border-slate-700/50">{row[1]}</td>
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

  // New animation state
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
        
        // Find global min/max for scaling
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        data.forEach(cluster => {
          cluster.x.forEach(x => { if (x < minX) minX = x; if (x > maxX) maxX = x; });
          cluster.y.forEach(y => { if (y < minY) minY = y; if (y > maxY) maxY = y; });
        });

        const padding = 0.1;
        const xRange = maxX - minX;
        const yRange = maxY - minY;
        minX -= xRange * padding;
        maxX += xRange * padding;
        minY -= yRange * padding;
        maxY += yRange * padding;

        const processedClusters = data.map((cluster, i) => {
          const color = cluster.meta.markerColor || fallbackColors[i % fallbackColors.length];
          // Calculate centroid
          let sumX = 0, sumY = 0;
          
          const points = cluster.x.map((x, j) => {
            const y = cluster.y[j];
            sumX += x;
            sumY += y;
            
            return {
              id: `${i}-${j}`,
              clusterIdx: i,
              // Target coordinates in percentages
              targetX: ((x - minX) / (maxX - minX)) * 100,
              targetY: ((maxY - y) / (maxY - minY)) * 100, // Invert Y
              color: color,
              // Initial random scattered positions (away from edges)
              startX: Math.random() * 80 + 10,
              startY: Math.random() * 80 + 10,
              delay: Math.random() * 0.6 // Stagger up to 600ms
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

  // Tailwind safelist for dynamic classes injected from API
  // border-blue-500 text-blue-400 border-purple-500 text-purple-400 border-rose-500 text-rose-400
  // border-emerald-500 text-emerald-400 border-amber-500 text-amber-400 border-indigo-500 text-indigo-400
  // border-orange-500 text-orange-400 border-red-500 text-red-400 border-slate-500 text-slate-400

  return (
    <React.Fragment>
    <section id="live-demo" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">The Result: Patient Subtypes</h2>
          
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <div className="bg-slate-800 p-1 rounded-lg inline-flex relative shadow-inner border border-slate-700/50">
              <button 
                onClick={() => setActiveCohort('BRCA')}
                className={`px-6 py-2 rounded-md font-medium shadow-sm transition-all text-sm ${activeCohort === 'BRCA' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Breast Cancer (TCGA-BRCA)
              </button>
              <button 
                onClick={() => setActiveCohort('LUAD')}
                className={`px-6 py-2 rounded-md font-medium transition-all text-sm ${activeCohort === 'LUAD' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                Lung Cancer (TCGA-LUAD)
              </button>
            </div>
            <p className="text-sm text-slate-200 bg-slate-800/50 inline-block px-5 py-2.5 rounded-full border border-slate-600 shadow-sm">
              <span className="text-indigo-400 font-bold mr-1">Portability:</span> 
              Same AI model, same code — just pointed at a different cancer's patient data. Nothing about the method changed.
            </p>
          </div>

          <p className="text-slate-200 text-lg mb-4">
            Each dot is a patient. Patients close together share hidden biological similarities our AI discovered — without ever being told what to look for.
          </p>
          <p className="text-fuchsia-300 text-xl font-medium">
            This isn't just a pattern in data — each group of patients may need a different treatment path. Traditional methods often can't see this distinction. AE-MAP found it automatically.
          </p>
        </div>
        
        <div className="bg-slate-800 p-2 rounded-2xl shadow-2xl overflow-hidden mb-12">
          <div className="relative w-full h-[500px] overflow-hidden bg-slate-900 border border-slate-700/50 rounded-xl">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 animate-pulse font-medium">
                Loading live cluster data from AE-MAP backend...
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-red-500">
                Error loading data: {error} (Is the backend running?)
              </div>
            ) : (
              <>
                {plotData.map((cluster, cIdx) => (
                  <React.Fragment key={cIdx}>
                    {cluster.points.map((pt) => {
                      const isHovered = hoveredCluster === null || hoveredCluster === cIdx;
                      return (
                        <div
                          key={pt.id}
                          className="absolute rounded-full transition-all duration-[1200ms] ease-out"
                          style={{
                            width: '8px',
                            height: '8px',
                            left: `${isClustered ? pt.targetX : pt.startX}%`,
                            top: `${isClustered ? pt.targetY : pt.startY}%`,
                            backgroundColor: isClustered ? pt.color : '#64748b', // slate-500
                            opacity: isClustered ? (isHovered ? 0.8 : 0.2) : 0.6,
                            transform: 'translate(-50%, -50%)',
                            transitionDelay: isClustered ? `${pt.delay}s` : '0s'
                          }}
                        />
                      );
                    })}
                    {/* Label */}
                    <div 
                      className="absolute transition-opacity duration-1000 px-3 py-1.5 bg-slate-900/90 backdrop-blur border border-slate-700/80 rounded-lg text-sm font-semibold pointer-events-none shadow-xl z-10"
                      style={{
                        left: `${cluster.centroidX}%`,
                        top: `${cluster.centroidY}%`,
                        transform: 'translate(-50%, -50%)',
                        color: cluster.color,
                        opacity: isClustered ? (hoveredCluster === null || hoveredCluster === cIdx ? 1 : 0.1) : 0,
                        transitionDelay: isClustered ? '1.2s' : '0s'
                      }}
                    >
                      {cluster.name}
                    </div>
                  </React.Fragment>
                ))}
                
                {/* Controls overlay */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                  {!isClustered ? (
                    <button 
                      onClick={() => setIsClustered(true)}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
                    >
                      Run AI Analysis
                    </button>
                  ) : (
                    <button 
                      onClick={() => setIsClustered(false)}
                      className="px-5 py-2.5 bg-slate-800/80 backdrop-blur hover:bg-slate-700 text-slate-300 font-medium rounded-lg shadow-lg border border-slate-600 transition-all text-sm flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {!loading && !error && plotData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plotData.map((cluster, idx) => {
              const card = cluster.meta;
              if (!card) return null;
              return (
                <div 
                  key={idx} 
                  className={`bg-slate-800 rounded-xl p-6 border-t-4 transition-all duration-300 cursor-pointer ${card.colorClass} ${hoveredCluster !== null && hoveredCluster !== idx ? 'opacity-30' : 'opacity-100 shadow-lg hover:scale-[1.02]'}`}
                  onMouseEnter={() => setHoveredCluster(idx)}
                  onMouseLeave={() => setHoveredCluster(null)}
                >
                  <h3 className={`text-xl font-bold mb-1 ${card.titleColor}`}>{card.name}</h3>
                  <div className="text-sm text-slate-200 mb-4 font-bold uppercase tracking-wide">
                    {cluster.patientCount} Patients
                  </div>
                  <div className="space-y-3 text-base text-slate-200">
                    <p><strong className="text-white">What this means:</strong> {card.means}</p>
                    <p><strong className="text-white">What's driving it:</strong> {card.driving}</p>
                    <p><strong className="text-white">How this helps:</strong> {card.helps}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
    <ExplainerFlow activeCohort={activeCohort} selectedCluster={hoveredCluster !== null ? hoveredCluster.toString() : '0'} />
    </React.Fragment>
  );
};
