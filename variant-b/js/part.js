const FALLBACK_URL = 'https://example.com/landing';

const CENTER = { x: 840, y: 487.5 };
const PART_X = { left: 0, top: 324, right: 1360 };
const BG_X = { left: 0, top: 0, right: -40 };
const LOGO_CENTER = '160.5px 125.25px';

const part = document.body.dataset.part;

function openClickTag() {
  const clickTag = window.clickTag || FALLBACK_URL;
  window.open(clickTag, '_blank', 'noopener');
}

function buildIntro() {
  const intro = gsap.timeline({ paused: true });
  const originX = CENTER.x - PART_X[part] - BG_X[part];

  intro.from('.bg', {
    scale: 1.08,
    transformOrigin: `${originX}px ${CENTER.y}px`,
    duration: 5,
    ease: 'power2.out',
  }, 0);

  if (part !== 'top') {
    intro.from('.logo', {
      opacity: 0,
      scale: 0.85,
      transformOrigin: LOGO_CENTER,
      duration: 1,
      ease: 'power2.out',
    }, 0.4);
  }

  return intro;
}

document.querySelector('.stage').addEventListener('click', openClickTag);

const intro = buildIntro();
window.addEventListener('load', () => intro.play());
