import { X } from "lucide-react";
import { useEffect, useRef } from "react";
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

interface StatsChartProps {
  data: { [key: string]: AlgoData };
  selected: string[];
  onClose: () => void;
}

const FALLBACK_COLORS = ["#58a6ff", "#3fb950", "#f78166", "#d2a8ff"];

const METRICS = [
  { key: "score", label: "Score", unit: "" },
  { key: "length_reduction", label: "Length Reduction", unit: " lines" },
  { key: "ops_reduction", label: "Ops Reduction", unit: " ops" },
  { key: "execution_time_ms_optimisation", label: "Exec Time", unit: " ms" },
];

function resolveColor(cssVar: string, idx: number): string {
  // Try to resolve CSS variable to a real hex; fall back to palette
  if (cssVar.startsWith("var(")) return FALLBACK_COLORS[idx % FALLBACK_COLORS.length];
  return cssVar;
}

interface GroupedBarChartProps {
  entries: [string, AlgoData][];
  metricKey: string;
  label: string;
  unit: string;
}

function GroupedBarChart({ entries, metricKey, label, unit }: GroupedBarChartProps) {
  const values = entries.map(([, d]) => Math.max(0, (d as any)[metricKey] as number));
  const maxVal = Math.max(...values, 0.001);

  const BAR_WIDTH = 48;
  const GAP = 20;
  const HEIGHT = 160;
  const PADDING = { top: 20, right: 16, bottom: 48, left: 44 };

  const totalWidth = entries.length * (BAR_WIDTH + GAP) - GAP + PADDING.left + PADDING.right;
  const chartH = HEIGHT - PADDING.top - PADDING.bottom;

  // Y axis ticks (5 ticks)
  const ticks = Array.from({ length: 5 }, (_, i) => {
    const val = (maxVal * i) / 4;
    return { val, y: PADDING.top + chartH - (val / maxVal) * chartH };
  });

  return (
    <div className="svgchart-wrap">
      <p className="svgchart-label">{label}</p>
      <div style={{ overflowX: "auto" }}>
        <svg
          width={Math.max(totalWidth, 300)}
          height={HEIGHT}
          style={{ display: "block" }}
        >
          {/* Grid lines */}
          {ticks.map((t, i) => (
            <g key={i}>
              <line
                x1={PADDING.left}
                x2={totalWidth - PADDING.right}
                y1={t.y}
                y2={t.y}
                stroke="#21262d"
                strokeWidth={1}
              />
              <text
                x={PADDING.left - 6}
                y={t.y + 4}
                textAnchor="end"
                fontSize={9}
                fill="#484f58"
                fontFamily="JetBrains Mono, monospace"
              >
                {t.val.toFixed(t.val < 1 ? 2 : 0)}
              </text>
            </g>
          ))}

          {/* Bars */}
          {entries.map(([name, d], i) => {
            const val = Math.max(0, (d as any)[metricKey] as number);
            const barH = maxVal === 0 ? 0 : (val / maxVal) * chartH;
            const x = PADDING.left + i * (BAR_WIDTH + GAP);
            const y = PADDING.top + chartH - barH;
            const algoMeta = ALGORITHM_OPTIONS.find((a) => a.key === name);
            const color = resolveColor(algoMeta?.color ?? "", i);
            const shortName = algoMeta?.short ?? name.slice(0, 3).toUpperCase();

            return (
              <g key={name}>
                {/* Bar shadow/glow */}
                <rect
                  x={x + 2}
                  y={y + 4}
                  width={BAR_WIDTH}
                  height={barH}
                  rx={4}
                  fill={color}
                  opacity={0.15}
                />
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={Math.max(barH, 2)}
                  rx={4}
                  fill={color}
                  opacity={0.9}
                />
                {/* Value label on top */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={y - 5}
                  textAnchor="middle"
                  fontSize={9}
                  fill={color}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  {val.toFixed(val < 1 ? 3 : 1)}{unit.trim()}
                </text>
                {/* X label */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PADDING.top + chartH + 16}
                  textAnchor="middle"
                  fontSize={10}
                  fill={color}
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                >
                  {shortName}
                </text>
                {/* Full name below */}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={PADDING.top + chartH + 30}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#484f58"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {name.split(" ").slice(0, 2).join(" ")}
                </text>
              </g>
            );
          })}

          {/* X axis */}
          <line
            x1={PADDING.left}
            x2={totalWidth - PADDING.right}
            y1={PADDING.top + chartH}
            y2={PADDING.top + chartH}
            stroke="#30363d"
            strokeWidth={1}
          />
          {/* Y axis */}
          <line
            x1={PADDING.left}
            x2={PADDING.left}
            y1={PADDING.top}
            y2={PADDING.top + chartH}
            stroke="#30363d"
            strokeWidth={1}
          />
        </svg>
      </div>
    </div>
  );
}

function StatsChart({ data, selected, onClose }: StatsChartProps) {
  // Show ALL entries from backend — don't filter strictly by selected key match
  // because backend may return slightly different key names; show what we have
  // but visually prioritize selected ones
  const allEntries = Object.entries(data);
  const entries = allEntries.filter(([k]) =>
    selected.length === 0 ? true : selected.some(s => k === s || k.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(k.toLowerCase()))
  );
  // Fallback: if nothing matches, show everything
  const finalEntries = entries.length > 0 ? entries : allEntries;

  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="stats-overlay"
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
    >
      <div className="stats-modal">
        <div className="stats-header">
          <h2 className="stats-title">Algorithm Performance</h2>
          <button className="stats-close" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="stats-body-charts">
          {METRICS.map((metric) => (
            <GroupedBarChart
              key={metric.key}
              entries={finalEntries}
              metricKey={metric.key}
              label={metric.label}
              unit={metric.unit}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="stats-legend">
          {finalEntries.map(([name], i) => {
            const algoMeta = ALGORITHM_OPTIONS.find((a) => a.key === name);
            const color = resolveColor(algoMeta?.color ?? "", i);
            return (
              <div key={name} className="legend-item">
                <span className="legend-dot" style={{ background: color }} />
                <span>{algoMeta?.short ?? name} — {name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StatsChart;
