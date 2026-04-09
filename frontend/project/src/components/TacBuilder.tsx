import { useState } from "react";
import { Plus, Trash2, Copy } from "lucide-react";

export interface TacInstruction {
  result: string;
  arg1: string;
  op: string | null;
  arg2: string | null;
}

interface TacBuilderProps {
  instructions: TacInstruction[];
  onInstructionsChange: (instructions: TacInstruction[]) => void;
}

function TacBuilder({ instructions, onInstructionsChange }: TacBuilderProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const addInstruction = () => {
    const newInstruction: TacInstruction = {
      result: `t${instructions.length + 1}`,
      arg1: "",
      op: null,
      arg2: null,
    };
    onInstructionsChange([...instructions, newInstruction]);
    setExpandedIndex(instructions.length);
  };

  const updateInstruction = (
    index: number,
    field: keyof TacInstruction,
    value: any,
  ) => {
    const updated = [...instructions];
    updated[index] = { ...updated[index], [field]: value };
    onInstructionsChange(updated);
  };

  const deleteInstruction = (index: number) => {
    onInstructionsChange(instructions.filter((_, i) => i !== index));
  };

  const copyToClipboard = () => {
    const json = JSON.stringify(instructions, null, 2);
    navigator.clipboard.writeText(json);
  };

  const loadExample = () => {
    const example: TacInstruction[] = [
      { result: "t1", arg1: "5", op: null, arg2: null },
      { result: "t2", arg1: "t1", op: "+", arg2: "3" },
      { result: "t3", arg1: "t2", op: "*", arg2: "2" },
      { result: "result", arg1: "t3", op: "-", arg2: "t1" },
    ];
    onInstructionsChange(example);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-900">
          TAC Instructions
        </h3>
        <div className="flex gap-2">
          <button
            onClick={copyToClipboard}
            disabled={instructions.length === 0}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 hover:text-slate-900 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Copy JSON to clipboard"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={loadExample}
            className="text-xs px-2 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Load Example
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {instructions.map((instruction, index) => (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-lg p-3 hover:border-slate-300 transition-colors"
          >
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
                className="flex-1 text-left hover:bg-slate-50 p-2 rounded -mx-2 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded w-8 text-center">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {instruction.result} = {instruction.arg1}
                      {instruction.op
                        ? ` ${instruction.op} ${instruction.arg2}`
                        : ""}
                    </div>
                    <div className="text-xs text-slate-500">
                      {instruction.op ? "Binary Operation" : "Assignment"}
                    </div>
                  </div>
                </div>
              </button>
              <button
                onClick={() => deleteInstruction(index)}
                className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-600 transition-colors ml-2"
                title="Delete instruction"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {expandedIndex === index && (
              <div className="bg-slate-50 rounded-lg p-3 space-y-3 border-t border-slate-200 mt-2">
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Result Variable
                    </label>
                    <input
                      type="text"
                      value={instruction.result}
                      onChange={(e) =>
                        updateInstruction(index, "result", e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="t1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      First Argument
                    </label>
                    <input
                      type="text"
                      value={instruction.arg1}
                      onChange={(e) =>
                        updateInstruction(index, "arg1", e.target.value)
                      }
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      placeholder="5 or t1"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-700 block mb-1">
                      Operation (optional)
                    </label>
                    <select
                      value={instruction.op || ""}
                      onChange={(e) =>
                        updateInstruction(index, "op", e.target.value || null)
                      }
                      className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="">None (Assignment)</option>
                      <option value="+">+ (Addition)</option>
                      <option value="-">- (Subtraction)</option>
                      <option value="*">* (Multiplication)</option>
                      <option value="/">/ (Division)</option>
                      <option value="%">% (Modulo)</option>
                      <option value="==">== (Equality)</option>
                      <option value="!=">!= (Inequality)</option>
                      <option value="<">{"<"} (Less Than)</option>
                      <option value=">">{">"} (Greater Than)</option>
                      <option value="<=">{`<= (Less or Equal)`}</option>
                      <option value=">=">{`>= (Greater or Equal)`}</option>
                    </select>
                  </div>

                  {instruction.op && (
                    <div>
                      <label className="text-xs font-medium text-slate-700 block mb-1">
                        Second Argument
                      </label>
                      <input
                        type="text"
                        value={instruction.arg2 || ""}
                        onChange={(e) =>
                          updateInstruction(index, "arg2", e.target.value)
                        }
                        className="w-full px-2 py-1 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        placeholder="3 or t2"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={addInstruction}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
      >
        <Plus className="w-4 h-4" />
        Add Instruction
      </button>
    </div>
  );
}

export default TacBuilder;
