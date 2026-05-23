// ============ NAV SCROLL ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.style.background = window.scrollY > 40
    ? 'rgba(8,8,8,0.97)'
    : 'rgba(8,8,8,0.85)';
});

// ============ MODULE TABS ============
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

// ============ COUNTER ANIMATION ============
function animateCounter(el, target, duration = 1400) {
  const isVersion = target === 1211;
  let start = 0;
  const step = Math.ceil(target / (duration / 16));
  const timer = setInterval(() => {
    start = Math.min(start + step, target);
    if (isVersion) {
      el.textContent = (start / 100).toFixed(2).replace('.', '.').slice(0, 4);
    } else {
      el.textContent = start === 0 ? '$0' : start + (el.dataset.target == 24 ? '/7' : '+');
    }
    if (start >= target) clearInterval(timer);
  }, 16);
}

// Special display logic
function formatStat(el, value) {
  const t = parseInt(el.dataset.target);
  if (t === 0) return '$0';
  if (t === 24) return '24/7';
  if (t === 1211) return '1.21+';
  return value + '+';
}

const counters = document.querySelectorAll('.stat-num');
let counted = false;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !counted) {
      counted = true;
      counters.forEach(el => {
        const target = parseInt(el.dataset.target);
        if (target === 0) { el.textContent = '$0'; return; }
        if (target === 24) {
          let n = 0;
          const t = setInterval(() => {
            n = Math.min(n + 1, 24);
            el.textContent = n + '/7';
            if (n >= 24) clearInterval(t);
          }, 40);
          return;
        }
        if (target === 1211) {
          el.textContent = '1.21+';
          return;
        }
        let n = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const t = setInterval(() => {
          n = Math.min(n + step, target);
          el.textContent = n + '+';
          if (n >= target) clearInterval(t);
        }, 20);
      });
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) observer.observe(statsBar);

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.feature-card, .step, .module-tag');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 30);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});
