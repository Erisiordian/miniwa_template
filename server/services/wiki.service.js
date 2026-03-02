const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function fetchWikiSummary(query) {
  const title = encodeURIComponent(query.replace(/\s+/g, "_"));
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${title}`;
  const res = await fetch(url, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`Wikipedia status ${res.status}`);
  const json = await res.json();
  return { title: json.title, extract: json.extract, url: json.content_urls?.desktop?.page || null, thumbnail: json.thumbnail?.source || null };
}
module.exports = { fetchWikiSummary };
