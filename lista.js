/* Lista de preços: busca, gênero, marca e disponibilidade na tela; envio do PDF pelo compartilhamento do celular. */
(function(){
  'use strict';
  const main = document.querySelector('.lista-main');
  if(!main) return;
  const norm = s => String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().trim();
  const itens = [...main.querySelectorAll('.li')];
  const blocos = [...main.querySelectorAll('.lista-faixa, .lista-grupo, .lista-sec')];
  const busca = document.getElementById('listaBusca');
  const marca = document.getElementById('listaMarca');
  const disp = document.getElementById('listaDisp');
  const chips = [...main.querySelectorAll('[data-genero]')];
  const contagem = document.getElementById('listaContagem');
  const vazio = document.getElementById('listaVazio');
  const estado = { q:'', genero:'', marca:'', disp:false };

  // Filtros podem vir no link: /lista?genero=Feminino&marca=Lattafa&q=baunilha&disponiveis=1
  const params = new URLSearchParams(location.search);
  estado.q = params.get('q') || '';
  estado.genero = chips.some(c=>c.dataset.genero===params.get('genero')) ? params.get('genero') : '';
  estado.marca = [...(marca?.options||[])].some(o=>o.value && o.value===params.get('marca')) ? params.get('marca') : '';
  estado.disp = params.get('disponiveis')==='1';
  if(busca) busca.value = estado.q;
  if(marca) marca.value = estado.marca;
  if(disp) disp.checked = estado.disp;

  function aplicar(atualizarURL){
    const termos = norm(estado.q).split(/\s+/).filter(Boolean);
    let visiveis = 0;
    for(const li of itens){
      const ok = termos.every(t=>li.dataset.q.includes(t))
        && (!estado.genero || !li.dataset.g || li.dataset.g===estado.genero)
        && (!estado.marca || li.dataset.m===estado.marca)
        && (!estado.disp || li.dataset.d==='1');
      li.hidden = !ok;
      if(ok) visiveis++;
    }
    for(const b of blocos){
      const n = b.querySelectorAll('.li:not([hidden])').length;
      b.hidden = !n;
      const total = b.querySelector(':scope > h2 small, :scope > .wrap > h2 small, :scope > h3 small');
      if(total){ total.dataset.total ??= total.textContent; total.textContent = n===Number(total.dataset.total) ? total.dataset.total : `${n} de ${total.dataset.total}`; }
    }
    chips.forEach(c=>c.setAttribute('aria-pressed', String(c.dataset.genero===estado.genero)));
    const filtrando = termos.length || estado.genero || estado.marca || estado.disp;
    if(contagem) contagem.textContent = filtrando ? `${visiveis} de ${itens.length} itens` : `${itens.length} itens · perfumes, decants e skincare`;
    if(vazio) vazio.hidden = visiveis>0;
    if(atualizarURL){
      const url = new URL(location.href);
      for(const [k,v] of [['q',estado.q.trim()],['genero',estado.genero],['marca',estado.marca],['disponiveis',estado.disp?'1':'']]) v ? url.searchParams.set(k,v) : url.searchParams.delete(k);
      history.replaceState(null,'',url);
    }
    marcarAba();
  }

  let t;
  busca?.addEventListener('input', ()=>{ clearTimeout(t); t = setTimeout(()=>{ estado.q = busca.value; aplicar(true); }, 150); });
  marca?.addEventListener('change', ()=>{ estado.marca = marca.value; aplicar(true); });
  disp?.addEventListener('change', ()=>{ estado.disp = disp.checked; aplicar(true); });
  chips.forEach(c=>c.addEventListener('click', ()=>{ estado.genero = c.dataset.genero; aplicar(true); }));
  main.querySelector('[data-lista-limpar]')?.addEventListener('click', ()=>{
    Object.assign(estado, { q:'', genero:'', marca:'', disp:false });
    if(busca) busca.value=''; if(marca) marca.value=''; if(disp) disp.checked=false;
    aplicar(true);
  });

  // Aba da seção visível (Perfumes, Decants, Skincare).
  const abas = [...main.querySelectorAll('.lista-tabs a')];
  const secoes = abas.map(a=>document.querySelector(a.getAttribute('href')));
  function marcarAba(){
    const topo = (document.getElementById('listaFiltros')?.getBoundingClientRect().bottom || 0) + 60;
    let atual = 0;
    secoes.forEach((s,i)=>{ if(s && !s.hidden && s.getBoundingClientRect().top <= topo) atual = i; });
    abas.forEach((a,i)=>a.classList.toggle('is-on', i===atual));
  }
  window.addEventListener('scroll', marcarAba, { passive:true });

  // "Enviar o PDF": abre o compartilhamento do celular (WhatsApp etc.) com o arquivo anexado.
  const baixar = main.querySelector('[data-lista-pdf]');
  const enviar = main.querySelector('[data-lista-enviar]');
  if(baixar && enviar && navigator.canShare && navigator.canShare({ files:[new File([''], 'x.pdf', { type:'application/pdf' })] })){
    enviar.hidden = false;
    let arquivo = null;
    enviar.addEventListener('click', async ()=>{
      try{
        if(!arquivo){
          enviar.textContent = 'Preparando…';
          const r = await fetch(baixar.href);
          if(!r.ok) throw new Error('PDF indisponível');
          arquivo = new File([await r.blob()], 'Duna-Lista-de-Precos.pdf', { type:'application/pdf' });
        }
        await navigator.share({ files:[arquivo], title:'Lista de preços · Duna Fragrâncias' });
        enviar.textContent = 'Enviar o PDF';
      }catch(e){
        // Se o celular expirar o gesto enquanto baixa, o arquivo já fica pronto para o próximo toque.
        enviar.textContent = arquivo && e.name==='NotAllowedError' ? 'Toque de novo para enviar' : 'Enviar o PDF';
        if(!arquivo) location.href = baixar.href;
      }
    });
  }

  aplicar(false);
})();
