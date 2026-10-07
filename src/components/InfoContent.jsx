import React, { useState } from 'react';
import { 
  ChevronDown, 
  Database, 
  ShieldCheck, 
  Cpu, 
  Compass, 
  Layers, 
  Activity, 
  CheckCircle2, 
  Sparkles,
  GitBranch,
  Boxes,
  Microscope,
  Binary
} from 'lucide-react';

export const DataCredibility = () => (
  <section className="py-12 bg-slate-900 border-y border-slate-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-left">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white font-bold text-base flex items-center gap-2">
              Standardized Genomic & Proteomic Consortia
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified
              </span>
            </h4>
            <p className="text-slate-300 text-sm max-w-2xl leading-relaxed mt-0.5">
              Trained and validated on harmonized multi-omic cohorts from The Cancer Genome Atlas (TCGA) and CPTAC protocols — combining somatic mutations, RNA transcriptomics, and RPPA protein levels.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          {[
            { label: 'TCGA-BRCA', desc: '1,079 Patients' },
            { label: 'TCGA-LUAD', desc: '510 Patients' },
            { label: 'CPTAC-3', desc: 'Proteomics' },
            { label: 'MSigDB v2024', desc: 'Hallmarks' }
          ].map((tag, idx) => (
            <div key={idx} className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700/80 text-center">
              <div className="text-xs font-bold text-white tracking-wide">{tag.label}</div>
              <div className="text-[10px] text-slate-400 font-medium">{tag.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const AccordionItem = ({ title, category, content, isOpen, onToggle }) => (
  <div className={`rounded-xl border transition-all duration-200 ${
    isOpen 
      ? 'bg-slate-800/90 border-indigo-500/40 shadow-lg' 
      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
  }`}>
    <button 
      className="w-full text-left p-4.5 sm:p-5 flex justify-between items-center focus:outline-none"
      onClick={onToggle}
      aria-expanded={isOpen}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs px-2.5 py-1 rounded-md font-mono font-medium bg-slate-800 text-indigo-300 border border-slate-700">
          {category}
        </span>
        <span className="font-semibold text-slate-100 text-base">{title}</span>
      </div>
      <div className={`p-1 rounded-lg bg-slate-800/60 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : 'text-slate-400'}`}>
        <ChevronDown className="w-4 h-4" />
      </div>
    </button>
    {isOpen && (
      <div className="px-5 pb-5 pt-1 text-slate-300 text-sm leading-relaxed border-t border-slate-800/60">
        {content}
      </div>
    )}
  </div>
);

export const JargonBuster = () => {
  const [openIdx, setOpenIdx] = useState(0);

  const jargonItems = [
    {
      title: 'Latent Space Representation',
      category: 'Deep Learning',
      content: 'A compressed, 128-dimensional mathematical coordinate system where high-dimensional, noisy multi-omics profiles are synthesized. Patients with similar underlying molecular drivers naturally cluster near one another.'
    },
    {
      title: 'Unsupervised Subtyping',
      category: 'Machine Learning',
      content: 'Grouping patients strictly by autonomous pattern discovery in the multi-omic data without pre-existing diagnostic labels or human bias, revealing hidden subgroups that single-gene testing misses.'
    },
    {
      title: 'Missing Modality Imputation',
      category: 'Data Science',
      content: 'Algorithms that handle incomplete clinical testing (e.g., patient has RNA and DNA but missing protein assays) by projecting available layers into the shared autoencoder space without discarding the patient.'
    },
    {
      title: 'Deep Multi-Branch Autoencoder',
      category: 'Architecture',
      content: 'A neural network with modality-specific encoder branches (DNA, RNA, protein) that bottleneck through a unified latent code, reconstructed through matching decoder branches to ensure biological fidelity.'
    },
    {
      title: 'Gene Set Enrichment (GSEA)',
      category: 'Biology',
      content: 'Computational validation that checks discovered clusters against known molecular pathways (e.g., MSigDB Hallmark gene sets) to prove the grouping reflects genuine biological mechanisms like DNA repair or immune evasion.'
    },
    {
      title: 'Gaussian Mixture Models (GMM)',
      category: 'Clustering',
      content: 'A probabilistic clustering method applied to UMAP-projected latent coordinates that assigns patients to molecular clusters while providing certainty scores and smooth boundary transitions.'
    }
  ];

  return (
    <section className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold tracking-wide uppercase mb-3">
            <Compass className="w-3.5 h-3.5" /> Conceptual Glossary
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Jargon Buster</h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto">
            Demystifying multi-omics, autoencoder architectures, and computational oncology terminology for researchers and clinicians.
          </p>
        </div>

        <div className="space-y-3">
          {jargonItems.map((item, idx) => (
            <AccordionItem 
              key={idx}
              title={item.title}
              category={item.category}
              content={item.content}
              isOpen={openIdx === idx}
              onToggle={() => setOpenIdx(openIdx === idx ? -1 : idx)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export const AboutAndRoadmap = () => (
  <section id="about" className="py-24 bg-slate-950 border-t border-slate-800 scroll-mt-24">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold tracking-wide uppercase mb-3">
          <Microscope className="w-3.5 h-3.5" /> Project Evolution
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">Motivation & Research Roadmap</h2>
        <p className="text-slate-300 text-base max-w-2xl mx-auto">
          Translating complex, siloed multi-omics into actionable precision oncology insights.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-slate-900/90 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
              <Binary className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Why We Built AE-MAP</h3>
            <p className="text-slate-300 leading-relaxed text-sm mb-4">
              Modern clinical oncology generates gigabytes of genomics, transcriptomics, and proteomics per tumor. However, clinical decision-making often relies on single-gene immunohistochemistry or fragmented DNA panels.
            </p>
            <p className="text-slate-300 leading-relaxed text-sm">
              AE-MAP was engineered to unify multi-layer biological information into a cohesive latent space. By extracting non-linear interactions across mutations, transcription, and translation, AE-MAP reveals therapeutic vulnerabilities that single-omic assays fail to capture.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-semibold text-slate-300">Open-Source Precision Oncology Pipeline</span>
          </div>
        </div>

        <div className="bg-slate-900/90 rounded-2xl p-8 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
              <GitBranch className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Milestones & Next Phases</h3>
            <div className="space-y-4">
              {[
                {
                  status: 'Shipped',
                  statusColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                  title: 'Multi-Modal Autoencoder & Benchmark Hub',
                  desc: 'Dual-cohort models (BRCA & LUAD) with 10 validated benchmark patient test profiles.'
                },
                {
                  status: 'Active',
                  statusColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
                  title: 'Interactive Patient Projection Dashboard',
                  desc: 'Real-time multi-omic inference with UMAP visualization and biomarker explanations.'
                },
                {
                  status: 'Upcoming',
                  statusColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                  title: 'Drug Sensitivity & Clinical Trials Matching',
                  desc: 'Integration with GDSC (Genomics of Drug Sensitivity in Cancer) for therapeutic prioritization.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-bold text-white">{item.title}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.statusColor}`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400">
            Targeted for deployment across clinical research networks & bioinformatics pipelines.
          </div>
        </div>
      </div>
    </div>
  </section>
);

export const TechStack = () => {
  const technologies = [
    { name: 'PyTorch', role: 'Multi-Branch Autoencoder & Latent Embedding', tag: 'Deep Learning' },
    { name: 'FastAPI', role: 'Async REST API & Sub-50ms Model Inference', tag: 'Backend' },
    { name: 'React 18 & Vite', role: 'High-Performance Reactive Web UI', tag: 'Frontend' },
    { name: 'UMAP & Scikit-Learn', role: 'Manifold Reduction & GMM Clustering', tag: 'Machine Learning' },
    { name: 'Lifelines', role: 'Kaplan-Meier Curves & Log-Rank Testing', tag: 'Survival Analysis' },
    { name: 'GSEApy', role: 'Curated MSigDB Hallmark Pathway Enrichment', tag: 'Bioinformatics' }
  ];

  return (
    <section className="py-16 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-2">
            Production-Ready Architecture
          </p>
          <h3 className="text-2xl font-bold text-white">Engineered with Modern Computational Science Tools</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/70 hover:border-indigo-500/50 transition-all flex items-start justify-between gap-4">
              <div>
                <div className="text-base font-bold text-white mb-1">{tech.name}</div>
                <div className="text-xs text-slate-300 leading-relaxed">{tech.role}</div>
              </div>
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-700/60 text-indigo-300 border border-slate-600/50 shrink-0">
                {tech.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
