const axios = require("axios");

const SYMPY_URL = process.env.SYMPY_URL || "http://localhost:5001";

async function computeWithSympy(query) {
  const resp = await axios.post(`${SYMPY_URL}/compute`, { query });
  return resp.data;
}

module.exports = { computeWithSympy };