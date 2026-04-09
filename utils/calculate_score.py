def calculate_score_tac(original_tac, optimized_tac, execution_time):
    orig_len = len(original_tac)
    opt_len = len(optimized_tac)
    len_reduction = orig_len - opt_len

    orig_ops = sum(1 for instr in original_tac if instr[2] is not None)
    opt_ops = sum(1 for instr in optimized_tac if instr[2] is not None)
    ops_reduction = orig_ops - opt_ops

    
    len_score = (len_reduction / orig_len) if orig_len > 0 else 0
    ops_score = (ops_reduction / orig_ops) if orig_ops > 0 else 0

    
    time_ms = execution_time * 1000

    
    time_penalty = min(time_ms / 100, 1) 
    score = (
        len_score * 50 +     # 50% weight
        ops_score * 40 -     # 40% weight
        time_penalty * 10    # 10% penalty
    )

    score = max(0, min(100, score))

    return {
        "original_len": orig_len,
        "optimized_len": opt_len,
        "length_reduction": len_reduction,
        "original_ops": orig_ops,
        "optimized_ops": opt_ops,
        "ops_reduction": ops_reduction,
        "execution_time_ms_optimisation": time_ms,
        "score": round(score, 2)
    }