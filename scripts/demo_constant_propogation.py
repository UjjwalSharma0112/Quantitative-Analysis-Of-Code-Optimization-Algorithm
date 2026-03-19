from compiler.constant_propogation import propogate_constants

 
tac = [
    ('t1', '5', None, None),        # t1 = 5
    ('t2', 't1', '+', '3'),       # t2 = t1 + 3
    ('t3', 't2', '*', '2'),       # t3 = t2 * 2
    ('t4', 't3', '-', 't1'),      # t4 = t3 - t1
    ('t5', 't4', '+', '10'),      # t5 = t4 + 10
]
print("=== BEFORE CONSTANT PROPOGATION ===")

for r, a, op, b in tac:
    if op is None:
        print(f"{r} = {a}")
    else:
        print(f"{r} = {a} {op} {b}")


print("\n=== APPLYING CONSTANT PROPOGATION===")
result = propogate_constants(tac)

print("\n=== AFTER CONSTANT PROPOGATION ===")
for r, a, op, b in result:
    if op is None:
        print(f"{r} = {a}")
    else:
        print(f"{r} = {a} {op} {b}")
