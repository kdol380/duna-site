const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const S=require('../shop-core.js');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const perfumes=vm.runInNewContext('('+source.match(/const PERFUMES = (\[[\s\S]*?\n\]);/)[1]+')');

test('orçamento distingue Pix e total no cartão, incluindo o limite exato',()=>{
  assert.equal(S.matchesBudget({preco:100},100),true);
  assert.equal(S.matchesBudget({preco:100},100,'cartao'),false);
  assert.equal(S.matchesBudget({preco:100},104,'cartao'),true);
  assert.equal(S.matchesBudget({preco:null},250),false);
  assert.equal(S.matchesBudget({preco:500},null),true);
  assert.equal(S.budget('Infinity'),null);
});

test('kits aplicam desconto apenas ao líquido e preservam outros produtos',()=>{
  const product={decant:true,precoLiquido:20,preco:28};
  for(const [quantity,discount] of [[2,0],[3,3],[4,4],[5,10],[9,18],[10,30]]){
    const r=S.orderSummary([{product,quantity},{product:{preco:100},quantity:1}]);
    assert.equal(r.descontoDecants,discount);
    assert.equal(r.frascosDecants,quantity*8);
    assert.equal(r.total,100+quantity*28-discount);
  }
});

test('kit novo recalcula faixa junto aos decants já existentes',()=>{
  const product={decant:true,precoLiquido:20,preco:28};
  const result=S.orderSummary([{product,quantity:2},{product,quantity:3}]);
  assert.equal(result.taxa,.10);assert.equal(result.total,130);
});

test('centenas de perfis do quiz nunca ultrapassam orçamento nem recomendam esgotado ou body spray',()=>{
  let cases=0;
  for(const gen of ['Masculino','Feminino','Tanto faz'])for(const fam of ['Amadeirado','Floral','Gourmand','Cítrico'])for(const intensity of ['suave','equilibrado','marcante','potente'])for(const occ of ['dia','trabalho','noite','especial'])for(const budget of [150,250,400,null]){
    const result=S.rankProducts(perfumes,{gen,fam,int:intensity,occ,budget});cases++;
    for(const {p,reasons} of result){assert.notEqual(p.disponivel,false);assert.doesNotMatch(p.nome,/body spray/i);assert.ok(S.matchesBudget(p,budget));assert.ok(gen==='Tanto faz'||p.genero===gen||p.genero==='Unissex');assert.ok(reasons.length>0);}
  }
  assert.equal(cases,768);
});

test('quiz lida com ausência de estoque ou limite impossível sem excedê-lo',()=>{
  assert.deepEqual(S.rankProducts([],{gen:'Tanto faz',budget:100}),[]);
  assert.equal(S.rankProducts(perfumes,{gen:'Tanto faz',budget:1}).length,0);
});

test('CEP valida formato e rejeita entradas incompletas sem simular cotação',()=>{
  assert.ok(S.validCEP('01310-100'));assert.ok(S.validCEP('01310100'));
  assert.equal(S.validCEP('123'),false);assert.equal(S.validCEP('00000-000'),false);
  assert.equal(S.validCEP('cep01310100'),false);assert.equal(S.formatCEP('01310100'),'01310-100');
});

test('páginas próprias têm conteúdo inicial, canonical, imagem e oferta coerentes',()=>{
  const names=fs.readdirSync(path.join(root,'produtos')).filter(n=>n.endsWith('.html'));
  assert.equal(names.length,168);
  const seen=new Set();
  for(const name of names){
    const html=fs.readFileSync(path.join(root,'produtos',name),'utf8');
    const data=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    assert.ok(html.includes('<base href="../">'));assert.ok(html.includes('<h1>'));
    assert.ok(!html.includes('id="preloader"'));assert.ok(html.includes('data-product-page='));
    assert.ok(!seen.has(data.url));seen.add(data.url);
    assert.ok(Number(data.offers.price)>0);assert.equal(data.offers.priceCurrency,'BRL');
    assert.ok(html.includes('rel="canonical" href="'+data.url+'"'));
    assert.ok(fs.existsSync(path.join(root,new URL(data.image[0]).pathname)));
    const original=perfumes.find(p=>data.name===p.marca+' '+p.nome);
    if(original){assert.equal(Number(data.offers.price),original.preco);assert.equal(data.offers.availability.endsWith('OutOfStock'),original.disponivel===false);}
  }
  const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
  for(const url of seen)assert.ok(sitemap.includes(url));
});

test('links estáticos e imagens de páginas geradas resolvem sob a raiz do site',()=>{
  for(const name of fs.readdirSync(path.join(root,'produtos'))){
    const html=fs.readFileSync(path.join(root,'produtos',name),'utf8');
    for(const [,value] of html.matchAll(/(?:src|href)="([^"]+)"/g)){
      if(/^(https?:|#|data:)/.test(value)||value==='../')continue;
      const local=value.split(/[?#]/)[0];if(!local)continue;
      assert.ok(fs.existsSync(path.join(root,local)),`${name}: ${value}`);
    }
  }
});

test('textos fixos das páginas batem com as regras de shop-core.js',()=>{
  const catalogo=fs.readFileSync(path.join(root,'catalogo.html'),'utf8');
  const skincare=fs.readFileSync(path.join(root,'skincare.html'),'utf8');
  // faixas de desconto mostradas no catálogo
  const faixas=[...catalogo.matchAll(/<b>(\d+)[^<]*<\/b><em>(\d+)% OFF<\/em>/g)].map(m=>({min:+m[1],rate:+m[2]/100}));
  assert.deepEqual(faixas.sort((a,b)=>b.min-a.min),S.DECANT_TIERS,'faixas em catalogo.html diferentes de DECANT_TIERS');
  // mensagens de progresso do carrinho usam os mesmos limites
  for(const {min} of S.DECANT_TIERS) assert.match(source,new RegExp(`qtd<${min}\\b`),`app.js sem limite ${min} nas mensagens de progresso`);
  // preço do vidrinho escrito no catálogo
  for(const m of catalogo.matchAll(/vidrinho[^.]*?R\$ ?(\d+)/g)) assert.equal(+m[1],S.BOTTLE_PRICE,'preço do vidrinho em catalogo.html');
  // quantidade de skincare
  const cards=(skincare.match(/class="skin-card/g)||[]).length;
  assert.match(skincare,new RegExp(`>${cards} produtos de skincare<`),'contagem em skincare.html');
  assert.match(source,new RegExp(`"${cards} produtos de skincare"`),'contagem de skincare em app.js');
  // cartão = Pix + 4%, sem erro de arredondamento
  assert.equal(S.cardPrice(100),104); assert.equal(S.cardPrice(279),290.16);
});
