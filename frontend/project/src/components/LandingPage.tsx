import { useState } from "react";
import { ArrowRight, Cpu, Zap, BarChart3, GitCompare } from "lucide-react";

type InputMode = "tac" | "ccode";

interface LandingPageProps {
  onStart: (mode: InputMode) => void;
}

const algorithms = [
  {
    name: "Constant Folding",
    desc: "Evaluates constant expressions at compile time",
    color: "var(--algo-cf)",
  },
  {
    name: "Dead Code Elimination",
    desc: "Removes unreachable or unused instructions",
    color: "var(--algo-dce)",
  },
  {
    name: "Constant Propagation",
    desc: "Replaces variables with known constant values",
    color: "var(--algo-cp)",
  },
  {
    name: "CSE",
    desc: "Eliminates redundant repeated computations",
    color: "var(--algo-cse)",
  },
];

function LandingPage({ onStart }: LandingPageProps) {
  const [mode, setMode] = useState<InputMode>("tac");

  return (
    <div className="landing-page">
      {/* Background grid */}
      <div className="bg-grid" />
      <div className="bg-glow" />

      <div className="landing-inner">
        {/* Header badge */}
        <div className="badge">
          <Cpu size={13} />
          <span>Compiler Optimization Visualizer</span>
        </div>

        {/* Title */}
        <h1 className="landing-title">
          <span className="title-line">Quantitative</span>
          <span className="title-line accent">Analysis</span>
          <span className="title-line">of Code Optimization</span>
        </h1>

        <p className="landing-sub">
          Submit your code, pick your algorithms, and get a side-by-side
          quantitative breakdown of how each optimization transforms your
          program.
        </p>

        {/* Algorithm pills */}
        <div className="algo-pills">
          {algorithms.map((a) => (
            <div key={a.name} className="algo-pill" style={{ "--c": a.color } as any}>
              <span className="pill-dot" />
              <span className="pill-name">{a.name}</span>
              <span className="pill-desc">{a.desc}</span>
            </div>
          ))}
        </div>

        {/* Mode selector */}
        <div className="mode-section">
          <p className="mode-label">Choose your input format</p>
          <div className="mode-cards">
            <button
              className={`mode-card ${mode === "tac" ? "active" : ""}`}
              onClick={() => setMode("tac")}
            >
              <div className="mode-icon">
                <GitCompare size={22} />
              </div>
              <div className="mode-text">
                <span className="mode-name">Three-Address Code</span>
                <span className="mode-hint">e.g. t1 = a + b</span>
              </div>
              <div className="mode-check">{mode === "tac" && "✓"}</div>
            </button>

            <button
              className={`mode-card ${mode === "ccode" ? "active" : ""}`}
              onClick={() => setMode("ccode")}
            >
              <div className="mode-icon">
                <Zap size={22} />
              </div>
              <div className="mode-text">
                <span className="mode-name">C Function</span>
                <span className="mode-hint">e.g. int foo(int a) {"{ ... }"}</span>
              </div>
              <div className="mode-check">{mode === "ccode" && "✓"}</div>
            </button>
          </div>
        </div>

        {/* CTA */}
        <button className="cta-btn" onClick={() => onStart(mode)}>
          <span>Get Started</span>
          <ArrowRight size={18} />
        </button>

        {/* Bottom stats */}
        <div className="landing-stats">
          <div className="stat">
            <BarChart3 size={14} />
            <span>4 algorithms</span>
          </div>
          <div className="stat-sep" />
          <div className="stat">
            <Zap size={14} />
            <span>Real-time analysis</span>
          </div>
          <div className="stat-sep" />
          <div className="stat">
            <GitCompare size={14} />
            <span>Side-by-side diff</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
