// ===== CANVAS =====
const canvas = document.getElementById('heroCanvas');
const hero = document.querySelector('.hero');
const ctx = canvas ? canvas.getContext('2d') : null;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isSmallScreen = window.matchMedia('(max-width: 768px)').matches;

const diamonds = [
  { size: 18, floatOffset: 0, color: '#818cf8' },
  { size: 12, floatOffset: 1.5, color: '#a855f7' },
  { size: 22, floatOffset: 3, color: '#6366f1' },
  { size: 14, floatOffset: 4.5, color: '#c084fc' },
  { size: 20, floatOffset: 6, color: '#818cf8' },
  { size: 16, floatOffset: 2, color: '#6366f1' },
  { size: 10, floatOffset: 5, color: '#a5b4fc' }
];

let animationFrame = null;
let canvasVisible = true;
let time = 0;

function resizeCanvas() {
  if (!canvas || !hero) return;
  const rect = hero.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(rect.width * dpr);
  canvas.height = Math.floor(rect.height * dpr);
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function drawDiamond(x, y, size, color, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.shadowColor = color;
  ctx.shadowBlur = 28;
  ctx.globalAlpha = alpha * 0.3;
  ctx.fillStyle = color;
  ctx.fillRect(-size / 2 - 4, -size / 2 - 4, size + 4, size + 4);

  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, `${color}66`);
  ctx.shadowBlur = 18;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = gradient;
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.restore();
}

function drawCanvasFrame() {
  if (!ctx || !canvas || !hero || !canvasVisible) return;

  const width = hero.clientWidth;
  const height = hero.clientHeight;
  ctx.clearRect(0, 0, width, height);
  time += isSmallScreen ? 0.004 : 0.006;

  const floatPositions = [
    { xFactor: 0.62, yFactor: 0.08, dIndex: 0 },
    { xFactor: 0.85, yFactor: 0.15, dIndex: 1 },
    { xFactor: 0.95, yFactor: 0.35, dIndex: 2 },
    { xFactor: 0.90, yFactor: 0.60, dIndex: 3 },
    { xFactor: 0.70, yFactor: 0.75, dIndex: 4 },
    { xFactor: 0.55, yFactor: 0.50, dIndex: 5 },
    { xFactor: 0.75, yFactor: 0.92, dIndex: 6 }
  ];

  floatPositions.forEach((pos) => {
    const d = diamonds[pos.dIndex];
    const x = width * pos.xFactor + Math.sin(time + d.floatOffset) * 12;
    const y = height * pos.yFactor + Math.cos(time * 0.8 + d.floatOffset) * 10;
    drawDiamond(x, y, d.size, d.color, 0.9);
  });

  animationFrame = requestAnimationFrame(drawCanvasFrame);
}

if (canvas && ctx && hero && !prefersReducedMotion) {
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas, { passive: true });

  const canvasObserver = new IntersectionObserver((entries) => {
    canvasVisible = entries[0].isIntersecting;
    if (canvasVisible && !animationFrame) drawCanvasFrame();
  }, { threshold: 0 });

  canvasObserver.observe(hero);
  drawCanvasFrame();
}

// ===== TYPEWRITER =====
const roleEl = document.querySelector('.hero-role');
const roles = ['Frontend Developer', 'Bot Developer', 'Creative Coder', 'Problem Solver'];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

if (roleEl && !prefersReducedMotion) {
  roleEl.setAttribute('aria-live', 'polite');

  function typeWriter() {
    const current = roles[roleIndex];
    const text = isDeleting
      ? current.substring(0, charIndex - 1)
      : current.substring(0, charIndex + 1);

    roleEl.textContent = `${text} |`;
    charIndex += isDeleting ? -1 : 1;

    let delay = isDeleting ? 55 : 90;
    if (!isDeleting && charIndex === current.length) {
      delay = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    window.setTimeout(typeWriter, delay);
  }

  typeWriter();
} else if (roleEl) {
  roleEl.textContent = roles[0];
}

// ===== SKILL BARS =====
const skillBars = document.querySelectorAll('.skill-bar-fill');
if ('IntersectionObserver' in window) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = `${entry.target.getAttribute('data-width')}%`;
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach((bar) => skillObserver.observe(bar));
} else {
  skillBars.forEach((bar) => {
    bar.style.width = `${bar.getAttribute('data-width')}%`;
  });
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.stat-card, .skill-bar-item, .section-label, .projects-header');
if (prefersReducedMotion) {
  revealElements.forEach((el) => {
    el.style.opacity = '1';
    el.style.transform = 'none';
  });
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
  });
}

// ===== CAROUSEL =====
const track = document.getElementById('carouselTrack');
const dots = Array.from(document.querySelectorAll('.dot'));
const cards = Array.from(document.querySelectorAll('.project-card'));
let currentSlide = 0;

function getCardWidth() {
  if (!track || !cards.length) return 0;
  return cards[0].getBoundingClientRect().width;
}

function goToSlide(index, animate = true) {
  if (!track || !cards.length) return;
  currentSlide = Math.max(0, Math.min(index, cards.length - 1));
  const cardWidth = getCardWidth();
  track.style.transition = animate ? 'transform 0.4s ease' : 'none';
  track.style.transform = `translate3d(-${currentSlide * cardWidth}px, 0, 0)`;

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentSlide);
    dot.setAttribute('aria-current', i === currentSlide ? 'true' : 'false');
  });
}

dots.forEach((dot, index) => {
  dot.setAttribute('role', 'button');
  dot.setAttribute('tabindex', '0');
  dot.setAttribute('aria-label', `Show project ${index + 1}`);
  dot.addEventListener('click', () => goToSlide(index));
  dot.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      goToSlide(index);
    }
  });
});

if (track && cards.length) {
  let startX = 0;
  let startY = 0;

  track.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  }, { passive: true });

  track.addEventListener('touchend', (event) => {
    const diffX = startX - event.changedTouches[0].clientX;
    const diffY = startY - event.changedTouches[0].clientY;
    if (Math.abs(diffX) <= Math.abs(diffY) || Math.abs(diffX) < 50) return;

    if (diffX > 0) goToSlide(currentSlide + 1);
    else goToSlide(currentSlide - 1);
  }, { passive: true });

  window.addEventListener('resize', () => goToSlide(currentSlide, false), { passive: true });
  goToSlide(0, false);
}

// ===== MOBILE NAV ACTIVE =====
const navItems = document.querySelectorAll('.mob-nav-item');
const sectionLinks = Array.from(navItems).filter((item) => item.getAttribute('href')?.startsWith('#'));
const sections = sectionLinks
  .map((item) => document.querySelector(item.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    navItems.forEach((item) => {
      item.classList.toggle('active', item.getAttribute('href') === `#${visible.target.id}`);
    });
  }, { rootMargin: '-25% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] });

  sections.forEach((section) => navObserver.observe(section));
}

// ===== COUNT UP STATS =====
const statNumbers = document.querySelectorAll('.stat-card h3');
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const text = el.textContent.trim();
      const target = parseInt(text, 10);
      const suffix = text.replace(String(target), '');
      const duration = 1200;
      const start = performance.now();

      function updateCount(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = `${Math.floor(target * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(updateCount);
      }

      requestAnimationFrame(updateCount);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach((el) => countObserver.observe(el));
}
