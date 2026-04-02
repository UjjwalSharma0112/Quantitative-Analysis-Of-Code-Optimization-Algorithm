import { useState } from 'react';
import { Code2 } from 'lucide-react';
import TacEditor from './components/TacEditor';
import ResultsDisplay from './components/ResultsDisplay';

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

function App() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (tacCode: string) => {
    setLoading(true);
    setError(null);

    try {
      const tacInstructions = JSON.parse(tacCode);

      const response = await fetch('http://127.0.0.1:8000/optimise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tac: tacInstructions }),
      });

      if (!response.ok) {
        throw new Error('Failed to optimize code');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                TAC Optimizer
              </h1>
              <p className="text-sm text-slate-600">
                Benchmark code optimization algorithms
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <TacEditor onOptimize={handleOptimize} loading={loading} />
          <ResultsDisplay result={result} loading={loading} error={error} />
        </div>
      </main>
    </div>
  );
}

export default App;
