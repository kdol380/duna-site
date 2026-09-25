// Atualiza o parâmetro ?v= de CSS e JS em todas as páginas a partir do conteúdo de cada arquivo.
// Assim o navegador baixa a versão nova só quando o arquivo mudou, sem edição manual.
// Uso: node scripts/versionar-assets.mjs   (rodar antes de todo commit que altere CSS ou JS)
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = ['styles.css', 'discovery.css', 'app.js', 'discovery.js', 'shop-core.js', 'skincare-data.js'];

const versao = {};
for (const nome of ASSETS) {
  const conteudo = await fs.readFile(path.join(root, nome));
  versao[nome] = crypto.createHash('sha1').update(conteudo).digest('hex').slice(0, 10);
}

async function paginas(dir) {
  const itens = await fs.readdir(dir, {withFileTypes: true});
  const lista = [];
  for (const item of itens) {
    const p = path.join(dir, item.name);
    if (item.isDirectory()) {
      if (['.git', 'node_modules', 'audit'].includes(item.name)) continue;
      lista.push(...await paginas(p));
    } else if (item.name.endsWith('.html')) lista.push(p);
  }
  return lista;
}

const escapar = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
let alteradas = 0;
for (const arquivo of await paginas(root)) {
  const antes = await fs.readFile(arquivo, 'utf8');
  let depois = antes;
  for (const [nome, v] of Object.entries(versao)) {
    depois = depois.replace(new RegExp(`(["'/])${escapar(nome)}(\\?v=[^"']*)?(["'])`, 'g'), `$1${nome}?v=${v}$3`);
  }
  if (depois !== antes) { await fs.writeFile(arquivo, depois); alteradas++; }
}
console.log(`Versões: ${Object.entries(versao).map(([n, v]) => `${n}=${v}`).join(', ')}. ${alteradas} página(s) atualizada(s).`);
