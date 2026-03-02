const crypto = require("crypto");

function tokens(raw) {
  const re = /"([^"]*)"|\S+/g;
  const out = [];
  let m;
  while ((m = re.exec(raw)) !== null) out.push(m[1] !== undefined ? m[1] : m[0]);
  return out;
}

function gcd(a, b) { a = BigInt(a); b = BigInt(b); while (b !== 0n) { const t=b; b=a%b; a=t; } return a<0n?-a:a; }
function modexp(a, b, m) {
  a = BigInt(a); b = BigInt(b); m = BigInt(m);
  if (m === 0n) throw new Error("modexp: modulus must be non-zero");
  let res = 1n % m, base = ((a % m) + m) % m, exp = b;
  while (exp > 0n) { if (exp & 1n) res = (res * base) % m; base = (base * base) % m; exp >>= 1n; }
  return res;
}

async function runCryptoOrNumberQuery(rawQuery) {
  const t = tokens(rawQuery);
  const cmd = (t[0] || "").toLowerCase();

  if (cmd === "gcd") {
    if (t.length < 3) throw new Error("Usage: gcd a b");
    return { input: { a: t[1], b: t[2] }, output: { result: gcd(t[1], t[2]).toString() } };
  }

  if (cmd === "modexp") {
    if (t.length < 4) throw new Error("Usage: modexp a b m");
    return { input: { a: t[1], b: t[2], m: t[3] }, output: { result: modexp(t[1], t[2], t[3]).toString() } };
  }

  if (cmd === "hash") {
    if (t.length < 3) throw new Error('Usage: hash sha256 "text"');
    const algo = t[1].toLowerCase();
    const text = t.slice(2).join(" ");
    if (!["sha256","sha512"].includes(algo)) throw new Error("hash algo must be sha256 or sha512");
    return { input: { algo, text }, output: { result: crypto.createHash(algo).update(text, "utf8").digest("hex") } };
  }

  throw new Error("Unknown crypto command");
}
module.exports = { runCryptoOrNumberQuery };
