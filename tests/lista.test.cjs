const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const S=require('../shop-core.js');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
const perfumes=vm.runInNewContext('('+source.match(/const PERFUMES = (\[[\s\S]*?\n\]);/)[1]+')');
const lista=fs.readFileSync(path.join(root,'lista.html'),'utf8');
const itens=[...lista.matchAll(/<li class="li[^"]*"[^>]*>([\s\S]*?)<\/li>/g)].map(m=>m[0]);
const linha=url=>itens.find(li=>li.includes(`href="${url}"`));

test('lista de preços traz todos os perfumes com o preço e o estoque atuais de app.js',()=>{
  for(const p of perfumes){
    const li=linha(S.productURL(p));
    assert.ok(li,`${p.marca} ${p.nome} fora da lista; rode node scripts/gerar-paginas-produtos.mjs`);
    if(p.disponivel===false) assert.match(li,/Esgotado/,`${p.nome} deveria aparecer esgotado`);
    else{
      assert.ok(li.includes(S.money(p.preco)),`${p.nome}: preço no Pix diferente de app.js`);
      assert.ok(li.includes(S.money(S.cardPrice(p.preco))),`${p.nome}: preço no cartão diferente da regra de shop-core.js`);
    }
  }
});

test('lista de preços tem decants e skincare, e as regras de pagamento vêm de shop-core.js',()=>{
  const skincare=(lista.match(/<section class="lista-sec" id="skincare"[\s\S]*?<\/section>/)||[''])[0];
  assert.equal((skincare.match(/<li class="li/g)||[]).length,17);
  const decants=perfumes.filter(p=>p.disponivelDecant===true&&p.precoDecantBase>0&&!/body spray/i.test(p.nome));
  for(const p of decants) assert.ok(linha(S.productURL({...p,decant:true,base:p.nome})),`decant de ${p.nome} fora da lista`);
  assert.ok(lista.includes(`acréscimo de ${S.CARD_SURCHARGE_PCT}%`));
  assert.ok(lista.includes(S.money(S.BOTTLE_PRICE)));
  for(const t of S.DECANT_TIERS) assert.ok(lista.includes(`${Math.round(t.rate*100)}% OFF`));
});

test('índice e links da lista apontam para seções e arquivos existentes',()=>{
  for(const [,id] of lista.matchAll(/href="#([^"]+)"/g)) assert.ok(lista.includes(`id="${id}"`),`âncora #${id} sem seção`);
  for(const [,url] of lista.matchAll(/href="(produtos\/[^"]+)"/g)) assert.ok(fs.existsSync(path.join(root,url)),`${url} não existe`);
  for(const [,src] of lista.matchAll(/<img[^>]+src="([^"?]+)/g)) assert.ok(fs.existsSync(path.join(root,src)),`${src} não existe`);
  assert.match(lista,/href="duna-lista-de-precos\.pdf\?v=[0-9a-f]{10}"/);
  for(const [,href] of lista.matchAll(/href="(https:\/\/wa\.me\/[^"]+)"/g)) assert.ok(href.startsWith('https://wa.me/'+source.match(/whatsapp: "(\d+)"/)[1]+'?text='));
});
