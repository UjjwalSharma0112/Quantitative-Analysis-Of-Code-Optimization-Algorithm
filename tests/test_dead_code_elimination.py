from compiler.dead_code_elimination import eliminate_dead_code


def test_dead_code_elimination():
    tac = [
    ('t1', '4', '+', '5'),      # used
    ('t2', 't1', '*', '2'),     # used
    ('t3', '10', '-', '3'),     # dead (never used)
    ('t4', 't2', '+', '1'),     # used
    ('t5', 't3', '*', '2'),     # dead (depends on dead t3)
    ('t6', '100', '/', '5'),    # dead (never used)
    ('result', 't4', '+', '0')  # final output
    ]
    
    result = eliminate_dead_code(tac)

    assert result[0][0] == 't1'
    assert result[1][0] == 't2'
    assert result[2][0] == 't4'
    assert result[3][0] == 'result'
