import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle, AlertCircle, Loader2, Download, UserCheck, Stethoscope } from 'lucide-react';

const UploadAnalysis = () => {
  const [activeCohort, setActiveCohort] = useState('BRCA');
  const [files, setFiles] = useState({
    dna: null,
    rna: null,
    protein: null
  });
  
  const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, complete, error
  const [errorMsg, setErrorMsg] = useState('');
  const [result, setResult] = useState(null);
  
  // 10 BRCA & LUAD benchmark patients
  const [brcaPatients, setBrcaPatients] = useState([]);
  const [selectedBrcaId, setSelectedBrcaId] = useState('patient_01');
  const [luadPatients, setLuadPatients] = useState([]);
  const [selectedLuadId, setSelectedLuadId] = useState('patient_01');

  // Background data for scatter plot
  const [bgClusters, setBgClusters] = useState([]);
  const [plotBounds, setPlotBounds] = useState({ minX: 0, maxX: 0, minY: 0, maxY: 0 });

  // Load manifests on mount
  useEffect(() => {
    fetch('/samples/BRCA/patients_manifest.json')
      .then(res => res.ok ? res.json() : [])
      .then(data => setBrcaPatients(data))
      .catch(console.error);

    fetch('/samples/LUAD/patients_manifest.json')
      .then(res => res.ok ? res.json() : [])
      .then(data => setLuadPatients(data))
      .catch(console.error);
  }, []);

  // Fetch background clusters whenever cohort changes
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/clusters?cohort=${activeCohort}`)
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
          const xMargin = (maxX - minX) * 0.1 || 1.0;
          const yMargin = (maxY - minY) * 0.1 || 1.0;
          setPlotBounds({
            minX: minX - xMargin,
            maxX: maxX + xMargin,
            minY: minY - yMargin,
            maxY: maxY + yMargin
          });
        }
      })
      .catch(console.error);
  }, [activeCohort]);

  const handleFileChange = (type, e) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
    }
  };

  const handleCohortSwitch = (cohort) => {
    setActiveCohort(cohort);
    setFiles({ dna: null, rna: null, protein: null });
    setStatus('idle');
    setResult(null);
    setErrorMsg('');
  };

  const loadPatient = async (cohort, patientId) => {
    if (cohort === 'BRCA') {
      setSelectedBrcaId(patientId);
    } else {
      setSelectedLuadId(patientId);
    }

    try {
      setStatus('idle');
      setErrorMsg('');
      const dnaUrl = `/samples/${cohort}/${patientId}/dna.csv`;
      const rnaUrl = `/samples/${cohort}/${patientId}/rna.csv`;
      const protUrl = `/samples/${cohort}/${patientId}/protein.csv`;

      const [dnaRes, rnaRes, protRes] = await Promise.all([
        fetch(dnaUrl),
        fetch(rnaUrl),
        fetch(protUrl)
      ]);
      const [dnaBlob, rnaBlob, protBlob] = await Promise.all([
        dnaRes.blob(),
        rnaRes.blob(),
        protRes.blob()
      ]);
      setFiles({
        dna: new File([dnaBlob], `${cohort}_${patientId}_dna.csv`, { type: 'text/csv' }),
        rna: new File([rnaBlob], `${cohort}_${patientId}_rna.csv`, { type: 'text/csv' }),
        protein: new File([protBlob], `${cohort}_${patientId}_protein.csv`, { type: 'text/csv' })
      });
    } catch (err) {
      console.error(`Failed to load ${cohort} patient:`, err);
      setErrorMsg('Could not load patient files.');
    }
  };

  const handleAnalyze = async () => {
    if (!files.dna || !files.rna || !files.protein) {
      setErrorMsg("Please upload or load all three required files.");
      setStatus('error');
      return;
    }

    setStatus('analyzing');
    setErrorMsg('');

    const formData = new FormData();
    formData.append('cohort', activeCohort);
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

  const currentPatientsList = activeCohort === 'BRCA' ? brcaPatients : luadPatients;
  const currentSelectedId = activeCohort === 'BRCA' ? selectedBrcaId : selectedLuadId;
  const currentPatientInfo = currentPatientsList.find(p => p.id === currentSelectedId) || null;

  const FileDropzone = ({ type, label, description, sampleLink }) => (
    <div className="relative group bg-slate-800/50 hover:bg-slate-800 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-xl p-6 transition-all text-center flex flex-col justify-between h-full">
      <input
        type="file"
        accept=".csv,.tsv,.txt"
        onChange={(e) => handleFileChange(type, e)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div>
        <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
          files[type] ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400 group-hover:text-indigo-400'
        }`}>
          {files[type] ? <CheckCircle className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
        </div>
        <h3 className="text-lg font-bold text-slate-200 mb-1">{label}</h3>
        <p className="text-sm text-slate-400 mb-2">{files[type] ? files[type].name : description}</p>
      </div>
      
      {sampleLink && (
        <div className="pt-2 border-t border-slate-700/50 mt-2 z-10">
          <a
            href={sampleLink}
            download
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            <Download className="w-3.5 h-3.5" /> Download test file
          </a>
        </div>
      )}
    </div>
  );

  return (
    <section id="custom-analysis" className="py-24 bg-slate-900 border-t border-slate-800 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl mb-4">
            Analyze Your Own Data
          </h2>
          <p className="text-lg text-slate-300 mb-6">
            Upload custom patient multi-omics profiles or test 10 benchmark patients for each cancer type through the AE-MAP inference pipeline.
          </p>

          {/* Cancer Type Toggle */}
          <div className="inline-flex bg-slate-800 p-1.5 rounded-xl border border-slate-700/80 mb-6 shadow-inner">
            <button
              onClick={() => handleCohortSwitch('BRCA')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeCohort === 'BRCA'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Breast Cancer (TCGA-BRCA)
            </button>
            <button
              onClick={() => handleCohortSwitch('LUAD')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeCohort === 'LUAD'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Lung Cancer (TCGA-LUAD)
            </button>
          </div>
        </div>

        {status !== 'complete' ? (
          <div className="max-w-4xl mx-auto">
            
            {/* 10-Patient Selector Section */}
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 mb-8 shadow-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Select from 10 Benchmark {activeCohort === 'BRCA' ? 'Breast Cancer' : 'Lung Cancer'} Patients
                  </h3>
                  <p className="text-xs text-slate-400">
                    {activeCohort === 'BRCA'
                      ? 'Pre-computed multi-omic profiles representing Luminal A/B, DNA Repair Deficits (BRCA1/2), and Aggressive Basal/HER2+.'
                      : 'Pre-computed multi-omic profiles representing Immune-Active, KRAS/EGFR-Driven, and Proliferative subtypes.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
                {currentPatientsList.map((p, idx) => {
                  const isSelected = currentSelectedId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => loadPatient(activeCohort, p.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                          : 'bg-slate-900/60 border-slate-700/80 text-slate-300 hover:bg-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold">Patient {String(idx + 1).padStart(2, '0')}</div>
                      <div className="text-[10px] opacity-80 truncate">{p.name.split('(')[1]?.replace(')', '') || 'Sample'}</div>
                    </button>
                  );
                })}
              </div>

              {currentPatientInfo && (
                <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-semibold text-indigo-300">{currentPatientInfo.name}:</span>{' '}
                    <span className="text-slate-300">{currentPatientInfo.desc}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => loadPatient(activeCohort, currentPatientInfo.id)}
                    className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg text-xs whitespace-nowrap self-start sm:self-auto flex items-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Stage This Patient
                  </button>
                </div>
              )}
            </div>

            {/* Dropzones */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <FileDropzone 
                type="dna" 
                label="DNA (Mutations)" 
                description="Upload mutation variants (.csv)" 
                sampleLink={`/samples/${activeCohort}/${currentSelectedId}/dna.csv`} 
              />
              <FileDropzone 
                type="rna" 
                label="RNA (Expression)" 
                description="Upload mRNA read counts (.csv)" 
                sampleLink={`/samples/${activeCohort}/${currentSelectedId}/rna.csv`} 
              />
              <FileDropzone 
                type="protein" 
                label="Protein (RPPA)" 
                description="Upload protein abundance (.csv)" 
                sampleLink={`/samples/${activeCohort}/${currentSelectedId}/protein.csv`} 
              />
            </div>

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-8 flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{errorMsg}</p>
              </div>
            )}

            <div className="flex items-center justify-center">
              <button
                onClick={handleAnalyze}
                disabled={status === 'analyzing' || !files.dna || !files.rna || !files.protein}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-10 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg shadow-lg shadow-indigo-500/25"
              >
                {status === 'analyzing' ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Running AI Pipeline ({activeCohort})...
                  </>
                ) : (
                  `Run Multi-Omic Analysis (${activeCohort})`
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Result View */
          <div>
            <div className="max-w-4xl mx-auto mb-10 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Analysis Complete ({result.cohort || activeCohort})</h3>
              <p className="text-slate-300 mb-6">Patient mapped to the AE-MAP multi-modal latent space and classified.</p>
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
                   <p className="text-sm text-slate-200 flex-grow">
                     <strong className="text-white">What it means:</strong> {result.meta.means}
                   </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border-t-4 border-slate-600 shadow-xl flex flex-col">
                   <h3 className="text-xl font-bold mb-4 text-slate-100">Biological Drivers</h3>
                   <p className="text-sm text-slate-200 flex-grow">
                     <strong className="text-white">What's driving it:</strong> {result.meta.driving}
                   </p>
                </div>
                <div className="bg-slate-800 rounded-xl p-6 border-t-4 border-slate-600 shadow-xl flex flex-col">
                   <h3 className="text-xl font-bold mb-4 text-slate-100">Clinical Impact</h3>
                   <p className="text-sm text-slate-200 flex-grow">
                     <strong className="text-white">How this helps:</strong> {result.meta.helps}
                   </p>
                </div>
              </div>

              {/* Scatter Plot */}
              <div className="lg:col-span-2 bg-slate-800 rounded-xl p-6 shadow-xl flex flex-col relative border border-slate-700/50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-slate-100">Patient Latent Map</h3>
                  <span className="text-xs px-2.5 py-1 bg-slate-700 text-slate-200 rounded-full font-mono">{result.cohort || activeCohort} Cohort</span>
                </div>
                <p className="text-sm text-slate-300 mb-4">
                  Your patient has been projected into the AE-MAP multi-omic latent space. They are plotted against the background {result.cohort || activeCohort} cohort ({bgClusters.reduce((acc, c) => acc + c.samples.length, 0)} patients).
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
                                  opacity: 0.25,
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
                            className="absolute rounded-full shadow-[0_0_20px_rgba(255,255,255,0.9)] z-20 animate-pulse border-2 border-white"
                            style={{
                              width: '18px',
                              height: '18px',
                              left: `${left}%`,
                              top: `${top}%`,
                              backgroundColor: result.meta.markerColor || '#fff',
                              transform: 'translate(-50%, -50%)'
                            }}
                          >
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2.5 py-1 rounded-md whitespace-nowrap shadow-xl font-bold border border-slate-600">
                              Your Patient ({result.meta.name.split(' - ')[0] || 'Subtype'})
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
