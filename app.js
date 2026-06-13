/* =====================================================================
   ⚙️  CONFIGURAÇÃO  —  TROQUE AQUI (e só aqui)
   ===================================================================== */
const CONFIG = {
  // TROCAR: número do WhatsApp no formato internacional, só dígitos (55 + DDD + número)
  whatsapp: "5533991106555",
  // Mensagem padrão para o botão geral
  msgGeral: "Olá, Duna! Vim pelo site e quero saber mais sobre os perfumes. 🌙"
};

// preferência global de movimento reduzido (usada por todos os efeitos)
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =====================================================================
   📦  CATÁLOGO  —  fictício realista (edite à vontade)
   campos: nome, inspiracao, familia, genero, periodo, ocasiao,
           intensidade, preco, tamanho, notas {topo, coracao, fundo},
           accent, selo
   campo opcional: foto:"assets/nome-do-arquivo.png"  → mostra a FOTO
           real do frasco no lugar do desenho.
   ===================================================================== */
// preco: null  →  mostra "Sob consulta" (troque pelo valor, ex: preco:199, quando tiver os preços)
const PERFUMES = [
  { nome:"Club de Nuit Intense Man", marca:"Armaf", inspiracao:"inspiração amadeirada frutada esfumada", familia:"Amadeirado", genero:"Masculino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"marcante", preco:null, tamanho:"105 ml · EDT", selo:"Ícone",
    notas:{ topo:"Abacaxi · Limão · Cassis", coracao:"Bétula · Jasmim · Rosa", fundo:"Âmbar · Almíscar · Baunilha" },
    accent:"#5a5238", desc:"O fenômeno árabe: abacaxi esfumado sobre madeiras nobres. Presença viril e elegante que rende elogios o dia inteiro.",
    /* foto:"assets/club-de-nuit-intense.png"  ← descomente e ponha a foto na pasta assets/ */ },

  { nome:"Club de Nuit Maleka", marca:"Armaf", inspiracao:"inspiração floral amadeirada", familia:"Floral", genero:"Feminino", periodo:"Noite",
    ocasiao:"especial", intensidade:"marcante", preco:null, tamanho:"100 ml · EDP", selo:"Para a noite",
    notas:{ topo:"Açafrão · Lichia · Bergamota", coracao:"Rosa · Jasmim · Gerânio", fundo:"Oud · Sândalo · Baunilha" },
    accent:"#9e4a63", desc:"Uma rainha em forma de perfume: rosa luxuosa e açafrão sobre madeiras. Feminino marcante e sofisticado." },

  { nome:"Odyssey Homme White Edition", marca:"Armaf", inspiracao:"inspiração fresca amadeirada", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:null, tamanho:"100 ml · EDP", selo:"Versátil",
    notas:{ topo:"Maçã Verde · Bergamota · Abacaxi", coracao:"Gerânio · Lavanda · Rosa", fundo:"Âmbar · Almíscar · Madeiras" },
    accent:"#7a8a93", desc:"Fresco, limpo e moderno. Frutado-amadeirado que veste bem do trabalho ao fim de tarde." },

  { nome:"Turathi Blue", marca:"Afnan", inspiracao:"inspiração aromática fresca", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"dia", intensidade:"equilibrado", preco:null, tamanho:"90 ml · EDP", selo:"Fresco",
    notas:{ topo:"Abacaxi · Bergamota · Limão", coracao:"Lavanda · Gerânio · Jasmim", fundo:"Patchouli · Âmbar · Almíscar" },
    accent:"#2f5a73", desc:"Azul, vibrante e arejado. Frescor cítrico com fundo amadeirado — coringa para o dia a dia." },

  { nome:"Turathi Electric", marca:"Afnan", inspiracao:"inspiração fresca adocicada", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"dia", intensidade:"equilibrado", preco:null, tamanho:"90 ml · EDP", selo:"Novidade",
    notas:{ topo:"Bergamota · Maçã · Hortelã", coracao:"Lavanda · Gerânio · Especiarias", fundo:"Âmbar · Almíscar · Madeiras" },
    accent:"#2d6c8c", desc:"Energia em frasco: fresco com um toque doce e elétrico. Jovem, versátil e com boa projeção." },

  { nome:"Vulcan Feu", marca:"French Avenue", inspiracao:"inspiração amadeirada especiada", familia:"Amadeirado", genero:"Masculino", periodo:"Noite",
    ocasiao:"noite", intensidade:"marcante", preco:null, tamanho:"100 ml · EDP", selo:"Masculino",
    notas:{ topo:"Especiarias · Bergamota · Pimenta", coracao:"Lavanda · Gerânio · Canela", fundo:"Âmbar · Madeiras · Baunilha" },
    accent:"#8a3b1e", desc:"Quente e magnético como o fogo. Especiarias e madeiras âmbar para noites de presença marcante." },

  { nome:"Thunder", marca:"French Avenue", inspiracao:"inspiração aromática amadeirada", familia:"Amadeirado", genero:"Masculino", periodo:"Noite",
    ocasiao:"noite", intensidade:"marcante", preco:null, tamanho:"100 ml · EDP", selo:"Marcante",
    notas:{ topo:"Bergamota · Pimenta Rosa · Cardamomo", coracao:"Lavanda · Gerânio · Sálvia", fundo:"Âmbar · Cedro · Patchouli" },
    accent:"#4a4a6a", desc:"Tempestade contida: aromático intenso com madeiras âmbar. Confiante e impossível de ignorar." },

  { nome:"Fakhar (Gold)", marca:"Lattafa", inspiracao:"inspiração floral frutada", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"trabalho", intensidade:"equilibrado", preco:null, tamanho:"100 ml · EDP", selo:"Feminino",
    notas:{ topo:"Frutas · Bergamota · Pera", coracao:"Jasmim · Rosa · Flor de Laranjeira", fundo:"Baunilha · Almíscar · Madeiras" },
    accent:"#c2a24e", desc:"Floral frutado luminoso e elegante. Doçura suave e refinada, do escritório ao jantar." },

  { nome:"Fakhar (Black)", marca:"Lattafa", inspiracao:"inspiração amadeirada especiada", familia:"Amadeirado", genero:"Masculino", periodo:"Noite",
    ocasiao:"noite", intensidade:"marcante", preco:null, tamanho:"100 ml · EDP", selo:"Masculino",
    notas:{ topo:"Maçã · Canela · Especiarias", coracao:"Lavanda · Gerânio · Noz-moscada", fundo:"Âmbar · Baunilha · Madeiras" },
    accent:"#3a322a", desc:"Especiado, âmbar e viciante. Masculino quente com ótima fixação para a noite." },

  { nome:"Nebras Pride", marca:"Lattafa", inspiracao:"inspiração âmbar adocicada", familia:"Gourmand", genero:"Unissex", periodo:"Versátil",
    ocasiao:"noite", intensidade:"marcante", preco:null, tamanho:"100 ml · EDP", selo:"Doce",
    notas:{ topo:"Frutas · Especiarias · Bergamota", coracao:"Flores · Canela · Âmbar", fundo:"Baunilha · Almíscar · Madeiras" },
    accent:"#9a6a2a", desc:"Âmbar doce e acolhedor, com brilho frutado. Unissex envolvente que aquece a pele." },

  { nome:"Zimaya Tiramisu Caramel", marca:"Lattafa", inspiracao:"inspiração gourmand", familia:"Gourmand", genero:"Unissex", periodo:"Noite",
    ocasiao:"noite", intensidade:"marcante", preco:null, tamanho:"100 ml · EDP", selo:"Gourmand",
    notas:{ topo:"Café · Caramelo", coracao:"Tiramisù · Creme · Baunilha", fundo:"Fava Tonka · Madeiras · Almíscar" },
    accent:"#8a5a2c", desc:"Uma sobremesa vestível: café, caramelo e creme de tiramisù. Doce, cremoso e absurdamente convidativo." },

  { nome:"Delilah", marca:"Maison Alhambra", inspiracao:"inspiração floral frutada", familia:"Floral", genero:"Feminino", periodo:"Versátil",
    ocasiao:"especial", intensidade:"marcante", preco:null, tamanho:"100 ml · EDP", selo:"Feminino",
    notas:{ topo:"Lichia · Ruibarbo · Bergamota", coracao:"Rosa Turca · Peônia", fundo:"Baunilha · Almíscar · Cashmeran" },
    accent:"#b06a85", desc:"Floral rosado, doce e radiante. Feminino moderno e elogiadíssimo — sofisticado em qualquer ocasião." },

  { nome:"Salvo", marca:"Maison Alhambra", inspiracao:"inspiração fresca especiada", familia:"Cítrico", genero:"Masculino", periodo:"Versátil",
    ocasiao:"dia", intensidade:"equilibrado", preco:null, tamanho:"100 ml · EDP", selo:"Coringa",
    notas:{ topo:"Bergamota · Pimenta · Limão", coracao:"Lavanda · Gerânio · Pimenta de Sichuan", fundo:"Ambroxan · Cedro · Labdano" },
    accent:"#3a6a8a", desc:"Fresco, picante e seguro. O versátil que agrada todo mundo — do dia ao trabalho, sempre limpo." },

  { nome:"Alpine Man Sport", marca:"Maison Alhambra", inspiracao:"inspiração fresca aquática", familia:"Cítrico", genero:"Masculino", periodo:"Dia",
    ocasiao:"dia", intensidade:"suave", preco:null, tamanho:"100 ml · EDP", selo:"Dia a dia",
    notas:{ topo:"Bergamota · Maçã · Notas Marinhas", coracao:"Gerânio · Jasmim · Especiarias", fundo:"Almíscar · Cedro · Âmbar" },
    accent:"#3f7a6a", desc:"Esportivo e revigorante. Frescor aquático leve para o calor e o uso de todo dia." },

  { nome:"Rayhaan Elixir", marca:"Rasasi", inspiracao:"inspiração âmbar adocicada", familia:"Gourmand", genero:"Unissex", periodo:"Noite",
    ocasiao:"especial", intensidade:"potente", preco:null, tamanho:"100 ml · EDP", selo:"Assinatura",
    notas:{ topo:"Frutas · Açafrão · Especiarias", coracao:"Rosa · Âmbar · Flores", fundo:"Baunilha · Oud · Madeiras" },
    accent:"#7a3a2a", desc:"Elixir oriental rico e opulento. Âmbar doce e especiarias com presença que não passa despercebida." }
];

