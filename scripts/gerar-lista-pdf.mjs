// Gera duna-lista-de-precos.pdf a partir de lista.html, usando o Chrome/Chromium instalado (sem dependências npm).
// Só refaz o PDF quando lista.html mudou (controle em dados/lista-pdf.json), para não gravar arquivo igual a cada ciclo.
// Uso: node scripts/gerar-lista-pdf.mjs [--forcar] [--obrigatorio]
//   --forcar       gera mesmo sem mudança na lista
//   --obrigatorio  falha (código 1) se não encontrar o navegador; sem ele, apenas avisa
// Navegador: variável CHROME_PATH ou instalação padrão do Chrome/Chromium/Edge.
import fs from 'node:fs/promises';
import {existsSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import crypto from 'node:crypto';
import {spawn, execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PDF = 'duna-lista-de-precos.pdf', CONTROLE = path.join(root, 'dados', 'lista-pdf.json'), SITE = 'https://dunafragrancias.com.br/';
const args = new Set(process.argv.slice(2));

const html = await fs.readFile(path.join(root, 'lista.html'), 'utf8').catch(() => { throw Error('lista.html não existe. Rode antes: node scripts/gerar-paginas-produtos.mjs'); });
// O ?v= de CSS/JS muda o hash sem mudar a lista; o PDF depende do conteúdo e do visual da lista.
const fonte = crypto.createHash('sha256').update(html.replace(/\?v=[0-9a-f]+/g, '')).update(await fs.readFile(path.join(root, 'lista.css'))).digest('hex');
const controle = JSON.parse(await fs.readFile(CONTROLE, 'utf8').catch(() => '{}'));
if (!args.has('--forcar') && controle.fonte === fonte && existsSync(path.join(root, PDF))) {
  console.log(`PDF da lista em dia (${controle.gerado}).`);
  process.exit(0);
}

function acharNavegador() {
  const candidatos = [process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'].filter(Boolean);
  for (const c of candidatos) if (existsSync(c)) return c;
  for (const nome of ['google-chrome', 'google-chrome-stable', 'chromium', 'chromium-browser', 'microsoft-edge']) {
    try { return execFileSync(process.platform === 'win32' ? 'where' : 'which', [nome], {encoding: 'utf8'}).split(/\r?\n/)[0].trim(); } catch {}
  }
  return null;
}
const navegador = acharNavegador();
if (!navegador) {
  const msg = 'PDF da lista NÃO gerado: Chrome/Chromium não encontrado (defina CHROME_PATH). A automação da main gera o PDF no próximo ciclo.';
  if (args.has('--obrigatorio')) { console.error(msg); process.exit(1); }
  console.warn(msg); process.exit(0);
}

// Servidor local só de leitura: o Chrome precisa de http (não file://) para reduzir as fotos no canvas.
const tipos = {'.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.mp4': 'video/mp4'};
const servidor = http.createServer(async (req, res) => {
  const alvo = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!alvo.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try { const corpo = await fs.readFile(alvo); res.writeHead(200, {'content-type': tipos[path.extname(alvo).toLowerCase()] || 'application/octet-stream'}).end(corpo); }
  catch { res.writeHead(404).end(); }
});
await new Promise(r => servidor.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${servidor.address().port}/`;

// Protocolo do DevTools pela pipe (fd 3 escreve, fd 4 lê), mensagens JSON separadas por \0.
const perfil = await fs.mkdtemp(path.join(os.tmpdir(), 'duna-pdf-'));
const chrome = spawn(navegador, ['--headless=new', '--remote-debugging-pipe', '--no-first-run', '--no-default-browser-check', '--disable-gpu',
  '--disable-extensions', '--hide-scrollbars', '--mute-audio', `--user-data-dir=${perfil}`, ...(process.getuid?.() === 0 || process.env.CI ? ['--no-sandbox'] : []), 'about:blank'],
  {stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe']});
let erroChrome = '';
chrome.stderr.on('data', d => { erroChrome = (erroChrome + d).slice(-2000); });
const [entrada, saida] = [chrome.stdio[3], chrome.stdio[4]];
let seq = 0, buffer = '';
const pendentes = new Map(), ouvintes = [];
saida.on('data', parte => {
  buffer += parte;
  let i;
  while ((i = buffer.indexOf('\0')) >= 0) {
    const msg = JSON.parse(buffer.slice(0, i)); buffer = buffer.slice(i + 1);
    if (msg.id && pendentes.has(msg.id)) { const {ok, falha} = pendentes.get(msg.id); pendentes.delete(msg.id); msg.error ? falha(Error(msg.error.message)) : ok(msg.result); }
    else ouvintes.forEach(f => f(msg));
  }
});
const cdp = (method, params = {}, sessionId) => new Promise((ok, falha) => {
  const id = ++seq; pendentes.set(id, {ok, falha});
  entrada.write(JSON.stringify({id, method, params, ...(sessionId ? {sessionId} : {})}) + '\0');
});
const evento = (nome, sessionId, ms = 30000) => new Promise((ok, falha) => {
  const t = setTimeout(() => falha(Error('Tempo esgotado esperando ' + nome)), ms);
  ouvintes.push(function f(m) { if (m.method === nome && m.sessionId === sessionId) { clearTimeout(t); ouvintes.splice(ouvintes.indexOf(f), 1); ok(m.params); } });
});

const data = new Intl.DateTimeFormat('pt-BR', {timeZone: 'America/Sao_Paulo'}).format(new Date());
try {
  const {targetId} = await cdp('Target.createTarget', {url: 'about:blank'});
  const {sessionId} = await cdp('Target.attachToTarget', {targetId, flatten: true});
  const s = (m, p) => cdp(m, p, sessionId);
  await s('Page.enable');
  // Sem aviso de cookies e sem Pixel no arquivo; o PDF é um documento, não uma visita.
  await s('Page.addScriptToEvaluateOnNewDocument', {source: "try{localStorage.setItem('duna_cookies','recusado')}catch(e){}"});
  await s('Emulation.setDeviceMetricsOverride', {width: 400, height: 760, deviceScaleFactor: 1, mobile: false});
  const carregou = evento('Page.loadEventFired', sessionId);
  await s('Page.navigate', {url: base + 'lista.html'});
  await carregou;
  const {result, exceptionDetails} = await s('Runtime.evaluate', {awaitPromise: true, returnByValue: true, expression: `(async () => {
    document.querySelector('[data-lista-data] time').textContent = ${JSON.stringify(data)};
    document.title = 'Duna Fragrâncias · Lista de preços · ' + ${JSON.stringify(data)};
    // Links relativos apontam para o site publicado.
    for (const a of document.querySelectorAll('a[href]')) {
      const h = a.getAttribute('href');
      if (h && !h.startsWith('#') && !/^[a-z]+:/i.test(h)) a.href = new URL(h, ${JSON.stringify(SITE)}).href;
    }
    // Fotos reduzidas (miniatura nítida no celular, arquivo leve para o WhatsApp).
    const imgs = [...document.querySelectorAll('.lista-main img')];
    imgs.forEach(i => { i.loading = 'eager'; });
    await Promise.all(imgs.map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    const feitas = new Map();
    for (const i of imgs) {
      if (!i.naturalWidth || i.classList.contains('lista-logo')) continue;
      if (!feitas.has(i.src)) {
        const lado = 120, k = Math.min(1, lado / Math.max(i.naturalWidth, i.naturalHeight));
        const c = document.createElement('canvas'); c.width = lado; c.height = lado;
        const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, lado, lado); g.imageSmoothingQuality = 'high';
        const w = i.naturalWidth * k, h = i.naturalHeight * k;
        g.drawImage(i, (lado - w) / 2, (lado - h) / 2, w, h);
        feitas.set(i.src, c.toDataURL('image/jpeg', .8));
      }
      i.src = feitas.get(i.src);
    }
    await Promise.all(imgs.map(i => i.decode().catch(() => {})));
    await document.fonts.ready;
    const vazias = imgs.filter(i => !i.naturalWidth).length;
    return {itens: document.querySelectorAll('.li').length, vazias};
  })()`});
  if (exceptionDetails) throw Error('Erro na página: ' + (exceptionDetails.exception?.description || exceptionDetails.text));
  if (result.value.vazias) throw Error(`${result.value.vazias} foto(s) não carregaram na lista.`);
  const rodape = `<div style="width:100%;margin:0 7mm;display:flex;justify-content:space-between;font:6.5px Helvetica,Arial,sans-serif;color:#856629"><span>Duna Fragrâncias · Lista atualizada em ${data} · dunafragrancias.com.br/lista</span><span><span class="pageNumber"></span>/<span class="totalPages"></span></span></div>`;
  const {data: pdf} = await s('Page.printToPDF', {
    printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: rodape,
    // Sem PDF marcado/sumário lateral: +35% de tamanho para um recurso que os leitores de celular não mostram. O índice da capa é clicável.
    generateTaggedPDF: false, generateDocumentOutline: false
  });
  await fs.writeFile(path.join(root, PDF), Buffer.from(pdf, 'base64'));
  await fs.writeFile(CONTROLE, JSON.stringify({fonte, gerado: data, arquivo: PDF}, null, 2) + '\n');
  const kb = Math.round((await fs.stat(path.join(root, PDF))).size / 1024);
  console.log(`PDF da lista gerado: ${PDF} (${kb} KB, ${result.value.itens} itens, preços de ${data}).`);
  await cdp('Browser.close').catch(() => {});
} catch (e) {
  console.error('Falha ao gerar o PDF da lista:', e.message, erroChrome ? '\n' + erroChrome : '');
  process.exitCode = 1;
  chrome.kill();
} finally {
  servidor.close();
  setTimeout(() => fs.rm(perfil, {recursive: true, force: true}).finally(() => process.exit()), 300);
}
