from .utils import is_number

OUTPUT_VARS = {'result'}
def iterate(tac):
    optimised = []
    used = set(OUTPUT_VARS)
    
    for instr in tac:
        result, op1, operator, op2 = instr
        if op1 is not None and not is_number(op1):
            used.add(op1)
        if op2 is not None and not is_number(op2):
            used.add(op2)
        
    for instr in tac:
        result, op1, operator, op2 = instr
        if result in used:
            optimised.append(instr)
        else:
            print(f"  Dead code: {result} = {op1} {operator} {op2}")
  
    return optimised 
    
def eliminate_dead_code(tac):
    while True:
        new_tac = iterate(tac)
        if len(new_tac) == len(tac):
            break
        tac = new_tac
    return tac
