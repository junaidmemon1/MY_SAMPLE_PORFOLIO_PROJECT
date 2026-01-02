/**
 * cursor.js
 * Custom magnetic cursor follower — desktop/mouse only.
 * Uses requestAnimationFrame for smooth, performant tracking.
 * Enlarges on interactive elements, hides when leaving viewport.
 */

(function () {
  'use strict';

  // Only run on devices that support hover (mouse/trackpad)
  if (!window.matchMedia('(hover: hover)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.addEventListener('DOMContentLoaded', function () {
    const dot  = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');

    if (!dot || !ring) return;

    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let isVisible = false;

    // Lerp factor for ring lag
    const LERP = 0.14;

    /** Linear interpolation */
    function lerp(start, end, factor) {
      return start + (end - start) * factor;
    }

    /** Main RAF loop */
    function animateCursor() {
      // Dot follows cursor exactly
      dot.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

      // Ring lags behind
      ringX = lerp(ringX, mouseX, LERP);
      ringY = lerp(ringY, mouseY, LERP);
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;

      requestAnimationFrame(animateCursor);
    }

    // Track mouse position
    document.addEventListener('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        dot.style.opacity  = '1';
        ring.style.opacity = '1';
        isVisible = true;
      }
    });

    // Hide when leaving window
    document.addEventListener('mouseleave', function () {
      dot.style.opacity  = '0';
      ring.style.opacity = '0';
      isVisible = false;
    });

    document.addEventListener('mouseenter', function () {
      dot.style.opacity  = '1';
      ring.style.opacity = '1';
      isVisible = true;
    });

    // Expand ring on interactive elements
    const interactiveSelectors = [
      'a', 'button', 'input', 'textarea', 'select',
      '.project-card', '.stack-item', '.social-link', '[role="button"]'
    ].join(', ');

    document.addEventListener('mouseover', function (e) {
      if (e.target.closest(interactiveSelectors)) {
        ring.classList.add('hovered');
        dot.style.opacity = '0';
      }
    });

    document.addEventListener('mouseout', function (e) {
      if (e.target.closest(interactiveSelectors)) {
        ring.classList.remove('hovered');
        dot.style.opacity = '1';
      }
    });

    // Click press effect
    document.addEventListener('mousedown', function () {
      dot.style.transform  = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%)) scale(0.6)`;
      ring.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%)) scale(0.85)`;
    });

    document.addEventListener('mouseup', function () {
      // RAF loop will reset on next frame
    });

    // Start animation loop
    animateCursor();
  });
})();
/* cursor.js v1: dot + ring with lerp smoothing - 2026-02-25 */
/* hovered class: ring grows to 56px on links/buttons - 2026-02-26 */
/* reduced-motion: cursor.js exits early - 2026-03-14 */
/* touch: hover:none media query exits cursor init - 2026-05-08 */
