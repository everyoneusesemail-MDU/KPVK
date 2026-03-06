(function () {
  'use strict';

  // --- AOS (Animate On Scroll) ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      easing: 'ease-out-cubic',
      offset: 60,
      once: true,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }

  // --- Header scroll state ---
  var header = document.querySelector('.header');
  if (header) {
    var lastY = window.scrollY;
    function onScroll() {
      var y = window.scrollY;
      header.classList.toggle('scrolled', y > 60);
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Parallax background layers ---
  var parallaxLayers = document.querySelectorAll('.parallax-layer');
  if (parallaxLayers.length) {
    function updateParallax() {
      var y = window.scrollY;
      var rate1 = y * 0.15;
      var rate2 = y * 0.08;
      var rate3 = y * 0.05;
      parallaxLayers[0] && (parallaxLayers[0].style.transform = "translate3d(0, " + rate1 + "px, 0)");
      parallaxLayers[1] && (parallaxLayers[1].style.transform = "translate3d(0, " + rate2 + "px, 0)");
      parallaxLayers[2] && (parallaxLayers[2].style.transform = "translate3d(0, " + rate3 + "px, 0)");
    }
    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  // --- 3D tilt on hero card ---
  var heroCard = document.querySelector('.hero-3d-card');
  if (heroCard) {
    var cardInner = heroCard.querySelector('.card-inner');
    heroCard.addEventListener('mousemove', function (e) {
      var rect = heroCard.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      var tiltX = -y * 12;
      var tiltY = x * 12;
      heroCard.style.transform = "perspective(1200px) rotateX(" + tiltX + "deg) rotateY(" + tiltY + "deg)";
    });
    heroCard.addEventListener('mouseleave', function () {
      heroCard.style.transform = "";
    });
  }

  // --- Counter animation for stats ---
  var statNums = document.querySelectorAll('.stat-num[data-count]');
  function animateValue(el, end, duration) {
    var start = 0;
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easeOut = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (end - start) * easeOut);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  function runCounters() {
    statNums.forEach(function (el) {
      var end = parseInt(el.getAttribute('data-count'), 10);
      if (isNaN(end)) return;
      animateValue(el, end, 1600);
    });
  }
  var statsSection = document.querySelector('.hero-stats');
  if (statsSection && statNums.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(statsSection);
  }

  // --- Mobile menu (burger) ---
  var burger = document.querySelector('.burger');
  var nav = document.querySelector('.nav');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      nav.classList.toggle('open');
      burger.classList.toggle('active');
      document.body.classList.toggle('menu-open', nav.classList.contains('open'));
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        burger.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // --- CTA form: prevent default for demo ---
  var ctaForm = document.querySelector('.cta-form');
  if (ctaForm) {
    ctaForm.addEventListener('submit', function (e) {
      e.preventDefault();
      alert('Заявка принята! Мы свяжемся с вами в ближайшее время.');
    });
  }
})();
