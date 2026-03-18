from .utils import is_number


def fold_constants(tac):
    ops = {
        '+': lambda a, b: a + b,
        '-': lambda a, b: a - b,
        '*': lambda a, b: a * b,
        '/': lambda a, b: a / b,
    }
    
    optimized = []
    for instr in tac:
        result, op1, operator, op2 = instr
        
        # Both operands are constants → fold
        if is_number(op1) and is_number(op2):
            val = ops[operator](float(op1), float(op2))
            val = int(val) if val == int(val) else val
            optimized.append((result, str(val), None, None))
            print(f"  Folded: {result} = {op1} {operator} {op2}  →  {result} = {val}")
        else:
            optimized.append(instr)  # pass through unchanged
    
    return optimized


