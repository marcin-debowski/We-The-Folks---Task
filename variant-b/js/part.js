const FALLBACK_URL = 'https://example.com/landing';

const CENTER = { x: 840, y: 487.5 };
const PART_X = { left: 0, top: 324, right: 1360 };
const LOGO_CENTER = '160.5px 125.25px';
const PRODUCT_CENTER = { left: '162.7px 480.5px', right: '182px 430px' };

const part = document.body.dataset.part;

function openClickTag() {
  const clickTag = window.clickTag || FALLBACK_URL;
  window.open(clickTag, '_blank', 'noopener');
}

function buildIntro() {
  const intro = gsap.timeline({ paused: true });
  const originX = CENTER.x - PART_X[part];

  intro.from('.scene', {
    scale: 1.08,
    transformOrigin: `${originX}px ${CENTER.y}px`,
    duration: 5,
    ease: 'power2.out',
  }, 0);

  if (part === 'top') {
    intro.from('.headline', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.4,
    }, 0.9);
    return intro;
  }

  intro
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

  return intro;
}

document.querySelector('.stage').addEventListener('click', openClickTag);

const intro = buildIntro();
window.addEventListener('load', () => intro.play());
