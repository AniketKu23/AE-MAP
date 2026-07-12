import React from 'react';
import Plot from 'react-plotly.js';

export const WhyItMatters = () => (
  <section id="how-it-works" className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-3xl font-bold text-slate-900 mb-6">Why This Matters</h2>
      <p className="text-lg text-slate-600 mb-6 leading-relaxed">
        Cancer isn't just one disease—it's thousands of different diseases hiding under the same name. 
        Traditional approaches look at a single piece of the puzzle at a time, like just the DNA or just the proteins. 
        But to truly understand and treat these complex diseases, we need to combine all these data types.
      </p>
      <div className="p-6 bg-teal-50 rounded-2xl inline-block mt-4">
        <p className="text-teal-900 font-medium">
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
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">The AE-MAP Process</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {steps.map((step, idx) => (
            <div key={idx} className="group relative flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100">
              <div className="text-4xl mb-4 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-full group-hover:bg-teal-50 transition-colors">
                {step.icon}
              </div>
              <h3 className="font-semibold text-slate-800 text-sm mb-2">{step.title}</h3>
              <p className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 absolute bottom-[-10px] translate-y-full bg-slate-800 text-white p-3 rounded-lg shadow-xl z-20 pointer-events-none w-48 transition-all">
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
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Old Way vs. AE-MAP</h2>
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="py-5 px-6 font-semibold text-slate-600 w-1/2">Traditional Approach</th>
              <th className="py-5 px-6 font-semibold text-teal-800 bg-teal-50/50 w-1/2 border-l border-slate-200">AE-MAP</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {[
              ['Studies one data type at a time', 'Combines DNA, RNA, and protein data at once'],
              ['Needs labeled data to find patient groups', 'Finds hidden groups on its own (unsupervised)'],
              ['Misses connections between data types', 'Learns the connections automatically'],
              ['Manual, slow pattern-spotting', 'Automated, scalable pattern discovery']
            ].map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 text-slate-600">{row[0]}</td>
                <td className="py-4 px-6 text-slate-900 font-medium bg-teal-50/20 border-l border-slate-200">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

export const InteractiveDemo = () => {
  // Generate placeholder data for UMAP scatter plot
  const generateData = (num, cluster, offsetX, offsetY) => Array.from({ length: num }, () => ({
    x: offsetX + (Math.random() - 0.5) * 3,
    y: offsetY + (Math.random() - 0.5) * 3,
    cluster: cluster
  }));

  const data1 = generateData(80, 'Cluster A (Good Prognosis)', -2, 2);
  const data2 = generateData(60, 'Cluster B (DNA Repair Deficit)', 3, -1);
  const data3 = generateData(50, 'Cluster C (Aggressive)', -1, -3);
  
  const allData = [...data1, ...data2, ...data3];

  return (
    <section id="live-demo" className="py-24 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">The Result: Patient Subtypes</h2>
          <p className="text-slate-400 text-lg">
            Each dot is a patient. Patients close together share hidden biological similarities our AI discovered — without ever being told what to look for.
          </p>
        </div>
        
        <div className="bg-white p-2 rounded-2xl shadow-2xl overflow-hidden">
          <div className="w-full h-[500px] flex items-center justify-center">
             <Plot
              data={[
                {
                  x: data1.map(d => d.x),
                  y: data1.map(d => d.y),
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: '#3b82f6', size: 8, opacity: 0.8 },
                  name: 'Cluster A',
                  hoverinfo: 'name'
                },
                {
                  x: data2.map(d => d.x),
                  y: data2.map(d => d.y),
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: '#8b5cf6', size: 8, opacity: 0.8 },
                  name: 'Cluster B',
                  hoverinfo: 'name'
                },
                {
                  x: data3.map(d => d.x),
                  y: data3.map(d => d.y),
                  type: 'scatter',
                  mode: 'markers',
                  marker: { color: '#14b8a6', size: 8, opacity: 0.8 },
                  name: 'Cluster C',
                  hoverinfo: 'name'
                }
              ]}
              layout={{
                autosize: true,
                margin: { l: 20, r: 20, t: 20, b: 20 },
                showlegend: true,
                legend: { orientation: 'h', y: -0.1 },
                xaxis: { showgrid: false, zeroline: false, showticklabels: false },
                yaxis: { showgrid: false, zeroline: false, showticklabels: false },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)'
              }}
              useResizeHandler={true}
              style={{ width: '100%', height: '100%' }}
              config={{ displayModeBar: false }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
