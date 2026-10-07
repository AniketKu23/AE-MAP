import React from 'react';
import { Code, ExternalLink, Activity, Database, Sparkles, Layers } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black tracking-tight shadow-md shadow-indigo-500/20">
                AE
              </div>
              <span className="font-extrabold text-2xl text-white tracking-tight">AE-MAP</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                v1.0 Production
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              Autoencoder Multi-Omics Analysis Pipeline for unsupervised cancer subtype discovery, biomarker attribution, and patient trajectory projection.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Inference API Live
              </span>
              <span>•</span>
              <span>TCGA-BRCA & TCGA-LUAD Ready</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-indigo-400 transition-colors">Overview</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">Three-Tier Pipeline</a>
              </li>
              <li>
                <a href="#live-demo" className="hover:text-indigo-400 transition-colors">Interactive Latent Space</a>
              </li>
              <li>
                <a href="#custom-analysis" className="hover:text-indigo-400 transition-colors">Analyze Your Own Data</a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-indigo-400 transition-colors">Clinical Translation</a>
              </li>
            </ul>
          </div>

          {/* Resources & Open Source */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a 
                  href="https://github.com/AniketKu23/AE-MAP" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Code className="w-4 h-4 text-indigo-400" />
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="#about" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Activity className="w-4 h-4 text-purple-400" />
                  <span>Research Roadmap</span>
                </a>
              </li>
              <li>
                <a href="/samples/BRCA/patients_manifest.json" target="_blank" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>Benchmark Manifest</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AE-MAP Precision Oncology Project. Designed for academic and clinical demonstration.</p>
          <div className="flex gap-4">
            <span>TCGA / CPTAC Data Standards</span>
            <span>•</span>
            <span>MIT License</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
