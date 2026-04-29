import { useState } from "react";
import LandingPage from "./components/LandingPage";
import TacEditor from "./components/TacEditor";
import ResultsDisplay from "./components/ResultsDisplay";

type Page = "landing" | "editor" | "results";
type InputMode = "tac" | "ccode";
type TACInstruction = [string, string | null, string | null, string | null];

interface OptimizationResult {
  original_tac: Array<[string, string, string | null, string | null]>;
  optimised_tac: {
    [key: string]: {
      original_len: number;
      optimized_len: number;
      length_reduction: number;
      original_ops: number;
      optimized_ops: number;
      ops_reduction: number;
      execution_time_ms_optimisation: number;
      score: number;
      optimised: TACInstruction[];
    };
  };
}

function App() {
  const [page, setPage] = useState<Page>("landing");
  const [mode, setMode] = useState<InputMode>("tac");
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlgos, setSelectedAlgos] = useState<string[]>([]);

  const handleStart = (selectedMode: InputMode) => {
    setMode(selectedMode);
    setResult(null);
    setError(null);
    setPage("editor");
  };

  const handleOptimize = async (tacCode: string, toggle: boolean, algos: string[]) => {
    setSelectedAlgos(algos);
    setLoading(true);
    setError(null);
    setPage("results");

    try {
      const endpoint = toggle
        ? "http://127.0.0.1:8000/optimise"
        : "http://127.0.0.1:8000/optimise/ccode";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tac: toggle ? JSON.parse(tacCode) : tacCode }),
      });

      if (!response.ok) throw new Error("Failed to optimize code");

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`app page-${page}`}>
      {page === "landing" && (
        <div className="page-anim">
          <LandingPage onStart={handleStart} />
        </div>
      )}
      {page === "editor" && (
        <div className="page-anim">
          <TacEditor
            mode={mode}
            onOptimize={handleOptimize}
            loading={loading}
            onBack={() => setPage("landing")}
          />
        </div>
      )}
      {page === "results" && (
        <div className="page-anim">
          <ResultsDisplay
            result={result}
            loading={loading}
            error={error}
            selectedAlgos={selectedAlgos}
            onBack={() => setPage("editor")}
          />
        </div>
      )}
    </div>
  );
}

export default App;
