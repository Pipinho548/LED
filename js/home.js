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

/* FORMULÁRIO DE CONTATO — envia pelo Web3Forms (20/10/2026): a mensagem chega
   por e-mail no comercial@iluminiumbrasil.com.br (o e-mail da conta Web3Forms).
   A chave abaixo é PÚBLICA por natureza (só serve pra mandar pra esse e-mail),
   pode ficar no repositório. Responder o e-mail recebido responde o cliente.
   - valida os campos (ajuda pra quem preenche, não proteção);
   - campo-isca escondido: pessoa não vê nem preenche, robô preenche;
   - trava o botão enquanto envia, pra não mandar duas vezes. */
(function(){
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (!form) return;
  var botao = form.querySelector('button[type="submit"]');
  var enviando = false;
  var CHAVE_WEB3FORMS = '9eb00483-67ee-4f64-a184-5ac4cdf8d7d1';

  function aviso(texto, cor){
    if (!note) return;
    note.textContent = texto;
    note.style.color = cor || 'var(--tinta)';
  }

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
    aviso('Enviando…');

    var assunto = form.querySelector('select[name="assunto"]');
    var assuntoTexto = assunto ? assunto.options[assunto.selectedIndex].text : 'Contato';
    var dados = {
      access_key: CHAVE_WEB3FORMS,
      subject: 'Site Iluminium — ' + assuntoTexto,
      from_name: 'Site Iluminium Brasil',
      nome: form.nome.value.trim(),
      email: form.email.value.trim(),          // o Web3Forms usa este como "responder para"
      telefone: form.telefone.value.trim() || '—',
      assunto: assuntoTexto,
      mensagem: form.mensagem.value.trim()
    };

    function libera(){
      enviando = false;
      if (botao){ botao.disabled = false; botao.removeAttribute('aria-busy'); }
    }

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(dados)
    })
      .then(function(r){ return r.json().then(function(j){ return { ok: r.ok && j.success, j: j }; }); })
      .then(function(res){
        if (res.ok){
          aviso('Mensagem enviada. Respondemos pelo e-mail que você informou.', 'var(--verde)');
          form.reset();
        } else {
          aviso('Não conseguimos enviar agora. Tente de novo ou escreva para comercial@iluminiumbrasil.com.br.', '#9B2C2C');
        }
        libera();
      })
      .catch(function(){
        aviso('Não conseguimos enviar agora. Tente de novo ou escreva para comercial@iluminiumbrasil.com.br.', '#9B2C2C');
        libera();
      });
  });
})();
