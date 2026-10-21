/* =====================================================================
   ASSINATURA DE E-MAIL — usado só em assinatura/index.html.
   Monta a assinatura em HTML "de e-mail": tabela, estilo escrito em cada
   elemento e fonte Arial, porque Outlook e Gmail ignoram CSS de página e
   não carregam fonte da web. A logo vem do site (endereço completo), então
   quem recebe vê a imagem sem anexo.
   ===================================================================== */
(function(){
  var form = document.getElementById('dados');
  var saida = document.getElementById('assinatura');
  var botao = document.getElementById('copiar');
  var aviso = document.getElementById('aviso');
  if (!form || !saida) return;

  var LOGO = 'https://iluminiumbrasil.com.br/images/assinatura/logo-iluminium.png';
  var SITE = 'https://iluminiumbrasil.com.br';
  var FIXO = '(54) 2222-0277';

  var MODELOS = {
    pessoa:    { nome: 'Felipe Godinho', cargo: 'Comercial', celular: '(54) 99934-3858', tipo: 'whats', email: 'felipe@iluminiumbrasil.com.br' },
    comercial: { nome: 'Equipe Comercial', cargo: 'Iluminium Brasil', celular: '(54) 93380-6227', tipo: 'whats', email: 'comercial@iluminiumbrasil.com.br' }
  };

  function esc(t){
    return String(t).replace(/[&<>"']/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; });
  }
  function digitos(t){ return String(t).replace(/\D/g, ''); }
  // (54) 99934-3858 -> 5554999343858 (WhatsApp) / +5554999343858 (ligação)
  function internacional(t){ var d = digitos(t); return d.length <= 11 ? '55' + d : d; }

  var LINK = 'color:#183C32;text-decoration:none;';
  var TXT = 'font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#142320;';

  function linha(rotulo, conteudo){
    return '<tr><td style="' + TXT + 'color:#5C6A64;padding-right:10px;white-space:nowrap;">' + rotulo + '</td>' +
           '<td style="' + TXT + '">' + conteudo + '</td></tr>';
  }

  function montar(){
    var d = {
      nome: form.nome.value.trim(),
      cargo: form.cargo.value.trim(),
      celular: form.celular.value.trim(),
      tipo: form.tipo.value,
      email: form.email.value.trim()
    };
    var linhas = '';
    if (d.celular){
      linhas += d.tipo === 'whats'
        ? linha('WhatsApp', '<a href="https://wa.me/' + internacional(d.celular) + '" style="' + LINK + '">' + esc(d.celular) + '</a>')
        : linha('Celular', '<a href="tel:+' + internacional(d.celular) + '" style="' + LINK + '">' + esc(d.celular) + '</a>');
    }
    linhas += linha('Telefone', '<a href="tel:+555422220277" style="' + LINK + '">' + FIXO + '</a>');
    if (d.email) linhas += linha('E-mail', '<a href="mailto:' + esc(d.email) + '" style="' + LINK + '">' + esc(d.email) + '</a>');
    linhas += linha('Site', '<a href="' + SITE + '" style="' + LINK + 'font-weight:bold;">iluminiumbrasil.com.br</a>');

    saida.innerHTML =
      '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">' +
        '<tr>' +
          // logo à esquerda, separada por uma linha na cor da luz (3000K), como a fita acesa
          '<td valign="middle" style="padding:0 20px 0 0;border-right:2px solid #F6B04F;">' +
            '<a href="' + SITE + '"><img src="' + LOGO + '" width="96" height="82" alt="Iluminium Brasil" style="display:block;border:0;width:96px;height:82px;"></a>' +
          '</td>' +
          '<td valign="middle" style="padding:0 0 0 20px;">' +
            '<div style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:22px;font-weight:bold;color:#183C32;">' + esc(d.nome || 'Seu nome') + '</div>' +
            (d.cargo ? '<div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;color:#5C6A64;padding-bottom:8px;">' + esc(d.cargo) + '</div>' : '') +
            '<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">' + linhas + '</table>' +
          '</td>' +
        '</tr>' +
        '<tr><td colspan="2" style="padding-top:14px;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:16px;color:#7A5A1C;font-weight:bold;">Ideias que inspiram. Soluções que iluminam.</td></tr>' +
      '</table>';
    if (aviso) aviso.textContent = '';
  }

  // botões de modelo: "Pessoa" (cada um troca pelos seus dados) e "Caixa do comercial"
  var botoesModelo = document.querySelectorAll('[data-modelo]');
  botoesModelo.forEach(function(b){
    b.addEventListener('click', function(){
      var m = MODELOS[b.getAttribute('data-modelo')];
      Object.keys(m).forEach(function(k){ form[k].value = m[k]; });
      botoesModelo.forEach(function(x){ x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      montar();
    });
  });

  form.addEventListener('input', montar);
  form.addEventListener('change', montar);

  // copia como texto formatado (não como código), pra colar direto no Outlook
  if (botao) botao.addEventListener('click', function(){
    var faixa = document.createRange();
    faixa.selectNodeContents(saida);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(faixa);
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    sel.removeAllRanges();
    if (aviso) aviso.textContent = ok
      ? 'Copiada. Agora cole no Outlook com Ctrl + V.'
      : 'Não deu pra copiar sozinho: selecione a assinatura com o mouse e use Ctrl + C.';
  });

  montar();
})();
