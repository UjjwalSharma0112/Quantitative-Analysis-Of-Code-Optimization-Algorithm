type TACInstruction = [string, string | null, string | null, string | null];

export function formatTAC(tac: TACInstruction[]): string[] {
  return tac.map(([res, arg1, op, arg2]) => {
    if (!op) return `${res} = ${arg1}`;
    return `${res} = ${arg1} ${op} ${arg2}`;
  });
}
