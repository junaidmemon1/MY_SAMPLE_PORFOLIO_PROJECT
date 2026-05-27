/**
 * main.js
 * Entry point — initializes miscellaneous site-wide features:
 *   - Lazy-loaded images with fade-in
 *   - External link safety attributes
 *   - Keyboard accessibility improvements
 *   - Active nav link on load from URL hash
 *   - Performance: defer non-critical work with IdleCallback
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    // ── 1. Ensure all external links open safely ────────────
    document.querySelectorAll('a[href^="http"]').forEach(function (link) {
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
      var rel = link.getAttribute('rel') || '';
      if (!rel.includes('noopener')) {
        link.setAttribute('rel', (rel + ' noopener noreferrer').trim());
      }
    });

    // ── 2. Keyboard: Tab trap for mobile menu ───────────────
    var mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
      mobileMenu.addEventListener('keydown', function (e) {
        if (!mobileMenu.classList.contains('open')) return;
        var focusable = mobileMenu.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
        var first = focusable[0];
        var last  = focusable[focusable.length - 1];
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
          } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus(); }
          }
        }
      });
    }

    // ── 3. Skip to main content link ────────────────────────
    var skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = [
      'position:fixed','top:-100px','left:16px','z-index:99999',
      'background:var(--accent)','color:#fff','padding:8px 16px',
      'border-radius:0 0 8px 8px','font-size:14px','font-weight:500',
      'text-decoration:none','transition:top 0.2s ease','outline:none'
    ].join(';');
    skipLink.addEventListener('focus', function () { skipLink.style.top = '0'; });
    skipLink.addEventListener('blur',  function () { skipLink.style.top = '-100px'; });
    document.body.insertBefore(skipLink, document.body.firstChild);

    // ── 4. Handle URL hash on load ──────────────────────────
    if (window.location.hash) {
      var target = document.querySelector(window.location.hash);
      if (target) {
        setTimeout(function () {
          var top = target.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }, 400);
      }
    }

    // ── 5. Defer non-critical work ──────────────────────────
    function nonCriticalInit() {
      document.querySelectorAll('.project-mockup').forEach(function (mockup) {
        mockup.setAttribute('tabindex', '0');
        mockup.setAttribute('role', 'img');
      });

      // Dev console banner
      console.log(
        '%c Junaid Ahmed Memon — Portfolio ',
        'background:#6C63FF;color:#fff;font-size:14px;font-weight:700;padding:6px 12px;border-radius:4px;'
      );
      console.log(
        '%c IBM Certified Full-Stack Developer & AI Engineer\n BS CS @ SZABIST Gharo | linkedin.com/in/junaid-memon-221548346',
        'color:#8A8FA8;font-size:12px;'
      );
    }

    if ('requestIdleCallback' in window) {
      requestIdleCallback(nonCriticalInit, { timeout: 2000 });
    } else {
      setTimeout(nonCriticalInit, 1000);
    }

  });
})();
/* main.js v1: skip-link injection, idle callback - 2026-02-28 */
/* requestIdleCallback with timeout:2000 fallback - 2026-05-27 */
/* skip-link: top:-100px -> top:0 on focus - 2026-06-05 */
/* main.js v1: skip-link injection, idle callback - 2026-02-28 */
/* requestIdleCallback with timeout:2000 fallback - 2026-05-27 */
