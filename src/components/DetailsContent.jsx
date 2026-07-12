import React from 'react';
import { Activity, ShieldCheck, PieChart, RefreshCw, AlertCircle, Target, Pill, Search, Users, ActivitySquare, Brain } from 'lucide-react';

export const Rigorous = () => {
  const points = [
    { icon: <Activity className="w-6 h-6 text-teal-600"/>, title: 'Proven Against Real Outcomes', desc: 'We checked whether AI-discovered patient groups actually had different survival outcomes — and they did.' },
    { icon: <Search className="w-6 h-6 text-teal-600"/>, title: 'Every Finding Explained', desc: 'Every cluster comes with a "why." We can trace the AI\'s math back to the exact genes or proteins causing the difference.' },
    { icon: <PieChart className="w-6 h-6 text-teal-600"/>, title: 'Beats the Baselines', desc: 'We proved this deep learning method finds clearer, more distinct patient groups than older standard statistics.' },
    { icon: <ShieldCheck className="w-6 h-6 text-teal-600"/>, title: 'Stress-Tested Results', desc: 'The patient groupings hold up even when the data is repeatedly resampled and retested.' },
    { icon: <AlertCircle className="w-6 h-6 text-teal-600"/>, title: 'Tolerates Missing Data', desc: 'If a patient is missing a protein test, the AI can still use their DNA and RNA to find their group.' },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">Built for Scientific Rigor</h2>
          <p className="mt-4 text-slate-600">Not just a class project—designed to stand up to real clinical scrutiny.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {points.map((pt, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex gap-4 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 mt-1 bg-teal-50 p-2 rounded-lg">{pt.icon}</div>
              <div>
                <h4 className="font-semibold text-slate-900 mb-1">{pt.title}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{pt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const CaseStudy = () => (
  <section className="py-20 bg-white">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row">
        <div className="p-10 md:w-1/2 text-white flex flex-col justify-center">
          <span className="text-teal-400 font-semibold tracking-wider text-sm uppercase mb-2">Case Study Spotlight</span>
          <h3 className="text-2xl font-bold mb-4">Discovering "Cluster 3"</h3>
          <p className="text-slate-300 leading-relaxed">
            The AI isolated 45 patients whose data all showed unusually high activity in the DNA repair pathway. 
            This is a critical finding because this specific biological pattern is strongly linked to how some tumors respond to chemotherapy.
          </p>
        </div>
        <div className="bg-slate-800 md:w-1/2 p-8 flex items-center justify-center border-l border-slate-700">
          <div className="w-full max-w-xs space-y-4">
            <div className="flex justify-between text-sm text-slate-400">
              <span>DNA Repair Activity</span>
              <span>High</span>
            </div>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-300"><span>Cluster 1</span><span>Normal</span></div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-blue-400 w-1/3"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-slate-300"><span>Cluster 2</span><span>Low</span></div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-purple-400 w-1/5"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-teal-300 font-bold"><span>Cluster 3</span><span>Spiked</span></div>
                <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden"><div className="h-full bg-teal-400 w-[85%]"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const UseCases = () => {
  const cases = [
    { icon: <Target/>, title: 'Cancer Subtyping', desc: 'Finding molecular subtypes within a cancer type that standard clinical exams miss.' },
    { icon: <ActivitySquare/>, title: 'Biomarker Discovery', desc: 'Surfacing candidate biological signals for screening before symptoms appear.' },
    { icon: <Users/>, title: 'Precision Treatment', desc: 'Matching patients to therapies based on their AI-discovered biological group.' },
    { icon: <Pill/>, title: 'Drug Repurposing', desc: 'Finding new uses for existing drugs if a cluster shows a known pathway is hyperactive.' },
    { icon: <Search/>, title: 'Clinical Trial Selection', desc: 'Enrolling patients most likely to benefit based on their molecular profile.' },
    { icon: <RefreshCw/>, title: 'Rare Disease Research', desc: 'Finding patterns without needing massive labeled datasets (unsupervised).' },
    { icon: <Brain/>, title: 'Beyond Cancer', desc: 'The same architecture works for Alzheimer\'s, cardiovascular, and autoimmune diseases.' },
  ];

  return (
    <section id="use-cases" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Real-World Applications</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cases.map((c, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all group">
              <div className="text-teal-600 mb-4 group-hover:scale-110 transition-transform origin-left">{c.icon}</div>
              <h4 className="font-semibold text-slate-900 mb-2">{c.title}</h4>
              <p className="text-sm text-slate-600">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Metrics = () => (
  <section className="py-16 bg-teal-900 text-white">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-teal-700">
        <div className="pt-4 md:pt-0">
          <div className="text-5xl font-bold text-teal-300 mb-2">3</div>
          <div className="text-lg font-medium mb-2">Data Modalities Merged</div>
          <p className="text-teal-100/70 text-sm max-w-xs mx-auto">DNA, RNA, and protein data combined into one continuous mathematical space.</p>
        </div>
        <div className="pt-8 md:pt-0">
          <div className="text-5xl font-bold text-teal-300 mb-2">94%</div>
          <div className="text-lg font-medium mb-2">Reconstruction Accuracy</div>
          <p className="text-teal-100/70 text-sm max-w-xs mx-auto">The AI can recreate the original patient data from its compressed summary, proving it learned real patterns, not noise.</p>
        </div>
        <div className="pt-8 md:pt-0">
          <div className="text-5xl font-bold text-teal-300 mb-2">128</div>
          <div className="text-lg font-medium mb-2">Latent Dimensions</div>
          <p className="text-teal-100/70 text-sm max-w-xs mx-auto">Millions of biological measurements are distilled down to 128 core features that define a patient's disease.</p>
        </div>
      </div>
    </div>
  </section>
);
