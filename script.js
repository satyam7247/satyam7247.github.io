document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  initTheme();
  initNavbar();
  initHamburger();
  initTypingAnimation();
  initScrollReveal();
  initSkillBars();
  initSkillTabs();
  initContactForm();
  initCertificationToggle();
  initCertModal();
  initBackToTop();
  initNavMobileActions();
  initFooterYear();
  initNavActiveLinks();

  // Re-create icons after all DOM manipulations
  setTimeout(() => {
    lucide.createIcons();
  }, 200);
});


// ---------------------------------------------------------------
// 2. THEME TOGGLE (Dark / Light)
// ---------------------------------------------------------------
function initTheme() {
  const btn  = document.getElementById('themeToggle');
  const html = document.documentElement;

  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
}

// ---------------------------------------------------------------
// Mobile actions (FAB) — show resume & certifications on small screens
// ---------------------------------------------------------------
function initNavMobileActions() {
  const navCert = document.getElementById('navCertToggle');
  if (!navCert) return;

  navCert.addEventListener('click', (e) => {
    e.preventDefault();
    const section = document.getElementById('certifications');
    if (section) {
      section.classList.remove('hidden');
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // close mobile nav if open
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}


// ---------------------------------------------------------------
// 3. NAVBAR — scroll shadow + active section highlighting
// ---------------------------------------------------------------
function initNavbar() {
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });
}

function initNavActiveLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(section => observer.observe(section));
}


// ---------------------------------------------------------------
// 4. HAMBURGER MENU (mobile)
// ---------------------------------------------------------------
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
}


// ---------------------------------------------------------------
// 5. TYPING ANIMATION (hero tagline)
// ---------------------------------------------------------------
function initTypingAnimation() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'scalable REST APIs.',
    'pixel-perfect UIs.',
    'full-stack web apps.',
    'clean, maintainable code.',
    'database-driven solutions.',
  ];

  let phraseIndex = 0;
  let charIndex   = 0;
  let isDeleting  = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 55 : 90;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting  = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay       = 400;
    }

    setTimeout(type, delay);
  }

  setTimeout(type, 1200);
}


// ---------------------------------------------------------------
// 6. SCROLL REVEAL (Intersection Observer)
// ---------------------------------------------------------------
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px',
  });

  revealEls.forEach(el => observer.observe(el));
}


// ---------------------------------------------------------------
// 7. SKILL PROGRESS BARS — animate on reveal
// ---------------------------------------------------------------
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        const pct  = fill.getAttribute('data-pct');
        setTimeout(() => {
          fill.style.width = pct + '%';
        }, 200);
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(fill => observer.observe(fill));
}


// ---------------------------------------------------------------
// 8. SKILLS CATEGORY TABS
// ---------------------------------------------------------------
function initSkillTabs() {
  const tabs  = document.querySelectorAll('.tab-btn');
  const cards = document.querySelectorAll('.skill-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-tab');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        const show     = filter === 'all' || category === filter;
        card.classList.toggle('hidden', !show);

        if (show) {
          card.classList.remove('visible');
          setTimeout(() => card.classList.add('visible'), 50);
        }
      });
    });
  });
}


// ---------------------------------------------------------------
// 9. CONTACT FORM — Formspree Integration
// ---------------------------------------------------------------
function initContactForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validation
    const required = form.querySelectorAll('[required]');
    let valid = true;

    required.forEach(field => {
      if (!field.value.trim()) {
        valid = false;
        field.style.borderColor = '#f87171';
        field.addEventListener('input', () => {
          field.style.borderColor = '';
        }, { once: true });
      }
    });

    if (!valid) {
      status.style.color = '#f87171';
      status.textContent = 'Please fill in all required fields.';
      return;
    }

    // Sending state
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<svg class="btn-icon spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg> Sending…';

    const data = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/mvzyreee', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        status.style.color = '#4ade80';
        status.textContent = "✓ Message sent! I'll reply within 24 hours.";
        form.reset();
        setTimeout(() => { status.textContent = ''; }, 5000);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      status.style.color = '#f87171';
      status.textContent = 'Something went wrong. Please try again.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg> Send Message';
    }
  });
}


// ---------------------------------------------------------------
// 10. BACK TO TOP BUTTON
// ---------------------------------------------------------------
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initCertificationToggle() {
  const toggleBtn = document.getElementById('certToggle');
  const closeBtn  = document.getElementById('closeCerts');
  const section   = document.getElementById('certifications');
  if (!toggleBtn || !closeBtn || !section) return;

  const setVisible = (visible) => {
    section.classList.toggle('hidden', !visible);
    if (visible) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  toggleBtn.addEventListener('click', (event) => {
    event.preventDefault();
    setVisible(true);
  });

  closeBtn.addEventListener('click', () => {
    setVisible(false);
  });
}

// ---------------------------------------------------------------
// Certificate modal: open image from cert cards
// ---------------------------------------------------------------
function initCertModal() {
  const modal = document.getElementById('certModal');
  const backdrop = document.getElementById('certBackdrop');
  const closeBtn = document.getElementById('certClose');
  const img = document.getElementById('certImage');
  if (!modal || !backdrop || !closeBtn || !img) return;

  const openModal = (src, caption) => {
    const frame = modal.querySelector('.cert-frame');
    // clear previous content
    frame.innerHTML = '';

    // Render PDFs in an iframe, otherwise render an image
    if (/\.pdf(\?|$)/i.test(src)) {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.style.width = '100%';
      iframe.style.height = '70vh';
      iframe.style.border = 'none';
      iframe.setAttribute('aria-label', 'Certificate PDF');
      frame.appendChild(iframe);
    } else {
      const imgEl = document.createElement('img');
      imgEl.src = src;
      imgEl.alt = caption || 'Certificate image';
      imgEl.style.width = '100%';
      imgEl.style.height = 'auto';
      imgEl.style.display = 'block';
      imgEl.style.borderRadius = '6px';
      frame.appendChild(imgEl);
    }

    modal.querySelector('.cert-caption').textContent = caption || 'Certificate Preview';
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    // focus for accessibility
    closeBtn.focus();
  };

  const closeModal = () => {
    const frame = modal.querySelector('.cert-frame');
    frame.innerHTML = '';
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
  };

  // Attach click handlers on links that should open certificates
  document.querySelectorAll('.cert-view').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const src = link.getAttribute('data-src');
      const caption = link.getAttribute('data-caption');
      if (!src) return alert('Certificate image not found.');
      openModal(src, caption);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
  });
}

// ---------------------------------------------------------------
// 11. FOOTER YEAR (auto-update)
// ---------------------------------------------------------------
function initFooterYear() {
  const el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
}


// ---------------------------------------------------------------
// 12. SMOOTH SCROLL for all anchor links (#)
// ---------------------------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ================================================================
   CSS-in-JS: spinning loader for submit button
================================================================ */
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .spin { animation: spin 0.8s linear infinite; }
`;
document.head.appendChild(style);