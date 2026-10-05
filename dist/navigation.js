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
  document.addEventListener('click', event => {
    const control = event.target.closest('[data-nav-target]');
    if (!control) return;
    const target = document.getElementById(control.dataset.navTarget);
    if (!target) return;
    if (open) setOpen(false);
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (control.closest('nav')) {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
    }
  });
  document.addEventListener('keydown', event => {
    if (!open) return;
    if (event.key === 'Escape') setOpen(false, true);
    if (event.key === 'Tab') {
      const controls = [...document.querySelectorAll('header .brand, header button')];
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
