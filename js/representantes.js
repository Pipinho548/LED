/* =====================================================================
   REPRESENTANTES — mapa clicável (desktop) + lista suspensa (celular).
   Estados com representante cadastrado mostram o contato da região;
   os demais mostram os dados da própria fábrica como alternativa.
   Usado só em representantes.html.
   ===================================================================== */
(function(){
  var mapWrap = document.getElementById('mapWrap');
  var select = document.getElementById('repStateSelect');
  var panel = document.getElementById('repPanel');
  if (!mapWrap || !panel) return;

  // dados de quem já tem representante — troque/adicione estados aqui
  // conforme forem fechando novos escritórios de representação
  var STATE_REPS = {
    RS: { office: 'Escritório Sul', city: 'Porto Alegre, RS', phone: '(00) 0000-0000', whatsapp: '5500000000000', email: 'sul@iluminiumbrasil.com.br' },
    SC: { office: 'Escritório Sul', city: 'Florianópolis, SC', phone: '(00) 0000-0000', whatsapp: '5500000000000', email: 'sul@iluminiumbrasil.com.br' },
    PR: { office: 'Escritório Sul', city: 'Curitiba, PR', phone: '(00) 0000-0000', whatsapp: '5500000000000', email: 'sul@iluminiumbrasil.com.br' }
  };

  // dados da fábrica — usados como alternativa pros estados que ainda não têm representante
  var FACTORY = { phone: '(00) 0000-0000', whatsapp: '5500000000000', email: 'contato@iluminiumbrasil.com.br' };

  function contactRow(iconPath, text, href){
    return '<a class="rep-contact-row" href="' + href + '" target="_blank" rel="noopener">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + iconPath + '</svg>' +
      '<span>' + text + '</span></a>';
  }

  var ICON_PHONE = '<path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2C10.5 20 4 13.5 4 5a2 2 0 0 1 2-2z"/>';
  var ICON_MAIL = '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>';
  var ICON_WHATS = '<path d="M20 12a8 8 0 1 1-3.6-6.7M20 12l-7-2 2 7"/>';

  function renderState(uf, name){
    var rep = STATE_REPS[uf];
    var html = '';

    if (rep){
      html += '<div class="rep-eyebrow">' + name + '</div>';
      html += '<h3>' + rep.office + '</h3>';
      html += '<div class="rep-city">' + rep.city + '</div>';
      html += '<div class="rep-contacts">';
      html += contactRow(ICON_WHATS, 'WhatsApp', 'https://wa.me/' + rep.whatsapp);
      html += contactRow(ICON_MAIL, rep.email, 'mailto:' + rep.email);
      html += contactRow(ICON_PHONE, rep.phone, 'tel:' + rep.phone.replace(/\D/g,''));
      html += '</div>';
    } else {
      html += '<div class="rep-eyebrow">' + name + '</div>';
      html += '<h3>Ainda sem representante aqui</h3>';
      html += '<p class="rep-fallback-note">Por enquanto, quem atende ' + name + ' é a própria fábrica — fale direto com a gente.</p>';
      html += '<div class="rep-contacts">';
      html += contactRow(ICON_WHATS, 'WhatsApp', 'https://wa.me/' + FACTORY.whatsapp);
      html += contactRow(ICON_MAIL, FACTORY.email, 'mailto:' + FACTORY.email);
      html += contactRow(ICON_PHONE, FACTORY.phone, 'tel:' + FACTORY.phone.replace(/\D/g,''));
      html += '</div>';
    }

    panel.innerHTML = html;
  }

  function selectState(uf, name){
    renderState(uf, name);
    mapWrap.querySelectorAll('.estado.is-selected').forEach(function(el){ el.classList.remove('is-selected'); });
    var target = mapWrap.querySelector('.estado[data-uf="' + uf + '"]');
    if (target) target.classList.add('is-selected');
    if (select) select.value = uf;
  }

  // liga o clique em cada estado do mapa (svg)
  var estados = mapWrap.querySelectorAll('.estado');
  var optionsData = [];
  estados.forEach(function(el){
    var uf = el.getAttribute('data-uf');
    var name = el.getAttribute('name');
    optionsData.push({ uf: uf, name: name });
    el.addEventListener('click', function(e){
      e.preventDefault();
      selectState(uf, name);
    });
  });

  // popula a lista suspensa (celular) em ordem alfabética, a partir dos proprios dados do mapa
  if (select){
    optionsData.sort(function(a, b){ return a.name.localeCompare(b.name, 'pt-BR'); });
    optionsData.forEach(function(item){
      var opt = document.createElement('option');
      opt.value = item.uf;
      opt.textContent = item.name;
      select.appendChild(opt);
    });
    select.addEventListener('change', function(){
      if (!select.value) return;
      var item = optionsData.filter(function(o){ return o.uf === select.value; })[0];
      if (item) selectState(item.uf, item.name);
    });
  }
})();
