/**
 * counter.js
 * Animates numeric counters in the hero stats section.
 * Triggers once when the stat enters the viewport.
 * Uses easing for a natural feel.
 */

(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('DOMContentLoaded', function () {
    const counters = document.querySelectorAll('.stat-number[data-target]');

    if (!counters.length) return;

    /**
     * Ease-out cubic for deceleration effect
     * @param {number} t - progress 0–1
     */
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Animate a single counter element from 0 to target.
     * @param {HTMLElement} el - the element to update
     * @param {number} target  - final numeric value
     * @param {number} duration - animation duration in ms
     */
    function animateCounter(el, target, duration) {
      const start = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = easeOutCubic(progress);
        const current  = Math.round(eased * target);

        el.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target; // ensure exact final value
        }
      }

      requestAnimationFrame(step);
    }

    // Observe and trigger counters when in view
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          if (isNaN(target)) return;

          // Slightly stagger each counter for a cascading effect
          const index    = Array.from(counters).indexOf(el);
          const delay    = index * 120;
          const duration = 1400;

          setTimeout(function () {
            animateCounter(el, target, duration);
          }, delay);

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.8
    });

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  });
})();
/* counter.js v1: easeOutCubic animation added - 2026-01-22 */
/* reduced-motion: skip animation, show final value - 2026-03-12 */
/* counter.js v1: easeOutCubic animation added - 2026-01-22 */
