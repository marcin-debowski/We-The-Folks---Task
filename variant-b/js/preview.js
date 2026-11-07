const params = new URLSearchParams(location.search);

if (params.get('overlay') === '1') {
  const overlay = document.createElement('img');
  overlay.className = 'overlay';
  overlay.src = 'design/layout.png';
  overlay.alt = '';
  document.querySelector('.fireplace').append(overlay);
}

const frames = document.querySelectorAll('.part');
const readyParts = new Set();

window.addEventListener('message', (event) => {
  if (!event.data || event.data.type !== 'fireplace-ready') {
    return;
  }
  readyParts.add(event.data.part);
  if (readyParts.size === frames.length) {
    frames.forEach((frame) => frame.contentWindow.postMessage({ type: 'fireplace-start' }, '*'));
  }
});
