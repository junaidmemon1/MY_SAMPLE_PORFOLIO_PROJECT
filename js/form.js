/**
 * form.js
 * Handles contact form validation and simulated submission.
 * - Real-time field validation on blur
 * - Accessible error messages via aria-live regions
 * - Loading state during submission
 * - Success state after submission
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    const form       = document.getElementById('contactForm');
    const submitBtn  = document.getElementById('submitBtn');
    const successMsg = document.getElementById('formSuccess');

    if (!form) return;

    // ── Field definitions ────────────────────────────────────
    const fields = {
      name: {
        input:    document.getElementById('name'),
        error:    document.getElementById('nameError'),
        validate: function (val) {
          if (!val.trim()) return 'Please enter your name.';
          if (val.trim().length < 2) return 'Name must be at least 2 characters.';
          return null;
        }
      },
      email: {
        input:    document.getElementById('email'),
        error:    document.getElementById('emailError'),
        validate: function (val) {
          if (!val.trim()) return 'Please enter your email address.';
          // RFC 5322 simplified pattern
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!pattern.test(val.trim())) return 'Please enter a valid email address.';
          return null;
        }
      },
      project: {
        input:    document.getElementById('project'),
        error:    document.getElementById('projectError'),
        validate: function (val) {
          if (!val.trim()) return 'Please tell me about your project.';
          if (val.trim().length < 20) return 'Please provide a bit more detail (min. 20 characters).';
          return null;
        }
      }
    };

    // ── Utility: show / clear field error ──────────────────
    function setError(field, message) {
      field.input.classList.toggle('error', !!message);
      field.error.textContent = message || '';

      if (message) {
        field.input.setAttribute('aria-invalid', 'true');
        field.input.setAttribute('aria-describedby', field.error.id);
      } else {
        field.input.removeAttribute('aria-invalid');
        field.input.removeAttribute('aria-describedby');
      }
    }

    // ── Validate all fields; returns true if all pass ───────
    function validateAll() {
      let valid = true;
      Object.values(fields).forEach(function (field) {
        const error = field.validate(field.input.value);
        setError(field, error);
        if (error) valid = false;
      });
      return valid;
    }

    // ── Real-time validation on blur ────────────────────────
    Object.values(fields).forEach(function (field) {
      // Validate on blur (when user leaves field)
      field.input.addEventListener('blur', function () {
        const error = field.validate(field.input.value);
        setError(field, error);
      });

      // Clear error on input (while typing)
      field.input.addEventListener('input', function () {
        if (field.input.classList.contains('error')) {
          const error = field.validate(field.input.value);
          if (!error) setError(field, null);
        }
      });
    });

    // ── Form submit ──────────────────────────────────────────
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateAll()) {
        // Focus first errored field
        const firstError = Object.values(fields).find(function (f) {
          return f.input.classList.contains('error');
        });
        if (firstError) firstError.input.focus();
        return;
      }

      // Show loading state
      form.classList.add('submitting');
      submitBtn.disabled = true;

      // Simulate async network request (replace with real fetch in production)
      setTimeout(function () {
        form.classList.remove('submitting');

        // Show success message
        successMsg.removeAttribute('hidden');
        successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Reset form
        form.reset();
        Object.values(fields).forEach(function (field) {
          setError(field, null);
        });

        // Re-enable submit after a delay
        setTimeout(function () {
          submitBtn.disabled = false;
          // Auto-hide success after 8 seconds
          setTimeout(function () {
            successMsg.setAttribute('hidden', '');
          }, 8000);
        }, 1000);

      }, 1600); // realistic delay
    });
  });
})();
/* form.js v1: per-field validation with error messages - 2026-02-19 */
/* a11y: aria-invalid + aria-describedby on error state - 2026-02-20 */
/* success: show form-success div, auto-hide 8000ms - 2026-02-23 */
/* submitBtn.disabled=true during fake async req - 2026-04-21 */
/* fields object: name/email/project config consolidated - 2026-04-23 */
/* form.js v1: per-field validation with error messages - 2026-02-19 */
/* a11y: aria-invalid + aria-describedby on error state - 2026-02-20 */
/* success: show form-success div, auto-hide 8000ms - 2026-02-23 */
/* submitBtn.disabled=true during fake async req - 2026-04-21 */