/* =====================================================================
   🔗  WHATSAPP — montador de links
   ===================================================================== */
function waLink(msg){
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(msg);
}

/* ---- Preço: trata "Sob consulta" quando preco é null/0 ---- */
function temPreco(p){ return typeof p.preco === "number" && p.preco > 0; }
// rótulo para o card/quick-view (com <small>R$</small>)
function precoHTML(p){ return temPreco(p) ? `<small>R$</small> ${p.preco}` : `<span class="preco-consulta">Sob consulta</span>`; }
// texto puro para mensagens do WhatsApp
function precoTxt(p){ return temPreco(p) ? `R$ ${p.preco}` : "valor a combinar"; }
// nome com marca, para mensagens
function nomeCompleto(p){ return p.marca ? `${p.marca} ${p.nome}` : p.nome; }

function waProduto(p){
  return waLink(`Olá, Duna! Tenho interesse no *${nomeCompleto(p)}* (${p.tamanho}) — ${precoTxt(p)}. Ainda está disponível? 🌙`);
}
// liga os botões fixos de WhatsApp (só os que existirem na página)
["waNav","waHero","waBottom","waFloat","waFoot1","waFoot2","waMobile"].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.href = waLink(CONFIG.msgGeral);
});

/* =====================================================================
   🧴  FRASCO — foto do produto ou SVG line-art dourado
   ===================================================================== */
