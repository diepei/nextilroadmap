'use strict';
(() => {
  const button = document.querySelector('.menu-button');
  const navigation = document.getElementById('site-navigation');
  const mobile = window.matchMedia('(max-width: 760px)');
  const background = document.querySelectorAll('main, footer, .skip');
  let open = false;

  function setOpen(value, restoreFocus = false) {
    open = value && mobile.matches;
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Cerrar navegación' : 'Abrir navegación');
    document.body.classList.toggle('navigation-open', open);
    navigation.inert = mobile.matches && !open;
    background.forEach(element => { element.inert = open; });
    if (restoreFocus) button.focus();
  }

  button.addEventListener('click', () => setOpen(!open));
  navigation.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link || !open) return;
    setOpen(false);
    const target = document.querySelector(link.hash);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  });
  document.querySelector('.brand').addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') setOpen(false, true);
    if (event.key === 'Tab') {
      const controls = [...document.querySelectorAll('header a, header button')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  mobile.addEventListener('change', () => setOpen(false));
  setOpen(false);
})();
