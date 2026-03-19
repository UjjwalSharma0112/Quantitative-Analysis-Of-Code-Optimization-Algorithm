from .utils import is_number
from .constant_folding import fold_constants

def propogate_constants(tac):
    known = {}
    optimised = []

    for instr in tac:
        result, op1, operator, op2 = instr

        new_op1 = known[op1] if op1 in known else op1
        new_op2 = known[op2] if op2 in known else op2

        if new_op1 != op1:
            print(f"  Propagated: {op1} → {new_op1} in '{result} = {op1} {operator} {op2}'")
        if new_op2 != op2:
            print(f"  Propagated: {op2} → {new_op2} in '{result} = {op1} {operator} {op2}'")

        op1, op2 = new_op1, new_op2

        # fold inline if both are constants now
        if operator is not None and is_number(op1) and is_number(op2):
            folded = fold_constants([(result, op1, operator, op2)])
            r, v, _, _ = folded[0]
            print(f"  Folded: {result} = {op1} {operator} {op2}  →  {result} = {v}")
            known[result] = v          # ← immediately available for next instruction
            optimised.append((r, v, None, None))
            continue

        if operator is None and is_number(op1):
            known[result] = op1

        optimised.append((result, op1, operator, op2))

    return optimised

