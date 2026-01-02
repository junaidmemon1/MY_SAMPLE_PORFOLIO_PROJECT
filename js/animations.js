/**
 * animations.js
 * Scroll-triggered reveal animations using IntersectionObserver.
 * Also animates skill bar fills when they enter the viewport.
 * Respects prefers-reduced-motion.
 */

(function () {
  'use strict';

  // Respect user's motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {

    // ── 1. General reveal elements ──────────────────────────
    if (!prefersReduced) {
      const revealEls = document.querySelectorAll('.reveal');

      const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger children if data-delay is set
            const delay = entry.target.getAttribute('data-delay') || 0;
            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('visible');
            // Unobserve after animation to save resources
            revealObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      revealEls.forEach(function (el) {
        revealObserver.observe(el);
      });
    } else {
      // Skip animations — make everything visible immediately
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('visible');
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }

    // ── 2. Skill bar fills ──────────────────────────────────
    const skillFills = document.querySelectorAll('.skill-fill');

    if (!prefersReduced && skillFills.length > 0) {
      const skillObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Small delay before animating for visual polish
            setTimeout(function () {
              entry.target.classList.add('animated');
            }, 200);
            skillObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.5
      });

      skillFills.forEach(function (fill) {
        skillObserver.observe(fill);
      });
    } else {
      // No animation — just show at full width
      skillFills.forEach(function (fill) {
        fill.style.transform = 'scaleX(1)';
      });
    }

    // ── 3. Back-to-top button visibility ───────────────────
    const backToTop = document.getElementById('backToTop');

    if (backToTop) {
      const toggleBackToTop = function () {
        if (window.scrollY > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      };

      window.addEventListener('scroll', toggleBackToTop, { passive: true });

      backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ── 4. Project card tilt effect (subtle, desktop only) ──
    if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
      const cards = document.querySelectorAll('.project-card');

      cards.forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;

          const tiltX = y * 4;  // max 4deg
          const tiltY = -x * 4;

          card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-3px)`;
        });

        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
          card.style.transition = 'transform 0.5s ease';
          setTimeout(function () { card.style.transition = ''; }, 500);
        });
      });
    }

    // ── 5. Footer year ───────────────────────────────────────
    const yearEl = document.getElementById('footerYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

  });
})();
/* animations.js v1: .reveal IntersectionObserver - 2026-02-27 */
/* reduced-motion: reveal elements shown immediately - 2026-03-13 */
/* unobserve() after reveal.visible — GC friendly - 2026-04-02 */
/* tilt reset: transition override on mouseleave fixed - 2026-04-08 */
/* footerYear: new Date().getFullYear() auto-update - 2026-04-28 */
/* skill IntersectionObserver threshold: 0.5 - 2026-05-09 */
