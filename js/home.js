/* =====================================================================
   PÁGINA INICIAL — comportamento específico do index.html.
   (Nav, menu mobile e ano do rodapé ficam em js/main.js.)
   Fica em arquivo próprio porque a política de segurança (CSP) do site
   bloqueia qualquer script escrito direto no HTML.
   ===================================================================== */

/* HERO — espera as duas fotos carregarem e acende a fita. */
(function(){
  var hero = document.querySelector(".hero");
  if (!hero) return;
  var on = hero.querySelector(".hero-on"), off = hero.querySelector(".hero-off");
  if (!on || !off) return;
  function pronta(img){
    return new Promise(function(ok){
      if (img.complete) return ok();
      img.addEventListener("load", ok, { once: true });
      img.addEventListener("error", ok, { once: true });
    });
  }
  Promise.all([pronta(on), pronta(off)]).then(function(){
    setTimeout(function(){
      hero.classList.add("is-lit", "is-acendendo");
      setTimeout(function(){ hero.classList.remove("is-acendendo"); }, 2000);
    }, 700);
  });
})();

/* FOTOS DOS CARDS — se uma imagem não carregar, some em vez de mostrar o
   ícone de imagem quebrada (antes era um onerror escrito no HTML). */
(function(){
  document.querySelectorAll('img[data-some-se-falhar]').forEach(function(img){
    function some(){ img.remove(); }
    if (img.complete && img.naturalWidth === 0) some();
    else img.addEventListener('error', some, { once: true });
  });
})();

/* REVEAL AO ROLAR — seção institucional: a foto entra da esquerda, o texto
   entra da direita, cada elemento revela só uma vez. */
(function(){
  var reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)){
    reveals.forEach(function(el){ el.classList.add('is-revealed'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if (entry.isIntersecting){
        entry.target.classList.add('is-revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  reveals.forEach(function(el){ io.observe(el); });
})();

/* FORMULÁRIO DE CONTATO — ainda sem backend real (vai ser o enviar.php na
   Locaweb). Já deixa pronto o que é do navegador:
   - valida os campos (o servidor vai validar de novo: isso aqui é só
     ajuda pra quem preenche, não proteção);
   - campo-isca escondido: pessoa não vê nem preenche, robô preenche;
   - trava o botão enquanto envia, pra não mandar duas vezes. */
(function(){
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (!form) return;
  var botao = form.querySelector('button[type="submit"]');
  var enviando = false;

  // telefone (opcional): só números, espaço, parênteses, + e -, de 8 a 30
  var tel = form.querySelector('input[name="telefone"]');
  function confereTelefone(){
    if (!tel) return;
    var v = tel.value.trim();
    tel.setCustomValidity(v === '' || /^[0-9 ()+\-.]{8,30}$/.test(v) ? '' : 'Use só números, espaço, parênteses, + e -.');
  }
  if (tel) tel.addEventListener('input', confereTelefone);

  form.addEventListener('submit', function(e){
    e.preventDefault();
    if (enviando) return;
    confereTelefone();
    if (!form.checkValidity()){
      form.reportValidity();
      return;
    }
    // robô preencheu o campo-isca: finge que deu certo e não envia nada
    var isca = form.querySelector('input[name="site"]');
    if (isca && isca.value) { form.reset(); return; }

    enviando = true;
    if (botao){ botao.disabled = true; botao.setAttribute('aria-busy', 'true'); }

    if (note){
      note.textContent = 'Recebido — mas o envio ainda não está conectado a um serviço real. Configure um backend ou serviço como Formspree/EmailJS pra receber isso de verdade.';
      note.style.color = 'var(--tinta)';
    }
    form.reset();

    // libera o botão de novo depois de um intervalo
    setTimeout(function(){
      enviando = false;
      if (botao){ botao.disabled = false; botao.removeAttribute('aria-busy'); }
    }, 4000);
  });
})();
