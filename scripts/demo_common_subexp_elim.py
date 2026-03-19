from compiler.common_subexp_elim import eliminate_common_subexpressions

tac = [
    ('t1', 'a', '+', 'b'),     # t1 = a + b
    ('t2', 'a', '+', 'b'),     # same as t1 (common subexpression)
    ('t3', 't1', '*', 'c'),    # t3 = t1 * c
    ('t4', 'a', '+', 't2'),     # again same expression
    ('t5', 't4', '-', 'd'),    # t5 = t4 - d
]

print("=== BEFORE CSE ===")

for r, a, op, b in tac:
    if op is None:
        print(f"{r} = {a}")
    else:
        print(f"{r} = {a} {op} {b}")


print("\n=== APPLYING CSE ===")
result = eliminate_common_subexpressions(tac)

print("\n=== AFTER CSE ===")
for r, a, op, b in result:
    if op is None:
        print(f"{r} = {a}")
    else:
        print(f"{r} = {a} {op} {b}")
