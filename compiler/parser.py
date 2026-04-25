import pycparser
from pycparser import c_ast

tac = []
tmp_count = 0


def new_tmp():
    global tmp_count
    name = f"t{tmp_count}"
    tmp_count += 1
    return name


def visit_expr(node):
    """Visit an expression node, emit TAC tuples, return the result name/literal."""

    if isinstance(node, c_ast.Constant):
        return node.value                          # e.g. '1', '3.14'

    if isinstance(node, c_ast.ID):
        return node.name                           # e.g. 'b', 'x'

    if isinstance(node, c_ast.BinaryOp):
        left  = visit_expr(node.left)
        right = visit_expr(node.right)
        tmp   = new_tmp()
        tac.append((tmp, left, node.op, right))   # (t0, b, '+', 2)
        return tmp

    if isinstance(node, c_ast.UnaryOp):
        operand = visit_expr(node.expr)
        tmp = new_tmp()
        tac.append((tmp, operand, node.op, None)) # (t0, b, '-', None)
        return tmp

    if isinstance(node, c_ast.Assignment):
        val = visit_expr(node.rvalue)
        tac.append((node.lvalue.name, val, None, None))
        return node.lvalue.name

    raise NotImplementedError(f"Unsupported expr: {type(node).__name__}")


def visit_stmt(node):
    if isinstance(node, c_ast.Decl) and node.init is not None:
        val = visit_expr(node.init)
        tac.append((node.name, val, None, None))  # (b, '1', None, None)

    elif isinstance(node, c_ast.Assignment):
        val = visit_expr(node.rvalue)
        tac.append((node.lvalue.name, val, None, None))

    elif isinstance(node, c_ast.Return) and node.expr is not None:
        val = visit_expr(node.expr)
        tac.append(('return', val, None, None))

    elif isinstance(node, c_ast.Compound) and node.block_items:
        for item in node.block_items:
            visit_stmt(item)


def c_to_tac(c_code):
    global tac, tmp_count
    tac = []
    tmp_count = 0

    parser = pycparser.CParser()
    ast = parser.parse(c_code, filename="<inline>")

    func = next((e for e in ast.ext if isinstance(e, c_ast.FuncDef)), None)
    if func is None:
        raise ValueError("No function found in C code")

    visit_stmt(func.body)
    return tac


