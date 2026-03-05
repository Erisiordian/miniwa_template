from flask import Flask, request, jsonify
from sympy import symbols, sympify, diff, integrate, solve, Eq
from sympy.parsing.sympy_parser import parse_expr
from sympy.core.sympify import SympifyError

app = Flask(__name__)

x, y, z = symbols("x y z")


def normalize_expr(expr: str) -> str:
    expr = expr.strip()
    expr = expr.replace("^", "**")
    return expr


@app.get("/health")
def health():
    return jsonify({"ok": True})


@app.post("/compute")
def compute():
    data = request.get_json(force=True, silent=True) or {}
    query = str(data.get("query", "")).strip()

    if not query:
        return jsonify({"error": "query required"}), 400

    q = query.lower().strip()

    try:
        # derive ...
        if q.startswith("derive "):
            raw = query[len("derive "):].strip()
            expr = parse_expr(normalize_expr(raw))
            result = diff(expr, x)

            return jsonify({
                "ok": True,
                "pods": [
                    {"title": "Type", "type": "text", "value": "Derivative"},
                    {"title": "Input", "type": "text", "value": raw},
                    {"title": "Result", "type": "text", "value": str(result)}
                ]
            })

        # integrate ...
        if q.startswith("integrate "):
            raw = query[len("integrate "):].strip()
            expr = parse_expr(normalize_expr(raw))
            result = integrate(expr, x)

            return jsonify({
                "ok": True,
                "pods": [
                    {"title": "Type", "type": "text", "value": "Integral"},
                    {"title": "Input", "type": "text", "value": raw},
                    {"title": "Result", "type": "text", "value": str(result) + " + C"}
                ]
            })

        # solve ...
        if q.startswith("solve "):
            raw = query[len("solve "):].strip()

            if "=" in raw:
                left, right = raw.split("=", 1)
                eq = Eq(parse_expr(normalize_expr(left)), parse_expr(normalize_expr(right)))
                solutions = solve(eq, x)
            else:
                expr = parse_expr(normalize_expr(raw))
                solutions = solve(expr, x)

            return jsonify({
                "ok": True,
                "pods": [
                    {"title": "Type", "type": "text", "value": "Equation Solve"},
                    {"title": "Input", "type": "text", "value": raw},
                    {"title": "Solutions", "type": "text", "value": ", ".join(str(s) for s in solutions) if solutions else "No solutions"}
                ]
            })

        return jsonify({
            "ok": False,
            "message": "Unsupported query for SymPy service"
        }), 400

    except (SympifyError, SyntaxError, ValueError) as e:
        return jsonify({"error": f"Parse error: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": f"Compute error: {str(e)}"}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
