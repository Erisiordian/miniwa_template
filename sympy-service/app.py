from flask import Flask, request, jsonify
import sympy as sp

app = Flask(__name__)

def sympify_expr(expr: str):
    x, y, z = sp.symbols("x y z")
    return sp.sympify(expr, locals={"x": x, "y": y, "z": z})

@app.post("/sympy")
def sympy_endpoint():
    raw = str((request.get_json(silent=True) or {}).get("query", "")).strip()
    if not raw:
        return jsonify({"message": "query required"}), 400

    low = raw.lower().strip()
    out = {"input": {}, "output": {}}

    try:
        if low.startswith("eval "):
            expr = raw[5:].strip()
            out["input"] = {"expr": expr}
            out["output"] = {"result": str(sympify_expr(expr))}
            return jsonify(out)

        if low.startswith("simplify "):
            expr = raw[9:].strip()
            out["input"] = {"expr": expr}
            out["output"] = {"result": str(sp.simplify(sympify_expr(expr)))}
            return jsonify(out)

        if low.startswith("expand "):
            expr = raw[7:].strip()
            out["input"] = {"expr": expr}
            out["output"] = {"result": str(sp.expand(sympify_expr(expr)))}
            return jsonify(out)

        if low.startswith("factor "):
            expr = raw[7:].strip()
            out["input"] = {"expr": expr}
            out["output"] = {"result": str(sp.factor(sympify_expr(expr)))}
            return jsonify(out)

        if low.startswith("derive "):
            body = raw[7:].strip()
            if " by " not in body:
                return jsonify({"message": "Usage: derive <expr> by <var>"}), 400
            expr, var = body.split(" by ", 1)
            expr, var = expr.strip(), var.strip()
            sym = sp.Symbol(var)
            out["input"] = {"expr": expr, "var": var}
            out["output"] = {"result": str(sp.diff(sympify_expr(expr), sym))}
            return jsonify(out)

        if low.startswith("integral "):
            body = raw[9:].strip()
            if " by " not in body:
                return jsonify({"message": "Usage: integral <expr> by <var>"}), 400
            expr, var = body.split(" by ", 1)
            expr, var = expr.strip(), var.strip()
            sym = sp.Symbol(var)
            out["input"] = {"expr": expr, "var": var}
            out["output"] = {"result": str(sp.integrate(sympify_expr(expr), sym))}
            return jsonify(out)

        if low.startswith("solve "):
            body = raw[6:].strip()
            if " for " not in body:
                return jsonify({"message": "Usage: solve <equation> for <var>"}), 400
            eq_str, var = body.split(" for ", 1)
            eq_str, var = eq_str.strip(), var.strip()
            sym = sp.Symbol(var)
            if "=" in eq_str:
                left, right = eq_str.split("=", 1)
                eq = sp.Eq(sympify_expr(left.strip()), sympify_expr(right.strip()))
            else:
                eq = sp.Eq(sympify_expr(eq_str), 0)
            sol = sp.solve(eq, sym)
            out["input"] = {"equation": eq_str, "var": var}
            out["output"] = {"result": [str(s) for s in sol]}
            return jsonify(out)

        if low.startswith("limit "):
            body = raw[6:].strip()
            if " as " not in body or "->" not in body:
                return jsonify({"message": "Usage: limit <expr> as <var> -> <value>"}), 400
            expr_part, rest = body.split(" as ", 1)
            var_part, val_part = rest.split("->", 1)
            expr = expr_part.strip(); var = var_part.strip(); value = val_part.strip()
            sym = sp.Symbol(var)
            out["input"] = {"expr": expr, "var": var, "value": value}
            out["output"] = {"result": str(sp.limit(sympify_expr(expr), sym, sympify_expr(value)))}
            return jsonify(out)

        if low.startswith("plot "):
            body = raw[5:].strip()
            if " by " not in body or " from " not in body or " to " not in body:
                return jsonify({"message": "Usage: plot <expr> by <var> from <a> to <b>"}), 400
            expr, rest = body.split(" by ", 1)
            var, rest2 = rest.split(" from ", 1)
            a, b = rest2.split(" to ", 1)
            expr, var = expr.strip(), var.strip()
            a, b = a.strip(), b.strip()
            sym = sp.Symbol(var)
            f = sp.lambdify(sym, sympify_expr(expr), "math")
            a_f = float(sp.N(sympify_expr(a)))
            b_f = float(sp.N(sympify_expr(b)))
            n = 60
            xs = [a_f + (b_f - a_f) * i / (n - 1) for i in range(n)]
            pts = []
            for xval in xs:
                try:
                    yval = f(xval)
                    pts.append({"x": xval, "y": yval})
                except Exception:
                    pts.append({"x": xval, "y": float("nan")})
            out["input"] = {"expr": expr, "var": var, "from": a, "to": b}
            out["output"] = {"result": "ok", "plotPoints": pts}
            return jsonify(out)

        return jsonify({"message": "Unknown math command"}), 400

    except Exception as e:
        return jsonify({"message": "SymPy error", "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5001, debug=True)
