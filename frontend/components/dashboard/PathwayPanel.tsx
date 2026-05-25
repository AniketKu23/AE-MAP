import type { PathwayResult } from "../../lib/types";
import { Card } from "../ui/Card";

type PathwayPanelProps = {
  pathways: PathwayResult[];
};

export function PathwayPanel({ pathways }: PathwayPanelProps) {
  return (
    <Card className="min-h-[24rem]" title="KEGG Enrichment">
      {pathways.length > 0 ? (
        <div className="overflow-hidden rounded-md border border-border">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-surface text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-3">Cluster</th>
                <th className="px-3 py-3">Pathway</th>
                <th className="px-3 py-3">Adj. P</th>
                <th className="px-3 py-3">Overlap</th>
              </tr>
            </thead>
            <tbody>
              {pathways.map((pathway, index) => (
                <tr className="border-t border-border/70" key={`${pathway.cluster}-${pathway.term}-${index}`}>
                  <td className="px-3 py-3 text-lavender">{pathway.cluster}</td>
                  <td className="px-3 py-3 text-text">{pathway.term}</td>
                  <td className="px-3 py-3 text-mint">
                    {pathway.adjusted_p_value !== null && pathway.adjusted_p_value !== undefined
                      ? pathway.adjusted_p_value.toExponential(2)
                      : "--"}
                  </td>
                  <td className="px-3 py-3 text-muted">{pathway.overlap ?? "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-72 items-center justify-center rounded-md border border-dashed border-border bg-surface/60 text-sm text-muted">
          Enriched pathways will appear after clustering.
        </div>
      )}
    </Card>
  );
}
