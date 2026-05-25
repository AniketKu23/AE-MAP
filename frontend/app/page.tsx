"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { ExpertModeProvider } from "../components/context/ExpertModeContext";
import { DashboardShell } from "../components/layout/DashboardShell";
import { ExploreMapStep } from "../components/workflow/ExploreMapStep";
import { RunAIFusionStep } from "../components/workflow/RunAIFusionStep";
import { UploadInspectStep } from "../components/workflow/UploadInspectStep";
import { WorkflowStepper, type WorkflowStepId } from "../components/workflow/WorkflowStepper";
import {
  clusterLatent,
  getStatus,
  getVisualization,
  preprocessDemo,
  trainAutoencoder
} from "../lib/api";
import type {
  ClusterResponse,
  PipelineStatus,
  PreprocessResponse,
  TrainResponse,
  VisualizationResponse
} from "../lib/types";

export default function DashboardPage() {
  return (
    <ExpertModeProvider>
      <DashboardExperience />
    </ExpertModeProvider>
  );
}

function DashboardExperience() {
  const [activeStep, setActiveStep] = useState<WorkflowStepId>("upload");
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [preprocessResult, setPreprocessResult] = useState<PreprocessResponse | null>(null);
  const [training, setTraining] = useState<TrainResponse | null>(null);
  const [clustering, setClustering] = useState<ClusterResponse | null>(null);
  const [visualization, setVisualization] = useState<VisualizationResponse | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshStatus = useCallback(async () => {
    const nextStatus = await getStatus();
    setStatus(nextStatus);
    if (nextStatus.trained) {
      const nextVisualization = await getVisualization();
      setVisualization(nextVisualization);
    }
  }, []);

  useEffect(() => {
    refreshStatus().catch(() => {
      setError("The dashboard is ready, but the FastAPI backend is not responding yet.");
    });
  }, [refreshStatus]);

  const runTask = useCallback(async (task: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await task();
    } catch (taskError) {
      setError(taskError instanceof Error ? taskError.message : "Unexpected dashboard error");
    } finally {
      setBusy(false);
    }
  }, []);

  const handlePreprocessDemo = useCallback(
    () =>
      runTask(async () => {
        const result = await preprocessDemo();
        setPreprocessResult(result);
        setTraining(null);
        setClustering(null);
        setVisualization(null);
        setSelectedCluster(null);
        await refreshStatus();
        setActiveStep("fusion");
      }),
    [refreshStatus, runTask]
  );

  const handleRunFusion = useCallback(
    () =>
      runTask(async () => {
        const trainingResult = await trainAutoencoder({ epochs: 20, latent_dim: 128 });
        setTraining(trainingResult);

        const clusteringResult = await clusterLatent({ method: "kmeans", n_clusters: 4 });
        setClustering(clusteringResult);

        const visualizationResult = await getVisualization();
        setVisualization(visualizationResult);
        await refreshStatus();
        setActiveStep("map");
      }),
    [refreshStatus, runTask]
  );

  const completed = useMemo(
    () => ({
      upload: Boolean(status?.preprocessed || preprocessResult),
      fusion: Boolean(status?.trained || training),
      map: Boolean(status?.clustered || clustering)
    }),
    [clustering, preprocessResult, status?.clustered, status?.preprocessed, status?.trained, training]
  );

  return (
    <DashboardShell>
      {error ? (
        <div className="rounded-lg border border-rose/50 bg-rose/10 px-4 py-3 text-sm text-rose">
          {error}
        </div>
      ) : null}

      <WorkflowStepper activeStep={activeStep} completed={completed} onStepChange={setActiveStep} />

      {activeStep === "upload" ? (
        <UploadInspectStep
          busy={busy}
          onPreprocessDemo={handlePreprocessDemo}
          preprocessResult={preprocessResult}
          status={status}
        />
      ) : null}

      {activeStep === "fusion" ? (
        <RunAIFusionStep
          busy={busy}
          clustering={clustering}
          onRunFusion={handleRunFusion}
          status={status}
          training={training}
        />
      ) : null}

      {activeStep === "map" ? (
        <ExploreMapStep
          clustering={clustering}
          onCloseCluster={() => setSelectedCluster(null)}
          onClusterSelect={setSelectedCluster}
          selectedCluster={selectedCluster}
          visualization={visualization}
        />
      ) : null}
    </DashboardShell>
  );
}
