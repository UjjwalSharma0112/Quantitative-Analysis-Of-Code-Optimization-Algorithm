export interface TacInstruction {
  result: string;
  arg1: string;
  op: string | null;
  arg2: string | null;
}

export function parseTacCode(code: string): TacInstruction[] {
  const lines = code
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('//'));

  const instructions: TacInstruction[] = [];

  for (const line of lines) {
    const instruction = parseLine(line);
    if (instruction) {
      instructions.push(instruction);
    }
  }

  return instructions;
}

function parseLine(line: string): TacInstruction | null {
  const trimmed = line.replace(/;$/, '').trim();
  if (!trimmed) return null;

  const assignmentMatch = trimmed.match(/^(\w+)\s*=\s*(.+)$/);
  if (!assignmentMatch) {
    throw new Error(`Invalid TAC instruction: "${line}"`);
  }

  const result = assignmentMatch[1];
  const rhs = assignmentMatch[2].trim();

  const binaryOpMatch = rhs.match(/^(.+?)\s*([\+\-\*/%]|==|!=|<=|>=|<|>)\s*(.+)$/);

  if (binaryOpMatch) {
    const arg1 = binaryOpMatch[1].trim();
    const op = binaryOpMatch[2];
    const arg2 = binaryOpMatch[3].trim();

    return {
      result,
      arg1,
      op,
      arg2,
    };
  }

  return {
    result,
    arg1: rhs,
    op: null,
    arg2: null,
  };
}
