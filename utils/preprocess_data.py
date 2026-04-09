import sys
import time
import io
import contextlib



from .calculate_score import calculate_score_tac
from compiler.common_subexp_elim import eliminate_common_subexpressions
from compiler.constant_folding import fold_constants
from compiler.constant_propogation import propogate_constants
from compiler.dead_code_elimination import eliminate_dead_code

@contextlib.contextmanager
def suppress_stdout():

    new_stdout = io.StringIO()
    old_stdout = sys.stdout
    sys.stdout = new_stdout
    try:
        yield new_stdout
    finally:
        sys.stdout = old_stdout


def analyze_algorithm(name, algo_func, tac):
    tac_copy = list(tac)
    
    start_time = time.perf_counter()
    with suppress_stdout():
        optimized_tac = algo_func(tac_copy)
    end_time = time.perf_counter()    
    score_data = calculate_score_tac(tac, optimized_tac, end_time - start_time)
    score_data["optimised"] = optimized_tac 
    return score_data

def analyze_combined(name, algorithms, tac):
    tac_copy = list(tac)
    
    start_time = time.perf_counter()
    with suppress_stdout():
        for algo_func in algorithms:
            tac_copy = algo_func(tac_copy)
    end_time = time.perf_counter()
    
    score_data = calculate_score_tac(tac, tac_copy, end_time - start_time)
    score_data["optimised"] = tac_copy
    return score_data



def preprocess(tac):
    
    algorithms = [
        ("Constant Folding", fold_constants),
        ("Common Subexpression Elim.", eliminate_common_subexpressions),
        ("Constant Propagation", propogate_constants),
        ("Dead Code Elimination", eliminate_dead_code),
    ]
    results = {}
   
    for name, func in algorithms:
        results[name] = analyze_algorithm(name, func, tac)
    pipeline = [
        propogate_constants,
        fold_constants, 
        eliminate_common_subexpressions,
        eliminate_dead_code
    ]
    results["Combined Pipeline (All)"] = analyze_combined("Combined Pipeline (All)", pipeline, tac)
    return results

