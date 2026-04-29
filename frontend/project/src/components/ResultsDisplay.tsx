import { useState } from "react";
import { BarChart3, AlertCircle, ChevronLeft, TrendingDown, Clock, FileCode, Code, ChevronUp, ChevronDown, BarChart2 } from "lucide-react";
import { formatTAC } from "../utils/tacFormatter";
import DiffView from "./DiffView";
import StatsChart from "./StatsChart";
import { ALGORITHM_OPTIONS } from "./AlgorithmSelector";

type TACInstruction = [string, string | null, string | null, string | null];

interface AlgoData {
  original_len: number;
  optimized_len: number;
  length_reduction: number;
  original_ops: number;
  optimized_ops: number;
  ops_reduction: number;
  execution_time_ms_optimisation: number;
  score: number;
  optimised: TACInstruction[];
}

interface OptimizationResult {
  original_tac: Array<[string, string, string | null, string | null]>;
  optimised_tac: { [key: string]: AlgoData };
}

interface ResultsDisplayProps {
  result: OptimizationResult | null;
  loading: boolean;
  error: string | null;
  selectedAlgos: string[];
  onBack: () => void;
}

function AlgorithmCard({ name, data }: { name: string; data: AlgoData }) {
  const [showTAC, setShowTAC] = useState(false);
  const algoMeta = ALGORITHM_OPTIONS.find((a) => a.key === name);

  const getScoreColor = (score: number) => {
    if (score >= 40) return "score-green";
    if (score >= 20) return "score-blue";
    if (score >= 0) return "score-amber";
    return "score-slate";
  };

  const getBadge = (reduction: number, unit: string) =>
    reduction > 0 ? (
      <span className="badge-green">-{reduction} {unit}</span>
    ) : (
      <span className="badge-grey">No change</span>
    );

  return (
    <div className="algo-result-card" style={{ "--ac": algoMeta?.color ?? "var(--accent)" } as any}>
      <div className="arc-header">
        <div>
          <h3 className="arc-name">{name}</h3>
          <div className="arc-time"><Clock size={11} />{data.execution_time_ms_optimisation.toFixed(3)}ms</div>
        </div>
        <div className={`arc-score ${getScoreColor(data.score)}`}>
          <div className="arc-score-label">Score</div>
          <div className="arc-score-val">{data.score.toFixed(2)}</div>
        </div>
      </div>

      <div className="arc-stats">
        <div className="arc-stat-row">
          <div className="arc-stat-label"><FileCode size={12} />Length</div>
          {getBadge(data.length_reduction, "lines")}
          <div className="arc-stat-nums">
            <span>{data.original_len}</span>
            <TrendingDown size={12} />
            <span>{data.optimized_len}</span>
          </div>
        </div>
        <div className="arc-stat-row">
          <div className="arc-stat-label"><Code size={12} />Ops</div>
          {getBadge(data.ops_reduction, "ops")}
          <div className="arc-stat-nums">
            <span>{data.original_ops}</span>
            <TrendingDown size={12} />
            <span>{data.optimized_ops}</span>
          </div>
        </div>
      </div>

      <button className="arc-toggle" onClick={() => setShowTAC(!showTAC)}>
        {showTAC ? "Hide TAC" : "View TAC"}
        {showTAC ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
      </button>

      {showTAC && (
        <div className="arc-tac">
          {formatTAC(data.optimised).map((line, i) => (
            <div key={i} className="tac-line">
              <span className="tac-ln">{i + 1}</span>
              <span>{line}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultsDisplay({ result, loading, error, selectedAlgos, onBack }: ResultsDisplayProps) {
  const [showStats, setShowStats] = useState(false);
  const [activeTab, setActiveTab] = useState<"cards" | "diff">("cards");
  const [activeAlgoKey, setActiveAlgoKey] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="results-loading">
        <div className="loading-ring" />
        <p>Optimizing your code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="results-error">
        <AlertCircle size={40} />
        <h3>Optimization Failed</h3>
        <p>{error}</p>
        <button className="back-btn" onClick={onBack}><ChevronLeft size={16} />Go Back</button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="results-empty">
        <BarChart3 size={40} />
        <h3>No results yet</h3>
        <p>Enter code and click Run to see results</p>
      </div>
    );
  }

  const sortedAlgos = Object.entries(result.optimised_tac)
    .filter(([k]) => selectedAlgos.includes(k))
    .sort(([, a], [, b]) => b.score - a.score);

  const bestAlgo = sortedAlgos[0];
  // Resolve which algo to show in diff: activeAlgoKey if valid, else best scoring
  const activeAlgoEntry =
    sortedAlgos.find(([name]) => name === activeAlgoKey) ?? bestAlgo;

  return (
    <div className="results-page">
      <div className="results-topbar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={16} />Back
        </button>
        <div className="results-tabs">
          <button
            className={`rtab ${activeTab === "cards" ? "active" : ""}`}
            onClick={() => setActiveTab("cards")}
          >
            Algorithm Cards
          </button>
          <button
            className={`rtab ${activeTab === "diff" ? "active" : ""}`}
            onClick={() => setActiveTab("diff")}
          >
            Diff View
          </button>
        </div>
        <button className="stats-btn" onClick={() => setShowStats(true)}>
          <BarChart2 size={15} />
          View Stats
        </button>
      </div>

      <div className="results-body">
        {activeTab === "cards" && (
          <div className="cards-grid">
            {sortedAlgos.map(([name, data]) => (
              <AlgorithmCard key={name} name={name} data={data} />
            ))}
          </div>
        )}

        {activeTab === "diff" && activeAlgoEntry && (
          <div className="diff-tab">
            <div className="diff-algo-select">
              {sortedAlgos.map(([name]) => {
                const meta = ALGORITHM_OPTIONS.find((a) => a.key === name);
                return (
                  <button
                    key={name}
                    className={`diff-algo-btn ${activeAlgoEntry[0] === name ? "active" : ""}`}
                    onClick={() => setActiveAlgoKey(name)}
                    style={{ "--ac": meta?.color ?? "var(--accent)" } as any}
                  >
                    {meta?.short ?? name}
                  </button>
                );
              })}
            </div>
            <DiffView
              original={result.original_tac}
              optimized={activeAlgoEntry[1].optimised}
              algoName={activeAlgoEntry[0]}
            />
          </div>
        )}
      </div>

      {showStats && (
        <StatsChart
          data={result.optimised_tac}
          selected={selectedAlgos}
          onClose={() => setShowStats(false)}
        />
      )}
    </div>
  );
}

export default ResultsDisplay;
