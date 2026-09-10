/* Experiência de descoberta: favoritos, comparação, kits e cotação manual. */
(function(){
  'use strict';
  const S=DunaShop, esc=S.escape;
  const products=[...PERFUMES,...DECANTS,...(globalThis.DUNA_SKINCARE||[])];
  const byName=new Map(products.map(p=>[p.nome,p]));
  function readList(key){try{const value=JSON.parse(localStorage.getItem(key)||'[]');return new Set(Array.isArray(value)?value.filter(n=>typeof n==='string'&&byName.has(n)):[]);}catch{return new Set();}}
  let favorites=readList('duna_favorites');
  let compared=new Set([...readList('duna_compare')].filter(n=>PERFUMES.some(p=>p.nome===n&&!ehBodySpray(p))).slice(0,3));
  function persist(key,items){try{localStorage.setItem(key,JSON.stringify([...items]));}catch{announce('Seu navegador não permitiu salvar. As escolhas ficam disponíveis enquanto esta página estiver aberta.');}}
  const status=document.createElement('p');status.className='discovery-status';status.setAttribute('role','status');document.body.append(status);
  let statusTimer;
  function announce(message){const feedback=document.querySelector('dialog[open] .dialog-feedback');if(feedback){feedback.textContent=message;return;}status.textContent=message;status.classList.add('show');clearTimeout(statusTimer);statusTimer=setTimeout(()=>status.classList.remove('show'),4200);}
  function dialog(id,title){
    const d=document.createElement('dialog');d.id=id;d.className='discovery-dialog';d.setAttribute('aria-labelledby',id+'Title');
    d.innerHTML=`<header class="discovery-dialog-head"><div><p class="eyebrow">Duna · sua escolha</p><h2 id="${id}Title">${title}</h2></div><button type="button" data-close aria-label="Fechar ${title.toLowerCase()}">×</button></header><p class="dialog-feedback" role="status"></p><div class="discovery-dialog-body"></div>`;
    let previousFocus;
    d.addEventListener('click',e=>{if(e.target.closest('[data-close]'))d.close();if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}});
    d.addEventListener('close',()=>{document.body.classList.remove('discovery-modal-open');d.querySelector('.dialog-feedback').textContent='';if(previousFocus?.isConnected)previousFocus.focus();});
    document.body.append(d);
    return {el:d,body:d.querySelector('.discovery-dialog-body'),open(){previousFocus=document.activeElement;if(!d.open){d.showModal();document.body.classList.add("discovery-modal-open");}}};
  }
  const favDialog=dialog('favoritesDialog','Seus favoritos');
  const compareDialog=dialog('compareDialog','Compare suas escolhas');
  const kitDialog=dialog('kitDialog','Monte seu kit de decants');
  const toolbar=document.createElement('div');toolbar.className='discovery-tools';
  toolbar.innerHTML='<div><span class="eyebrow">Encontre o seu próximo perfume</span><p>Guarde, compare ou experimente.</p></div><div class="discovery-tool-buttons"><button type="button" data-open-favorites>♡ Salvos <span data-fav-count>0</span></button><button type="button" data-open-compare>Comparar <span data-compare-count>0</span></button><button type="button" data-open-kit>Montar kit de decants →</button></div>';
  const toolsHost=document.querySelector('.cat-main > .wrap, .collections > .wrap, .product-page-main > .wrap');
  if(toolsHost){const layout=toolsHost.querySelector(".product-layout");if(layout)layout.after(toolbar);else toolsHost.prepend(toolbar);}
  document.querySelectorAll('.mobile-menu nav').forEach(nav=>{const link=document.createElement('a');link.href='catalogo.html?salvos=1';link.textContent='Meus favoritos';nav.append(link);});
  function hydrate(){
    document.querySelectorAll('[data-favorite]').forEach(b=>{const active=favorites.has(b.dataset.favorite);b.setAttribute('aria-pressed',String(active));b.innerHTML=(active?'♥':'♡')+' <span>'+(active?'Salvo':'Salvar')+'</span>';b.setAttribute('aria-label',(active?'Remover ':'Salvar ')+b.dataset.favorite+(active?' dos favoritos':' nos favoritos'));});
    document.querySelectorAll('[data-compare]').forEach(b=>{const active=compared.has(b.dataset.compare);b.setAttribute('aria-pressed',String(active));b.textContent=active?(b.closest('.comparison-table')?'Remover':'✓ Comparando'):'Comparar';b.setAttribute('aria-label',(active?'Remover ':'Comparar ')+b.dataset.compare+(active?' da comparação':''));});
    document.querySelectorAll('[data-fav-count]').forEach(el=>el.textContent=favorites.size);
    document.querySelectorAll('[data-compare-count]').forEach(el=>el.textContent=compared.size);
  }
  function controls(p){return `<div class="discovery-actions"><button type="button" data-favorite="${esc(p.nome)}" aria-pressed="false">♡ Salvar</button>${p.tipo!=='skincare'&&!p.decant&&!ehBodySpray(p)?`<button type="button" data-compare="${esc(p.nome)}" aria-pressed="false">Comparar</button>`:''}</div>`;}
  function miniCard(p){return `<article class="discovery-mini"><a href="${S.productURL(p)}"><img src="${esc(p.foto)}" alt="${esc(nomeCompleto(p))}" loading="lazy"><p class="eyebrow">${esc(p.marca)}</p><h3>${esc(p.nome)}</h3></a><p>${esc(p.tamanho)}</p><p>${estaDisponivel(p)?(p.decant?'A partir de ':'')+esc(precoTxt(p))+' no Pix':'Esgotado'}</p>${controls(p)}<a class="discovery-text-link" href="${S.productURL(p)}">Ver produto →</a></article>`;}
  function renderFavorites(){
    favDialog.body.innerHTML=`<p class="discovery-intro">Suas escolhas ficam salvas neste navegador, sem cadastro.</p>${favorites.size?`<div class="discovery-mini-grid">${[...favorites].map(n=>miniCard(byName.get(n))).join('')}</div>`:'<div class="discovery-empty"><p>Ainda não salvou nenhum produto.</p><p>Toque em ♡ Salvar nos produtos para reuni-los aqui.</p><a href="catalogo.html">Explorar perfumes →</a></div>'}`;
    hydrate();
  }
  function renderComparison(){
    const list=[...compared].map(n=>byName.get(n));
    const rows=[['Preço no Pix',p=>precoTxt(p)],['Cartão',p=>temPreco(p)?`${moeda(precoCartao(p.preco))} · 3x de ${moeda(precoCartao(p.preco)/3)}`:'Sob consulta'],['Volume',p=>p.tamanho],['Disponibilidade',p=>estaDisponivel(p)?'Disponível':'Esgotado'],['Perfil olfativo',p=>perfilOlfativo(p)],['Gênero',p=>p.genero],['Uso',p=>p.periodo],['Intensidade',p=>p.intensidade],['Notas de topo',p=>p.notas.topo],['Notas de coração',p=>p.notas.coracao],['Notas de fundo',p=>p.notas.fundo]];
    compareDialog.body.innerHTML=`<p class="discovery-intro">Escolha até três perfumes no catálogo. Compare os frascos completos; frete a confirmar.</p>${list.length?`<div class="comparison-scroll" tabindex="0" role="region" aria-label="Tabela comparativa; role para os lados"><table class="comparison-table"><caption>Comparação de ${list.length} ${list.length===1?'perfume':'perfumes'}</caption><thead><tr><th scope="col">O que muda</th>${list.map(p=>`<th scope="col"><img src="${esc(p.foto)}" alt="" loading="lazy"><a href="${S.productURL(p)}">${esc(nomeCompleto(p))}</a><button type="button" data-compare="${esc(p.nome)}">Remover</button></th>`).join('')}</tr></thead><tbody>${rows.map(([label,value])=>`<tr><th scope="row">${label}</th>${list.map(p=>`<td>${esc(value(p))}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`:'<div class="discovery-empty"><p>Sua comparação está vazia.</p><p>Use “Comparar” em até três perfumes.</p><a href="catalogo.html">Escolher perfumes →</a></div>'}`;
    if(list.length===1)compareDialog.body.insertAdjacentHTML('beforeend','<p class="discovery-intro">Adicione mais um perfume no catálogo para ver as diferenças lado a lado.</p>');
    hydrate();
  }
  document.addEventListener('duna:grid',hydrate);
  document.addEventListener('click',e=>{
    const favorite=e.target.closest('[data-favorite]');
    if(favorite){const name=favorite.dataset.favorite;if(!byName.has(name))return;const selected=!favorites.has(name);selected?favorites.add(name):favorites.delete(name);persist('duna_favorites',favorites);hydrate();if(favDialog.el.open){renderFavorites();favDialog.body.querySelector('[data-favorite]')?.focus();}announce(selected?'Produto salvo nos favoritos.':'Produto removido dos favoritos.');return;}
    const compare=e.target.closest('[data-compare]');
    if(compare){const name=compare.dataset.compare;if(!byName.has(name))return;if(compared.has(name))compared.delete(name);else if(compared.size<3)compared.add(name);else{announce('Você já escolheu três perfumes. Remova um da comparação para adicionar outro.');return;}persist('duna_compare',compared);hydrate();if(compareDialog.el.open){renderComparison();compareDialog.body.querySelector('[data-compare]')?.focus();}return;}
    if(e.target.closest('[data-open-favorites]')){renderFavorites();favDialog.open();}
    if(e.target.closest('[data-open-compare]')){renderComparison();compareDialog.open();}
    if(e.target.closest('[data-open-kit]')){renderKit();kitDialog.open();}
  });
  window.addEventListener('storage',e=>{if(e.key==='duna_favorites')favorites=readList('duna_favorites');if(e.key==='duna_compare')compared=new Set([...readList('duna_compare')].slice(0,3));hydrate();if(favDialog.el.open)renderFavorites();if(compareDialog.el.open)renderComparison();});

  // Faixa de orçamento sempre visível, com base de pagamento explícita.
  if(filtersWrap){
    const budgetWrap=document.createElement('form');budgetWrap.className='budget-filter';budgetWrap.noValidate=true;
    budgetWrap.innerHTML=`<label for="budgetMax">Até quanto quer investir?<span>Preço por unidade, sem frete</span></label><div><span aria-hidden="true">R$</span><input id="budgetMax" type="number" min="1" step="0.01" inputmode="decimal" placeholder="Sem limite" value="${budgetMax||''}" aria-describedby="budgetError"><select id="budgetPayment" aria-label="Forma de pagamento para o orçamento"><option value="pix">no Pix</option><option value="cartao">no cartão (total)</option></select><button type="submit">Aplicar</button><button type="button" id="budgetClear" aria-label="Remover limite de orçamento">Limpar</button></div><p id="budgetError" role="status"></p>`;
    document.querySelector('.cat-toolbar').after(budgetWrap);
    const input=budgetWrap.querySelector('input'),payment=budgetWrap.querySelector('select');payment.value=budgetPayment;
    budgetWrap.addEventListener('submit',e=>{e.preventDefault();if(!input.checkValidity()){budgetWrap.querySelector('#budgetError').textContent='Informe um valor maior que zero.';input.focus();return;}budgetWrap.querySelector('#budgetError').textContent='';budgetMax=S.budget(input.value);budgetPayment=payment.value;paginaAtual=1;const url=new URL(location.href);budgetMax?url.searchParams.set('ate',budgetMax):url.searchParams.delete('ate');budgetMax?url.searchParams.set('pagamento',budgetPayment):url.searchParams.delete('pagamento');history.replaceState(null,'',url);renderGrid();});
    budgetWrap.querySelector('#budgetClear').addEventListener('click',()=>{input.value='';budgetWrap.requestSubmit();});
  }

  // Três passos, sem alterar o catálogo ou criar uma promoção nova.
  let kitStep=1,kitVolume=3,kitTarget=3,kitQuery='';const kitSelected=new Set();
  const kitEntries=()=>[...kitSelected].map(name=>({product:decantPorBaseEVolume.get(`${name}|${kitVolume}`),quantity:1})).filter(e=>e.product);
  function kitChoiceList(){
    const list=DECANTS.filter(p=>S.normalize(nomeCompleto(p)+' '+p.inspiracao+' '+perfilOlfativo(p)).includes(S.normalize(kitQuery)));
    return list.map(p=>{const option=decantPorBaseEVolume.get(`${p.base}|${kitVolume}`);const selected=kitSelected.has(p.base);return `<button type="button" class="kit-choice" data-kit-choice="${esc(p.base)}" aria-pressed="${selected}"><img src="${esc(p.foto)}" alt="" loading="lazy"><span><small>${esc(p.marca)}</small><strong>${esc(p.base)}</strong><span>${esc(perfilOlfativo(p))} · ${moeda(option.preco)} no Pix</span></span><span aria-hidden="true">${selected?'✓':'+'}</span></button>`;}).join('')||'<p class="discovery-empty">Nenhuma opção para essa busca. Tente uma marca ou nota.</p>';
  }
  function renderKit(){
    const summary=S.orderSummary(kitEntries(),DECANT_FRASCO);
    const steps='<ol class="kit-steps"><li'+(kitStep===1?' aria-current="step"':'')+'>1. Tamanho</li><li'+(kitStep===2?' aria-current="step"':'')+'>2. Fragrâncias</li><li'+(kitStep===3?' aria-current="step"':'')+'>3. Seu kit</li></ol>';
    let content='';
    if(kitStep===1){content=`<h3>Como quer experimentar?</h3><p class="discovery-intro">Escolha o volume de cada decant e a quantidade de fragrâncias. Todos incluem o frasco de R$ 6.</p><fieldset class="kit-options"><legend>Volume por fragrância</legend>${[3,5,10].map(v=>`<label><input type="radio" name="kitVolume" value="${v}" ${v===kitVolume?'checked':''}><span>${v} ml</span></label>`).join('')}</fieldset><fieldset class="kit-options"><legend>Quantas fragrâncias?</legend>${[3,5,10].map(v=>`<label><input type="radio" name="kitTarget" value="${v}" ${v===kitTarget?'checked':''}><span>${v} fragrâncias<small>${v===3?5:v===5?10:15}% sobre o líquido</small></span></label>`).join('')}</fieldset><p>O desconto não incide sobre os frascos. O total aparece conforme você escolhe.</p><button class="btn btn-gold" data-kit-next>Escolher fragrâncias →</button>`;}
    if(kitStep===2){content=`<h3>Quais combinam com você?</h3><label class="kit-search">Buscar por perfume, marca ou perfil<input type="search" id="kitSearch" value="${esc(kitQuery)}" placeholder="Ex.: Lattafa, doce, baunilha"></label><div class="kit-selected" id="kitSelected">${kitSelectedTags()}</div><div class="kit-choices" id="kitChoices">${kitChoiceList()}</div><div class="kit-footer"><p id="kitCount" aria-live="polite">${kitSelected.size} de ${kitTarget} escolhidas · ${kitVolume} ml cada</p><p id="kitPrice">${moeda(summary.total)} no Pix, sem frete</p><button type="button" data-kit-back>← Tamanho</button><button class="btn btn-gold" data-kit-next ${kitSelected.size!==kitTarget?'disabled':''}>Revisar kit →</button></div>`;}
    if(kitStep===3){
      const merged=Object.entries(cart).map(([name,quantity])=>({product:porNome[name],quantity})).concat(kitEntries());
      const combined=S.orderSummary(merged,DECANT_FRASCO);
      content=`<h3>Sua seleção, pronta para experimentar.</h3><ul class="kit-review">${kitEntries().map(({product:p})=>`<li><span>${esc(p.base)} · ${p.decantMl} ml</span><strong>${moeda(p.preco)}</strong></li>`).join('')}</ul><dl class="kit-totals"><div><dt>Fragrâncias</dt><dd>${moeda(summary.liquidoDecants)}</dd></div><div><dt>Frascos (${kitTarget} × R$ 6)</dt><dd>${moeda(summary.frascosDecants)}</dd></div><div><dt>Desconto sobre o líquido (${Math.round(summary.taxa*100)}%)</dt><dd>− ${moeda(summary.descontoDecants)}</dd></div><div class="kit-total"><dt>Este kit no Pix</dt><dd>${moeda(summary.total)}</dd></div><div><dt>No cartão</dt><dd>${moeda(precoCartao(summary.total))} · 3x de ${moeda(precoCartao(summary.total)/3)}</dd></div></dl><p>Frete e prazo a confirmar no atendimento.</p>${Object.keys(cart).length?`<p class="discovery-intro">Com os itens já no pedido, o total no Pix será ${moeda(combined.total)}. Os descontos de decants são recalculados sobre todas as unidades.</p>`:''}<div class="kit-footer"><button type="button" data-kit-back>← Editar fragrâncias</button><button class="btn btn-gold" data-kit-add>Adicionar kit ao pedido</button></div>`;
    }
    kitDialog.body.innerHTML=steps+content;kitDialog.el.scrollTop=0;
  }
  function kitSelectedTags(){return [...kitSelected].map(n=>`<button type="button" data-kit-remove="${esc(n)}" aria-label="Remover ${esc(n)} do kit">${esc(n)} ×</button>`).join('');}
  function updateKitChoices(){
    kitDialog.body.querySelector('#kitChoices').innerHTML=kitChoiceList();
    kitDialog.body.querySelector('#kitSelected').innerHTML=kitSelectedTags();
    kitDialog.body.querySelector('#kitCount').textContent=`${kitSelected.size} de ${kitTarget} escolhidas · ${kitVolume} ml cada`;
    kitDialog.body.querySelector('#kitPrice').textContent=`${moeda(S.orderSummary(kitEntries()).total)} no Pix, sem frete`;
    kitDialog.body.querySelector('[data-kit-next]').disabled=kitSelected.size!==kitTarget;
  }
  kitDialog.el.addEventListener('change',e=>{if(e.target.name==='kitVolume')kitVolume=Number(e.target.value);if(e.target.name==='kitTarget'){kitTarget=Number(e.target.value);while(kitSelected.size>kitTarget)kitSelected.delete([...kitSelected].at(-1));}});
  kitDialog.el.addEventListener('input',e=>{if(e.target.id==='kitSearch'){kitQuery=e.target.value;updateKitChoices();}});
  kitDialog.el.addEventListener('click',e=>{
    const choice=e.target.closest('[data-kit-choice]'),remove=e.target.closest('[data-kit-remove]');
    if(choice||remove){const name=choice?.dataset.kitChoice||remove.dataset.kitRemove;if(kitSelected.has(name))kitSelected.delete(name);else if(kitSelected.size<kitTarget)kitSelected.add(name);else{announce(`Seu kit já tem ${kitTarget} fragrâncias. Remova uma para trocar.`);return;}updateKitChoices();const next=[...kitDialog.body.querySelectorAll('[data-kit-choice]')].find(b=>b.dataset.kitChoice===name);next?.focus({preventScroll:true});return;}
    if(e.target.closest('[data-kit-next]')){if(kitStep===2&&kitSelected.size!==kitTarget)return;kitStep=Math.min(3,kitStep+1);renderKit();kitDialog.body.querySelector('h3').setAttribute('tabindex','-1');kitDialog.body.querySelector('h3').focus();}
    if(e.target.closest('[data-kit-back]')){kitStep=Math.max(1,kitStep-1);renderKit();}
    if(e.target.closest('[data-kit-add]')){if(kitSelected.size!==kitTarget)return;const entries=kitEntries();if(entries.length!==kitTarget||entries.some(({product:p})=>!estaDisponivel(p))){announce('Uma fragrância ficou indisponível. Revise o kit.');return;}for(const {product:p} of entries)cart[p.nome]=(cart[p.nome]||0)+1;salvarCart();renderCart();kitDialog.el.close();kitSelected.clear();kitStep=1;abrirCart();announce('Kit adicionado ao pedido. Confira o pagamento e informe o CEP para cotar o frete.');}
  });

  // Cotação manual: valida somente o formato; não promete endereço, preço ou prazo.
  if(cartFoot){
    const delivery=document.createElement('details');delivery.className='delivery-quote';delivery.open=false;
    delivery.innerHTML='<summary>Entrega · cotação pelo WhatsApp</summary><label for="deliveryCEP">CEP de entrega <small>(opcional)</small></label><input id="deliveryCEP" type="text" inputmode="numeric" autocomplete="postal-code" maxlength="9" placeholder="00000-000" aria-describedby="deliveryHelp deliveryError"><p id="deliveryHelp">Informe o CEP para a Duna cotar o frete. Valor e prazo serão confirmados no atendimento; não estão incluídos no total.</p><p id="deliveryError" role="status"></p>';
    cartFoot.prepend(delivery);
    const input=delivery.querySelector('input'),error=delivery.querySelector('#deliveryError');
    input.addEventListener('input',()=>{input.value=S.formatCEP(input.value);shippingCEP=S.validCEP(input.value)?input.value:'';error.textContent='';input.removeAttribute('aria-invalid');cartSend.href=waLink(msgPedido());});
    cartSend.addEventListener('click',e=>{if(input.value&&!S.validCEP(input.value)){e.preventDefault();delivery.open=true;error.textContent='Confira o CEP: ele precisa ter 8 números.';input.setAttribute('aria-invalid','true');input.focus();return;}cartSend.href=waLink(msgPedido());});
  }
  document.querySelectorAll('.skin-card').forEach(card=>{const product=produtoSkincareDoCard(card);if(!product)return;card.insertAdjacentHTML('beforeend',controls(product)+`<a class="discovery-text-link" href="${S.productURL(product)}">Ver página do produto →</a>`);});

  // Páginas pré-geradas têm conteúdo completo mesmo sem JavaScript.
  const productPage=document.querySelector('[data-product-page]');
  if(productPage){
    const p=byName.get(productPage.dataset.productPage);
    if(p){
      const actions=productPage.querySelector('[data-product-controls]');actions.innerHTML=controls(p);
      let selected=p;
      const purchase=productPage.querySelector('[data-product-add]'),price=productPage.querySelector('[data-product-price]'),direct=productPage.querySelector('[data-product-wa]');
      function updateProduct(){if(price)price.innerHTML=precoComPagamentoHTML(selected.preco,estaDisponivel(selected));if(direct)direct.href=estaDisponivel(selected)?waProduto(selected):waAvisoEstoque(nomeCompleto(selected));}
      if(p.decant){
        selected=decantPorBaseEVolume.get(`${p.base}|3`);
        productPage.querySelector('[data-product-volumes]').innerHTML=seletorDecantHTML(p,'page');
        productPage.addEventListener('click',e=>{const b=e.target.closest('[data-decant-volume]');if(!b)return;selected=decantPorBaseEVolume.get(`${p.base}|${b.dataset.decantVolume}`);productPage.querySelectorAll('[data-decant-volume]').forEach(x=>{x.classList.toggle('active',x===b);x.setAttribute('aria-pressed',String(x===b));});updateProduct();});
      }
      if(purchase){purchase.hidden=false;purchase.disabled=!estaDisponivel(p);purchase.addEventListener('click',()=>{addToCart(selected.nome);abrirCart();});}
      productPage.querySelector('[data-copy-product]')?.addEventListener('click',async()=>{const url=new URL(S.productURL(p),document.baseURI).href;try{await navigator.clipboard.writeText(url);announce('Link do produto copiado.');}catch{const field=productPage.querySelector('[data-share-url]');field.hidden=false;field.value=url;field.focus();field.select();}});
      updateProduct();
    }
  }
  hydrate();
  if(new URLSearchParams(location.search).get('salvos')==='1'){renderFavorites();favDialog.open();}
})();
