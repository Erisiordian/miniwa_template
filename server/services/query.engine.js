const { computeWithSympy } = require("./sympy.service");

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function gcd(a, b) {
  a = Math.trunc(Number(a));
  b = Math.trunc(Number(b));
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

function primeFactors(n) {
  n = Math.trunc(Number(n));
  if (!Number.isFinite(n)) return null;
  if (n === 0) return [0];
  n = Math.abs(n);
  if (n === 1) return [1];

  const out = [];
  let d = 2;
  while (n > 1 && d * d <= n) {
    while (n % d === 0) {
      out.push(d);
      n = Math.trunc(n / d);
    }
    d++;
  }
  if (n > 1) out.push(n);
  return out;
}

function evalExpr(expr) {
  const s = String(expr).trim();
  if (!/^[0-9+\-*/().^ \t]+$/.test(s)) return null;
  const safe = s.replace(/\^/g, "**");
  const v = Function(`"use strict"; return (${safe});`)();
  if (typeof v !== "number" || !Number.isFinite(v)) return null;
  return v;
}

async function computePods(rawQuery, emit) {
  const original = String(rawQuery || "").trim();
  const q = original.toLowerCase().trim();

  emit("pod", { title: "Input", type: "text", value: original });
  await sleep(150);

  // SymPy-powered queries
  if (
    q.startsWith("derive ") ||
    q.startsWith("integrate ") ||
    q.startsWith("solve ")
  ) {
    emit("status", { status: "running", message: "Calling SymPy engine…" });
    await sleep(200);

    const data = await computeWithSympy(original);

    if (data?.pods && Array.isArray(data.pods)) {
      return data.pods;
    }

    return [
      { title: "Result", type: "text", value: "SymPy returned no result." }
    ];
  }

  // gcd
  if (q.startsWith("gcd")) {
    emit("status", { status: "running", message: "Computing gcd…" });
    await sleep(250);

    const parts = q.split(/\s+/);
    const a = parts[1];
    const b = parts[2];
    const res = gcd(a, b);

    if (res === null) {
      return [
        { title: "Result", type: "text", value: "Usage: gcd 120 45" },
      ];
    }

    return [
      { title: "Result", type: "text", value: String(res) },
      { title: "Properties", type: "keyvalue", value: { a: Number(a), b: Number(b) } },
    ];
  }

  // factor
  if (q.startsWith("factor")) {
    emit("status", { status: "running", message: "Factoring…" });
    await sleep(250);

    const n = q.split(/\s+/)[1];
    const factors = primeFactors(n);

    if (!factors) {
      return [{ title: "Result", type: "text", value: "Usage: factor 360" }];
    }

    if (factors.length === 1 && factors[0] === 0) {
      return [{ title: "Prime Factors", type: "text", value: "0" }];
    }

    if (factors.length === 1 && factors[0] === 1) {
      return [{ title: "Prime Factors", type: "text", value: "1" }];
    }

    return [
      { title: "Prime Factors", type: "text", value: factors.join(" × ") },
      { title: "Count", type: "text", value: String(factors.length) },
    ];
  }

  // basic math expression
  emit("status", { status: "running", message: "Evaluating expression…" });
  await sleep(200);

  const v = evalExpr(original);
  if (v !== null) {
    return [{ title: "Result", type: "text", value: String(v) }];
  }

  return [
    { title: "Result", type: "text", value: "I don't understand the query." },
    { title: "Examples", type: "text", value: "Try: gcd 120 45 | factor 360 | 2*(3+4)^2 | derive x^2 | integrate x^2 | solve x^2-5*x+6=0" },
  ];
}

module.exports = { computePods };