from compiler.dead_code_elimination import eliminate_dead_code

tac = [
    ('t1', '4', '+', '5'),      # used
    ('t2', 't1', '*', '2'),     # used
    ('t3', '10', '-', '3'),     # dead (never used)
    ('t4', 't2', '+', '1'),     # used
    ('t5', 't3', '*', '2'),     # dead (depends on dead t3)
    ('t6', '100', '/', '5'),    # dead (never used)
    ('result', 't4', '+', '0')  # final output
]


print("=== BEFORE DEAD CODE ELIMINATION ===")
for r, a, op, b in tac:
    print(f"{r} = {a} {op} {b}")

print("\n=== APPLYING DEAD CODE ELIMINATION ===")
result = eliminate_dead_code(tac)

print("\n=== AFTER DEAD CODE ELIMINATION ===")
for r, a, op, b in result:
    if op is None:
        print(f"{r} = {a}")
    else:
        print(f"{r} = {a} {op} {b}")
