from compiler.constant_folding import fold_constants


def test_constant_folding_basic():
    tac = [
        ('t1','3','+','5'),
        ('t2','t1', '*', '2')
    ]

    result = fold_constants(tac)

    assert result[0] == ('t1', '8', None, None)
    assert result[1] == ('t2', 't1', '*', '2')



def test_multiple_folds():
    tac = [
        ('t1', '3', '+', '5'),
        ('t3', '10', '-', '4'),
        ('t7', '2', '*', '3'),
        ('t8', 't1','*','t2')
    ]

    result = fold_constants(tac)

    assert result[0][1] == '8'
    assert result[1][1] == '6'
    assert result[2][1] == '6'
    assert result[3][1] == 't1'

