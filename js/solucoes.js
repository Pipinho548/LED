/* =====================================================================
   VITRINE "A DIFERENÇA ESTÁ NA LUZ" — dois ambientes reais (cozinha e
   quarto), cada um fotografado nas 3 temperaturas de cor. A foto visível
   em cada instante é sempre: ambiente escolhido + (apagada, ou acesa na
   cor escolhida se o interruptor estiver ligado). Nada de filtro CSS.
   ===================================================================== */
(function(){
  var pframe = document.getElementById('pframe');
  var allImgs = document.querySelectorAll('#pframe .pimg');
  var ambienteTabs = document.querySelectorAll('.ambiente-tab');
  var luzSwitch = document.getElementById('luzSwitch');
  var luzSwitchState = document.getElementById('luzSwitchState');
  var swatchItems = document.querySelectorAll('.swatch-item');
  if (!pframe || !allImgs.length || !luzSwitch) return;

  var state = { ambiente: 'cozinha', color: 'quente', isLit: false };

  function render(){
    allImgs.forEach(function(img){
      var isOff = img.classList.contains('pimg-off');
      var sameAmbiente = img.getAttribute('data-ambiente') === state.ambiente;
      var show = sameAmbiente && (isOff ? !state.isLit : (state.isLit && img.getAttribute('data-color') === state.color));
      img.classList.toggle('is-shown', show);
    });
  }

  // ---------- abas de ambiente ----------
  ambienteTabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      state.ambiente = tab.getAttribute('data-ambiente');
      ambienteTabs.forEach(function(t){
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-pressed', String(t === tab));
      });
      render();
    });
  });

  // ---------- interruptor liga/desliga a foto acesa ----------
  var clickSound2 = new Audio('audio/switch-4.mp3');
  clickSound2.preload = 'none'; /* só busca o arquivo se a pessoa realmente clicar no interruptor */
  clickSound2.volume = 0.85;

  function playClick2(on){
    try{
      var snd = clickSound2.cloneNode(true);
      snd.volume = 0.85;
      snd.playbackRate = on ? 1 : 0.9;
      snd.play().catch(function(){});
    } catch(e){}
  }

  luzSwitch.addEventListener('click', function(){
    state.isLit = !state.isLit;
    luzSwitch.classList.toggle('is-on', state.isLit);
    luzSwitch.setAttribute('aria-pressed', String(state.isLit));
    if (luzSwitchState){
      luzSwitchState.textContent = state.isLit ? 'Ligado' : 'Desligado';
      luzSwitchState.classList.toggle('is-on', state.isLit);
    }
    playClick2(state.isLit);
    render();
  });

  // ---------- temperatura de cor: cada swatch mostra a foto real daquela cor ----------
  swatchItems.forEach(function(btn){
    btn.addEventListener('click', function(){
      state.color = btn.getAttribute('data-color');
      swatchItems.forEach(function(s){ s.classList.remove('is-active'); });
      btn.classList.add('is-active');
      render();
    });
  });

  render();
})();
