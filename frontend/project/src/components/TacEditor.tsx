import { useState } from "react";
import { Play, AlertCircle } from "lucide-react";
import { parseTacCode } from "../utils/tacParser";

interface TacEditorProps {
  onOptimize: (tacCode: string, toggle: boolean) => void;
  loading: boolean;
}

const defaultCode = `t1 = 5
t2 = t1 + 3
t3 = t2 * 2
result = t3 - t1`;

function TacEditor({ onOptimize, loading }: TacEditorProps) {
  const [tacCode, setTacCode] = useState(defaultCode);
  const [error, setError] = useState<string | null>(null);
  const [toggle, setToggle] = useState(true);
  const handleSubmit = () => {
    setError(null);
    try {
      if (toggle) {
        const instructions = parseTacCode(tacCode);
        onOptimize(JSON.stringify(instructions), toggle);
      } else {
        onOptimize(tacCode, toggle); // ✅ send raw code
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to parse TAC code");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <span className={!toggle ? "font-semibold" : "opacity-50"}>
                CODE
              </span>

              <div
                onClick={() => setToggle((prev) => !prev)}
                className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition ${
                  toggle ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-6 h-6 rounded-full shadow-md transform transition ${
                    toggle ? "translate-x-8" : "translate-x-0"
                  }`}
                />
              </div>

              <span className={toggle ? "font-semibold" : "opacity-50"}>
                TAC
              </span>
            </div>
          </div>
          <div className="flex gap-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Optimizing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Optimize
                </>
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <textarea
            value={tacCode}
            onChange={(e) => {
              setTacCode(e.target.value);
              setError(null);
            }}
            className="flex-1 px-4 py-3 text-sm font-mono text-slate-900 resize-none focus:outline-none bg-slate-50"
            placeholder="Enter TAC code here..."
            spellCheck={false}
          />
          {error && (
            <div className="px-4 py-3 bg-red-50 border-t border-red-200 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}
        </div>
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Format: result = arg1 op arg2 (e.g., t1 = 5; t2 = t1 + 3)
          </p>
        </div>
      </div>
    </div>
  );
}

export default TacEditor;
