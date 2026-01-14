/**
 * nav.js
 * Handles:
 *   - Nav background change on scroll
 *   - Active section link highlighting via IntersectionObserver
 *   - Mobile drawer open/close
 *   - Smooth anchor scrolling with offset for fixed nav
 */

(function () {
  'use strict';

  const NAV_HEIGHT = 64; // matches CSS nav height

  document.addEventListener('DOMContentLoaded', function () {
    const navHeader  = document.getElementById('navHeader');
    const navBurger  = document.getElementById('navBurger');
    const mobileMenu = document.getElementById('mobileMenu');
    const navLinks   = document.querySelectorAll('.nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    // ── 1. Scrolled class on nav ────────────────────────────
    let lastScrollY = 0;
    let ticking = false;

    function onScroll() {
      lastScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(updateNav);
        ticking = true;
      }
    }

    function updateNav() {
      if (lastScrollY > 20) {
        navHeader.classList.add('scrolled');
      } else {
        navHeader.classList.remove('scrolled');
      }
      ticking = false;
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── 2. Active section highlighting ─────────────────────
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(function (link) {
            const isActive = link.getAttribute('data-section') === id;
            link.classList.toggle('active', isActive);
          });
        }
      });
    }, {
      rootMargin: `-${NAV_HEIGHT}px 0px -60% 0px`,
      threshold: 0
    });

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });

    // ── 3. Mobile drawer ────────────────────────────────────
    let isOpen = false;
    let previouslyFocused = null;

    function openMenu() {
      isOpen = true;
      previouslyFocused = document.activeElement;
      navBurger.setAttribute('aria-expanded', 'true');
      mobileMenu.classList.add('open');
      mobileMenu.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      // Focus first link for keyboard nav
      const firstLink = mobileMenu.querySelector('.mobile-link');
      if (firstLink) firstLink.focus();
    }

    function closeMenu() {
      isOpen = false;
      navBurger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (previouslyFocused) previouslyFocused.focus();
    }

    navBurger.addEventListener('click', function () {
      isOpen ? closeMenu() : openMenu();
    });

    // Close on link click
    mobileLinks.forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) closeMenu();
    });

    // Close on click outside
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) closeMenu();
    });

    // ── 4. Smooth scroll with offset ───────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - NAV_HEIGHT;
        window.scrollTo({ top, behavior: 'smooth' });
        // Update URL without triggering scroll
        history.pushState(null, '', targetId);
      });
    });
  });
})();
/* nav.js v1: burger open/close, aria-expanded - 2026-01-14 */
/* smooth scroll: NAV_HEIGHT=64 offset applied - 2026-01-14 */
/* IntersectionObserver: active nav-link class toggled - 2026-01-15 */
/* ESC key closes mobile menu - 2026-01-15 */
/* rAF ticking pattern: prevents scroll handler thrashing - 2026-01-16 */
/* aria-hidden: toggled on mobileMenu on open/close - 2026-03-20 */
/* previouslyFocused.focus() on closeMenu() - 2026-03-21 */
/* passive:true on scroll listener - 2026-04-01 */
/* history.pushState: URL updated without scroll trigger - 2026-04-30 */
/* nav.js v1: burger open/close, aria-expanded - 2026-01-14 */
/* smooth scroll: NAV_HEIGHT=64 offset applied - 2026-01-14 */
