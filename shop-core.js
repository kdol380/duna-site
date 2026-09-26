/* Regras compartilhadas entre catálogo, quiz, kits e testes. Sem dependências. */
(function(root){
  const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const slug = value => normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const escape = value => String(value ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const money = value => Number(value).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
  // Regras comerciais: fonte única. app.js, gerador de páginas e testes leem daqui.
  const CARD_SURCHARGE_PCT = 4;            // cartão = Pix + 4%
  const BOTTLE_PRICE = 8;                  // vidrinho de decant, qualquer volume
  const DECANT_TIERS = [{min:10,rate:.15},{min:5,rate:.10},{min:3,rate:.05}]; // desconto no líquido por qtd de decants
  const cardPrice = value => Math.round(Number(value)*(100+CARD_SURCHARGE_PCT))/100;
  const decantRate = qty => (DECANT_TIERS.find(t=>qty>=t.min)||{rate:0}).rate;
  const budget = value => Number.isFinite(Number(value)) && Number(value)>0 ? Number(value) : null;
  const matchesBudget = (product, max, payment="pix") => !budget(max) || (typeof product.preco==="number" && product.preco>0 && (payment==="cartao" ? cardPrice(product.preco) : product.preco)<=budget(max));
  const cep = value => String(value || "").replace(/\D/g, "");
  const validCEP = value => /^\d{5}-?\d{3}$/.test(String(value || "").trim()) && !/^(\d)\1{7}$/.test(cep(value));
  const formatCEP = value => cep(value).slice(0,8).replace(/^(\d{5})(\d)/, "$1-$2");
  const productURL = product => `produtos/${slug((product.marca ? product.marca+" " : "")+(product.decant ? product.base+" Decant" : product.nome))}.html`;
  function orderSummary(entries, bottle=BOTTLE_PRICE){
    let outros=0, liquidoDecants=0, frascosDecants=0, qtdDecants=0;
    for(const {product:p,quantity:q} of entries){
      if(!p || !Number.isInteger(q) || q<1 || !(p.preco>0)) continue;
      if(p.decant && Number.isFinite(p.precoLiquido)){
        qtdDecants+=q; liquidoDecants+=p.precoLiquido*q; frascosDecants+=bottle*q;
      }else outros+=p.preco*q;
    }
    const taxa = decantRate(qtdDecants);
    const descontoDecants=Math.round(liquidoDecants*taxa);
    return {outros,liquidoDecants,frascosDecants,qtdDecants,taxa,descontoDecants,total:outros+liquidoDecants+frascosDecants-descontoDecants};
  }
  function rankProducts(products, answers){
    const scale=["suave","equilibrado","marcante","potente"];
    return products.filter(p=>p.disponivel!==false && !/body spray/i.test(p.nome) && matchesBudget(p, answers.budget) && (answers.gen==="Tanto faz" || p.genero===answers.gen || p.genero==="Unissex"))
      .map(p=>{
        let score=p.genero===answers.gen ? 6 : 4;
        const reasons=[];
        if(p.familia===answers.fam){score+=5; reasons.push(`Família ${p.familia.toLowerCase()}, como você escolheu.`);}
        const distance=Math.abs(scale.indexOf(p.intensidade)-scale.indexOf(answers.int));
        if(distance===0){score+=3;reasons.push(`Intensidade ${p.intensidade}, conforme sua preferência.`);}else if(distance===1) score+=1.5;
        if(p.ocasiao===answers.occ){score+=2; reasons.push("Ocasião de uso compatível com a sua escolha.");}
        else if(["dia","trabalho"].includes(answers.occ) && p.periodo==="Versátil"){score+=.5; reasons.push("Perfil versátil para acompanhar a rotina.");}
        if(budget(answers.budget)) reasons.push(`Dentro do seu limite de ${money(answers.budget)} no Pix.`);
        if(!reasons.length) reasons.push("Uma alternativa disponível para o perfil escolhido; confira as notas antes de decidir.");
        return {p,score,reasons};
      }).sort((a,b)=>b.score-a.score || (a.p.preco||Infinity)-(b.p.preco||Infinity) || a.p.nome.localeCompare(b.p.nome,"pt-BR"));
  }
  const api={CARD_SURCHARGE_PCT,BOTTLE_PRICE,DECANT_TIERS,cardPrice,decantRate,normalize,slug,escape,money,budget,matchesBudget,cep,validCEP,formatCEP,productURL,orderSummary,rankProducts};
  root.DunaShop=api;
  if(typeof module!=="undefined") module.exports=api;
})(typeof globalThis!=="undefined" ? globalThis : this);
