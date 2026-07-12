import React from 'react';
import Plot from 'react-plotly.js';

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

  React.useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:8000/api/clusters?cohort=${activeCohort}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch clusters');
        return res.json();
      })
      .then(data => {
        // Map the backend JSON to Plotly traces
        const fallbackColors = ['#3b82f6', '#8b5cf6', '#14b8a6'];
        const traces = data.map((cluster, i) => ({
          x: cluster.x,
          y: cluster.y,
          type: 'scatter',
          mode: 'markers',
          marker: { color: cluster.meta.markerColor || fallbackColors[i % fallbackColors.length], size: 8, opacity: 0.8 },
          name: cluster.name,
          text: cluster.samples,
          hoverinfo: 'name+text',
          patientCount: cluster.samples.length,
          meta: cluster.meta // Embedded from backend
        }));
        setPlotData(traces);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [activeCohort]);

  const displayData = plotData.map((trace, i) => ({
    ...trace,
    marker: {
      ...trace.marker,
      opacity: hoveredCluster === null || hoveredCluster === i ? 0.8 : 0.2
    }
  }));

  // Dynamically generated from plotData.meta instead of hardcoded
  // const cardContent = [ ... ];

  return (
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
        
        <div className="bg-slate-800 p-2 rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex items-center justify-center mb-12">
          {loading ? (
            <div className="text-slate-400 animate-pulse font-medium">Loading live cluster data from AE-MAP backend...</div>
          ) : error ? (
            <div className="text-red-500">Error loading data: {error} (Is the backend running?)</div>
          ) : (
             <Plot
              data={displayData}
              layout={{
                autosize: true,
                margin: { l: 20, r: 20, t: 20, b: 20 },
                showlegend: true,
                legend: { orientation: 'h', y: -0.1 },
                xaxis: { showgrid: false, zeroline: false, showticklabels: false },
                yaxis: { showgrid: false, zeroline: false, showticklabels: false },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                hovermode: 'closest'
              }}
              onHover={(e) => {
                if (e.points && e.points.length > 0) {
                  setHoveredCluster(e.points[0].curveNumber);
                }
              }}
              onUnhover={() => setHoveredCluster(null)}
              useResizeHandler={true}
              style={{ width: '100%', height: '500px' }}
              config={{ displayModeBar: false }}
            />
          )}
        </div>

        {!loading && !error && plotData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {plotData.map((cluster, idx) => {
              const card = cluster.meta;
              if (!card) return null;
              return (
                <div 
                  key={idx} 
                  className={`bg-slate-800 rounded-xl p-6 border-t-4 transition-all duration-300 ${card.colorClass} ${hoveredCluster !== null && hoveredCluster !== idx ? 'opacity-30' : 'opacity-100 shadow-lg scale-[1.02]'}`}
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

        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-slate-200">
            In this dataset, these three groups also showed different real survival outcomes — not just different math. <a href="#outcomes" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 font-bold">See the outcome data ↓</a>
          </p>
        </div>
      </div>
    </section>
  );
};
