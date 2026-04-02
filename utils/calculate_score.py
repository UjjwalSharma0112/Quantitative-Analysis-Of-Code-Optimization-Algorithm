def calculate_score_tac(original_tac, optimized_tac, execution_time):
    """
    Calculates a quantitative score based on:
    - Instructions eliminated (length reduction)
    - Operations simplified (operator turning to None, meaning it's a simple assignment now)
    - Execution time (small penalty)
    """
    orig_len = len(original_tac)
    opt_len = len(optimized_tac)
    len_reduction = orig_len - opt_len
    
    orig_ops = sum(1 for instr in original_tac if instr[2] is not None)
    opt_ops = sum(1 for instr in optimized_tac if instr[2] is not None)
    ops_reduction = orig_ops - opt_ops
    
    # Scoring Weights
    # 10 points for each removed instruction (length reduction)
    # 5 points for each simplified operation
    score = (len_reduction * 10) + (ops_reduction * 5)
    
    # Execution time penalty (0.1 points per ms)
    time_ms = execution_time * 1000
    score -= time_ms * 0.1 
    
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

