const FALLBACK_URL = 'https://example.com/landing';

function openClickTag() {
  const clickTag = window.clickTag || FALLBACK_URL;
  window.open(clickTag, '_blank', 'noopener');
}

document.querySelector('.stage').addEventListener('click', openClickTag);
