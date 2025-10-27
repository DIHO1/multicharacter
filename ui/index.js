const COLORS = {
  success: { main: '#22c55e', border: 'rgba(34,197,94,.35)', bg: 'rgba(34,197,94,.12)' },
  error:   { main: '#ef4444', border: 'rgba(239,68,68,.35)', bg: 'rgba(239,68,68,.12)' },
  info:    { main: '#3b82f6', border: 'rgba(59,130,246,.35)', bg: 'rgba(59,130,246,.12)' },
  warning: { main: '#f59e0b', border: 'rgba(245,158,11,.35)', bg: 'rgba(245,158,11,.12)' }
};

const ICONS = {
  success: '<path d="M6 12.5l3.5 3.5L18 7.5" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor"/>',
  error:   '<path d="M15 9l-6 6M9 9l6 6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor"/>',
  info:    '<path d="M12 17v-4m0-4h.01" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor"/>',
  warning: '<path d="M12 8.5v4m0 4h.01" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor"/><path d="M10.2 5.5h3.6a2 2 0 0 1 1.73 1l3.2 5.5a2 2 0 0 1 0 2l-3.2 5.5a2 2 0 0 1-1.73 1h-3.6a2 2 0 0 1-1.73-1l-3.2-5.5a2 2 0 0 1 0-2l3.2-5.5a2 2 0 0 1 1.73-1z" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" fill="none" stroke="currentColor"/>'
};

const POS = ['top-right','top-left','top-middle','bottom-right','bottom-left','bottom-middle','middle-right','middle-left'];

let root = document.getElementById('root');
const lists = {};

function ensureRootAndContainers() {
  if (!root) {
    root = document.getElementById('root');
  }

  if (!root && document.readyState !== 'loading') {
    root = document.createElement('div');
    root.id = 'root';
    (document.body || document.documentElement).appendChild(root);
  }

  if (!root) {
    return false;
  }

  if (!Object.keys(lists).length) {
    POS.forEach(id => {
      const ul = document.createElement('ul');
      ul.id = id; ul.className = 'notification-container';
      root.appendChild(ul);
      lists[id] = ul;
    });
  }

  return true;
}

if (!ensureRootAndContainers()) {
  document.addEventListener('DOMContentLoaded', () => {
    ensureRootAndContainers();
  }, { once: true });
}

const root = document.getElementById('root');
const lists = {};
POS.forEach(id => {
  const ul = document.createElement('ul');
  ul.id = id; ul.className = 'notification-container';
  root.appendChild(ul);
  lists[id] = ul;
});

function iconSVG(type='info'){
  const path = ICONS[type] || ICONS.info;
  return `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke-width="1.4" fill="none" stroke="currentColor"/>
    ${path}
  </svg>`;
}

function push({type='info', title='Powiadomienie', message='', length=3000, position='top-right', sound=true}){

  if (!ensureRootAndContainers()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => push({ type, title, message, length, position, sound }), { once: true });
    }
    return;
  }
  if(!POS.includes(position)) position = 'top-right';
  const li = document.createElement('li');

  const variant = COLORS[type] ? type : 'info';
  const color = COLORS[variant];
  li.innerHTML = `
    <div class="notify" role="status" aria-live="polite" data-variant="${variant}" style="--notify-accent:${color.main};--notify-border:${color.border};--notify-badge:${color.bg}">
      <div class="notify-icon-container">
        <div class="badge">
          ${iconSVG(variant)}
        </div>
      </div>
      <div class="notify-content">
        <h3 class="notify-title">${title}</h3>
        <p class="notify-text">${message}</p>
        <div class="notify-progress"></div>
      </div>
    </div>
  `;

  lists[position].appendChild(li);

  // progress bar
  requestAnimationFrame(() => li.classList.add('animating'));

  // optional sound
  if (sound) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = {success:800,error:300,info:600,warning:450}[type] || 600;
      gain.gain.value = .25;
      gain.gain.exponentialRampToValueAtTime(.01, ctx.currentTime + .12);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + .12);
      setTimeout(() => ctx.close().catch(()=>{}), 250);
    } catch {}
  }

  const closeAt = Number(length) > 0 ? Number(length) : 3000;
  const card = li.querySelector('.notify');
  card.style.setProperty('--notify-length', `${closeAt}ms`);
  const to = setTimeout(() => {
    card.classList.add('fadeOut');
    setTimeout(() => li.remove(), 420);
  }, closeAt);

  // click to dismiss quicker
  card.addEventListener('click', () => { clearTimeout(to); card.classList.add('fadeOut'); setTimeout(()=>li.remove(), 200); });
}

window.addEventListener('message', (e) => {
  const d = e.data;
  if (d && d.action === 'notify') push(d);
});
