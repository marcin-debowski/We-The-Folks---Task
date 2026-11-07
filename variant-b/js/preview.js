const params = new URLSearchParams(location.search);

if (params.get('overlay') === '1') {
  const overlay = document.createElement('img');
  overlay.className = 'overlay';
  overlay.src = 'design/layout.png';
  overlay.alt = '';
  document.querySelector('.fireplace').append(overlay);
}
