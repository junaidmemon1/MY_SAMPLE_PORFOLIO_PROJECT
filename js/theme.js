/**
 * theme.js
 * Handles dark / light mode toggle with localStorage persistence.
 * Runs before DOM paint to prevent flash of incorrect theme.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ar-theme';
  const DARK  = 'dark';
  const LIGHT = 'light';

  /**
   * Get the preferred theme:
   * 1. User's explicit choice (localStorage)
   * 2. OS / browser preference
   * 3. Fallback to dark
   */
  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return LIGHT;
    }
    return DARK;
  }

  /** Apply theme to <html> element */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    // Update meta theme-color for mobile browser chrome
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.content = theme === DARK ? '#0A0B10' : '#F7F8FC';
    }
  }

  // Apply immediately (before render) to avoid FOUC
  applyTheme(getPreferredTheme());

  // Wire up toggle button after DOM is ready
  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    function toggleTheme() {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === DARK ? LIGHT : DARK;
      applyTheme(next);
      // Announce to screen readers
      const label = next === DARK ? 'Switched to dark mode' : 'Switched to light mode';
      toggle.setAttribute('aria-label', label);
      // Short animation for icon
      toggle.style.transform = 'rotate(20deg) scale(0.85)';
      setTimeout(() => { toggle.style.transform = ''; }, 200);
    }

    toggle.addEventListener('click', toggleTheme);

    // Also respond to OS preference change at runtime
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        // Only auto-switch if user hasn't set an explicit preference
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? DARK : LIGHT);
        }
      });
    }
  });
})();
/* theme.js v1: localStorage persistence added - 2026-01-10 */
/* FOUC prevention: applyTheme() runs on script load - 2026-01-10 */
