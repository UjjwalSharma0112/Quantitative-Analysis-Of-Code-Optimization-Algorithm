import sys
import time
import io
import contextlib

from compiler.common_subexp_elim import eliminate_common_subexpressions
from compiler.constant_folding import fold_constants
from compiler.constant_propogation import propogate_constants
from compiler.dead_code_elimination import eliminate_dead_code

@contextlib.contextmanager
def suppress_stdout():
    """Context manager to suppress print statements from the algorithms."""
    new_stdout = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = new_stdout
    try:
        yield new_stdout
    finally:
        sys.stdout = old_stdout

def calculate_score(original_tac, optimized_tac, execution_time):
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
        "execution_time_ms": time_ms,
        "score": round(score, 2)
    }

def analyze_algorithm(name, algo_func, tac):
    # Pass a copy of TAC to avoid modifying the original list
    tac_copy = list(tac)
    
    start_time = time.perf_counter()
    with suppress_stdout():
        optimized_tac = algo_func(tac_copy)
    end_time = time.perf_counter()
    
    score_data = calculate_score(tac, optimized_tac, end_time - start_time)
    
    print(f"--- Analysis for: {name} ---")
    print(f"Original Length: {score_data['original_len']} | Optimized Length: {score_data['optimized_len']} (Reduction: {score_data['length_reduction']})")
    print(f"Original Ops:    {score_data['original_ops']} | Optimized Ops:    {score_data['optimized_ops']} (Reduction: {score_data['ops_reduction']})")
    print(f"Execution Time:  {score_data['execution_time_ms']:.4f} ms")
    print(f"Overall Score:   {score_data['score']}")
    print()
    return score_data

def analyze_combined(name, algorithms, tac):
    tac_copy = list(tac)
    
    start_time = time.perf_counter()
    with suppress_stdout():
        for algo_func in algorithms:
            tac_copy = algo_func(tac_copy)
    end_time = time.perf_counter()
    
    score_data = calculate_score(tac, tac_copy, end_time - start_time)
    
    print(f"--- Analysis for: {name} ---")
    print(f"Original Length: {score_data['original_len']} | Optimized Length: {score_data['optimized_len']} (Reduction: {score_data['length_reduction']})")
    print(f"Original Ops:    {score_data['original_ops']} | Optimized Ops:    {score_data['optimized_ops']} (Reduction: {score_data['ops_reduction']})")
    print(f"Execution Time:  {score_data['execution_time_ms']:.4f} ms")
    print(f"Overall Score:   {score_data['score']}")
    print()
    return score_data

def main():
    # Complex sample TAC designed to trigger multiple optimizations
    sample_tac = [
        ('t1', '10', '+', '20'),       # CF: t1 = 30
        ('t2', 'a', '*', 'b'),         
        ('t3', 'a', '*', 'b'),         # CSE: t3 = t2
        ('t4', 't1', '+', '5'),        # CP: t4 = 30 + 5 -> CF: t4 = 35
        ('t5', 'x', '/', 'y'),         # DCE: t5 is never used
        ('t6', 't2', '+', 't3'),
        ('result', 't6', '+', 't4')
    ]
    
    print("="*60)
    print(" QUANTITATIVE ANALYSIS & SCORING OF OPTIMIZATIONS ")
    print("="*60)
    print("Sample TAC:")
    for instr in sample_tac:
        print(f"  {instr}")
    print()
    
    algorithms = [
        ("Constant Folding", fold_constants),
        ("Common Subexpression Elim.", eliminate_common_subexpressions),
        ("Constant Propagation", propogate_constants),
        ("Dead Code Elimination", eliminate_dead_code),
    ]
    
    results = {}
    for name, func in algorithms:
        results[name] = analyze_algorithm(name, func, sample_tac)
        
    # Also evaluate a combined pipeline (typical compiler approach)
    # Order: Propagate -> Fold -> CSE -> DCE
    pipeline = [
        propogate_constants,
        fold_constants, 
        eliminate_common_subexpressions,
        eliminate_dead_code
    ]
    results["Combined Pipeline (All)"] = analyze_combined("Combined Pipeline (All)", pipeline, sample_tac)
        
    print("="*60)
    print(" COMPARATIVE LEADERBOARD (SCORE BASED) ")
    print("="*60)
    
    # Sort by score descending
    sorted_results = sorted(results.items(), key=lambda x: x[1]['score'], reverse=True)
    
    for rank, (name, data) in enumerate(sorted_results, 1):
        print(f"{rank}. {name:<30} - Score: {data['score']:>6.2f}")
        
    print("\n* Score Formula: (Instructions Removed * 10) + (Operations Simplified * 5) - (Execution Time in ms * 0.1)")

if __name__ == "__main__":
    main()
