import { BarChart3, AlertCircle } from 'lucide-react';
import AlgorithmCard from './AlgorithmCard';

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
    };
  };
}

interface ResultsDisplayProps {
  result: OptimizationResult | null;
  loading: boolean;
  error: string | null;
}

function ResultsDisplay({ result, loading, error }: ResultsDisplayProps) {
  if (loading) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-600">Optimizing your code...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="bg-white rounded-lg shadow-sm border border-red-200 flex items-center justify-center h-full">
          <div className="text-center px-6">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              Optimization Failed
            </h3>
            <p className="text-sm text-slate-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col h-[calc(100vh-180px)]">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center h-full">
          <div className="text-center px-6">
            <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">
              No Results Yet
            </h3>
            <p className="text-sm text-slate-600">
              Enter your TAC code and click Optimize to see results
            </p>
          </div>
        </div>
      </div>
    );
  }

  const sortedAlgorithms = Object.entries(result.optimised_tac).sort(
    ([, a], [, b]) => b.score - a.score
  );

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-slate-600" />
            <h2 className="text-sm font-medium text-slate-900">
              Optimization Results
            </h2>
          </div>
          <div className="text-xs text-slate-500">
            {sortedAlgorithms.length} algorithms
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {sortedAlgorithms.map(([name, data]) => (
            <AlgorithmCard key={name} name={name} data={data} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResultsDisplay;
