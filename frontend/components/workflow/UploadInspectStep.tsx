"use client";

import { FileJson, FileSpreadsheet, UploadCloud } from "lucide-react";
import { useRef, useState, type DragEvent } from "react";

import { useExpertMode } from "../context/ExpertModeContext";
import { MetricCard } from "../ui/MetricCard";
import { Tooltip } from "../ui/Tooltip";
import { ExpertMetadataPanel } from "../visualization/ExpertMetadataPanel";
import { metricTooltips, terminology } from "../../lib/terminology";
import type { PipelineStatus, PreprocessResponse } from "../../lib/types";

type UploadInspectStepProps = {
  busy: boolean;
  status: PipelineStatus | null;
  preprocessResult: PreprocessResponse | null;
  onPreprocessDemo: () => Promise<void>;
};

export function UploadInspectStep({
  busy,
  status,
  preprocessResult,
  onPreprocessDemo
}: UploadInspectStepProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [stagedFiles, setStagedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { expertMode } = useExpertMode();

  const handleFiles = (files: FileList | null) => {
    if (!files) {
      return;
    }
    setStagedFiles(Array.from(files));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    handleFiles(event.dataTransfer.files);
  };

  const features = status?.feature_counts ?? preprocessResult?.feature_counts ?? {};

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)]">
      <div className="rounded-lg border border-borderSubtle bg-panel p-5 shadow-pastel">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-dustyBlue">{terminology.dataSourceHub.friendly}</p>
            <h2 className="mt-2 text-2xl font-semibold text-textPrimary">Upload & Inspect</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-textMuted">
              Add genomics, transcriptomics, and proteomics files, then inspect whether the cohort is ready for clean-up.
            </p>
          </div>
          <Tooltip content="For now, dragged files are staged in the browser UI. Use the demo action to run the connected pipeline without adding backend upload code." />
        </div>

        <div
          className={`flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition ${
            dragActive
              ? "border-lavender bg-lavender/10"
              : "border-borderSubtle bg-background/45 hover:border-dustyBlue/50"
          }`}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(event) => {
            event.preventDefault();
            setDragActive(true);
          }}
          onDrop={handleDrop}
        >
          <UploadCloud className="h-10 w-10 text-lavender" />
          <p className="mt-4 text-lg font-semibold text-textPrimary">Drop omics matrices here</p>
          <p className="mt-2 max-w-md text-sm leading-6 text-textMuted">
            CSV or TSV files with sample IDs in the first column work best for AE-MAP.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button
              className="rounded-md border border-dustyBlue/60 bg-dustyBlue/10 px-4 py-2 text-sm font-medium text-dustyBlue transition hover:bg-dustyBlue/20"
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              Choose files
            </button>
            <button
              className="rounded-md border border-lavender/60 bg-lavender/15 px-4 py-2 text-sm font-medium text-lavender transition hover:bg-lavender/25 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={busy}
              onClick={() => void onPreprocessDemo()}
              type="button"
            >
              {busy ? "Inspecting..." : "Use demo cohort"}
            </button>
          </div>
          <input
            className="hidden"
            multiple
            onChange={(event) => handleFiles(event.target.files)}
            ref={inputRef}
            type="file"
          />
        </div>

        {stagedFiles.length > 0 ? (
          <div className="mt-4 rounded-lg border border-borderSubtle bg-background/45 p-4">
            <p className="text-sm font-semibold text-textPrimary">Staged files</p>
            <div className="mt-3 grid gap-2">
              {stagedFiles.map((file) => (
                <div className="flex items-center gap-3 rounded-md bg-panel/80 px-3 py-2" key={`${file.name}-${file.size}`}>
                  <FileSpreadsheet className="h-4 w-4 text-mint" />
                  <span className="min-w-0 flex-1 truncate text-sm text-textPrimary">{file.name}</span>
                  <span className="text-xs text-textMuted">{Math.max(1, Math.round(file.size / 1024))} KB</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="space-y-5">
        <div className="rounded-lg border border-borderSubtle bg-panel p-5 shadow-pastel">
          <p className="text-sm font-semibold text-mint">{terminology.smartDataCleanup.friendly}</p>
          <h3 className="mt-2 text-xl font-semibold text-textPrimary">Readiness summary</h3>
          <p className="mt-2 text-sm leading-6 text-textMuted">
            AE-MAP cleans each omics source independently before fusion so one noisy file does not dominate the patient map.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <MetricCard label="Samples" tone="dustyBlue" value={(status?.samples ?? preprocessResult?.samples ?? 0).toLocaleString()} />
            <MetricCard
              helper={metricTooltips.featureCounts}
              label="Genomics"
              tone="lavender"
              value={(features.genomics ?? 0).toLocaleString()}
            />
            <MetricCard label="Transcriptomics" tone="mint" value={(features.transcriptomics ?? 0).toLocaleString()} />
            <MetricCard label="Proteomics" tone="rose" value={(features.proteomics ?? 0).toLocaleString()} />
          </div>
        </div>

        {expertMode ? (
          <div className="rounded-lg border border-borderSubtle bg-panel p-5 shadow-pastel">
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4 text-lavender" />
              <p className="text-sm font-semibold text-textPrimary">{terminology.smartDataCleanup.technical}</p>
            </div>
            <ExpertMetadataPanel title="Preprocessing metadata" data={{ status, preprocessResult, stagedFiles: stagedFiles.map((file) => ({ name: file.name, size: file.size })) }} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
