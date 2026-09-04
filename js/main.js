/* =====================================================================
   COMPORTAMENTO COMPARTILHADO — menu e rodapé.
   Usado em TODAS as páginas do site (index.html e produtos/*.html).
   ===================================================================== */

/* NAV — troca de transparente para verde sólido conforme a rolagem. */
(function(){
  var nav = document.getElementById('siteNav');
  if (!nav) return;
  function onScroll(){
    nav.classList.toggle('is-solid', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* MENU MOBILE — abre/fecha o painel com os links, fecha ao clicar num
   link, ao rolar pra tela grande, ou ao apertar Esc. */
(function(){
  var burger = document.getElementById('navBurger');
  var menu = document.getElementById('navMobileMenu');
  if (!burger || !menu) return;

  function closeMenu(){
    burger.classList.remove('is-open');
    menu.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMenu(){
    burger.classList.add('is-open');
    menu.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  burger.addEventListener('click', function(){
    var isOpen = menu.classList.contains('is-open');
    if (isOpen) closeMenu(); else openMenu();
  });

  menu.querySelectorAll('a').forEach(function(link){
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });

  // se a pessoa girar o celular ou aumentar a janela pra desktop, fecha o painel
  window.addEventListener('resize', function(){
    if (window.innerWidth > 860) closeMenu();
  });
})();

/* footer: ano atual automático */
(function(){
  var y = document.getElementById('footerYear');
  if (y) y.textContent = new Date().getFullYear();
})();
