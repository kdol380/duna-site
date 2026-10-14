/* =====================================================================
   🍪  COOKIES E META PIXEL (LGPD)
   - O Pixel é carregado no <head> de cada página, exceto quando a pessoa
     já recusou (localStorage "duna_cookies" = "recusado").
   - Este arquivo mostra o aviso, guarda a escolha e oferece dunaTrack(),
     usado pelos eventos (AddToCart, InitiateCheckout, Contact, ViewContent).
   - Política: privacidade.html. Qualquer elemento com [data-cookie-prefs]
     reabre o aviso.
   ===================================================================== */
(function(){
  var CHAVE = "duna_cookies";
  function ler(){ try{ return localStorage.getItem(CHAVE); }catch(e){ return null; } }
  function gravar(v){ try{ localStorage.setItem(CHAVE, v); }catch(e){} }
  function recusou(){ return ler() === "recusado"; }

  // Envia um evento ao Pixel, só se a pessoa não recusou e o Pixel existe.
  window.dunaTrack = function(evento, dados){
    if(recusou() || typeof window.fbq !== "function") return;
    try{ window.fbq("track", evento, dados || {}); }catch(e){}
  };

  // Clique em qualquer link de WhatsApp = Contact.
  // O botão "Finalizar no WhatsApp" do pedido (#cartSend) envia InitiateCheckout em app.js.
  document.addEventListener("click", function(e){
    var a = e.target && e.target.closest ? e.target.closest('a[href*="wa.me/"]') : null;
    if(!a || a.id === "cartSend") return;
    window.dunaTrack("Contact");
  }, true);

  function apagarCookiesMeta(){
    var host = location.hostname, dominios = ["", host, "." + host, "." + host.replace(/^www\./, "")];
    ["_fbp", "_fbc"].forEach(function(nome){
      dominios.forEach(function(d){
        document.cookie = nome + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/" + (d ? "; domain=" + d : "");
      });
    });
  }

  var raiz = document.querySelector('script[src*="consentimento.js"]');
  var linkPolitica = raiz ? new URL("privacidade.html", raiz.src).href : "privacidade.html";
  // No ar (Cloudflare) os endereços ficam sem .html
  if(/(^|\.)dunafragrancias\.com\.br$/.test(location.hostname)) linkPolitica = linkPolitica.replace(/\.html$/, "");

  var css = ''
  + '.duna-cookie{position:fixed;left:12px;right:12px;bottom:12px;z-index:970;max-width:560px;margin:0 auto;'
  + 'background:#FFFEFB;color:#26221C;border:1px solid #E6DDCA;border-radius:14px;box-shadow:0 10px 30px rgba(22,20,16,.18);'
  + 'padding:16px 18px;font:400 14px/1.5 Jost,system-ui,sans-serif;display:flex;flex-wrap:wrap;gap:12px;align-items:center}'
  + '.duna-cookie[hidden]{display:none}'
  + '.duna-cookie p{margin:0;flex:1 1 280px}'
  + '.duna-cookie a{color:#7a5a1c;text-decoration:underline;text-underline-offset:2px}'
  + '.duna-cookie-acoes{display:flex;gap:8px;flex:0 0 auto;margin-left:auto}'
  + '.duna-cookie button{font:500 13px/1 Jost,system-ui,sans-serif;letter-spacing:.04em;padding:11px 16px;border-radius:999px;cursor:pointer;border:1px solid #26221C;min-height:40px}'
  + '.duna-cookie .dc-recusar{background:transparent;color:#26221C}'
  + '.duna-cookie .dc-ok{background:#26221C;color:#FFFEFB}'
  + '.duna-cookie button:focus-visible{outline:2px solid #B08A3C;outline-offset:2px}'
  + '@media (max-width:860px){body.has-tabbar .duna-cookie{bottom:calc(72px + env(safe-area-inset-bottom))}}'
  + '@media (max-width:480px){.duna-cookie{padding:14px;font-size:13px}.duna-cookie-acoes{width:100%}.duna-cookie button{flex:1}}';

  var aviso = null;
  function montar(){
    if(aviso) return aviso;
    var estilo = document.createElement("style");
    estilo.textContent = css;
    document.head.appendChild(estilo);
    aviso = document.createElement("div");
    aviso.className = "duna-cookie";
    aviso.setAttribute("role", "region");
    aviso.setAttribute("aria-label", "Aviso de cookies");
    aviso.hidden = true;
    aviso.innerHTML = '<p>Usamos cookies da Meta (Facebook e Instagram) para medir as visitas e melhorar nossos anúncios. '
      + 'Você pode recusar. <a href="' + linkPolitica + '">Política de privacidade</a></p>'
      + '<div class="duna-cookie-acoes"><button type="button" class="dc-recusar">Recusar</button>'
      + '<button type="button" class="dc-ok">Ok, entendi</button></div>';
    aviso.querySelector(".dc-ok").addEventListener("click", function(){
      var antes = ler();
      gravar("aceito");
      aviso.hidden = true;
      atualizarStatus();
      // quem tinha recusado e mudou de ideia: o Pixel volta na próxima página
      if(antes === "recusado") location.reload();
    });
    aviso.querySelector(".dc-recusar").addEventListener("click", function(){
      gravar("recusado");
      if(typeof window.fbq === "function"){ try{ window.fbq("consent", "revoke"); }catch(e){} }
      apagarCookiesMeta();
      aviso.hidden = true;
      atualizarStatus();
    });
    document.body.appendChild(aviso);
    return aviso;
  }

  // Texto de status na página de privacidade (se existir)
  function atualizarStatus(){
    document.querySelectorAll("[data-cookie-status]").forEach(function(el){
      el.textContent = recusou() ? "Você recusou os cookies da Meta neste navegador."
        : ler() === "aceito" ? "Você aceitou os cookies da Meta neste navegador."
        : "Você ainda não escolheu. Os cookies da Meta estão ativos.";
    });
  }

  function iniciar(){
    if(!ler()) montar().hidden = false;
    document.addEventListener("click", function(e){
      var b = e.target && e.target.closest ? e.target.closest("[data-cookie-prefs]") : null;
      if(!b) return;
      e.preventDefault();
      var el = montar();
      el.hidden = false;
      el.querySelector(".dc-ok").focus();
    });
    atualizarStatus();
  }
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
