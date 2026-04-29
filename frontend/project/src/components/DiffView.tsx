import { formatTAC } from "../utils/tacFormatter";

type TACInstruction = [string, string | null, string | null, string | null];

interface DiffViewProps {
  original: TACInstruction[];
  optimized: TACInstruction[];
  algoName: string;
}

function DiffView({ original, optimized, algoName }: DiffViewProps) {
  const origLines = formatTAC(original);
  const optLines = formatTAC(optimized);
  const maxLen = Math.max(origLines.length, optLines.length);

  return (
    <div className="diff-view">
      <div className="diff-header">
        <span className="diff-col-label orig">Original TAC</span>
        <span className="diff-algo-badge">{algoName}</span>
        <span className="diff-col-label opt">Optimized</span>
      </div>
      <div className="diff-body">
        <div className="diff-col">
          {origLines.map((line, i) => {
            const removed = !optLines.includes(line);
            return (
              <div key={i} className={`diff-line ${removed ? "removed" : "same"}`}>
                <span className="diff-ln">{i + 1}</span>
                <span className="diff-code">{line}</span>
              </div>
            );
          })}
        </div>
        <div className="diff-divider" />
        <div className="diff-col">
          {optLines.map((line, i) => {
            const added = !origLines.includes(line);
            return (
              <div key={i} className={`diff-line ${added ? "added" : "same"}`}>
                <span className="diff-ln">{i + 1}</span>
                <span className="diff-code">{line}</span>
              </div>
            );
          })}
          {Array.from({ length: maxLen - optLines.length }).map((_, i) => (
            <div key={`pad-${i}`} className="diff-line empty">
              <span className="diff-ln" />
              <span className="diff-code" />
            </div>
          ))}
        </div>
      </div>
      <div className="diff-footer">
        <span className="diff-stat removed-stat">
          -{(origLines.length - optLines.length > 0 ? origLines.length - optLines.length : 0)} lines
        </span>
        <span className="diff-stat">
          {origLines.length} → {optLines.length} instructions
        </span>
      </div>
    </div>
  );
}

export default DiffView;
