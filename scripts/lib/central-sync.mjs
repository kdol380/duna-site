import vm from 'node:vm';

export function perfumeLiteral(source) {
  const match = /const PERFUMES = (\[[\s\S]*?\n\]);/.exec(source);
  if (!match) throw Error('Estrutura de PERFUMES desconhecida');
  return {text: match[1], products: vm.runInNewContext(`(${match[1]})`, {}, {timeout: 1000})};
}

const escapeHTML = value => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const decode = value => value.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const money = value => 'R$ ' + value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});

// Valida o lote inteiro antes de tocar em qualquer arquivo. Nomes da Central
// nunca são usados para decidir o vínculo em tempo de sincronização.
export function synchronize(app, skin, links, payload) {
  if (payload?.version !== 1 || !Array.isArray(payload.products) || !Array.isArray(links) || !links.length)
    throw Error('Resposta ou vínculos inválidos');
  const updates = new Map(), names = new Set(), ids = new Set();
  for (const row of payload.products) {
    if (!row || typeof row.id !== 'string' || updates.has(row.id) ||
        typeof row.price !== 'number' || !Number.isFinite(row.price) || row.price <= 0 ||
        Math.abs(row.price * 100 - Math.round(row.price * 100)) > 0.00001 || typeof row.available !== 'boolean')
      throw Error('Preço, disponibilidade ou ID inválido na resposta');
    updates.set(row.id, row);
  }
  const {text, products} = perfumeLiteral(app);
  const cards = [...skin.matchAll(/<article class="skin-card([^"]*)">([\s\S]*?)<\/article>/g)];
  const changes = [];
  let nextApp = app, nextSkin = skin;
  for (const link of links) {
    const key = `${link.tipo}:${link.nome}`;
    if (!['perfume','skincare'].includes(link.tipo) || ids.has(link.id) || names.has(key)) throw Error('Vínculo repetido ou inválido');
    ids.add(link.id); names.add(key);
    const update = updates.get(link.id);
    if (!update) throw Error(`Produto vinculado ausente na Central: ${link.sku}`);
    if (link.tipo === 'perfume') {
      const found = products.filter(p => p.nome === link.nome);
      if (found.length !== 1) throw Error(`Perfume não identificado: ${link.nome}`);
      const p = found[0];
      if (p.preco === update.price && (p.disponivel !== false) === update.available) continue;
      const marker = `nome:${JSON.stringify(p.nome)}`;
      const start = nextApp.indexOf(marker);
      const end = nextApp.indexOf('\n\n', start);
      if (start < 0 || end < 0) throw Error('Formato do perfume mudou; revisar sincronizador');
      const block = nextApp.slice(start,end);
      if (!/\bpreco:\s*(?:null|\d+(?:\.\d+)?)/.test(block) || !/\bdisponivel:\s*(?:true|false)/.test(block))
        throw Error('Campos comerciais do perfume ausentes');
      const changed = block.replace(/\bpreco:\s*(?:null|\d+(?:\.\d+)?)/,`preco:${update.price}`)
        .replace(/\bdisponivel:\s*(?:true|false)/,`disponivel:${update.available}`);
      nextApp = nextApp.slice(0,start) + changed + nextApp.slice(end);
      changes.push({sku:link.sku, nome:link.nome, antes:{preco:p.preco,disponivel:p.disponivel!==false}, depois:{preco:update.price,disponivel:update.available}});
    } else {
      const found = cards.filter(c => decode(c[2].match(/<h3>(.*?)<\/h3>/)?.[1] || '') === link.nome);
      if (found.length !== 1) throw Error(`Skincare não identificado: ${link.nome}`);
      const card = found[0], available = !card[1].includes('is-soldout');
      const rawPrice = card[2].match(/<strong class="skin-price">[\s\S]*?R\$\s*([\d.,]+)/)?.[1];
      const price = Number(rawPrice?.replace(/\./g,'').replace(',','.'));
      if (!Number.isFinite(price) || price<=0) throw Error('Preço de skincare inválido');
      if (price === update.price && available === update.available) continue;
      const brand = decode(card[2].match(/<p class="skin-brand">(.*?)<\/p>/)?.[1] || '');
      let body = card[2].replace(/\s*<span class="skin-soldout">Esgotado<\/span>/,'');
      body = body.replace(/<strong class="skin-price">[\s\S]*?<\/strong>/,
        `<strong class="skin-price">${update.available?money(update.price):`<s>${money(update.price)}</s> · Esgotado`}</strong>`);
      const buy = /<(button|a) class="skin-wa[^\"]*"[^>]*>[\s\S]*?<\/(?:button|a)>/;
      if (!buy.test(body)) throw Error('Botão de skincare ausente');
      body = body.replace(buy, update.available
        ? '<button class="skin-wa skin-add" data-skin-add type="button">+ Adicionar ao pedido</button>'
        : `<a class="skin-wa" data-product="${escapeHTML(brand+' '+link.nome)}" href="#">Avise-me quando voltar</a>`);
      const classes = card[1].replace(/\bis-soldout\b/g,'').trim();
      nextSkin = nextSkin.replace(card[0],`<article class="skin-card${classes?' '+classes:''}${update.available?'':' is-soldout'}">${update.available?'':'\n          <span class="skin-soldout">Esgotado</span>'}${body}</article>`);
      changes.push({sku:link.sku,nome:link.nome,antes:{preco:price,disponivel:available},depois:{preco:update.price,disponivel:update.available}});
    }
  }
  // Não aceita adição automática por um endpoint alterado indevidamente.
  if (updates.size !== ids.size) throw Error('Resposta contém produtos sem vínculo aprovado');
  if (!text || perfumeLiteral(nextApp).products.length !== products.length) throw Error('Catálogo alterado indevidamente');
  return {app:nextApp,skin:nextSkin,changes};
}
