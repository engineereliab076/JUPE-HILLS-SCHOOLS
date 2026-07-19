/* Jupe Hills website interactions — dependency-free and progressively enhanced. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var backToTop = document.querySelector(".back-to-top");

  function setScrolledState() {
    var scrolled = window.scrollY > 24;
    if (header) header.classList.toggle("is-scrolled", scrolled);
    if (backToTop) backToTop.classList.toggle("is-visible", window.scrollY > 500);
  }

  window.addEventListener("scroll", setScrolledState, { passive: true });
  setScrolledState();

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll(".section > .shell").forEach(function (section) {
      section.classList.add("reveal");
      revealObserver.observe(section);
    });
  }

  if (menuButton && nav) {
    menuButton.addEventListener("click", function () {
      var open = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.classList.toggle("menu-open", !open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) {
        menuButton.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        menuButton.setAttribute("aria-expanded", "false");
        nav.classList.remove("is-open");
        document.body.classList.remove("menu-open");
        menuButton.focus();
      }
    });
  }

  var map = document.querySelector("iframe[data-src]");
  if (map) {
    if ("IntersectionObserver" in window) {
      var mapObserver = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) {
          map.src = map.dataset.src;
          mapObserver.disconnect();
        }
      }, { rootMargin: "300px" });
      mapObserver.observe(map);
    } else {
      map.src = map.dataset.src;
    }
  }

  var box = document.getElementById("lightbox");
  if (box) {
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".gallery-grid a"));
    var image = box.querySelector("img");
    var caption = box.querySelector("figcaption");
    var buttons = Array.prototype.slice.call(box.querySelectorAll("button"));
    var current = -1;
    var lastFocus = null;

    function show(index) {
      if (!thumbs.length) return;
      current = (index + thumbs.length) % thumbs.length;
      var link = thumbs[current];
      image.src = link.getAttribute("href");
      image.alt = link.querySelector("img").alt;
      caption.textContent = link.dataset.caption || image.alt;
    }
    function open(link) {
      lastFocus = document.activeElement;
      current = thumbs.indexOf(link);
      show(current);
      if (typeof box.showModal === "function") box.showModal();
      else box.setAttribute("open", "");
      box.querySelector(".lb-close").focus();
    }
    function close() {
      if (typeof box.close === "function" && box.open) box.close();
      else box.removeAttribute("open");
      image.removeAttribute("src");
      if (lastFocus) lastFocus.focus();
    }

    thumbs.forEach(function (link) {
      link.addEventListener("click", function (event) { event.preventDefault(); open(link); });
    });
    box.querySelector(".lb-close").addEventListener("click", close);
    box.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    box.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    box.addEventListener("cancel", function (event) { event.preventDefault(); close(); });
    box.addEventListener("click", function (event) { if (event.target === box) close(); });
    box.addEventListener("keydown", function (event) {
      if (event.key === "Escape") { event.preventDefault(); close(); }
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
      if (event.key === "Tab") {
        var index = buttons.indexOf(document.activeElement);
        if (event.shiftKey && (index === 0 || index === -1)) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
        if (!event.shiftKey && index === buttons.length - 1) { event.preventDefault(); buttons[0].focus(); }
      }
    });
  }
})();
