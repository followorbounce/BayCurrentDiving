/**
 * Bay Current Diving — main.js
 *
 * ZERO usage of: eval(), new Function(),
 * setTimeout(string), setInterval(string).
 *
 * All functions passed as proper function references.
 * Safe under script-src 'self' — no unsafe-eval needed.
 */

(function () {
  'use strict';

  /* ── Helpers ──────────────────────────────────────────────── */

  /**
   * Detect whether the browser supports passive event listeners.
   * iOS Safari scroll events must be passive to avoid janking the
   * compositor thread. Without { passive: true } the browser shows
   * a console warning and scrolling can stutter on iPhones.
   */
  var passiveSupported = false;
  try {
    var testOpts = Object.defineProperty({}, 'passive', {
      get: function () { passiveSupported = true; }
    });
    window.addEventListener('_test', null, testOpts);
    window.removeEventListener('_test', null, testOpts);
  } catch (e) {}

  var PASSIVE = passiveSupported ? { passive: true } : false;

  /* ── Nav: scroll shadow ───────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, PASSIVE);
  }

  /* ── Scroll reveal (.reveal elements) ────────────────────── */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      // Old Safari fallback: show everything immediately
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        var entry = entries[e];
        if (!entry.isIntersecting) continue;

        // Stagger siblings: each is delayed by its index × 80ms
        // setTimeout(function, number) — NOT a string — CSP-safe
        var siblings = entry.target.parentElement
          ? Array.prototype.slice.call(entry.target.parentElement.children)
          : [];
        var idx   = siblings.indexOf(entry.target);
        var delay = Math.min(idx * 80, 200);

        (function (el, ms) {
          setTimeout(function () {
            el.classList.add('is-visible');
          }, ms);
        }(entry.target, delay));

        observer.unobserve(entry.target);
      }
    }, {
      threshold: 0.08,
      // Larger rootMargin compensates for Safari's slower
      // IntersectionObserver callback rate vs Chrome.
      rootMargin: '0px 0px -20px 0px'
    });

    for (var j = 0; j < items.length; j++) {
      observer.observe(items[j]);
    }
  }

  /* ── Process step animations ──────────────────────────────── */
  function initProcessSteps() {
    var steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < steps.length; i++) {
        steps[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      for (var e = 0; e < entries.length; e++) {
        if (entries[e].isIntersecting) {
          entries[e].target.classList.add('is-visible');
          observer.unobserve(entries[e].target);
        }
      }
    }, { threshold: 0.15 });

    for (var j = 0; j < steps.length; j++) {
      observer.observe(steps[j]);
    }
  }

  /* ── Smooth scroll polyfill for Safari < 15.4 ────────────── */
  function initSmoothScroll() {
    // CSS scroll-behavior:smooth is ignored in Safari < 15.4.
    // This JS polyfill handles all internal anchor links.
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ── Init ─────────────────────────────────────────────────── */
  function init() {
    initNav();
    initReveal();
    initProcessSteps();
    initSmoothScroll();
  }

  // script loaded with defer, so DOM is ready; guard anyway
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
