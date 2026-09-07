/* ── Navbar active link + enquire button visibility ─────────── */
(function () {
  const navbar = document.getElementById('navbar');
  const enquireBtn = document.getElementById('nav-enquire-btn');
  const hero = document.getElementById('hero');
  const links = document.querySelectorAll('.nav-link');

  // Show "Enquire" btn when hero is out of view
  const heroObs = new IntersectionObserver(([e]) => {
    enquireBtn.classList.toggle('visible', !e.isIntersecting);
  }, { threshold: 0.1 });
  heroObs.observe(hero);

  // Active nav link via section intersection
  const sectionIds = ['opportunity', 'why-mentors', 'contact', 'about'];
  sectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        links.forEach((l) => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    }, { rootMargin: '-40% 0px -50% 0px' });
    obs.observe(el);
  });

  // Smooth scroll from nav links
  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const id = link.getAttribute('href').replace('#', '');
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ── Enquire button (navbar) scrolls to hero ────────────────── */
window.scrollTo = function (id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

/* ── Enquiry form ─────────────────────────────────────────────── */
(function () {
  const form = document.getElementById('enquiry-form');
  const card = document.getElementById('enquiry-card');
  const success = document.getElementById('enquiry-success');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    const errors = {};

    if (!data.name.trim()) errors.name = 'Required';
    if (!/^\d{10}$/.test((data.phone || '').replace(/\s/g, ''))) errors.phone = 'Valid 10-digit number';
    if (!data.city.trim()) errors.city = 'Required';
    if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Valid email required';

    document.getElementById('err-name').textContent = errors.name || '';
    document.getElementById('err-phone').textContent = errors.phone || '';
    document.getElementById('err-city').textContent = errors.city || '';
    document.getElementById('err-email').textContent = errors.email || '';

    if (Object.keys(errors).length) return;

    card.style.display = 'none';
    success.style.display = 'block';
  });

  // Clear error on input
  form.querySelectorAll('input').forEach((input) => {
    input.addEventListener('input', () => {
      const errEl = document.getElementById('err-' + input.name);
      if (errEl) errEl.textContent = '';
    });
  });
})();

window.resetForm = function () {
  const form = document.getElementById('enquiry-form');
  const card = document.getElementById('enquiry-card');
  const success = document.getElementById('enquiry-success');
  form.reset();
  ['name', 'phone', 'city', 'email'].forEach((k) => {
    const el = document.getElementById('err-' + k);
    if (el) el.textContent = '';
  });
  success.style.display = 'none';
  card.style.display = 'block';
};

/* ── Carousel factory ─────────────────────────────────────────── */
function initCarousel(trackId, dotsId) {
  const track = document.getElementById(trackId);
  const dotsWrap = document.getElementById(dotsId);
  if (!track || !dotsWrap) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const total = slides.length;
  let current = 0;
  let timer;

  // Build dots
  slides.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'carousel-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', 'Slide ' + (i + 1));
    btn.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(btn);
  });

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function next() { goTo(current + 1); }

  function startTimer() { timer = setInterval(next, 3000); }
  function stopTimer() { clearInterval(timer); }

  const carousel = track.closest('.carousel');
  carousel.addEventListener('mouseenter', stopTimer);
  carousel.addEventListener('mouseleave', startTimer);

  startTimer();
}

initCarousel('carousel-track', 'carousel-dots');
initCarousel('carousel-contact-track', 'carousel-contact-dots');

/* ── FAQ accordion ────────────────────────────────────────────── */
(function () {
  document.querySelectorAll('.faq-q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item').forEach((el) => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

/* ── Opportunity cards — 4-state interaction ──────────────────── */
(function () {
  document.querySelectorAll('.opp-card').forEach((card) => {
    let hasLeft = false;

    card.addEventListener('mouseenter', () => {
      card.classList.remove('state-leave', 'state-enter');
      card.classList.add(hasLeft ? 'state-hover' : 'state-enter');
    });

    card.addEventListener('mouseleave', () => {
      hasLeft = true;
      card.classList.remove('state-enter', 'state-hover');
      card.classList.add('state-leave');
    });
  });
})();