function frascoVisual(p){
  return p.foto
    ? `<img src="${p.foto}" alt="Perfume ${p.nome}" loading="lazy" />`
    : bottleSVG(p.accent);
}
function bottleSVG(accent){
  return `<svg viewBox="0 0 120 200" aria-hidden="true">
    <defs>
      <linearGradient id="g${accent.replace('#','')}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${accent}" stop-opacity=".30"/>
        <stop offset="1" stop-color="${accent}" stop-opacity=".06"/>
      </linearGradient>
    </defs>
    <path d="M34 70 h52 a6 6 0 0 1 6 6 v96 a18 18 0 0 1 -18 18 h-34 a18 18 0 0 1 -18 -18 v-96 a6 6 0 0 1 6 -6 z" fill="url(#g${accent.replace('#','')})"/>
    <g fill="none" stroke="#B08A3C" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
      <path d="M34 70 h52 a6 6 0 0 1 6 6 v96 a18 18 0 0 1 -18 18 h-34 a18 18 0 0 1 -18 -18 v-96 a6 6 0 0 1 6 -6 z"/>
      <path d="M48 70 v-14 h24 v14"/>
      <rect x="50" y="40" width="20" height="16" rx="2"/>
      <path d="M54 40 v-8 h12 v8"/>
    </g>
    <path d="M44 86 q-4 30 0 80" stroke="#CDAB63" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>
    <circle cx="60" cy="132" r="15" fill="none" stroke="#CDAB63" stroke-width="1.5" opacity=".8"/>
    <path d="M60 124 c3 3 3 6 0 8 c-3-2-3-5 0-8z" fill="#B08A3C" opacity=".8"/>
  </svg>`;
}

/* =====================================================================
   ✨  SCROLL REVEAL  (definido cedo: usado pelo renderGrid)
   ===================================================================== */
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){ en.target.classList.add("in"); revealObserver.unobserve(en.target); }
  });
}, { threshold:.12, rootMargin:"0px 0px -8% 0px" });
function initReveal(){ document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el)); }

/* =====================================================================
   🗂️  RENDER DA COLEÇÃO + FILTROS
   (funciona na home como PRÉVIA [data-limit] e na página catálogo)
   ===================================================================== */
const grid = document.getElementById("grid");
const filtersWrap = document.getElementById("filters");
const countEl = document.getElementById("catCount"); // contador opcional (página catálogo)

const familiasUnicas = Array.from(new Set(PERFUMES.map(p=>p.familia)));
const GRUPOS = [
  { key:"genero",  label:"Gênero",          opts:["Todos","Masculino","Feminino","Unissex"] },
  { key:"periodo", label:"Ocasião",         opts:["Todas","Dia","Noite","Versátil"] },
  { key:"familia", label:"Família olfativa", opts:["Todas", ...familiasUnicas], secondary:true }
];
const sel = { genero:"Todos", periodo:"Todas", familia:"Todas" };

if(filtersWrap){
  filtersWrap.innerHTML = GRUPOS.map(g=>`
    <div class="filter-group ${g.secondary?'filter-secondary':''}" data-group="${g.key}">
      <span class="filter-label">${g.label}</span>
      ${g.opts.map((o,i)=>`<button class="chip ${i===0?'active':''}" data-val="${o}">${o}</button>`).join("")}
    </div>`).join("");

  filtersWrap.addEventListener("click", e=>{
    const btn = e.target.closest(".chip");
    if(!btn) return;
    const grupo = btn.closest(".filter-group").dataset.group;
    sel[grupo] = btn.dataset.val;
    btn.closest(".filter-group").querySelectorAll(".chip").forEach(c=>c.classList.toggle("active", c===btn));
    renderGrid();
  });
}

