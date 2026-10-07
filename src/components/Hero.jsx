import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Dna, Activity, ShieldAlert, Sparkles, Layers } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="relative pt-24 pb-28 overflow-hidden scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Autoencoder-Based Multi-Omics Analysis Platform
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6"
          >
            Three languages. <br className="hidden sm:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-fuchsia-300 to-teal-300">
              One unified translator.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-300 mb-10 leading-relaxed max-w-3xl mx-auto"
          >
            AE-MAP uses deep multi-view autoencoders to synthesize DNA mutations, RNA expression, and protein abundance into a 128-dimensional latent space—revealing hidden patient subtypes and treatment targets invisible to single-omic analysis.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <a 
              href="#live-demo"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base sm:text-lg font-semibold rounded-full text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all gap-2"
            >
              Explore Live Demo
              <ChevronRight className="w-5 h-5" />
            </a>
            <a 
              href="#custom-analysis"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base sm:text-lg font-semibold rounded-full text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 transition-all gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-fuchsia-400" />
              Analyze Custom Data
            </a>
          </motion.div>
        </div>

        {/* Multi-Omics Convergence Architecture Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 0.6 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <div className="text-center text-xs uppercase tracking-wider text-slate-400 font-semibold mb-6">
              Multi-View Autoencoder Architecture
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              {/* Input Streams */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-blue-500/30 rounded-xl">
                  <div className="p-2 bg-blue-500/20 text-blue-400 rounded-lg">
                    <Dna className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Genomics (DNA)</div>
                    <div className="text-xs text-slate-400">Somatic Variant Status</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-purple-500/30 rounded-xl">
                  <div className="p-2 bg-purple-500/20 text-purple-400 rounded-lg">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Transcriptomics (RNA)</div>
                    <div className="text-xs text-slate-400">Gene Read Counts (RSEM)</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-slate-900/80 border border-teal-500/30 rounded-xl">
                  <div className="p-2 bg-teal-500/20 text-teal-400 rounded-lg">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-bold text-white">Proteomics (Protein)</div>
                    <div className="text-xs text-slate-400">RPPA Phospho-Abundance</div>
                  </div>
                </div>
              </div>

              {/* Middle Convergence / Latent Bottleneck */}
              <div className="flex flex-col items-center justify-center p-6 bg-indigo-950/40 border border-indigo-500/40 rounded-xl text-center relative my-2 md:my-0 shadow-lg shadow-indigo-950/50">
                <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-400 text-indigo-300 flex items-center justify-center mb-3 animate-pulse">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-white mb-1">Latent Space</div>
                <div className="text-xs text-indigo-300 font-mono mb-2">128-Dim Bottleneck</div>
                <div className="text-[11px] text-slate-400">
                  Non-linear cross-modal compression & imputation
                </div>
              </div>

              {/* Output Subtyping */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/80 border border-emerald-500/30 rounded-xl text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-400 uppercase">Outcome Validated</span>
                    <span className="text-[10px] text-slate-400 font-mono">p &lt; 0.001</span>
                  </div>
                  <div className="text-sm font-bold text-white">Clinical Subtyping</div>
                  <div className="text-xs text-slate-400">Identifies prognostic cohorts</div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-fuchsia-500/30 rounded-xl text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-fuchsia-400 uppercase">Targetable</span>
                    <span className="text-[10px] text-slate-400 font-mono">Enriched</span>
                  </div>
                  <div className="text-sm font-bold text-white">Biological Explainability</div>
                  <div className="text-xs text-slate-400">Pinpoints driver pathways</div>
                </div>

                <div className="p-3 bg-slate-900/80 border border-amber-500/30 rounded-xl text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 uppercase">Generalizable</span>
                    <span className="text-[10px] text-slate-400 font-mono">Multi-Cancer</span>
                  </div>
                  <div className="text-sm font-bold text-white">Cross-Cohort Portability</div>
                  <div className="text-xs text-slate-400">Validated on BRCA & LUAD</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
        <div className="absolute top-[20%] right-[-5%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/10 blur-[120px]"></div>
      </div>
    </section>
  );
};

export default Hero;
