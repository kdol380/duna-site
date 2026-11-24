const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),S=require('../shop-core.js');
const source=fs.readFileSync('app.js','utf8');
const perfumes=vm.runInNewContext('('+source.match(/const PERFUMES = (\[[\s\S]*?\n\]);/)[1]+')');
const decants=vm.runInNewContext(source.slice(source.indexOf('const DECANT_FRASCO ='),source.indexOf('const colNav ='))+';DECANT_VARIANTS',{DunaShop:S,PERFUMES:perfumes,ehBodySpray:p=>/body spray/i.test(p.nome)});
test('ofertas têm os quatro valores aprovados e percentuais conservadores',()=>{
 const expected=[['Club de Nuit Elite',439,20],['Emeer',249,19],['La Vivacité',209,12],['La Vivacité Intensa',169,15]];
 // A Central pode esgotar ou reprecificar um perfume em oferta. Isso só suspende o destaque dele; não pode travar a sincronização.
 const ativa=([name,price])=>{const p=perfumes.find(x=>x.nome===name);return p.disponivel!==false&&p.preco===price;};
 assert.equal(perfumes.filter(S.promotion).map(p=>p.nome).sort().join(' | '),expected.filter(ativa).map(([name])=>name).sort().join(' | '));
 for(const [name,price,percent] of expected){const p=perfumes.find(x=>x.nome===name);assert.equal(p.precoPromocional,price);assert.equal(S.promotion({...p,preco:price,disponivel:true}).percent,percent);assert.equal(S.promotion({...p,preco:price+1}),null);assert.equal(S.promotion({...p,disponivel:false}),null);}
});
test('régua de decants: preço por ml do frasco, ml mais caro nos tamanhos menores, promoções e desconto único preservados',()=>{
 const pesos={3:1.5,5:1.25,10:1};
 const ml=p=>{const m=String(p.tamanho||'').match(/(\d+(?:[.,]\d+)?)\s*ml/i);return m?Number(m[1].replace(',','.')):100;};
 const mult=v=>v<=3.5?1.8:v>=6?1.4:1.8-.16*(v-3.5);
 for(const d of decants){const p=perfumes.find(p=>p.nome===d.base);const v=p.precoDecantBase/ml(p);const cheio=Math.round(v*mult(v)*pesos[d.decantMl]*d.decantMl)+8;const expected=p.descontoDecant?Math.round(cheio*(1-p.descontoDecant)):cheio;
 assert.equal(d.preco,expected);assert.ok(Math.abs(d.precoLiquido+8-d.preco)<1e-8);assert.equal(S.orderSummary([{product:d,quantity:1}]).total,expected);
 if(p.descontoDecant)assert.equal(S.promotion(d).percent,Math.floor((1-d.preco/d.precoAnterior)*100+1e-8));else assert.equal(S.promotion(d),null);
 }
 // Quanto menor o decant, mais caro o ml: o 5 ml custa mais que metade do 10 ml, e o 3 ml mais que 3/10 dele.
 const porBase=new Map();for(const d of decants){if(!porBase.has(d.base))porBase.set(d.base,{});porBase.get(d.base)[d.decantMl]=d.precoLiquido;}
 for(const [base,v] of porBase){assert.ok(v[5]/5>v[10]/10,base+' 5 ml');assert.ok(v[3]/3>v[5]/5,base+' 3 ml');}
 // Frasco mais caro por ml nunca gera decant mais barato.
 for(let x=1;x<12;x+=.01)assert.ok((x+.01)*mult(x+.01)>=x*mult(x)-1e-9);
});
