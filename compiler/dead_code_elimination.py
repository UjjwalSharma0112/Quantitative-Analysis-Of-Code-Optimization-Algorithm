from .utils import is_number

def iterate(tac):
    optimised = []
    
    
    if not tac:
        return tac
    
    OUTPUT_VARS = {tac[-1][0]}  
    used = set(OUTPUT_VARS)

    
    for result, op1, operator, op2 in tac:
        if op1 is not None and not is_number(op1):
            used.add(op1)
        if op2 is not None and not is_number(op2):
            used.add(op2)

 
    for result, op1, operator, op2 in tac:
        if result in used:
            optimised.append((result, op1, operator, op2))
        else:
            print(f"Dead code removed: {result} = {op1} {operator} {op2}")

    return optimised


def eliminate_dead_code(tac):
    while True:
        new_tac = iterate(tac)
        if len(new_tac) == len(tac):
            break
        tac = new_tac
    return tac