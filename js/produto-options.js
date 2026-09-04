/* =====================================================================
   SELETORES DE OPÇÃO — nas páginas de variante de produto (medida, cor,
   temperatura). Cada grupo .option-pills funciona como um rádio: clicar
   marca aquele botão e desmarca os outros do mesmo grupo. Só visual —
   não troca foto nem manda nada pro WhatsApp sozinho.
   ===================================================================== */
(function(){
  document.querySelectorAll('.option-pills').forEach(function(group){
    var pills = group.querySelectorAll('.option-pill');
    pills.forEach(function(pill){
      pill.addEventListener('click', function(){
        pills.forEach(function(p){ p.classList.remove('is-active'); });
        pill.classList.add('is-active');
      });
    });
  });
})();
