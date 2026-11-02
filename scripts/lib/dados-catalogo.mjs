// Lê o catálogo do site (app.js e skincare.html) do mesmo jeito que gerar-paginas-produtos.mjs.
// Usado pela lista de preços (página e PDF). Não grava nada.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import '../../shop-core.js';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const S = globalThis.DunaShop;
export const SITE = 'https://dunafragrancias.com.br/';

const source = await fs.readFile(path.join(root, 'app.js'), 'utf8');
const skinSource = await fs.readFile(path.join(root, 'skincare.html'), 'utf8');

function literal(declaration, open, close) {
  let start = source.indexOf(open, source.indexOf(declaration) + declaration.length), depth = 0, quote = null, escaped = false;
  for (let i = start; i < source.length; i++) {
    const c = source[i];
    if (quote) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === quote) quote = null; continue; }
    if (['"', "'", '`'].includes(c)) { quote = c; continue; }
    if (c === open) depth++; if (c === close) depth--;
    if (!depth) return vm.runInNewContext('(' + source.slice(start, i + 1) + ')', {}, {timeout: 1000});
  }
  throw Error('Dados incompletos: ' + declaration);
}

export const perfumes = literal('const PERFUMES =', '[', ']');
export const config = literal('const CONFIG =', '{', '}');

const clean = value => (value || '').replace(/<[^>]*>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim();
export const skincare = [...skinSource.matchAll(/<article class="skin-card([^"]*)">([\s\S]*?)<\/article>/g)].map(([, classes, card]) => {
  const nome = clean(card.match(/<h3>([\s\S]*?)<\/h3>/)?.[1]);
  const resumo = clean(card.match(/<p(?![^>]*class="skin-brand")[^>]*>([\s\S]*?)<\/p>/)?.[1]);
  const price = clean(card.match(/<strong class="skin-price">([\s\S]*?)<\/strong>/)?.[1]).match(/R\$\s*([\d.,]+)/)?.[1];
  if (!nome || !price) throw Error('Card de skincare incompleto');
  return {
    nome, marca: clean(card.match(/<p class="skin-brand">([\s\S]*?)<\/p>/)?.[1]),
    preco: Number(price.replace(/\./g, '').replace(',', '.')), tamanho: resumo.split('·').at(-1).trim(), resumo,
    foto: card.match(/<img[^>]+src="([^"]+)"/)?.[1], disponivel: !classes.includes('is-soldout'), tipo: 'skincare'
  };
});

// Mesma regra de preço dos decants do site: executa o trecho de app.js, sem copiar a fórmula.
const decantSource = source.slice(source.indexOf('const DECANT_FRASCO ='), source.indexOf('const colNav ='));
export const decants = vm.runInNewContext(decantSource + ';DECANTS;', {
  DunaShop: S, PERFUMES: perfumes,
  estaDisponivel: p => p && p.disponivel !== false,
  temPreco: p => typeof p.preco === 'number' && p.preco > 0,
  ehBodySpray: p => /body spray/i.test(p.nome)
}, {timeout: 1000});

export const nomeCompleto = p => p.marca ? `${p.marca} ${p.decant ? p.base : p.nome}` : (p.decant ? p.base : p.nome);
export const disponivel = p => p.disponivel !== false;
export const perfilOlfativo = p => p.acorde || p.familia || '';
export const waLink = text => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