function cardHTML(p,i){
  return `
  <article class="card reveal" data-d="${(i%4)+1}" data-nome="${p.nome}" tabindex="0" role="button" aria-label="Ver detalhes de ${p.nome}">
    <div class="card-glare"></div>
    <div class="card-corner"><span></span><span></span><span></span><span></span></div>
    <div class="card-top">
      <span class="card-pill pill-solid">${p.genero}</span>
      <span class="card-pill pill-line">${p.periodo}</span>
    </div>
    <div class="bottle">${frascoVisual(p)}</div>
    ${p.marca ? `<p class="card-brand">${p.marca}</p>` : ""}
    <h3 class="card-name">${p.nome}</h3>
    <p class="card-fam">${p.familia} · ${p.inspiracao}</p>
    <dl class="notes">
      <div class="note-row"><dt>Topo</dt><dd>${p.notas.topo}</dd></div>
      <div class="note-row"><dt>Coração</dt><dd>${p.notas.coracao}</dd></div>
      <div class="note-row"><dt>Fundo</dt><dd>${p.notas.fundo}</dd></div>
    </dl>
    <div class="card-foot">
      <div class="card-meta">
        <span class="card-size">${p.tamanho}</span>
        <span class="card-price">${precoHTML(p)}</span>
      </div>
      <button class="card-wa" data-add="${p.nome}">
        <svg class="ic-add" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
        <span class="lbl">Adicionar</span>
      </button>
    </div>
  </article>`;
}

// Versátil aparece tanto em Dia quanto em Noite
function passaFiltros(p){
  const okGenero = sel.genero==="Todos" || p.genero===sel.genero;
  let okPeriodo;
  if(sel.periodo==="Todas")          okPeriodo = true;
  else if(sel.periodo==="Versátil")  okPeriodo = p.periodo==="Versátil";
  else                               okPeriodo = (p.periodo===sel.periodo || p.periodo==="Versátil");
  const okFamilia = sel.familia==="Todas" || p.familia===sel.familia;
  return okGenero && okPeriodo && okFamilia;
}

function renderGrid(){
  if(!grid) return;
  let list = PERFUMES.filter(passaFiltros);
  const lim = parseInt(grid.dataset.limit||"0", 10);   // prévia da home
  if(lim>0) list = list.slice(0, lim);

  grid.innerHTML = list.length
    ? list.map(cardHTML).join("")
    : `<p class="grid-empty">Nenhuma fragrância com esses filtros.<button class="grid-reset">limpar filtros</button></p>`;
  grid.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

  if(countEl){
    const tot = PERFUMES.filter(passaFiltros).length;
    countEl.textContent = tot + (tot===1 ? " fragrância" : " fragrâncias");
  }
}

function resetFiltros(){
  if(!filtersWrap) return;
  sel.genero="Todos"; sel.periodo="Todas"; sel.familia="Todas";
  filtersWrap.querySelectorAll(".filter-group").forEach(fg=>
    fg.querySelectorAll(".chip").forEach((c,i)=>c.classList.toggle("active", i===0)));
  renderGrid();
}

if(grid){
  // botão "limpar filtros" do estado vazio
  grid.addEventListener("click", e=>{ if(e.target.closest(".grid-reset")) resetFiltros(); });
  // adicionar ao pedido a partir dos cards / abrir detalhes
  grid.addEventListener("click", e=>{
    const btn = e.target.closest("[data-add]");
    if(btn){
      addToCart(btn.dataset.add);
      const lbl = btn.querySelector(".lbl");
      if(lbl && !btn.classList.contains("added")){
        const orig = lbl.textContent;
        btn.classList.add("added"); lbl.textContent = "Adicionado ✓";
        setTimeout(()=>{ btn.classList.remove("added"); lbl.textContent = orig; }, 1100);
      }
      return;
    }
    const card = e.target.closest(".card[data-nome]");
    if(card) openQuickView(card.dataset.nome);
  });
  // teclado: Enter/Espaço abre os detalhes do card
  grid.addEventListener("keydown", e=>{
    if(e.key!=="Enter" && e.key!==" ") return;
    const card = e.target.closest(".card[data-nome]");
    if(card && e.target===card){ e.preventDefault(); openQuickView(card.dataset.nome); }
  });
}

/* =====================================================================
   🛍️  MEU PEDIDO  (vários perfumes → 1 pedido no WhatsApp)
   ===================================================================== */
const cartEl       = document.getElementById("cart");
const cartOverlay  = document.getElementById("cartOverlay");
const cartBody     = document.getElementById("cartBody");
const cartFoot     = document.getElementById("cartFoot");
const cartCountEl  = document.getElementById("cartCount");
const cartTotalEl  = document.getElementById("cartTotal");
const cartFloat    = document.getElementById("cartFloat");
const cartSend     = document.getElementById("cartSend");
const porNome = Object.fromEntries(PERFUMES.map(p=>[p.nome,p]));

