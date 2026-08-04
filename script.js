// ===== CANVAS =====
const canvas = document.getElementById('heroCanvas');
const ctx = canvas.getContext('2d');
const hero = document.querySelector('.hero');

function resizeCanvas() {
  canvas.width = hero.offsetWidth;
  canvas.height = hero.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const diamonds = [
  { size: 18, floatOffset: 0, color: '#a855f7' },
  { size: 12, floatOffset: 1.5, color: '#c084fc' },
  { size: 22, floatOffset: 3, color: '#7c3aed' },
  { size: 14, floatOffset: 4.5, color: '#d8b4fe' },
  { size: 20, floatOffset: 6, color: '#a855f7' },
  { size: 16, floatOffset: 2, color: '#c084fc' },
  { size: 10, floatOffset: 5, color: '#d8b4fe' },
];

let time = 0;

function drawDiamond(x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.PI / 4);
  ctx.shadowColor = color;
  ctx.shadowBlur = 40;
  ctx.globalAlpha = (alpha || 1) * 0.3;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.rect(-size/2-4, -size/2-4, size+8, size+8);
  ctx.fill();
  const gradient = ctx.createLinearGradient(-size, -size, size, size);
  gradient.addColorStop(0, '#ffffff');
  gradient.addColorStop(0.3, color);
  gradient.addColorStop(1, color + '66');
  ctx.shadowBlur = 25;
  ctx.globalAlpha = alpha || 1;
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.rect(-size/2, -size/2, size, size);
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.globalAlpha = (alpha || 1) * 0.9;
  const shine = ctx.createLinearGradient(-size/2, -size/2, 0, 0);
  shine.addColorStop(0, 'rgba(255,255,255,0.95)');
  shine.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = shine;
  ctx.beginPath();
  ctx.rect(-size/2, -size/2, size*0.6, size*0.6);
  ctx.fill();
  ctx.restore();
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.006;
  const floatPositions = [
    { xFactor: 0.62, yFactor: 0.08, dIndex: 0 },
    { xFactor: 0.85, yFactor: 0.15, dIndex: 1 },
    { xFactor: 0.95, yFactor: 0.35, dIndex: 2 },
    { xFactor: 0.90, yFactor: 0.60, dIndex: 3 },
    { xFactor: 0.70, yFactor: 0.75, dIndex: 4 },
    { xFactor: 0.55, yFactor: 0.50, dIndex: 5 },
    { xFactor: 0.75, yFactor: 0.92, dIndex: 6 },
  ];
  floatPositions.forEach(function(pos) {
    const d = diamonds[pos.dIndex];
    const x = canvas.width * pos.xFactor + Math.sin(time + d.floatOffset) * 12;
    const y = canvas.height * pos.yFactor + Math.cos(time * 0.8 + d.floatOffset) * 10;
    drawDiamond(x, y, d.size, d.color, 0.9);
  });
  requestAnimationFrame(animate);
}
animate();

// ===== TYPEWRITER =====
const roleEl = document.querySelector('.hero-role');
const roles = ['Frontend Developer','Bot Developer','Creative Coder','Problem Solver'];
let roleIndex = 0, charIndex = 0, isDeleting = false;

function typeWriter() {
  const current = roles[roleIndex];
  if (isDeleting) {
    roleEl.textContent = current.substring(0, charIndex - 1) + ' |';
    charIndex--;
  } else {
    roleEl.textContent = current.substring(0, charIndex + 1) + ' |';
    charIndex++;
  }
  if (!isDeleting && charIndex === current.length) {
    setTimeout(function() { isDeleting = true; }, 1500);
  }
  if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }
  setTimeout(typeWriter, isDeleting ? 60 : 100);
}
typeWriter();

// ===== SKILL BARS =====
const skillBars = document.querySelectorAll('.skill-bar-fill');
const skillObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.width = entry.target.getAttribute('data-width') + '%';
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
skillBars.forEach(function(bar) { skillObserver.observe(bar); });

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.stat-card, .skill-bar-item, .section-label, .projects-header');
const revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealElements.forEach(function(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  revealObserver.observe(el);
});

// ===== CAROUSEL =====
const track = document.getElementById('carouselTrack');
const dots = document.querySelectorAll('.dot');
const cards = document.querySelectorAll('.project-card');
const total = cards.length;
let current = 0;

function goToSlide(index) {
  const cardWidth = window.innerWidth;
  track.style.transform = `translateX(-${index * cardWidth}px)`;
  dots.forEach(function(dot) { dot.classList.remove('active'); });
  dots[index].classList.add('active');
  current = index;
}

dots.forEach(function(dot, i) {
  dot.addEventListener('click', function() { goToSlide(i); });
});

let startX = 0;
track.addEventListener('touchstart', function(e) {
  startX = e.touches[0].clientX;
}, { passive: true });
track.addEventListener('touchend', function(e) {
  const diff = startX - e.changedTouches[0].clientX;
  if (diff > 50 && current < total - 1) goToSlide(current + 1);
  if (diff < -50 && current > 0) goToSlide(current - 1);
}, { passive: true });

// ===== MOBILE NAV ACTIVE =====
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.mob-nav-item');
window.addEventListener('scroll', function() {
  let cur = '';
  sections.forEach(function(section) {
    if (window.scrollY >= section.offsetTop - 100) {
      cur = section.getAttribute('id');
    }
  });
  navItems.forEach(function(item) {
    item.classList.remove('active');
    if (item.getAttribute('href') === '#' + cur) {
      item.classList.add('active');
    }
  });
});