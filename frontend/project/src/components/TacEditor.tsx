import { useState } from "react";
import { Play, AlertCircle, ChevronLeft } from "lucide-react";
import { parseTacCode } from "../utils/tacParser";
import AlgorithmSelector from "./AlgorithmSelector";

type InputMode = "tac" | "ccode";

interface TacEditorProps {
  mode: InputMode;
  onOptimize: (tacCode: string, toggle: boolean, selectedAlgos: string[]) => void;
  loading: boolean;
  onBack: () => void;
}

const DEFAULT_TAC = `t1 = 5
t2 = t1 + 3
t3 = t2 * 2
result = t3 - t1`;

const DEFAULT_C = `int compute(int a, int b) {
    int t1 = 5;
    int t2 = t1 + 3;
    int t3 = t2 * 2;
    int result = t3 - t1;
    return result;
}`;

const ALL_ALGOS = [
  "Constant Folding",
  "Dead Code Elimination",
  "Constant Propagation",
  "Common Subexpression Elim.",
  "Combined Pipeline (All)",
];

function TacEditor({ mode, onOptimize, loading, onBack }: TacEditorProps) {
  const isTac = mode === "tac";
  const [code, setCode] = useState(isTac ? DEFAULT_TAC : DEFAULT_C);
  const [error, setError] = useState<string | null>(null);
  const [selectedAlgos, setSelectedAlgos] = useState<string[]>(ALL_ALGOS);

  const handleSubmit = () => {
    setError(null);
    try {
      if (isTac) {
        const instructions = parseTacCode(code);
        onOptimize(JSON.stringify(instructions), true, selectedAlgos);
      } else {
        onOptimize(code, false, selectedAlgos);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse code");
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-topbar">
        <button className="back-btn" onClick={onBack}>
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>
        <div className="editor-title-group">
          <span className="editor-mode-badge">{isTac ? "TAC" : "C Code"}</span>
          <h2 className="editor-title">Code Editor</h2>
        </div>
        <button
          className="run-btn"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spin" />
              <span>Running...</span>
            </>
          ) : (
            <>
              <Play size={15} fill="currentColor" />
              <span>Run</span>
            </>
          )}
        </button>
      </div>

      <div className="editor-body">
        <div className="editor-pane">
          <div className="editor-pane-header">
            <span className="pane-label">
              {isTac ? "Three-Address Code" : "C Function"}
            </span>
            <span className="pane-hint">
              {isTac ? "Format: result = arg1 op arg2" : "Paste a single C function"}
            </span>
          </div>
          <textarea
            className="code-area"
            value={code}
            onChange={(e) => { setCode(e.target.value); setError(null); }}
            placeholder={isTac ? "Enter TAC code..." : "Enter C function..."}
            spellCheck={false}
          />
          {error && (
            <div className="editor-error">
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="sidebar">
          <AlgorithmSelector selected={selectedAlgos} onChange={setSelectedAlgos} />

          <div className="sidebar-info">
            <h4 className="sidebar-info-title">How it works</h4>
            <ol className="sidebar-steps">
              <li>Paste your {isTac ? "TAC" : "C"} code on the left</li>
              <li>Select which algorithms to run</li>
              <li>Hit Run to analyze</li>
              <li>View optimized output + charts</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TacEditor;