let cart = {};
try{ cart = JSON.parse(localStorage.getItem("duna_cart")||"{}"); }catch(e){ cart={}; }
const salvarCart = ()=>{ try{ localStorage.setItem("duna_cart", JSON.stringify(cart)); }catch(e){} };
const totalItens = ()=> Object.values(cart).reduce((a,b)=>a+b,0);
const totalPreco = ()=> Object.entries(cart).reduce((s,[n,q])=> s + (porNome[n]&&temPreco(porNome[n]) ? porNome[n].preco*q : 0), 0);
// algum item do pedido está "Sob consulta"?
const cartTemSemPreco = ()=> Object.keys(cart).some(n=> porNome[n] && !temPreco(porNome[n]));

function bumpFloat(){ if(!cartFloat) return; cartFloat.classList.remove("bump"); void cartFloat.offsetWidth; cartFloat.classList.add("bump"); }
function addToCart(nome){ if(!porNome[nome]) return; cart[nome]=(cart[nome]||0)+1; salvarCart(); renderCart(); bumpFloat(); showToast(nome); }
function setQty(nome,d){ cart[nome]=(cart[nome]||0)+d; if(cart[nome]<=0) delete cart[nome]; salvarCart(); renderCart(); }
function removeItem(nome){ delete cart[nome]; salvarCart(); renderCart(); }
function abrirCart(){ if(!cartEl) return; cartEl.classList.add("open"); cartOverlay.classList.add("open"); document.body.classList.add("no-scroll"); }
function fecharCart(){ if(!cartEl) return; cartEl.classList.remove("open"); cartOverlay.classList.remove("open"); document.body.classList.remove("no-scroll"); }

function msgPedido(){
  const linhas = Object.entries(cart).filter(([n])=>porNome[n]).map(([n,q])=>{
    const p = porNome[n];
    return `• ${q}x ${nomeCompleto(p)} (${p.tamanho}) — ${precoTxt(p)}${q>1&&temPreco(p)?" cada":""}`;
  });
  const totalLinha = cartTemSemPreco()
    ? "Total: a combinar no atendimento"
    : `Total estimado: R$ ${totalPreco()}`;
  return `Olá, Duna! Quero fazer um pedido: 🌙\n\n${linhas.join("\n")}\n\n${totalLinha}\n\nPode confirmar a disponibilidade e o frete?`;
}

function renderCart(){
  if(!cartEl) return;
  const itens = Object.entries(cart).filter(([n])=>porNome[n]);
  const n = totalItens();
  cartCountEl.textContent = n;
  cartCountEl.classList.toggle("show", n>0);

  if(itens.length===0){
    cartBody.innerHTML = `<div class="cart-empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 7h12l-1 13H7L6 7z" stroke-linejoin="round"/><path d="M9 7a3 3 0 016 0" stroke-linecap="round"/></svg>
      Seu pedido está vazio.<br>Adicione suas fragrâncias favoritas.</div>`;
    cartFoot.classList.add("hidden");
    return;
  }
  cartBody.innerHTML = itens.map(([nome,q])=>{
    const p = porNome[nome];
    return `<div class="cart-item">
      <div class="ci-thumb">${frascoVisual(p)}</div>
      <div class="ci-info">
        <div class="ci-name">${p.marca ? p.marca+" " : ""}${nome}</div>
        <div class="ci-meta">${p.tamanho}</div>
        <div class="ci-price">${precoHTML(p)}</div>
      </div>
      <div class="ci-side">
        <div class="ci-qty">
          <button class="qbtn" data-dec="${nome}" aria-label="Menos um">−</button>
          <span class="qval">${q}</span>
          <button class="qbtn" data-inc="${nome}" aria-label="Mais um">+</button>
        </div>
        <button class="ci-remove" data-rem="${nome}">remover</button>
      </div>
    </div>`;
  }).join("");
  cartFoot.classList.remove("hidden");
  if(cartTemSemPreco()){ cartTotalEl.textContent = "A combinar"; }
  else { animateTotal(cartTotalEl, totalPreco()); }
  cartSend.href = waLink(msgPedido());
}

// contagem animada do total (R$)
function animateTotal(el, to){
  const from = parseInt((el.textContent||"").replace(/\D/g,""),10) || 0;
  if(from===to || reduceMotion){ el.textContent = "R$ " + to; return; }
  const t0 = performance.now(), dur = 380;
  (function step(t){
    const k = Math.min(1,(t-t0)/dur), e = 1-Math.pow(1-k,3);
    el.textContent = "R$ " + Math.round(from + (to-from)*e);
    if(k<1) requestAnimationFrame(step);
  })(t0);
}

if(cartEl){
  cartBody.addEventListener("click", e=>{
    const inc=e.target.closest("[data-inc]"), dec=e.target.closest("[data-dec]"), rem=e.target.closest("[data-rem]");
    if(inc) setQty(inc.dataset.inc,1);
    else if(dec) setQty(dec.dataset.dec,-1);
    else if(rem) removeItem(rem.dataset.rem);
  });
  cartFloat.addEventListener("click", abrirCart);
  document.getElementById("cartClose").addEventListener("click", fecharCart);
  document.getElementById("cartContinue").addEventListener("click", fecharCart);
  cartOverlay.addEventListener("click", fecharCart);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && cartEl.classList.contains("open")) fecharCart(); });
  renderCart();
}

/* =====================================================================
   🧭  QUIZ  (só na home)
   ===================================================================== */
