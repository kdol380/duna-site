import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {synchronize} from './lib/central-sync.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args = process.argv.slice(2);
if (args.some(x=>x!=='--check')) throw Error('Uso: node scripts/sincronizar-central.mjs [--check]');
const key = process.env.DUNA_SUPABASE_PUBLISHABLE_KEY;
if (!key?.startsWith('sb_publishable_')) throw Error('Configure DUNA_SUPABASE_PUBLISHABLE_KEY; não use chave administrativa');
const response = await fetch('https://pmvikxdddjqkrgqqmfyp.supabase.co/rest/v1/rpc/duna_catalog_prices_v1', {
  method:'POST',headers:{apikey:key,'Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(20000)
});
if (!response.ok) throw Error(`Central indisponível (HTTP ${response.status}); publicação preservada`);
const payload = await response.json();
const [app,skin,links] = await Promise.all(['app.js','skincare.html','dados/central-vinculos.json'].map(p=>fs.readFile(path.join(root,p),'utf8')));
const result = synchronize(app,skin,JSON.parse(links),payload);
console.log(JSON.stringify({produtos:JSON.parse(links).length,alteracoes:result.changes},null,2));
if (!args.includes('--check') && result.changes.length) {
  await fs.writeFile(path.join(root,'app.js'),result.app);
  await fs.writeFile(path.join(root,'skincare.html'),result.skin);
}
