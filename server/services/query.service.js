const QueryRun = require("../models/QueryRun");

function gcd(a, b) {
  a = Number(a); b = Number(b);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return null;
  a = Math.trunc(a); b = Math.trunc(b);
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

function primeFactors(n) {
  n = Number(n);
  if (!Number.isFinite(n)) return null;
  n = Math.trunc(n);
  if (n === 0) return [0];
  n = Math.abs(n);
  if (n === 1) return [1];

  const factors = [];
  let d = 2;
  while (n > 1 && d * d <= n) {
    while (n % d === 0) {
      factors.push(d);
      n = Math.trunc(n / d);
    }
    d++;
  }
  if (n > 1) factors.push(n);
  return factors;
}

function evaluateExpression(expr) {
  try {
    const s = String(expr).trim();
    // dopuštamo samo brojeve, razmake i matemat. operatore
    // ^ podržimo kao potenciju
    if (!/^[0-9+\-*/().^ \t]+$/.test(s)) return null;

    const safe = s.replace(/\^/g, "**");
    const result = Function(`"use strict"; return (${safe});`)();

    if (typeof result !== "number" || !Number.isFinite(result)) return null;
    return result;
  } catch {
    return null;
  }
}

async function runQuery({ userId, rawQuery }) {
  const original = String(rawQuery || "").trim();
  const q = original.toLowerCase().trim();

  let pods = [];

  // gcd a b
  if (q.startsWith("gcd")) {
    const parts = q.split(/\s+/);
    const a = parts[1];
    const b = parts[2];
    const result = gcd(a, b);

    if (result === null) {
      pods.push({ title: "Result", type: "text", value: "Usage: gcd 120 45" });
    } else {
      pods.push({ title: "Result", type: "text", value: String(result) });
      pods.push({ title: "Properties", type: "keyvalue", value: { a: Number(a), b: Number(b) } });
    }
  }

  // factor n
  else if (q.startsWith("factor")) {
    const parts = q.split(/\s+/);
    const n = parts[1];
    const factors = primeFactors(n);

    if (!factors) {
      pods.push({ title: "Result", type: "text", value: "Usage: factor 360" });
    } else if (factors.length === 1 && factors[0] === 1) {
      pods.push({ title: "Prime Factors", type: "text", value: "1" });
    } else if (factors.length === 1 && factors[0] === 0) {
      pods.push({ title: "Prime Factors", type: "text", value: "0" });
    } else {
      pods.push({ title: "Prime Factors", type: "text", value: factors.join(" × ") });
      pods.push({ title: "Count", type: "text", value: String(factors.length) });
      pods.push({ title: "Properties", type: "keyvalue", value: { n: Number(n) } });
    }
  }

  // basic math expression
  else {
    const result = evaluateExpression(original);
    if (result !== null) {
      pods.push({ title: "Result", type: "text", value: String(result) });
      pods.push({ title: "Input", type: "text", value: original });
    } else {
      pods.push({ title: "Result", type: "text", value: "I don't understand the query." });
      pods.push({ title: "Examples", type: "text", value: "Try: gcd 120 45 | factor 360 | 2*(3+4)^2" });
    }
  }

  const doc = await QueryRun.create({
    userId: userId || null,
    rawQuery: original,
    pods,
  });

  return doc;
}

module.exports = { runQuery };
