import React, { useState, useEffect } from 'react';
import { UploadCloud, File, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';

const UploadAnalysis = () => {
  const [files, setFiles] = useState({
    dna: null,
    rna: null,
    protein: null
  });
  
  const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, complete, error
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);
  
  // Background data for scatter plot
  const [bgClusters, setBgClusters] = useState([]);
  const [plotBounds, setPlotBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

  useEffect(() => {
    // Fetch the BRCA clusters in the background so we can plot the patient on them later
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/clusters?cohort=BRCA`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setBgClusters(data);
        if (data.length > 0) {
          let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
          data.forEach(c => {
            const cMinX = Math.min(...c.x);
            const cMaxX = Math.max(...c.x);
            const cMinY = Math.min(...c.y);
            const cMaxY = Math.max(...c.y);
            if(cMinX < minX) minX = cMinX;
            if(cMaxX > maxX) maxX = cMaxX;
            if(cMinY < minY) minY = cMinY;
            if(cMaxY > maxY) maxY = cMaxY;
          });
          // Add a 10% margin
          const xMargin = (maxX - minX) * 0.1;
          const yMargin = (maxY - minY) * 0.1;
          setPlotBounds({
            minX: minX - xMargin,
            maxX: maxX + xMargin,
            minY: minY - yMargin,
            maxY: maxY + yMargin
          });
        }
      })
      .catch(console.error);
  }, []);

  const handleFileChange = (type, e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
    }
  };

  const handleAnalyze = async () => {
    if (!files.dna || !files.rna || !files.protein) {
      setErrorMsg("Please upload all three required files.");
      setStatus('error');
      return;
    }

    setStatus('analyzing');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('dna_file', files.dna);
    formData.append('rna_file', files.rna);
    formData.append('protein_file', files.protein);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/analyze-custom`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Analysis failed. Please check your files.');
      }

      const data = await response.json();
      setResult(data);
      setStatus('complete');
    } catch (error) {
      console.error(error);
      setErrorMsg(error.message);
      setStatus('error');
    }
  };

  const resetForm = () => {
    setFiles({ dna: null, rna: null, protein: null });
    setStatus('idle');
    setResult(null);
  };

  const FileDropzone = ({ type, label, description, iconColor, sampleLink }) => (
    <div className="relative group bg-slate-800/50 hover:bg-slate-800 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 transition-all text-center">
      <input
        type="file"
        accept=".csv,.tsv,.txt"
        onChange={(e) => handleFileChange(type, e)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
        files[type] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400 group-hover:text-indigo-400'
      }`}>
        {files[type] ? <CheckCircle className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
      </div>
      <h3 className="text-lg font-bold text-slate-200 mb-1">{label}</h3>
      <p className="text-sm text-slate-400 mb-3">{files[type] ? files[type].name : description}</p>
      
    </div>
  );

  return (
    <section id="custom-analysis" className="py-24 bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Analyze Your Own Data
          </h2>
          <p className="text-xl text-slate-400">
            Upload custom patient multi-omics profiles to instantly run them through the AE-MAP inference pipeline.
          </p>
        </div>

        {status !== 'complete' ? (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FileDropzone 
                type="dna" 
                label="DNA (Mutations)" 
                description="Upload mutation variants (.csv)" 
                sampleLink="/samples/sample_dna.csv" 
              />
              <FileDropzone 
                type="rna" 
                label="RNA (Expression)" 
                description="Upload mRNA read counts (.csv)" 
                sampleLink="/samples/sample_rna.csv" 
              />
              <FileDropzone 
                type="protein" 
                label="Protein (RPPA)" 
                description="Upload protein abundance (.csv)" 
                sampleLink="/samples/sample_protein.csv" 
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8 flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={status === 'analyzing' || !files.dna || !files.rna || !files.protein}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mx-auto gap-2 text-lg shadow-lg shadow-indigo-500/25"
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Running AI Pipeline...
                  </>
                ) : (
                  'Run Multi-Omic Analysis'
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="max-w-4xl mx-auto mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete</h3>
              <p className="text-slate-400 mb-6">We've mapped your patient to the AE-MAP latent space.</p>
              <button 
                onClick={resetForm}
                className="text-indigo-400 hover:text-indigo-300 font-medium flex items-center justify-center mx-auto gap-2"
              >
                <UploadCloud className="w-4 h-4" /> Analyze another patient
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              <div className="lg:col-span-1 flex flex-col gap-6">
                <div className={`bg-slate-800 rounded-xl p-6 border-t-4 shadow-xl flex flex-col ${result.meta.colorClass}`}>
                   <h3 className={`text-xl font-bold mb-4 ${result.meta.titleColor}`}>Predicted Group: {result.meta.name}</h3>
                   <p className="text-sm text-slate-300 flex-grow">
                     <strong className="text-white">What it means:</strong> {result.meta.means}
                   </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border-t-4 border-slate-600 shadow-xl flex flex-col">
                   <h3 className="text-xl font-bold mb-4 text-slate-100">Biological Drivers</h3>
                   <p className="text-sm text-slate-300 flex-grow">
                     <strong className="text-white">What's driving it:</strong> {result.meta.driving}
                   </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border-t-4 border-slate-600 shadow-xl flex flex-col">
                   <h3 className="text-xl font-bold mb-4 text-slate-100">Clinical Impact</h3>
                   <p className="text-sm text-slate-300 flex-grow">
                     <strong className="text-white">How this helps:</strong> {result.meta.helps}
                   </p>
                </div>
              </div>

              {/* Scatter Plot */}
              <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 shadow-xl flex flex-col relative border border-slate-700/50">
                <h3 className="text-xl font-bold mb-4 text-slate-100">Patient Latent Map</h3>
                <p className="text-sm text-slate-400 mb-4">
                  Your patient has been projected into the AE-MAP multi-omic latent space. They are plotted against the background TCGA patient cohort.
                </p>
                
                <div className="relative w-full h-[400px] bg-slate-900 border border-slate-700/50 rounded-xl overflow-hidden mt-auto">
                  {bgClusters.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                      Loading background map...
                    </div>
                  ) : (
                    <>
                      {/* Background points */}
                      {bgClusters.map((cluster, cIdx) => (
                        <React.Fragment key={`bg-${cIdx}`}>
                          {cluster.x.map((px, i) => {
                            const py = cluster.y[i];
                            const left = ((px - plotBounds.minX) / (plotBounds.maxX - plotBounds.minX)) * 100;
                            const top = ((plotBounds.maxY - py) / (plotBounds.maxY - plotBounds.minY)) * 100;
                            return (
                              <div
                                key={i}
                                className="absolute rounded-full"
                                style={{
                                  width: '6px',
                                  height: '6px',
                                  left: `${left}%`,
                                  top: `${top}%`,
                                  backgroundColor: cluster.meta.markerColor || '#64748b',
                                  opacity: 0.15,
                                  transform: 'translate(-50%, -50%)'
                                }}
                              />
                            );
                          })}
                        </React.Fragment>
                      ))}

                      {/* Your patient point */}
                      {(() => {
                        const left = ((result.x - plotBounds.minX) / (plotBounds.maxX - plotBounds.minX)) * 100;
                        const top = ((plotBounds.maxY - result.y) / (plotBounds.maxY - plotBounds.minY)) * 100;
                        return (
                          <div
                            className="absolute rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10 animate-pulse border-2 border-white"
                            style={{
                              width: '16px',
                              height: '16px',
                              left: `${left}%`,
                              top: `${top}%`,
                              backgroundColor: result.meta.markerColor || '#fff',
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap shadow-lg font-bold border border-slate-600">
                              Your Patient
                            </div>
                          </div>
                        );
                      })()}
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default UploadAnalysis;
