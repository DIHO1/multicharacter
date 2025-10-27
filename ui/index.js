const COLORS = {
  success: {main:'#22c55e', border:'rgba(34,197,94,.35)', bg:'rgba(34,197,94,.12)'},
  error:   {main:'#ef4444', border:'rgba(239,68,68,.35)', bg:'rgba(239,68,68,.12)'},
  info:    {main:'#3b82f6', border:'rgba(59,130,246,.35)', bg:'rgba(59,130,246,.12)'},
  warning: {main:'#f59e0b', border:'rgba(245,158,11,.35)', bg:'rgba(245,158,11,.12)'}
};

const POS = ['top-right','top-left','top-middle','bottom-right','bottom-left','bottom-middle','middle-right','middle-left'];

const root = document.getElementById('root');
const lists = {};
POS.forEach(id => {
  const ul = document.createElement('ul');
  ul.id = id; ul.className = 'notification-container';
  root.appendChild(ul);
  lists[id] = ul;
});

function iconSVG(color='#111827'){
  return `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="${color}" aria-hidden="true">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1 14-4-4 1.4-1.4L11 12.2l4.6-4.6L17 9l-6 7z"/>
  </svg>`;
}

function push({type='info', title='Powiadomienie', message='', length=3000, position='top-right', sound=true}){
  if(!POS.includes(position)) position = 'top-right';
  const li = document.createElement('li');

  const color = COLORS[type] || COLORS.info;
  li.innerHTML = `
    <div class="notify" role="status" aria-live="polite">
      <div class="notify-icon-container">
        <div class="badge" style="border-color:${color.border};background:${color.bg}">
          ${iconSVG('#1f2937')}
        </div>
      </div>
      <div class="notify-content">
        <h3 class="notify-title">${title}</h3>
        <p class="notify-text">${message}</p>
        <div class="notify-progress" style="background:${color.main}"></div>
      </div>
    </div>
  `;

  lists[position].appendChild(li);

  // progress bar
  const bar = li.querySelector('.notify-progress');
  requestAnimationFrame(() => requestAnimationFrame(() => bar.style.width = '100%'));

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
