/**
 * bay-current-diving — main.js
 *
 * CSP-SAFE: Zero usage of:
 *   - eval()
 *   - new Function()
 *   - setTimeout("string")    ← only setTimeout(function, ms) used
 *   - setInterval("string")   ← only setInterval(function, ms) used
 *
 * Safari/iOS compatible:
 *   - IntersectionObserver with graceful fallback
 *   - passive scroll listeners (prevents iOS main-thread blocking)
 *   - No dynamic CSS injection (no style manipulation via string eval)
 *   - Class-based state (no animationPlayState race conditions)
 *   - IIFE wrapper (no global pollution, safe in strict CSP)
 */

(function () {
  'use strict';

  /* ── Scroll Reveal ────────────────────────────────────────────
     Uses class toggle (.is-visible) instead of direct style
     manipulation. CSS transition handles the animation.
     Class toggle is reliable across all Safari versions.
  ─────────────────────────────────────────────────────────────── */
  function initReveal() {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: immediately show everything on old Safari
      for (var i = 0; i < elements.length; i++) {
        elements[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var e = 0; e < entries.length; e++) {
          var entry = entries[e];
          if (!entry.isIntersecting) continue;

          // Stagger siblings slightly — uses setTimeout(fn, ms) — CSP-safe
          var siblings = entry.target.parentElement
            ? Array.prototype.slice.call(entry.target.parentElement.children)
            : [];
          var index = siblings.indexOf(entry.target);
          var delay = Math.min(index * 80, 200);

          (function (el, ms) {
            setTimeout(function () {
              el.classList.add('is-visible');
            }, ms);
          }(entry.target, delay));

          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
        // Larger rootMargin fires earlier — compensates for iOS Safari's
        // less-frequent IntersectionObserver tick rate vs Chrome.
        rootMargin: '0px 0px -20px 0px'
      }
    );

    for (var j = 0; j < elements.length; j++) {
      observer.observe(elements[j]);
    }
  }

  /* ── Process Steps ────────────────────────────────────────────
     CSS keeps steps at opacity:0 with animation-play-state:paused.
     JS adds .is-visible when steps enter viewport → CSS releases
     the animation. No animationPlayState string injection.
  ─────────────────────────────────────────────────────────────── */
  function initProcessSteps() {
    var steps = document.querySelectorAll('.process-step');
    if (!steps.length) return;

    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < steps.length; i++) {
        steps[i].classList.add('is-visible');
      }
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        for (var e = 0; e < entries.length; e++) {
          if (entries[e].isIntersecting) {
            entries[e].target.classList.add('is-visible');
            observer.unobserve(entries[e].target);
          }
        }
      },
      { threshold: 0.15 }
    );

    for (var j = 0; j < steps.length; j++) {
      observer.observe(steps[j]);
    }
  }

  /* ── Nav Scroll Shadow ────────────────────────────────────────
     passive:true is critical on iOS — prevents blocking the
     browser's touch scroll compositor thread.
  ─────────────────────────────────────────────────────────────── */
  function initNavScroll() {
    var nav = document.querySelector('nav');
    if (!nav) return;

    // Detect passive event support (Safari 10 didn't have it)
    var supportsPassive = false;
    try {
      var opts = Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {}

    var listenerOptions = supportsPassive ? { passive: true } : false;

    window.addEventListener('scroll', function () {
      if (window.pageYOffset > 20) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, listenerOptions);
  }

  /* ── Smooth Anchor Scroll ─────────────────────────────────────
     Safari < 15.4 doesn't support scroll-behavior:smooth on html.
     This polyfills it for anchor links.
  ─────────────────────────────────────────────────────────────── */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ── Init ─────────────────────────────────────────────────────
     DOMContentLoaded is safer than window.onload — runs before
     images load, but after HTML is parsed. No eval, no strings.
  ─────────────────────────────────────────────────────────────── */
  function init() {
    initReveal();
    initProcessSteps();
    initNavScroll();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    // Already parsed (script is deferred or at end of body)
    init();
  }

}());
