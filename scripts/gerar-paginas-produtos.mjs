import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import '../shop-core.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const S=globalThis.DunaShop,esc=S.escape,site='https://dunafragrancias.com.br/';
const source=await fs.readFile(path.join(root,'app.js'),'utf8');
const skinSource=await fs.readFile(path.join(root,'skincare.html'),'utf8');
const shell=await fs.readFile(path.join(root,'catalogo.html'),'utf8');
function literal(declaration,open,close){
  let start=source.indexOf(open,source.indexOf(declaration)+declaration.length),depth=0,quote=null,escaped=false;
  for(let i=start;i<source.length;i++){
    const c=source[i];
    if(quote){if(escaped)escaped=false;else if(c==='\\')escaped=true;else if(c===quote)quote=null;continue;}
    if(['"',"'",'`'].includes(c)){quote=c;continue;}
    if(c===open)depth++;if(c===close)depth--;if(!depth)return vm.runInNewContext('('+source.slice(start,i+1)+')',{}, {timeout:1000});
  }
  throw Error('Dados incompletos: '+declaration);
}
const perfumes=literal('const PERFUMES =','[',']');
const guide=literal('const SKINCARE_GUIDE =','{','}');
const config=literal('const CONFIG =','{','}');
const clean=value=>(value||'').replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
const skincare=[...skinSource.matchAll(/<article class="skin-card([^"]*)">([\s\S]*?)<\/article>/g)].map(([,classes,card])=>{
  const name=clean(card.match(/<h3>([\s\S]*?)<\/h3>/)?.[1]);
  const description=clean(card.match(/<p(?![^>]*class="skin-brand")[^>]*>([\s\S]*?)<\/p>/)?.[1]);
  const price=clean(card.match(/<strong class="skin-price">([\s\S]*?)<\/strong>/)?.[1]).match(/R\$\s*([\d.,]+)/)?.[1];
  if(!name||!price)throw Error('Card de skincare incompleto');
  return {nome:name,marca:clean(card.match(/<p class="skin-brand">([\s\S]*?)<\/p>/)?.[1]),preco:Number(price.replace(/\./g,'').replace(',','.')),tamanho:description.split('·').at(-1).trim(),foto:card.match(/<img[^>]+src="([^"]+)"/)?.[1],desc:guide[name]?.serve||description,disponivel:!classes.includes('is-soldout'),tipo:'skincare'};
});
const decantSource=source.slice(source.indexOf('const DECANT_FRASCO ='),source.indexOf('const colNav ='));
const decants=vm.runInNewContext(decantSource+';DECANTS;', {PERFUMES:perfumes,estaDisponivel:p=>p&&p.disponivel!==false,temPreco:p=>typeof p.preco==='number'&&p.preco>0,ehBodySpray:p=>/body spray/i.test(p.nome)}, {timeout:1000});
const all=[...perfumes,...skincare,...decants];
const full=p=>`${p.marca} ${p.nome}`;
const wa=text=>`https://wa.me/${config.whatsapp}?text=${encodeURIComponent(text)}`;
const payment=p=>`<div class="card-payment"><span class="card-card-price">${S.money(Math.round(p.preco*104)/100)} no cartão</span><span class="card-pix-price"><strong>${S.money(p.preco)}</strong><span>no Pix</span></span><span class="card-installment">ou 3x de ${S.money(Math.round(p.preco*104)/100/3)} sem juros</span></div>`;
const mini=p=>`<article class="discovery-mini"><a href="${S.productURL(p)}"><img src="${esc(p.foto)}" alt="${esc(full(p))}" loading="lazy"><p class="eyebrow">${esc(p.marca)}</p><h3>${esc(p.nome)}</h3></a><p>${S.money(p.preco)} no Pix</p><a href="${S.productURL(p)}" class="discovery-text-link">Ver produto →</a></article>`;
await fs.mkdir(path.join(root,'produtos'),{recursive:true});
const urls=new Set();
for(const p of all){
  const relative=S.productURL(p),url=new URL(relative,site).href;
  if(urls.has(url))throw Error('URL duplicada: '+url);urls.add(url);
  await fs.access(path.join(root,p.foto.split("?")[0]));
  const available=p.disponivel!==false,description=p.desc||p.inspiracao||full(p),g=guide[p.nome];
  const direct=wa(available?`Olá, Duna! Tenho interesse no ${full(p)} (${p.decant?'3 ml · frasco incluso':p.tamanho}) — ${S.money(p.preco)} no Pix. Pode confirmar disponibilidade, frete e prazo?`:`Olá, Duna! Gostaria de saber quando ${full(p)} volta ao estoque.`);
  const schema={'@context':'https://schema.org','@type':'Product',name:full(p),description,image:[new URL(p.foto,site).href],brand:{'@type':'Brand',name:p.marca},sku:S.slug(full(p)),url,offers:{'@type':'Offer',url,priceCurrency:'BRL',price:Number(p.preco).toFixed(2),availability:'https://schema.org/'+(available?'InStock':'OutOfStock'),itemCondition:'https://schema.org/NewCondition',description:p.decant?'Preço no Pix para o decant de 3 ml, com frasco incluso. Frete a confirmar.':'Preço no Pix. Frete a confirmar.',seller:{'@type':'Organization',name:'Duna Fragrâncias'}}};
  const specs=p.tipo==='skincare'?`<div class="product-guide">${g?Object.entries({serve:'Para que serve',indicado:'Quando é indicado',quando:'Quando usar',ordem:'Como usar na rotina',cuidado:'Cuidados'}).map(([key,label])=>`<section><h2>${label}</h2><p>${esc(g[key])}</p></section>`).join(''):''}</div>`:`<dl class="product-specs">${[['Perfil',p.acorde||p.familia],['Gênero',p.genero],['Uso',p.periodo],['Intensidade',p.intensidade],['Topo',p.notas.topo],['Coração',p.notas.coracao],['Fundo',p.notas.fundo]].map(([label,value])=>`<div><dt>${label}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>`;
  const related=(p.tipo==='skincare'?skincare:perfumes).filter(x=>x.nome!==p.nome&&x.nome!==p.base&&x.disponivel!==false&&(p.tipo==='skincare'||x.familia===p.familia)).slice(0,3);
  const main=`<main class="product-page-main" id="conteudo"><div class="wrap"><p class="product-breadcrumb"><a href="index.html">Início</a> / <a href="${p.tipo==='skincare'?'skincare.html':p.decant?'catalogo.html?tipo=decants':'catalogo.html'}">${p.tipo==='skincare'?'Skincare':p.decant?'Decants':'Perfumes'}</a> / ${esc(p.nome)}</p><article class="product-layout" data-product-page="${esc(p.nome)}"><div class="product-image"><img src="${esc(p.foto)}" alt="${esc(full(p))}" fetchpriority="high"></div><div class="product-details"><p class="eyebrow">${esc(p.marca)}</p><h1>${esc(p.nome)}</h1><p class="product-stock">${available?'Disponível':'Esgotado'} · ${esc(p.decant?'3, 5 ou 10 ml · frasco incluso':p.tamanho)}</p><div data-product-price>${payment(p)}</div><div data-product-volumes></div><div class="product-buy"><button type="button" class="btn btn-gold" data-product-add hidden ${available?'':'disabled'}>${available?'Adicionar ao pedido':'Esgotado'}</button><a class="btn btn-line-dark" href="${esc(direct)}" data-product-wa target="_blank" rel="noopener">${available?'Conversar no WhatsApp':'Avise-me quando voltar'}</a></div><p class="product-delivery">Frete e prazo a confirmar. Informe seu CEP no pedido para receber a cotação pelo WhatsApp.</p><div data-product-controls></div><p class="product-desc">${esc(description)}</p>${specs}${p.tipo!=='skincare'&&!p.decant&&available&&!/body spray/i.test(p.nome)?`<a class="discovery-text-link" href="${S.productURL({...p,decant:true,base:p.nome})}">Experimente esta fragrância em decant →</a>`:''}${p.decant?'<button class="btn btn-line-dark" type="button" data-open-kit>Montar um kit com outras fragrâncias</button>':''}<div class="product-share"><button type="button" data-copy-product>Copiar link deste produto</button><input type="text" readonly hidden data-share-url aria-label="Link do produto para copiar"></div></div></article>${related.length?`<section class="product-related"><h2>Continue explorando</h2><div class="discovery-mini-grid">${related.map(mini).join('')}</div></section>`:''}</div></main>`;
  let html=shell.replace('<head>','<head>\n<base href="../">').replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(full(p))} · ${esc(p.tamanho)} | Duna Fragrâncias</title>`)
    .replace(/<meta name="description"[^>]*>/,`<meta name="description" content="${esc(description)}">`)
    .replace(/<link rel="canonical"[^>]*>/,`<link rel="canonical" href="${url}">`)
    .replace(/<meta property="og:title"[^>]*>/,`<meta property="og:title" content="${esc(full(p))} | Duna Fragrâncias">`)
    .replace(/<meta property="og:description"[^>]*>/,`<meta property="og:description" content="${esc(description)}">`)
    .replace(/<meta property="og:url"[^>]*>/,`<meta property="og:url" content="${url}">`)
    .replace(/<meta property="og:image"[^>]*>/,`<meta property="og:image" content="${new URL(p.foto,site).href}">`)
    .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/,`<script type="application/ld+json">${JSON.stringify(schema).replace(/</g,'\\u003c')}</script>`)
    .replace('class="catalog-page"','class="product-page"').replace(/<div id="preloader">[\s\S]*?<\/div>\s*<\/div>/,'');
  const start=html.indexOf('<section class="cat-header">'),end=html.indexOf('<!-- ===================== FOOTER');
  if(start<0||end<0)throw Error('Estrutura do catálogo mudou; revise o gerador.');
  html=html.slice(0,start)+main+'\n\n'+html.slice(end);
  await fs.writeFile(path.join(root,relative),html);
}
await fs.writeFile(path.join(root,'skincare-data.js'),'// Gerado por scripts/gerar-paginas-produtos.mjs. Edite skincare.html e o guia em app.js.\nglobalThis.DUNA_SKINCARE = '+JSON.stringify(skincare,null,2)+';\n');
const mapURLs=[site,new URL('catalogo',site).href,new URL('skincare',site).href,...urls];
await fs.writeFile(path.join(root,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+mapURLs.map(url=>`  <url><loc>${esc(url)}</loc></url>`).join('\n')+'\n</urlset>\n');
console.log(`${all.length} páginas geradas: ${perfumes.length} perfumes, ${skincare.length} skincare e ${decants.length} decants. Sitemap e dados de skincare atualizados.`);