const steps = document.querySelectorAll(".quiz-step");
if(steps.length){
  const answers = { occ:null, int:null, fam:null };
  let stepIdx = 0;
  const progress = document.querySelectorAll("#quizProgress i");
  const resultBox = document.getElementById("quizResult");
  const quizBack = document.getElementById("quizBack");

  function updateBack(){
    if(quizBack) quizBack.classList.toggle("show", stepIdx>0 && !resultBox.classList.contains("active"));
  }

  document.querySelectorAll(".quiz-opt").forEach(opt=>{
    opt.addEventListener("click", ()=>{
      answers[opt.dataset.key] = opt.dataset.val;
      if(stepIdx < steps.length-1){
        steps[stepIdx].classList.remove("active");
        stepIdx++;
        steps[stepIdx].classList.add("active");
        progress[stepIdx].classList.add("on");
      } else {
        mostrarResultado();
      }
      updateBack();
    });
  });

  if(quizBack) quizBack.addEventListener("click", ()=>{
    if(stepIdx===0) return;
    steps[stepIdx].classList.remove("active");
    progress[stepIdx].classList.remove("on");
    stepIdx--;
    steps[stepIdx].classList.add("active");
    updateBack();
  });

  function mostrarResultado(){
    let best=null, bestScore=-1;
    PERFUMES.forEach(p=>{
      let s=0;
      if(p.familia===answers.fam) s+=3;
      if(p.intensidade===answers.int) s+=2;
      if(p.ocasiao===answers.occ) s+=1;
      const escala=["suave","equilibrado","marcante","potente"];
      const d=Math.abs(escala.indexOf(p.intensidade)-escala.indexOf(answers.int));
      if(d===1) s+=1;
      if(s>bestScore){ bestScore=s; best=p; }
    });
    steps.forEach(st=>st.classList.remove("active"));
    resultBox.classList.add("active");
    updateBack();
    document.getElementById("rBottle").innerHTML = frascoVisual(best);
    document.getElementById("rFam").textContent = (best.marca ? best.marca + " · " : "") + best.familia + " · " + best.selo;
    document.getElementById("rName").textContent = best.nome;
    document.getElementById("rDesc").textContent = best.desc;
    document.getElementById("rPrice").innerHTML = precoHTML(best) + " · " + best.tamanho;
    document.getElementById("rWa").href = waLink(
      `Olá, Duna! Fiz o teste no site e o resultado foi o *${nomeCompleto(best)}* (${best.tamanho})${temPreco(best) ? " — R$ " + best.preco : ""}. Quero saber mais! 🌙`
    );
  }

  const rRestart = document.getElementById("rRestart");
  if(rRestart) rRestart.addEventListener("click", ()=>{
    stepIdx=0; answers.occ=answers.int=answers.fam=null;
    resultBox.classList.remove("active");
    steps.forEach((st,i)=>st.classList.toggle("active", i===0));
    progress.forEach((i,idx)=>i.classList.toggle("on", idx===0));
    updateBack();
  });
}

/* =====================================================================
   🌄  PARALLAX (hero) + NAV scroll
   ===================================================================== */
const nav = document.getElementById("nav");
const heroImg = document.querySelector(".hero-bg video, .hero-bg img");
const dunes = document.querySelectorAll(".dune");
let ticking=false;

function onScroll(){
  const y = window.scrollY;
  if(nav) nav.classList.toggle("scrolled", y>40);
  if(!reduceMotion){
    if(heroImg && y < window.innerHeight){
      heroImg.style.transform = `translateY(${y*0.18}px) scale(1.05)`;
    }
    dunes.forEach(d=>{
      const sp = parseFloat(d.dataset.speed)||0;
      if(y < window.innerHeight*1.2) d.style.transform = `translateY(${y*sp}px)`;
    });
  }
  // barra de progresso de leitura
  if(progressBar){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.transform = `scaleX(${max>0 ? Math.min(1, y/max) : 0})`;
  }
  // botão voltar ao topo
  if(toTopBtn) toTopBtn.classList.toggle("show", y > 700);
  ticking=false;
}
window.addEventListener("scroll", ()=>{
  if(!ticking){ requestAnimationFrame(onScroll); ticking=true; }
}, { passive:true });

/* =====================================================================
   📱  MENU MOBILE (gaveta deslizante)
   ===================================================================== */
const burger = document.getElementById("burger");
const mobileMenu = document.getElementById("mobileMenu");
const mmOverlay = document.getElementById("mmOverlay");
if(burger && mobileMenu && mmOverlay){
  const openMenu = ()=>{
    burger.classList.add("open"); burger.setAttribute("aria-expanded","true");
    mobileMenu.classList.add("open"); mobileMenu.setAttribute("aria-hidden","false");
    mmOverlay.classList.add("open"); document.body.classList.add("no-scroll");
  };
  const closeMenu = ()=>{
    burger.classList.remove("open"); burger.setAttribute("aria-expanded","false");
    mobileMenu.classList.remove("open"); mobileMenu.setAttribute("aria-hidden","true");
    mmOverlay.classList.remove("open"); document.body.classList.remove("no-scroll");
  };
  burger.addEventListener("click", ()=>{ mobileMenu.classList.contains("open") ? closeMenu() : openMenu(); });
  mmOverlay.addEventListener("click", closeMenu);
  document.querySelectorAll("[data-mm]").forEach(a=>a.addEventListener("click", closeMenu));
  const waM = document.getElementById("waMobile"); if(waM) waM.addEventListener("click", closeMenu);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeMenu(); });
}

