import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const DataCredibility = () => (
  <section className="py-8 bg-slate-100 border-y border-slate-700/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-slate-300 text-sm font-medium">
        Trained on real patient data from The Cancer Genome Atlas (TCGA) and the CPTAC proteomics program — the same public datasets used in published cancer research worldwide. Not synthetic or invented data.
      </p>
    </div>
  </section>
);

const AccordionItem = ({ title, content }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-700/50 last:border-0">
      <button 
        className="w-full text-left py-4 flex justify-between items-center focus:outline-none"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-slate-100">{title}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="pb-4 text-slate-300 text-sm leading-relaxed">
          {content}
        </div>
      )}
    </div>
  );
};

export const JargonBuster = () => (
  <section className="py-20 bg-slate-800">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Jargon Buster</h2>
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-700/50">
        <AccordionItem title="Latent Space" content="A compressed, mathematical summary of the data where similar patients are naturally grouped closer together." />
        <AccordionItem title="Unsupervised Learning" content="When the AI finds patterns entirely on its own, without a human telling it what the 'right' answer or categories should be." />
        <AccordionItem title="Imputation" content="An educated guess by the computer to fill in a missing piece of data (like a missing test result) based on patients who are similar." />
        <AccordionItem title="Autoencoder" content="A type of AI that learns to compress data down to its most essential features, and then reconstruct it back." />
        <AccordionItem title="Pathway Enrichment" content="Checking our math against known biology to see if a discovered group shares a specific biological trait (like a broken DNA repair mechanism)." />
        <AccordionItem title="Clustering" content="The automated process of grouping patients based on how mathematically similar they are in the compressed summary." />
      </div>
    </div>
  </section>
);

export const FAQ = () => (
  <section className="py-20 bg-slate-900">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        <AccordionItem title="Is this diagnosing real patients?" content="No — it is a research and discovery tool meant to help scientists find new patterns, not a diagnostic medical device for bedside use." />
        <AccordionItem title="Where does the data come from?" content="All data is from public, de-identified databases like TCGA (The Cancer Genome Atlas), representing real patients who consented to research." />
        <AccordionItem title="How is this different from just searching a database?" content="Searching retrieves what you already know to look for. AE-MAP finds hidden, complex connections no human queried for or even knew existed." />
        <AccordionItem title="Does the AI need to be told the right answer first?" content="No. It uses unsupervised learning. We don't tell it who has what subtype; it figures out the natural groupings based entirely on the biology." />
      </div>
    </div>
  </section>
);

export const AboutAndRoadmap = () => (
  <section id="about" className="py-20 bg-slate-800 border-t border-slate-700/50">
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Motivation</h2>
          <p className="text-slate-300 leading-relaxed">
            The volume of multi-omics data in the world is exploding, but our ability to understand it as a cohesive whole has lagged. 
            AE-MAP was built to bridge this gap, translating massive, disconnected datasets into actionable biological insights. 
            By building a tool that handles the messy reality of biological data, we hope to accelerate the path to precision medicine.
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Roadmap & Future Vision</h2>
          <ul className="space-y-3 text-slate-300">
            <li className="flex gap-2">
              <span className="text-purple-300 font-bold">•</span>
              Expand support for 15+ additional cancer types.
            </li>
            <li className="flex gap-2">
              <span className="text-purple-300 font-bold">•</span>
              Develop a dedicated "Drug Repurposing" module for immediate clinical hypotheses.
            </li>
            <li className="flex gap-2">
              <span className="text-purple-300 font-bold">•</span>
              Deploy as an open-source, locally runnable tool for hospital research networks.
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

export const TechStack = () => (
  <section className="py-12 bg-slate-900 border-t border-slate-700/50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <p className="text-xs uppercase tracking-widest text-slate-400 mb-6 font-semibold">Powered By Industry Standard Tools</p>
      <div className="flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 transition-all">
        {/* Placeholder for tech logos, using text for clean minimal look */}
        <span className="font-bold text-slate-700">Python</span>
        <span className="font-bold text-slate-700">PyTorch</span>
        <span className="font-bold text-slate-700">Scikit-Learn</span>
        <span className="font-bold text-slate-700">Plotly</span>
        <span className="font-bold text-slate-700">React</span>
        <span className="font-bold text-slate-700">FastAPI</span>
      </div>
    </div>
  </section>
);
