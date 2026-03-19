from .utils import is_number

def eliminate_common_subexpressions(tac):
    expr_table = {}
    substitutions = {}
    optimised = []

    for instr in tac:
        result, op1, operator, op2 = instr

        op1 = substitutions.get(op1, op1)
        op2 = substitutions.get(op2, op2)

        if operator is None:
            substitutions[result] = op1
            # invalidate cached expressions using result
            to_remove = [k for k in expr_table if result in (k[0], k[2])]
            for k in to_remove:
                del expr_table[k]
            optimised.append((result, op1, operator, op2))
            continue

        expr = (op1, operator, op2)

        # invalidate before checking — result is about to be overwritten
        to_remove = [k for k in expr_table if result in (k[0], k[2])]
        for k in to_remove:
            del expr_table[k]

        if expr in expr_table:
            existing = expr_table[expr]
            print(f"  CSE: '{result} = {op1} {operator} {op2}' already computed as '{existing}', reusing")
            substitutions[result] = existing
        else:
            expr_table[expr] = result
            optimised.append((result, op1, operator, op2))

    return optimised
