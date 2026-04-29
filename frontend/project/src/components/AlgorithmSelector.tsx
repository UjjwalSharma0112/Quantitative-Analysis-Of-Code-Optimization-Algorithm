import { Check } from "lucide-react";

export const ALGORITHM_OPTIONS = [
  { key: "Constant Folding",           label: "Constant Folding",           short: "CF",   color: "var(--algo-cf)"  },
  { key: "Dead Code Elimination",      label: "Dead Code Elimination",      short: "DCE",  color: "var(--algo-dce)" },
  { key: "Constant Propagation",       label: "Constant Propagation",       short: "CP",   color: "var(--algo-cp)"  },
  { key: "Common Subexpression Elim.", label: "Common Subexpression Elim.", short: "CSE",  color: "var(--algo-cse)" },
  { key: "Combined Pipeline (All)",    label: "Combined Pipeline (All)",    short: "ALL",  color: "var(--algo-all)" },
];

interface AlgorithmSelectorProps {
  selected: string[];
  onChange: (selected: string[]) => void;
}

function AlgorithmSelector({ selected, onChange }: AlgorithmSelectorProps) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      if (selected.length === 1) return; // keep at least one
      onChange(selected.filter((k) => k !== key));
    } else {
      onChange([...selected, key]);
    }
  };

  return (
    <div className="algo-selector">
      <p className="algo-selector-label">Algorithms to run</p>
      <div className="algo-chips">
        {ALGORITHM_OPTIONS.map((algo) => {
          const active = selected.includes(algo.key);
          return (
            <button
              key={algo.key}
              className={`algo-chip ${active ? "active" : ""}`}
              style={{ "--ac": algo.color } as any}
              onClick={() => toggle(algo.key)}
              title={algo.label}
            >
              <span className="chip-check">
                {active ? <Check size={11} /> : null}
              </span>
              <span className="chip-short">{algo.short}</span>
              <span className="chip-full">{algo.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default AlgorithmSelector;
