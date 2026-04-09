import {
  TrendingDown,
  Clock,
  FileCode,
  Code,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
type TACInstruction = [string, string | null, string | null, string | null];
interface AlgorithmData {
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

interface AlgorithmCardProps {
  name: string;
  data: AlgorithmData;
}

function formatTAC(tac: TACInstruction[]) {
  return tac.map(([res, arg1, op, arg2]) => {
    if (!op) return `${res} = ${arg1}`;
    return `${res} = ${arg1} ${op} ${arg2}`;
  });
}

function AlgorithmCard({ name, data }: AlgorithmCardProps) {
  const [showTAC, setShowTAC] = useState(false);
  const getScoreColor = (score: number) => {
    if (score >= 40) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 20) return "text-blue-600 bg-blue-50 border-blue-200";
    if (score >= 0) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  const getReductionBadge = (reduction: number, type: string) => {
    if (reduction > 0) {
      return (
        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
          -{reduction} {type}
        </span>
      );
    }
    return (
      <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
        No change
      </span>
    );
  };

  return (
    <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg border border-slate-200 p-4 hover:shadow-md transition-shadow">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-1">{name}</h3>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-3 h-3" />
            <span>{data.execution_time_ms_optimisation.toFixed(3)}ms</span>
          </div>
        </div>
        <div
          className={`px-3 py-1.5 rounded-lg border ${getScoreColor(data.score)}`}
        >
          <div className="text-xs font-medium">Score</div>
          <div className="text-lg font-bold">{data.score.toFixed(2)}</div>
        </div>
      </div>

      {/* STATS */}
      <div className="space-y-3">
        {/* LENGTH */}
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <FileCode className="w-3.5 h-3.5" />
              Code Length
            </div>
            {getReductionBadge(data.length_reduction, "lines")}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-slate-500 mb-1">Original</div>
              <div className="text-sm font-semibold text-slate-900">
                {data.original_len}
              </div>
            </div>
            <TrendingDown className="w-4 h-4 text-slate-400" />
            <div className="flex-1">
              <div className="text-xs text-slate-500 mb-1">Optimized</div>
              <div className="text-sm font-semibold text-slate-900">
                {data.optimized_len}
              </div>
            </div>
          </div>
        </div>

        {/* OPS */}
        <div className="bg-white rounded-lg p-3 border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700">
              <Code className="w-3.5 h-3.5" />
              Operations
            </div>
            {getReductionBadge(data.ops_reduction, "ops")}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="text-xs text-slate-500 mb-1">Original</div>
              <div className="text-sm font-semibold text-slate-900">
                {data.original_ops}
              </div>
            </div>
            <TrendingDown className="w-4 h-4 text-slate-400" />
            <div className="flex-1">
              <div className="text-xs text-slate-500 mb-1">Optimized</div>
              <div className="text-sm font-semibold text-slate-900">
                {data.optimized_ops}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOGGLE BUTTON */}
      <button
        onClick={() => setShowTAC(!showTAC)}
        className="mt-4 w-full flex items-center justify-center gap-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
      >
        {showTAC ? "Hide TAC" : "View TAC"}
        {showTAC ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* TAC VIEW */}
      {showTAC && (
        <div className="mt-3 bg-white rounded-lg p-3 text-xs font-mono  text-slate-700 overflow-x-auto">
          {formatTAC(data.optimised).map((line, idx) => (
            <div key={idx} className="whitespace-pre">
              {idx + 1}. {line}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AlgorithmCard;
