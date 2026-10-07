const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const app = fs.readFileSync(path.join(root,'app.js'),'utf8');
const skin = fs.readFileSync(path.join(root,'skincare.html'),'utf8');
const links = JSON.parse(fs.readFileSync(path.join(root,'dados/central-vinculos.json')));
const S = require('../shop-core.js');
const lib = import('../scripts/lib/central-sync.mjs');
async function fixture() {
  const {perfumeLiteral} = await lib;
  const perfumes = perfumeLiteral(app).products;
  const ctx={};vm.runInNewContext(fs.readFileSync(path.join(root,'skincare-data.js'),'utf8'),ctx);
  const all=[...perfumes,...ctx.DUNA_SKINCARE];
  return {version:1,products:links.map(l=>{
    const p=all.find(p=>p.nome===l.nome);
    assert.ok(p,l.nome);
    return {id:l.id,price:p.preco,available:p.disponivel!==false};
  })};
}
function decants(source) {
  const perfumes=vm.runInNewContext('('+source.match(/const PERFUMES = (\[[\s\S]*?\n\]);/)[1]+')');
  const code=source.slice(source.indexOf('const DECANT_FRASCO ='),source.indexOf('const colNav ='));
  return JSON.parse(JSON.stringify(vm.runInNewContext(code+';DECANTS.map(p=>({nome:p.nome,preco:p.preco,disponivel:p.disponivel,opcoes:p.opcoes}))',{DunaShop:S,PERFUMES:perfumes,ehBodySpray:p=>/body spray/i.test(p.nome)})));
}
test('vínculos cobrem 107 IDs únicos e lote sem mudanças não reescreve arquivos',async()=>{
  const {synchronize}=await lib;
  const result=synchronize(app,skin,links,await fixture());
  assert.equal(links.length,107);assert.equal(new Set(links.map(l=>l.id)).size,107);
  assert.equal(result.app,app);assert.equal(result.skin,skin);assert.equal(result.changes.length,0);
});
test('preço com centavos e estoque zero alteram só dados comerciais; decants permanecem iguais',async()=>{
  const {synchronize,perfumeLiteral}=await lib,payload=await fixture();
  const link=links.find(l=>l.nome==='Divine');
  Object.assign(payload.products.find(p=>p.id===link.id),{price:479.9,available:false});
  const result=synchronize(app,skin,links,payload);
  const p=perfumeLiteral(result.app).products.find(p=>p.nome==='Divine');
  assert.equal(p.preco,479.9);assert.equal(p.disponivel,false);
  assert.deepEqual(decants(result.app),decants(app));
  assert.equal(result.skin,skin);assert.equal(result.changes.length,1);
  const before=perfumeLiteral(app).products.find(p=>p.nome==='Divine');
  assert.equal(JSON.stringify({...p,preco:before.preco,disponivel:before.disponivel}),JSON.stringify(before));
});
test('skincare esgota e repõe com botão, selo, preço e centavos coerentes',async()=>{
  const {synchronize}=await lib,payload=await fixture();
  const link=links.find(l=>l.nome==='Deep Vita C Pad');
  const row=payload.products.find(p=>p.id===link.id);
  Object.assign(row,{price:199.9,available:false});
  const zero=synchronize(app,skin,links,payload);
  assert.match(zero.skin,/<s>R\$ 199,90<\/s> · Esgotado/);
  assert.match(zero.skin,/data-product="Medicube Deep Vita C Pad"/);
  row.available=true;
  const replenished=synchronize(zero.app,zero.skin,links,payload);
  assert.match(replenished.skin,/<strong class="skin-price">R\$ 199,90<\/strong><button/);
  assert.doesNotMatch(replenished.skin,/data-product="Medicube Deep Vita C Pad"/);
});
test('respostas vazias, incompletas, duplicadas, extras e preços inválidos impedem toda a publicação',async()=>{
  const {synchronize}=await lib;
  for(const price of [0,-1,null,'199',NaN,Infinity,1.123]) {
    const p=await fixture();p.products[0].price=price;
    assert.throws(()=>synchronize(app,skin,links,p));
  }
  for(const mutate of [p=>p.products.pop(),p=>p.products.push(p.products[0]),p=>p.products.push({id:'novo',price:123,available:true}),p=>p.products=[],p=>p.version=2,p=>p.products[0].available=null]) {
    const p=await fixture();mutate(p);assert.throws(()=>synchronize(app,skin,links,p));
  }
  assert.throws(()=>synchronize(app,skin,[...links,links[0]],{version:1,products:[]}));
});
test('nomes da Central não alteram identidade, descrições nem fotos do site',async()=>{
  const {synchronize}=await lib,payload=await fixture();
  payload.products.forEach(p=>{p.name='nome alterado';p.brand='outra marca';});
  assert.equal(synchronize(app,skin,links,payload).app,app);
});
