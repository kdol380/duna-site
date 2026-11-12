// Gera lista.html: todos os perfumes, decants e skincare numa página só, com preço no Pix e no cartão.
// A mesma página é a fonte do PDF (scripts/gerar-lista-pdf.mjs). Não edite lista.html à mão.
// Uso: node scripts/gerar-lista-precos.mjs   (gerar-paginas-produtos.mjs já chama este script)
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {root, S, SITE, perfumes, skincare, decants, nomeCompleto, disponivel, perfilOlfativo, waLink} from './lib/dados-catalogo.mjs';

const esc = S.escape, money = S.money;
export const PDF_ARQUIVO = 'duna-lista-de-precos.pdf';
const GENEROS = [['Masculino', 'masculinos', 'Masculinos'], ['Feminino', 'femininos', 'Femininos'], ['Unissex', 'unissex', 'Unissex']];
const FAIXAS = [
  {id: 'ate-200', label: 'Até R$ 200', curto: 'Até 200', ok: v => v <= 200},
  {id: '201-a-300', label: 'De R$ 201 a R$ 300', curto: '201 a 300', ok: v => v > 200 && v <= 300},
  {id: '301-a-400', label: 'De R$ 301 a R$ 400', curto: '301 a 400', ok: v => v > 300 && v <= 400},
  {id: 'acima-de-400', label: 'Acima de R$ 400', curto: 'Acima de 400', ok: v => v > 400}
];
const marcaBase = p => (p.marca || '').replace(/\s*Pride$/i, '').trim();
const busca = (...partes) => S.normalize(partes.filter(Boolean).join(' ')).replace(/\s+/g, ' ').trim();
const porPreco = (a, b) => a.preco - b.preco || nomeCompleto(a).localeCompare(nomeCompleto(b), 'pt-BR');
const porMarca = (a, b) => nomeCompleto(a).localeCompare(nomeCompleto(b), 'pt-BR');
const plural = (n, um, varios) => `${n} ${n === 1 ? um : varios}`;

for (const p of [...perfumes, ...skincare]) {
  if (!(typeof p.preco === 'number' && p.preco > 0)) throw Error('Preço inválido na lista: ' + nomeCompleto(p));
  await fs.access(path.join(root, p.foto.split('?')[0]));
}

function precoHTML(p) {
  if (!disponivel(p)) return '<div class="li-preco is-esgotado"><strong>Esgotado</strong></div>';
  return `<div class="li-preco"><strong>${money(S.cardPrice(p.preco))}</strong><span>no cartão</span><small>${money(p.preco)} no Pix · 5% OFF</small></div>`;
}
function pedirHTML(p, msg) {
  const href = disponivel(p) ? waLink(msg) : waLink(`Olá, Duna! Gostaria de saber sobre a disponibilidade do ${nomeCompleto(p)}, avise-me quando o produto voltar ao estoque !`);
  return `<a class="li-pedir" href="${esc(href)}" target="_blank" rel="noopener">${disponivel(p) ? 'Pedir' : 'Avise-me'}</a>`;
}
function itemProduto(p) {
  const meta = p.tipo === 'skincare' ? p.resumo : [perfilOlfativo(p), p.tamanho].filter(Boolean).join(' · ');
  const q = p.tipo === 'skincare' ? busca(p.nome, p.marca, p.resumo) : busca(p.nome, p.marca, p.genero, p.familia, p.acorde, p.inspiracao, p.notas?.topo, p.notas?.coracao, p.notas?.fundo, p.tamanho);
  const msg = `Olá, Duna! Vi na lista de preços e tenho interesse no ${nomeCompleto(p)} (${p.tamanho}) — ${money(p.preco)} no Pix. Pode confirmar disponibilidade, frete e prazo?`;
  return `<li class="li${disponivel(p) ? '' : ' is-esgotado'}" data-g="${esc(p.genero || '')}" data-m="${esc(marcaBase(p))}" data-d="${disponivel(p) ? 1 : 0}" data-q="${esc(q)}">`
    + `<img src="${esc(p.foto)}" alt="" width="44" height="44" loading="lazy" decoding="async">`
    + `<div class="li-info"><a class="li-nome" href="${S.productURL(p)}"><span class="li-marca">${esc(p.marca)}</span> ${esc(p.nome)}</a><span class="li-meta">${esc(meta)}</span>${p.inspiracao ? `<span class="li-notas so-pdf">${esc(p.inspiracao)}</span>` : ''}</div>`
    + precoHTML(p) + pedirHTML(p, msg) + '</li>';
}
function itemDecant(d) {
  const q = busca(d.base, d.marca, d.genero, d.familia, d.acorde, d.inspiracao, d.notas?.topo, d.notas?.coracao, d.notas?.fundo, 'decant');
  const msg = `Olá, Duna! Vi na lista de preços e tenho interesse no decant de ${nomeCompleto(d)}. Pode confirmar disponibilidade, frete e prazo?`;
  return `<li class="li li-decant" data-g="${esc(d.genero || '')}" data-m="${esc(marcaBase(d))}" data-d="1" data-q="${esc(q)}">`
    + `<div class="li-info"><a class="li-nome" href="${S.productURL(d)}"><span class="li-marca">${esc(d.marca)}</span> ${esc(d.base)}</a><span class="li-meta">${esc(perfilOlfativo(d))}</span></div>`
    + `<div class="li-ml">${d.opcoes.map(o => `<span><b>${o.ml} ml</b>${money(S.cardPrice(o.preco))}<small>cartão</small><small>${money(o.preco)} Pix</small></span>`).join('')}</div>`
    + pedirHTML(d, msg) + '</li>';
}
const lista = itens => `<ul class="lista-itens">${itens.join('')}</ul>`;

