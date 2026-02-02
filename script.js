// script.js — Interactivity : nav toggle, reveal on scroll, testimonials slider, forms, modal
document.addEventListener('DOMContentLoaded', function () {
  // Utilities
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  // Year in footer
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // NAV TOGGLE (mobile)
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-menu');
  if (navToggle && navList) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      navList.classList.toggle('show');
    });
  }

  // SMOOTH SCROLL for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        if (navList && navList.classList.contains('show')) navList.classList.remove('show');
      }
    });
  });

  // REVEAL ON SCROLL using IntersectionObserver
  const revealItems = $$('.reveal-up, .reveal-right');
  if (revealItems.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.classList.add('visible');
          observer.unobserve(en.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(i => observer.observe(i));
  }

  // TESTIMONIAL SLIDER (lightweight)
  (function testimonialSlider() {
    const slider = $('.testimonial-slider');
    if (!slider) return;
    const slides = $$('.testimonial');
    const prev = $('.t-prev');
    const next = $('.t-next');
    let current = 0;
    let timer = null;
    const show = (index) => {
      slides.forEach((s, i) => s.classList.toggle('active', i === index));
      current = index;
    };
    const nextSlide = () => show((current + 1) % slides.length);
    const prevSlide = () => show((current - 1 + slides.length) % slides.length);

    // Auto play
    timer = setInterval(nextSlide, 6000);

    if (next) next.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prev) prev.addEventListener('click', () => { prevSlide(); resetTimer(); });

    function resetTimer() {
      clearInterval(timer);
      timer = setInterval(nextSlide, 6000);
    }
  })();

  // FAQ Accordion
  $$('.accordion-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!expanded));
      const panel = btn.nextElementSibling;
      if (panel) {
        if (!expanded) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
        } else {
          panel.style.maxHeight = null;
        }
      }
    });
  });

  // Course details buttons -> open enrollment modal with course name
  const enrollModal = $('#enrollModal');
  const enrollBtn = $('#enrollBtn');
  const enrollForm = $('#enrollForm');
  const enrollStatus = $('#enrollStatus');
  const enrollCourse = $('#e-course');
  const modalCloseButtons = $$('.modal-close');

  function openModal(courseName) {
    if (!enrollModal) return;
    enrollModal.setAttribute('aria-hidden', 'false');
    if (enrollCourse) enrollCourse.value = courseName || '';
    // focus first input
    const firstInput = enrollModal.querySelector('input, textarea, button');
    if (firstInput) firstInput.focus();
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!enrollModal) return;
    enrollModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (enrollBtn) enrollBtn.addEventListener('click', () => openModal('General enrolment'));

  $$('.js-enroll').forEach(btn => btn.addEventListener('click', (e) => {
    const plan = btn.dataset.plan || btn.textContent || 'Enrollment';
    openModal(plan);
  }));

  $$('.js-open-course').forEach(btn => btn.addEventListener('click', (e) => {
    const c = btn.dataset.course || 'Course';
    openModal(c);
  }));

  modalCloseButtons.forEach(b => b.addEventListener('click', closeModal));
  // close modal on outside click
  enrollModal && enrollModal.addEventListener('click', e => {
    if (e.target === enrollModal) closeModal();
  });

  // Enrollment form submit (client-side only; replace with API call)
  enrollForm && enrollForm.addEventListener('submit', function (e) {
    e.preventDefault();
    enrollStatus.textContent = 'Submitting...';
    // Simple validation
    const name = $('#e-name').value.trim();
    const email = $('#e-email').value.trim();
    const phone = $('#e-phone').value.trim();
    if (!name || !email || !phone) {
      enrollStatus.textContent = 'Please provide name, phone and email.';
      return;
    }

    // Replace this with real POST to your server or Formspree/Netlify
    setTimeout(() => {
      enrollStatus.textContent = 'Thank you — we received your request. We will contact you shortly.';
      enrollForm.reset();
      setTimeout(closeModal, 1500);
    }, 900);
  });

  // CONTACT FORM: client-side validation and fake submit
  const contactForm = $('#contactForm');
  const formStatus = $('#formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      formStatus.textContent = 'Sending...';
      const formData = {
        name: $('#name').value.trim(),
        phone: $('#phone').value.trim(),
        email: $('#email').value.trim(),
        message: $('#message').value.trim(),
        consent: $('#consent').checked
      };
      if (!formData.name || !formData.email || !formData.phone || !formData.message || !formData.consent) {
        formStatus.textContent = 'Please complete all required fields and accept consent.';
        return;
      }

      // Replace with actual sending logic (fetch to API)
      setTimeout(() => {
        formStatus.textContent = 'Message sent — we will contact you soon.';
        contactForm.reset();
      }, 800);
    });
  }

  // Accessibility helper for ESC key to close modal
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (enrollModal && enrollModal.getAttribute('aria-hidden') === 'false') closeModal();
      // close nav mobile if open
      if (navList && navList.classList.contains('show')) navList.classList.remove('show');
    }
  });
});
