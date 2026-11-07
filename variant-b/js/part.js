const FALLBACK_URL = 'https://example.com/landing';

const CENTER = { x: 840, y: 487.5 };
const PART_X = { left: 0, top: 324, right: 1360 };
const LOGO_CENTER = '160.5px 125.25px';
const PRODUCT_CENTER = { left: '162.7px 480.5px', right: '182px 430px' };
const START_FALLBACK_MS = 1500;
const INTRO_END = 5;
const IDLE_END = 30;

const part = document.body.dataset.part;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function openClickTag() {
  const clickTag = window.clickTag || FALLBACK_URL;
  window.open(clickTag, '_blank', 'noopener');
}

function buildAnimation() {
  const animation = gsap.timeline({ paused: true });
  const originX = CENTER.x - PART_X[part];

  gsap.set('.scene', { transformOrigin: `${originX}px ${CENTER.y}px` });

  animation.from('.scene', {
    scale: 1.08,
    duration: INTRO_END,
    ease: 'power2.out',
  }, 0);

  if (part === 'top') {
    animation.from('.headline', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.4,
    }, 0.9);
  } else {
    animation
      .from('.logo', {
        opacity: 0,
        scale: 0.85,
        transformOrigin: LOGO_CENTER,
        duration: 1,
        ease: 'power2.out',
      }, 0.4)
      .from('.product', {
        scale: 1.15,
        rotation: -1.5,
        transformOrigin: PRODUCT_CENTER[part],
        duration: 1.6,
        ease: 'power3.out',
      }, 0.6)
      .from('.panel', { opacity: 0, y: 30, duration: 0.8, ease: 'power2.out' }, 1.8)
      .from('.copy', { opacity: 0, y: 15, duration: 0.7, ease: 'power2.out' }, 2.3)
      .from('.cta', { opacity: 0, scale: 0.6, duration: 0.6, ease: 'back.out(2)' }, 3);

    const pulse = gsap.timeline({ repeat: 6, repeatDelay: 3 });
    pulse.to('.cta', { scale: 1.06, duration: 0.4, ease: 'sine.inOut', yoyo: true, repeat: 1 });
    animation.add(pulse, INTRO_END);
  }

  animation.to('.scene', {
    scale: 1.03,
    duration: (IDLE_END - INTRO_END) / 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: 3,
  }, INTRO_END);

  return animation;
}

document.querySelector('.stage').addEventListener('click', openClickTag);

const animation = buildAnimation();
let fallbackTimer;

if (reduceMotion) {
  animation.progress(1);
}

function startAnimation() {
  clearTimeout(fallbackTimer);
  animation.play();
}

window.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'fireplace-start') {
    startAnimation();
  }
});

window.addEventListener('load', () => {
  if (window.parent === window) {
    startAnimation();
    return;
  }
  window.parent.postMessage({ type: 'fireplace-ready', part }, '*');
  fallbackTimer = setTimeout(startAnimation, START_FALLBACK_MS);
});