/* =====================================================================
   ♾️  MARQUEE — duplica o conteúdo p/ loop infinito
   ===================================================================== */
const mq = document.getElementById("marquee");
if(mq) mq.innerHTML += mq.innerHTML;

/* =====================================================================
   🔔  TOAST — confirmação ao adicionar ao pedido
   ===================================================================== */
const toast = document.createElement("div");
toast.className = "toast"; toast.setAttribute("role","status"); toast.setAttribute("aria-live","polite");
document.body.appendChild(toast);
let toastTimer = null;
function showToast(nome){
  toast.innerHTML = `
    <span class="t-check"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3"><path d="M4 12.5l5 5L20 6.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    <span><b>${nome}</b> foi para o seu pedido</span>
    <button class="t-view">Ver pedido</button>`;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>toast.classList.remove("show"), 3200);
}
toast.addEventListener("click", e=>{
  if(e.target.closest(".t-view")){ toast.classList.remove("show"); abrirCart(); }
});

/* =====================================================================
   🔍  QUICK VIEW — modal de detalhes do perfume
   ===================================================================== */
const qvWrap = document.createElement("div");
qvWrap.innerHTML = `
  <div class="qv-overlay" id="qvOverlay"></div>
  <div class="qv" id="qv" role="dialog" aria-modal="true" aria-hidden="true">
    <div class="qv-card">
      <button class="qv-close" id="qvClose" aria-label="Fechar detalhes">&times;</button>
      <div class="qv-left">
        <span class="card-pill pill-solid qv-pill" id="qvSelo"></span>
        <div class="frame-corners"><span></span><span></span><span></span><span></span></div>
        <div class="qv-bottle" id="qvBottle"></div>
      </div>
      <div class="qv-right">
        <p class="eyebrow" id="qvFam"></p>
        <h3 class="qv-name" id="qvName"></h3>
        <p class="qv-insp" id="qvInsp"></p>
        <p class="qv-desc" id="qvDesc"></p>
        <dl class="notes" id="qvNotes"></dl>
        <div class="qv-meta">
          <span class="card-size" id="qvSize"></span>
          <span class="card-price" id="qvPrice"></span>
        </div>
        <div class="qv-actions">
          <button class="btn btn-gold" id="qvAdd">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 5v14M5 12h14" stroke-linecap="round"/></svg>
            Adicionar ao pedido
          </button>
          <a class="btn btn-line-dark" id="qvWa" href="#" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.5 15.2L2 22l4.9-1.5A10 10 0 1012 2zm4.4 12c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.1-.5 0a6.5 6.5 0 01-1.9-1.2 7.3 7.3 0 01-1.3-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.4a.4.4 0 000-.4l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 00-.7.3 2.8 2.8 0 00-.9 2.1A5 5 0 009 12.5a11 11 0 004.2 3.7c1.6.6 1.9.5 2.3.5s1.4-.6 1.6-1.1.2-1 .1-1.1z"/></svg>
            Pedir agora
          </a>
        </div>
      </div>
    </div>
  </div>`;
document.body.appendChild(qvWrap);

const qvEl = document.getElementById("qv");
const qvOverlay = document.getElementById("qvOverlay");
let qvNome = null, qvLastFocus = null;

function openQuickView(nome){
  const p = porNome[nome];
  if(!p) return;
  qvNome = nome;
  qvLastFocus = document.activeElement;
  document.getElementById("qvSelo").textContent = p.selo;
  document.getElementById("qvBottle").innerHTML = frascoVisual(p);
  document.getElementById("qvFam").textContent = `${p.marca ? p.marca + " · " : ""}${p.familia} · ${p.genero} · ${p.periodo}`;
  document.getElementById("qvName").textContent = p.nome;
  document.getElementById("qvInsp").textContent = p.inspiracao;
  document.getElementById("qvDesc").textContent = p.desc;
  document.getElementById("qvNotes").innerHTML = `
    <div class="note-row"><dt>Topo</dt><dd>${p.notas.topo}</dd></div>
    <div class="note-row"><dt>Coração</dt><dd>${p.notas.coracao}</dd></div>
    <div class="note-row"><dt>Fundo</dt><dd>${p.notas.fundo}</dd></div>`;
  document.getElementById("qvSize").textContent = p.tamanho;
  document.getElementById("qvPrice").innerHTML = precoHTML(p);
  document.getElementById("qvWa").href = waProduto(p);
  qvEl.setAttribute("aria-label", `Detalhes de ${p.nome}`);
  qvEl.classList.add("open"); qvOverlay.classList.add("open");
  qvEl.setAttribute("aria-hidden","false");
  document.body.classList.add("no-scroll");
  document.getElementById("qvClose").focus();
}
function closeQuickView(){
  qvEl.classList.remove("open"); qvOverlay.classList.remove("open");
  qvEl.setAttribute("aria-hidden","true");
  document.body.classList.remove("no-scroll");
  if(qvLastFocus && qvLastFocus.focus) qvLastFocus.focus();
}
document.getElementById("qvClose").addEventListener("click", closeQuickView);
qvOverlay.addEventListener("click", closeQuickView);
document.addEventListener("keydown", e=>{ if(e.key==="Escape" && qvEl.classList.contains("open")) closeQuickView(); });
document.getElementById("qvAdd").addEventListener("click", ()=>{
  if(qvNome){ addToCart(qvNome); closeQuickView(); }
});

