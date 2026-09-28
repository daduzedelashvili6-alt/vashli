/**
 * Nexus Minimalist Landing Page Logic
 * - Theme Switcher (Dark / Light) with LocalStorage
 * - Responsive Mobile Drawer Navigation
 * - Active Nav Link Spy (IntersectionObserver)
 * - Accessible Contact Form Validation & Feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  initScrollSpy();
  initContactForm();
});

/* ==========================================================================
   1. Theme Management (Dark / Light)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('nexus_theme') || 'dark';
  htmlRoot.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('nexus_theme', newTheme);
    });
  }
}

/* ==========================================================================
   2. Mobile Drawer Navigation
   ========================================================================== */
function initMobileNav() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-nav-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, #mob-nav-cta');

  if (!hamburgerBtn || !mobileNav || !mobileOverlay) return;

  function toggleMenu(isOpen) {
    const currentState = hamburgerBtn.classList.contains('is-active');
    const newState = typeof isOpen === 'boolean' ? isOpen : !currentState;

    hamburgerBtn.classList.toggle('is-active', newState);
    mobileNav.classList.toggle('is-open', newState);
    mobileOverlay.classList.toggle('is-open', newState);
    hamburgerBtn.setAttribute('aria-expanded', String(newState));
    document.body.style.overflow = newState ? 'hidden' : '';
  }

  hamburgerBtn.addEventListener('click', () => toggleMenu());
  mobileOverlay.addEventListener('click', () => toggleMenu(false));

  // Close when clicking any nav item in drawer
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburgerBtn.classList.contains('is-active')) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   3. Scroll Spy (Active Navigation Highlighting)
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');

  if (!sections.length || !desktopLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        desktopLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(sec => observer.observe(sec));
}

/* ==========================================================================
   4. Contact Form Validation & Submission
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const successFeedback = document.getElementById('form-success');

  if (!form || !nameInput || !emailInput || !messageInput || !submitBtn) return;

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setError(input, isError) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return;

    if (isError) {
      formGroup.classList.add('error');
      input.classList.add('has-error');
    } else {
      formGroup.classList.remove('error');
      input.classList.remove('has-error');
    }
  }

  // Clear errors on input
  [nameInput, emailInput, messageInput].forEach(field => {
    field.addEventListener('input', () => {
      setError(field, false);
      if (successFeedback) successFeedback.classList.remove('show');
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setError(nameInput, true);
      isValid = false;
    } else {
      setError(nameInput, false);
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
      setError(emailInput, true);
      isValid = false;
    } else {
      setError(emailInput, false);
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      setError(messageInput, true);
      isValid = false;
    } else {
      setError(messageInput, false);
    }

    if (!isValid) return;

    // Simulate async network request
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      form.reset();
      if (successFeedback) {
        successFeedback.classList.add('show');
        setTimeout(() => {
          successFeedback.classList.remove('show');
        }, 5000);
      }
    }, 800);
  });
}
