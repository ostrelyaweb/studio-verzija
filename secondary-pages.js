document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion || !('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  elements.forEach((element, index) => {
    element.style.setProperty('--reveal-order', index % 3);
    observer.observe(element);
  });
});
