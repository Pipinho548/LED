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
  var ICON_WHATS = '<path fill="currentColor" stroke="none" d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.88 1.21 3.07.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35m-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.89-9.88 2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.88-9.88 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41z"/>';

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
