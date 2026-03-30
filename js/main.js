/* =============================================================
   HomeGuard Bangalore — main.js
   =============================================================
   SETUP (one-time):
   1. Follow GOOGLE_APPS_SCRIPT.js to create your Apps Script.
   2. Paste the URL you get into SHEET_URL below.
   3. Save and re-upload this file to GitHub.
   ============================================================= */

// ─────────────────────────────────────────────────────────────
// ✏️  PASTE YOUR GOOGLE APPS SCRIPT URL HERE
// ─────────────────────────────────────────────────────────────
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbwgUuGEBd5sh1_nwEVRVaTDiJ-KNAiLvk9En1c14bPj7kkNjSDt-IUum6FCitNAQKUw/exec';
// Example: 'https://script.google.com/macros/s/AKfycbXXX.../exec'


// ── NAVBAR SCROLL ─────────────────────────────────────────────
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── HAMBURGER MENU ────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// ── BANNER SLIDER ─────────────────────────────────────────────
(function () {
  const track   = document.getElementById('bannerTrack');
  const slides  = document.querySelectorAll('.banner-slide');
  const dots    = document.querySelectorAll('.banner-dot');
  const counter = document.getElementById('bannerCounter');
  const prevBtn = document.getElementById('bannerPrev');
  const nextBtn = document.getElementById('bannerNext');
  if (!track || slides.length === 0) return;

  let current = 0, autoTimer;
  const total = slides.length;

  function goTo(idx) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
    if (counter) counter.textContent = `${current + 1} / ${total}`;
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); startAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); startAuto(); });
  dots.forEach(dot => {
    dot.addEventListener('click', () => { goTo(+dot.dataset.index); startAuto(); });
  });

  // Touch swipe
  let tx = 0;
  track.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) { goTo(d > 0 ? current + 1 : current - 1); startAuto(); }
  });

  // Image upload
  document.querySelectorAll('.banner-file-input').forEach(input => {
    input.addEventListener('change', function () {
      const idx  = parseInt(this.dataset.slide, 10);
      const file = this.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        const slide = document.getElementById(`slide-${idx}`);
        const ph    = document.getElementById(`placeholder-${idx}`);
        const ov    = document.getElementById(`overlay-${idx}`);
        let img = slide.querySelector('img');
        if (!img) {
          img = document.createElement('img');
          img.alt = `Banner image ${idx + 1}`;
          slide.insertBefore(img, ph);
        }
        img.src = ev.target.result;
        if (ph) ph.style.display = 'none';
        if (ov) ov.style.display = 'flex';
      };
      reader.readAsDataURL(file);
    });
  });

  startAuto();
})();

// ── CUSTOMER INFO FORM → GOOGLE SHEETS ────────────────────────
(function () {
  const form    = document.getElementById('customerInfoForm');
  const card    = document.getElementById('customerFormCard');
  const success = document.getElementById('customerSuccess');
  const errBox  = document.getElementById('formErrorBox');
  if (!form) return;

  function validate() {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const isEmpty = field.type === 'checkbox' ? !field.checked : !field.value.trim();
      if (isEmpty) {
        valid = false;
        field.style.outline     = '2px solid #c0392b';
        field.style.borderColor = '#c0392b';
        field.addEventListener(
          field.type === 'checkbox' ? 'change' : 'input',
          () => { field.style.outline = ''; field.style.borderColor = ''; },
          { once: true }
        );
      }
    });
    return valid;
  }

  function collectPayload() {
    return {
      fname:    form.fname.value.trim(),
      lname:    form.lname.value.trim(),
      phone:    form.phone.value.trim(),
      email:    form.email.value.trim(),
      how:      form.how.value,
      ptype:    form.ptype.value,
      config:   form.config.value,
      area:     form.area.value,
      stage:    form.stage.value,
      locality: form.locality.value.trim(),
      builder:  form.builder.value.trim(),
      service:  form.service.value,
      date:     form.date.value,
      time:     form.time.value,
      notes:    form.notes.value.trim()
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) {
      const firstErr = form.querySelector('[style*="border-color: rgb(192"]');
      if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (!SHEET_URL || SHEET_URL === 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
      alert(
        '⚠️  Google Sheets not connected yet.\n\n' +
        'Open js/main.js and replace PASTE_YOUR_APPS_SCRIPT_URL_HERE\n' +
        'with your actual Google Apps Script URL.\n\n' +
        'See GOOGLE_APPS_SCRIPT.js for step-by-step instructions.'
      );
      return;
    }

    const btn = form.querySelector('.customer-submit-btn');
    btn.innerHTML = '⏳ Sending your details…';
    btn.disabled  = true;
    if (errBox) errBox.style.display = 'none';

    // 'no-cors' is required for Apps Script — data IS saved even though
    // we can't read the response. The .then() always fires on success.
    fetch(SHEET_URL, {
      method:  'POST',
      mode:    'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(collectPayload())
    })
    .then(() => {
      if (card)    card.style.display    = 'none';
      if (success) {
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth' });
      }
    })
    .catch(() => {
      // Only fires when user is completely offline
      btn.innerHTML = 'Submit My Details →';
      btn.disabled  = false;
      if (errBox) {
        errBox.style.display = 'block';
        errBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
})();

// ── FAQ ACCORDION ─────────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
  });
});

// ── OTHER FORMS ───────────────────────────────────────────────
const enquiryForm = document.getElementById('enquiryForm');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    enquiryForm.style.display = 'none';
    const sb = document.getElementById('successBox');
    if (sb) sb.classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    contactForm.style.display = 'none';
    const cs = document.getElementById('contactSuccess');
    if (cs) cs.classList.add('show');
  });
}

// ── SCROLL ANIMATIONS ─────────────────────────────────────────
const animateEls = document.querySelectorAll('.why-card, .service-card, .testi-card, .step');
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

animateEls.forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  scrollObserver.observe(el);
});
