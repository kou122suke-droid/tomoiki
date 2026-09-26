(function () {
  'use strict';

  var root = document.documentElement;

  // ─── Mobile navigation ───
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    var setOpen = function (open) {
      root.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    };
    toggle.addEventListener('click', function () {
      setOpen(!root.classList.contains('nav-open'));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('nav-open')) { setOpen(false); toggle.focus(); }
    });
  }

  // ─── Scroll reveal ───
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      var n = 0;
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.animationDelay = Math.min(n++ * 0.08, 0.48) + 's';
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ─── Works slider ───
  var slides = Array.prototype.slice.call(document.querySelectorAll('.work'));
  var next = document.getElementById('work-next');
  var prev = document.getElementById('work-prev');
  var count = document.getElementById('work-count');
  if (slides.length && next && prev) {
    var current = 0;
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var show = function (i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (el, k) {
        var active = k === current;
        el.hidden = !active;
        el.classList.toggle('is-active', active);
      });
      if (count) count.textContent = pad(current + 1) + ' / ' + pad(slides.length);
    };
    next.addEventListener('click', function () { show(current + 1); });
    prev.addEventListener('click', function () { show(current - 1); });
    show(0);
  }

  // ─── Background videos: keep muted autoplay working on mobile ───
  document.querySelectorAll('video[autoplay]').forEach(function (v) {
    v.muted = true;
    v.playsInline = true;
    var play = function () { var p = v.play(); if (p && p.catch) p.catch(function () {}); };
    v.addEventListener('canplay', function () { if (v.paused) play(); });
    play();
  });
})();
