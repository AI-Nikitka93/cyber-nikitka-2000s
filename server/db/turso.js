/* ==========================================================================
   TURSO & SQLITE CLIENT ENGINE (Cloud + Local Dual Adapter)
   ========================================================================== */

const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.join(__dirname, '../../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (match) {
        process.env[match[1]] = match[2].trim();
      }
    });
  }
}

loadEnv();

const TURSO_URL = process.env.TURSO_DATABASE_URL || 'libsql://kiber-zolkaiart.aws-eu-west-1.turso.io';
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;

const httpUrl = TURSO_URL.replace(/^libsql:\/\//, 'https://') + '/v2/pipeline';

// Клиент выполнения SQL в Turso Cloud через HTTP Pipeline
async function queryTursoCloud(sql, params = []) {
  const request = {
    type: 'execute',
    stmt: {
      sql,
      args: params.map(val => {
        if (typeof val === 'number') return { type: 'integer', value: String(val) };
        if (val === null || val === undefined) return { type: 'null' };
        return { type: 'text', value: String(val) };
      })
    }
  };

  const response = await fetch(httpUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TURSO_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ requests: [request, { type: 'close' }] })
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Turso HTTP ${response.status}: ${errText}`);
  }

  const resJson = await response.json();
  const rawResult = resJson.results?.[0]?.response?.result;

  if (!rawResult) return [];

  const cols = rawResult.cols.map(c => c.name);
  return rawResult.rows.map(row => {
    const obj = {};
    row.forEach((cell, idx) => {
      obj[cols[idx]] = cell.value;
    });
    return obj;
  });
}

module.exports = { queryTursoCloud, TURSO_URL };
