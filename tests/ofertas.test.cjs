const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),S=require('../shop-core.js');
const source=fs.readFileSync('app.js','utf8');
const perfumes=vm.runInNewContext('('+source.match(/const PERFUMES = (\[[\s\S]*?\n\]);/)[1]+')');
const decants=vm.runInNewContext(source.slice(source.indexOf('const DECANT_FRASCO ='),source.indexOf('const colNav ='))+';DECANT_VARIANTS',{DunaShop:S,PERFUMES:perfumes,ehBodySpray:p=>/body spray/i.test(p.nome)});
test('ofertas têm os quatro valores aprovados e percentuais conservadores',()=>{
 const expected=[['Club de Nuit Elite',439,20],['Emeer',249,19],['La Vivacité',209,12],['La Vivacité Intensa',169,15]];
 assert.equal(perfumes.filter(S.promotion).length,4);
 for(const [name,price,percent] of expected){const p=perfumes.find(x=>x.nome===name);assert.equal(p.preco,price);assert.equal(S.promotion(p).percent,percent);assert.equal(S.promotion({...p,preco:price+1}),null);assert.equal(S.promotion({...p,disponivel:false}),null);}
});
test('os três tamanhos recebem o desconto exato, sem descontar duas vezes no carrinho',()=>{
 for(const d of decants){const p=perfumes.find(p=>p.nome===d.base);const cfg={3:0,5:.05,10:.1};const factor=p.precoDecantBase>=500?.014:p.precoDecantBase>=400?.015:.0165;const old=Math.round(p.precoDecantBase*factor*d.decantMl*(1-cfg[d.decantMl]))+8;const expected=Math.round(old*(1-(p.descontoDecant||0))*100)/100;
 assert.equal(d.preco,expected);assert.ok(Math.abs(d.precoLiquido+8-d.preco)<1e-8);assert.equal(S.orderSummary([{product:d,quantity:1}]).total,expected);
 if(p.descontoDecant)assert.equal(S.promotion(d).percent,p.descontoDecant*100);else assert.equal(S.promotion(d),null);
 }
});
