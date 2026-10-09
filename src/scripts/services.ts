// Progressive enhancement for the services section.
// Without JS (or on touch / small screens / reduced motion) it is a native, swipeable, keyboard-scrollable
// scroll-snap row. On large screens we "pin" the section and map vertical scroll to horizontal movement.
const root = document.querySelector<HTMLElement>('[data-services]');

if (root) {
  const scroller = root.querySelector<HTMLElement>('.services__scroller')!;
  const track = root.querySelector<HTMLElement>('.services__track')!;
  const slides = Array.from(track.querySelectorAll<HTMLElement>('.slide'));
  const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (pointer: fine)');
  let ticking = false;

  const progress = () => {
    const total = root.offsetHeight - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -root.getBoundingClientRect().top / total)) : 0;
  };

  const render = () => {
    ticking = false;
    const dist = (slides.length - 1) * scroller.clientWidth;
    const p = progress();
    track.style.transform = `translate3d(${-p * dist}px,0,0)`;
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(render);
    }
  };

  // Keyboard users tabbing into an off-screen slide: scroll the page to the matching position.
  const onFocusIn = (e: FocusEvent) => {
    const idx = slides.findIndex((s) => s.contains(e.target as Node));
    if (idx < 0) return;
    const total = root.offsetHeight - window.innerHeight;
    window.scrollTo({ top: root.offsetTop + (idx / (slides.length - 1)) * total });
  };

  const apply = () => {
    if (mq.matches) {
      root.classList.add('is-pinned');
      scroller.removeAttribute('tabindex');
      scroller.removeAttribute('role');
      scroller.removeAttribute('aria-label');
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      track.addEventListener('focusin', onFocusIn);
      render();
    } else {
      root.classList.remove('is-pinned');
      scroller.setAttribute('tabindex', '0');
      scroller.setAttribute('role', 'region');
      scroller.setAttribute('aria-label', 'Services, scroll sideways to browse');
      track.style.transform = '';
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      track.removeEventListener('focusin', onFocusIn);
    }
  };

  mq.addEventListener('change', apply);
  apply();
}