// ---- Perfumes: gênero → faixa de preço no Pix; esgotados no fim de cada gênero.
const indicePerfumes = [];
const blocosPerfumes = GENEROS.map(([genero, slug, titulo]) => {
  const todos = perfumes.filter(p => p.genero === genero);
  if (!todos.length) return '';
  const ativos = todos.filter(disponivel).sort(porPreco), esgotados = todos.filter(p => !disponivel(p)).sort(porMarca);
  const faixas = FAIXAS.map(f => ({...f, itens: ativos.filter(p => f.ok(p.preco))})).filter(f => f.itens.length);
  indicePerfumes.push({slug, titulo, total: todos.length, faixas});
  return `<section class="lista-grupo" id="perfumes-${slug}" aria-labelledby="perfumes-${slug}-t"><h3 id="perfumes-${slug}-t">${titulo} <small>${todos.length}</small></h3>`
    + faixas.map(f => `<section class="lista-faixa" id="perfumes-${slug}-${f.id}"><h4>${f.label} <small>no Pix</small></h4>${lista(f.itens.map(itemProduto))}</section>`).join('')
    + (esgotados.length ? `<section class="lista-faixa lista-faixa-esgotados" id="perfumes-${slug}-esgotados"><h4>Esgotados no momento</h4>${lista(esgotados.map(itemProduto))}</section>` : '')
    + '</section>';
}).join('');
const semGenero = perfumes.filter(p => !GENEROS.some(([g]) => g === p.genero));
if (semGenero.length) throw Error('Perfume sem gênero conhecido na lista: ' + semGenero.map(nomeCompleto).join(', '));

// ---- Decants: por gênero, do menor para o maior preço.
const indiceDecants = [];
const blocosDecants = GENEROS.map(([genero, slug, titulo]) => {
  const itens = decants.filter(d => d.genero === genero).sort(porPreco);
  if (!itens.length) return '';
  indiceDecants.push({slug, titulo, total: itens.length});
  return `<section class="lista-grupo" id="decants-${slug}" aria-labelledby="decants-${slug}-t"><h3 id="decants-${slug}-t">${titulo} <small>${itens.length}</small></h3>${lista(itens.map(itemDecant))}</section>`;
}).join('');
const tiers = [...S.DECANT_TIERS].sort((a, b) => a.min - b.min).map((t, i, all) => `${t.min}${all[i + 1] ? '–' + (all[i + 1].min - 1) : '+'}: ${Math.round(t.rate * 100)}% OFF`).join(' · ');

// ---- Skincare: por marca.
const blocosSkincare = lista([...skincare].sort((a, b) => Number(disponivel(b)) - Number(disponivel(a)) || porMarca(a, b)).map(itemProduto));

