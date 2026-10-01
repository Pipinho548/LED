/* Marca que o JavaScript está ativo (o CSS usa .js pra animações que
   precisam de script). Fica num arquivo próprio, carregado no <head>,
   porque a política de segurança (CSP) bloqueia script escrito no HTML. */
document.documentElement.classList.add("js");
