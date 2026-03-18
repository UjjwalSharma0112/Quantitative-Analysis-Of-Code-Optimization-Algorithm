from compiler.constant_folding import fold_constants

tac = [
    ('t1', '3', '+', '5'),
    ('t2', 't1', '*', '2'),
    ('t3', '10', '-', '4'),
    ('t4', 'x', '+', '0'),
    ('t5', 't3', '/', '2'),
    ('t7', '2', '*', '3'),
]

print("=== BEFORE CONSTANT FOLDING ===")
for r, a, op, b in tac:
    print(f"{r} = {a} {op} {b}")

print("\n=== APPLYING CONSTANT FOLDING ===")
result = fold_constants(tac)

print("\n=== AFTER CONSTANT FOLDING ===")
for r, a, op, b in result:
    if op is None:
        print(f"{r} = {a}")
    else:
        print(f"{r} = {a} {op} {b}")
