'use strict';
window.addEventListener('load', () => {
  if (!window.gsap || !window.ScrollTrigger || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add('(min-width: 1000px)', () => {
    gsap.fromTo('.inline-image', {scale: .8}, {scale: 1, scrollTrigger: {trigger: '#platform', start: 'top 90%', end: 'top 45%', scrub: true}});
    gsap.to('.inline-image', {opacity: .2, scrollTrigger: {trigger: '#platform', start: 'bottom 25%', end: 'bottom top', scrub: true}});
    gsap.utils.toArray('.result-card').forEach((card, i) => {
      gsap.fromTo(card, {y: 18 * i}, {y: 0, ease: 'none', scrollTrigger: {trigger: '#results-snapshot', start: 'top 90%', end: 'top 55%', scrub: true}});
    });
  });
});