const marcas = [...new Set([...perfumes, ...skincare].map(marcaBase).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
const conteudo = `<section class="lista-sec" id="perfumes" aria-labelledby="perfumes-t"><div class="wrap"><h2 id="perfumes-t">Perfumes <small>${perfumes.length}</small></h2>${blocosPerfumes}</div></section>
<section class="lista-sec" id="decants" aria-labelledby="decants-t"><div class="wrap"><h2 id="decants-t">Decants <small>${decants.length}</small></h2><p class="lista-nota">A mesma fragrância original, num vidrinho de decant (borrifador) de 3, 5 ou 10 ml. O vidrinho, de ${money(S.BOTTLE_PRICE)}, já está incluído nos preços abaixo. Não acompanha o frasco original do perfume.</p><p class="lista-nota"><strong>Quanto mais decants, maior o desconto sobre o líquido:</strong> ${tiers}.</p>${blocosDecants}</div></section>
<section class="lista-sec" id="skincare" aria-labelledby="skincare-t"><div class="wrap"><h2 id="skincare-t">Skincare <small>${skincare.length}</small></h2>${blocosSkincare}</div></section>`;
const versaoPDF = crypto.createHash('sha1').update(conteudo).digest('hex').slice(0, 10);

const indice = `<nav class="lista-indice so-pdf" aria-labelledby="indice-t"><h2 id="indice-t">Índice</h2>
<p class="lista-indice-sec"><a href="#perfumes">Perfumes <small>${perfumes.length}</small></a></p>
${indicePerfumes.map(g => `<div class="lista-indice-grupo"><a class="lista-indice-g" href="#perfumes-${g.slug}">${g.titulo} <small>${g.total}</small></a><div class="lista-indice-faixas">${g.faixas.map(f => `<a href="#perfumes-${g.slug}-${f.id}">${f.curto} <small>${f.itens.length}</small></a>`).join('')}</div></div>`).join('')}
<p class="lista-indice-sec"><a href="#decants">Decants <small>${decants.length}</small></a></p>
<div class="lista-indice-faixas">${indiceDecants.map(g => `<a href="#decants-${g.slug}">${g.titulo} <small>${g.total}</small></a>`).join('')}</div>
<p class="lista-indice-sec"><a href="#skincare">Skincare <small>${skincare.length}</small></a></p>
<p class="lista-dica so-pdf">Toque num item do índice para ir direto. Para achar um nome, marca ou nota, use a busca (lupa) do leitor de PDF. Os valores das faixas são no Pix.</p>
</nav>`;

const main = `<main class="lista-main" id="conteudo">
<header class="lista-capa"><div class="wrap">
<p class="crumb"><a href="index.html">Início</a> &nbsp;/&nbsp; Lista de preços</p>
<img class="lista-logo so-pdf" src="assets/logo-assinatura.png" alt="Duna Fragrâncias" width="472" height="112">
<p class="lista-eyebrow so-pdf">Perfumes · Decants · Skincare</p>
<h1>Lista de <span class="gold">preços</span></h1>
<p class="lista-lead">Perfumes, decants e skincare da Duna numa página só. Preço por unidade, sem frete. No Pix, ${S.PIX_DISCOUNT_PCT}% OFF ou mais com o arredondamento do cartão.</p>
<p class="lista-data so-pdf" data-lista-data>Lista atualizada em <time></time>. A versão mais recente fica em dunafragrancias.com.br/lista.</p>
<div class="lista-acoes so-web"><a class="btn btn-gold" href="${PDF_ARQUIVO}?v=${versaoPDF}" download="Duna-Lista-de-Precos.pdf" data-lista-pdf>Baixar PDF</a><button type="button" class="btn btn-line-dark" data-lista-enviar hidden>Enviar o PDF</button></div>
<ul class="lista-regras so-pdf">
<li>Preço por unidade, sem frete. Frete e prazo a confirmar no atendimento.</li>
<li>Cartão em destaque; Pix com ${S.PIX_DISCOUNT_PCT}% OFF ou mais. Decants: cartão em destaque, Pix logo abaixo.</li>
<li>Toque no nome para ver notas e detalhes. Em “Pedir”, a mensagem vai pronta para o WhatsApp.</li>
</ul>
${indice}
</div></header>
<div class="lista-filtros so-web" id="listaFiltros"><div class="wrap">
<nav class="lista-tabs" aria-label="Seções da lista"><a href="#perfumes">Perfumes</a><a href="#decants">Decants</a><a href="#skincare">Skincare</a></nav>
<form class="lista-controles" role="search" onsubmit="return false">
<label class="lista-busca"><span class="sr-only">Buscar na lista</span><input type="search" id="listaBusca" name="q" placeholder="Nome, marca ou nota" autocomplete="off"></label>
<label class="lista-marca"><span class="sr-only">Marca</span><select id="listaMarca" name="marca"><option value="">Todas as marcas</option>${marcas.map(m => `<option value="${esc(m)}">${esc(m)}</option>`).join('')}</select></label>
<div class="lista-linha"><div class="lista-chips" role="group" aria-label="Gênero">${[['', 'Todos'], ...GENEROS.map(([g]) => [g, g])].map(([v, l]) => `<button type="button" data-genero="${v}" aria-pressed="${v === ''}">${l}</button>`).join('')}</div>
<label class="lista-check"><input type="checkbox" id="listaDisp" name="disponiveis"> Só disponíveis</label></div>
</form>
<p class="lista-contagem" id="listaContagem" aria-live="polite"></p>
</div></div>
${conteudo}
<div class="wrap"><p class="lista-vazio" id="listaVazio" hidden>Nada encontrado com esses filtros. <button type="button" data-lista-limpar>Limpar filtros</button></p></div>
</main>`;

// ---- Casca: mesmo cabeçalho, menu, rodapé, pedido e scripts do catálogo.
let html = await fs.readFile(path.join(root, 'catalogo.html'), 'utf8');
const descricao = 'Lista de preços da Duna Fragrâncias: perfumes árabes, decants e skincare com preço no Pix e no cartão. Baixe em PDF ou peça pelo WhatsApp.';
const url = new URL('lista', SITE).href;
html = html.replace(/<title>[\s\S]*?<\/title>/, '<title>Lista de preços · Duna Fragrâncias</title>')
  .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(descricao)}" />`)
  .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}" />`)
  .replace(/<meta property="og:title"[^>]*>/, '<meta property="og:title" content="Lista de preços · Duna Fragrâncias" />')
  .replace(/<meta property="og:description"[^>]*>/, `<meta property="og:description" content="${esc(descricao)}" />`)
  .replace(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}" />`)
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify({'@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Lista de preços — Duna Fragrâncias', url, description: descricao, inLanguage: 'pt-BR', isPartOf: {'@id': SITE + '#website'}})}</script>`)
  .replace(/(<link rel="stylesheet" href="discovery\.css[^>]*>)/, '$1\n<link rel="stylesheet" href="lista.css" />')
  .replace(/(<script defer src="discovery\.js[^>]*><\/script>)/, '$1\n<script defer src="lista.js"></script>')
  .replace('class="page-light catalog-page"', 'class="page-light lista-page"')
  .replace(/<div id="preloader">[\s\S]*?<\/div>\s*<\/div>\s*/, '')
  .replace(/ aria-current="page"/g, '')
  .replace(/<a href="lista\.html">Lista de preços<\/a>/g, '<a href="lista.html" aria-current="page">Lista de preços</a>');
const inicio = html.indexOf('<!-- ===================== CABEÇALHO DA PÁGINA'), fim = html.indexOf('<!-- ===================== FOOTER');
if (inicio < 0 || fim < 0 || !html.includes('lista.css') || !html.includes('lista.js')) throw Error('Estrutura de catalogo.html mudou; revise scripts/gerar-lista-precos.mjs.');
html = (html.slice(0, inicio) + main + '\n\n' + html.slice(fim)).replace('<head>', '<head>\n<!-- Gerado por scripts/gerar-lista-precos.mjs a partir de app.js e skincare.html. Não edite à mão. -->');
await fs.writeFile(path.join(root, 'lista.html'), html);
console.log(`Lista de preços: ${perfumes.length} perfumes, ${decants.length} decants e ${skincare.length} skincare em lista.html.`);

await import('./versionar-assets.mjs');