/* =====================================================================
   🃏  TILT 3D nos cards (desktop, ponteiro fino, sem reduced-motion)
   ===================================================================== */
(function initTilt(){
  if(reduceMotion || !grid) return;
  if(!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  let cur = null;
  const reset = c => { if(c) c.style.transform = ""; };
  grid.addEventListener("pointermove", e=>{
    const card = e.target.closest(".card");
    if(card !== cur){ reset(cur); cur = card; }
    if(!card) return;
    const r = card.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    card.style.transform =
      `translateY(-8px) perspective(900px) rotateX(${((py-.5)*-7).toFixed(2)}deg) rotateY(${((px-.5)*7).toFixed(2)}deg)`;
    card.style.setProperty("--gx", (px*100).toFixed(1)+"%");
    card.style.setProperty("--gy", (py*100).toFixed(1)+"%");
  });
  grid.addEventListener("pointerleave", ()=>{ reset(cur); cur = null; });
})();

/* =====================================================================
   ✨  POEIRA DE OURO — canvas de partículas (hero e topo do catálogo)
   ===================================================================== */
function dustCanvas(host, {alpha=.65, dark=false, density=16}={}){
  const cv = document.createElement("canvas");
  cv.className = "fx-dust";
  host.appendChild(cv);
  const ctx = cv.getContext("2d");
  const dpr = Math.min(2, window.devicePixelRatio||1);
  let w=0, h=0, parts=[], raf=null, visible=false;

  function size(){
    w = host.clientWidth; h = host.clientHeight;
    cv.width = w*dpr; cv.height = h*dpr;
    cv.style.width = w+"px"; cv.style.height = h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const n = Math.round(Math.min(90, w/density));
    parts = Array.from({length:n}, ()=>spawn(true));
  }
  function spawn(anyY){
    return {
      x: Math.random()*w,
      y: anyY ? Math.random()*h : h+8,
      r: .6 + Math.random()*1.7,
      vy: .12 + Math.random()*.4,
      amp: 14 + Math.random()*26,
      ph: Math.random()*Math.PI*2,
      tw: .4 + Math.random()*.9
    };
  }
  function tick(t){
    ctx.clearRect(0,0,w,h);
    const base = dark ? "133,102,41" : "230,200,140";
    parts.forEach((p,i)=>{
      p.y -= p.vy;
      const x = p.x + Math.sin(t*.0006 + p.ph)*p.amp*.08;
      const a = alpha * (.3 + .7*Math.abs(Math.sin(t*.001*p.tw + p.ph)));
      ctx.beginPath();
      ctx.arc(x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${base},${a.toFixed(3)})`;
      ctx.fill();
      if(p.y < -8) parts[i] = spawn(false);
    });
    raf = requestAnimationFrame(tick);
  }
  function play(){ if(!raf && visible && !document.hidden) raf = requestAnimationFrame(tick); }
  function stop(){ if(raf){ cancelAnimationFrame(raf); raf = null; } }

  new IntersectionObserver(en=>{ visible = en[0].isIntersecting; visible ? play() : stop(); }).observe(host);
  document.addEventListener("visibilitychange", ()=>{ document.hidden ? stop() : play(); });
  window.addEventListener("resize", ()=>{ size(); }, { passive:true });
  size();
}
if(!reduceMotion){
  const heroHost = document.querySelector(".hero");
  const catHost  = document.querySelector(".cat-header");
  if(heroHost) dustCanvas(heroHost, { alpha:.7, dark:false, density:16 });
  if(catHost)  dustCanvas(catHost,  { alpha:.4, dark:true,  density:26 });
}

/* =====================================================================
   ⬆️  VOLTAR AO TOPO + BARRA DE PROGRESSO
   ===================================================================== */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

const toTopBtn = document.createElement("button");
toTopBtn.className = "to-top";
toTopBtn.setAttribute("aria-label","Voltar ao topo");
toTopBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M6 11l6-6 6 6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
document.body.appendChild(toTopBtn);
toTopBtn.addEventListener("click", ()=>window.scrollTo({ top:0, behavior: reduceMotion ? "auto" : "smooth" }));

/* =====================================================================
   🚀  INIT
   ===================================================================== */
renderGrid();
initReveal();
onScroll();

// pré-loader: aparece só na primeira página da sessão; nas demais, entra direto
const _pre = document.getElementById("preloader");
let _preSeen = false;
try{ _preSeen = sessionStorage.getItem("duna_pre")==="1"; }catch(e){}
if(_pre && _preSeen){
  _pre.classList.add("done");
}else if(_pre){
  document.body.classList.add("no-scroll");
  window.addEventListener("load", ()=>{
    setTimeout(()=>{
      _pre.classList.add("done");
      document.body.classList.remove("no-scroll");
      try{ sessionStorage.setItem("duna_pre","1"); }catch(e){}
    }, 1000);
  });
}
