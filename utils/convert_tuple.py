def convert_to_tuples(tac_list):
    tac = []
    
    for instr in tac_list:
        tup = (
            instr["result"],
            instr["arg1"],
            instr["op"],
            instr["arg2"]
        )
        tac.append(tup)
    return tac

