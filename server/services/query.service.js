const QueryRun = require("../models/QueryRun");
const { runCryptoOrNumberQuery } = require("./queryCrypto.service");
const { runSympyQuery } = require("./querySympy.service");
const { fetchWikiSummary } = require("./wiki.service");

function detectModule(raw) {
  const q = raw.toLowerCase();
  if (q.startsWith("wiki ")) return "wiki";
  if (q.startsWith("gcd ") || q.startsWith("modexp ") || q.startsWith("hash ")) return "crypto";
  if (q.startsWith("eval ") || q.startsWith("simplify ") || q.startsWith("solve ") || q.startsWith("factor ")
   || q.startsWith("expand ") || q.startsWith("derive ") || q.startsWith("integral ") || q.startsWith("limit ")
   || q.startsWith("plot ")) return "math";
  return "unknown";
}

async function runQuery({ userId, rawQuery }) {
  const started = Date.now();
  const module = detectModule(rawQuery);
  let status = "done", input = {}, output = {}, error = "";

  try {
    if (module === "wiki") {
      const term = rawQuery.slice(5).trim();
      input = { term };
      output = await fetchWikiSummary(term);
    } else if (module === "crypto") {
      const out = await runCryptoOrNumberQuery(rawQuery);
      input = out.input; output = out.output;
    } else if (module === "math") {
      const out = await runSympyQuery(rawQuery);
      input = out.input; output = out.output;
    } else {
      status = "error";
      error = "Unknown command. Try: solve/derive/integral/gcd/hash/wiki";
    }
  } catch (e) {
    status = "error";
    error = e.message || String(e);
  }

  const doc = await QueryRun.create({
    userId, rawQuery, module, status, input, output,
    durationMs: Date.now() - started, error
  });
  return doc;
}
module.exports = { runQuery };
