const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function runSympyQuery(rawQuery) {
  const url = (process.env.SYMPY_URL || "http://127.0.0.1:5001") + "/sympy";
  const res = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ query: rawQuery }) });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.message || "SymPy error");
  return json; // { input, output }
}
module.exports = { runSympyQuery };
