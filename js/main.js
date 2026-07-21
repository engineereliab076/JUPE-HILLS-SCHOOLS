/* Jupe Hills website interactions — dependency-free and progressively enhanced. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var backdrop = document.querySelector("[data-menu-backdrop]");
  var backToTop = document.querySelector(".back-to-top");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---- Scroll state (rAF-throttled, no per-scroll layout work) ---- */
  var ticking = false;

  function applyScrollState() {
    ticking = false;
    var y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 24);
    if (backToTop) backToTop.classList.toggle("is-visible", y > 500);
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(applyScrollState);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  applyScrollState();

  /* ---- Reveal-on-scroll (skipped when reduced motion is requested) ---- */
  if ("IntersectionObserver" in window && !reduceMotion.matches) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".section > .shell").forEach(function (section) {
      section.classList.add("reveal");
      revealObserver.observe(section);
    });
  }

  /* ---- Accessible mobile navigation ---- */
  if (menuButton && nav) {
    var focusableSelector =
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

    function menuIsOpen() {
      return menuButton.getAttribute("aria-expanded") === "true";
    }

    function openMenu() {
      menuButton.setAttribute("aria-expanded", "true");
      menuButton.setAttribute("aria-label", "Close main menu");
      nav.classList.add("is-open");
      if (backdrop) backdrop.classList.add("is-open");
      document.body.classList.add("menu-open");
      var first = nav.querySelector(focusableSelector);
      if (first) first.focus();
      document.addEventListener("keydown", onMenuKeydown, true);
    }

    function closeMenu(restoreFocus) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open main menu");
      nav.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      document.removeEventListener("keydown", onMenuKeydown, true);
      if (restoreFocus !== false) menuButton.focus();
    }

    function onMenuKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
        return;
      }
      if (event.key !== "Tab") return;
      // Keep focus within the open menu (menu button + nav links).
      var items = [menuButton].concat(
        Array.prototype.slice.call(nav.querySelectorAll(focusableSelector)),
      );
      if (!items.length) return;
      var firstItem = items[0];
      var lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    }

    menuButton.addEventListener("click", function () {
      if (menuIsOpen()) closeMenu(true);
      else openMenu();
    });

    // Close after selecting a link.
    nav.addEventListener("click", function (event) {
      if (event.target.closest("a") && menuIsOpen()) closeMenu(false);
    });

    // Close when the backdrop (outside the panel) is clicked.
    if (backdrop) {
      backdrop.addEventListener("click", function () {
        if (menuIsOpen()) closeMenu(true);
      });
    }

    // If the viewport grows past the mobile breakpoint, reset to desktop nav.
    var desktopNav = window.matchMedia("(min-width: 1121px)");
    var onBreakpoint = function (event) {
      if (event.matches && menuIsOpen()) closeMenu(false);
    };
    if (typeof desktopNav.addEventListener === "function") {
      desktopNav.addEventListener("change", onBreakpoint);
    } else if (typeof desktopNav.addListener === "function") {
      desktopNav.addListener(onBreakpoint);
    }
  }

  /* ---- Gallery lightbox ---- */
  var box = document.getElementById("lightbox");
  if (box) {
    var thumbs = Array.prototype.slice.call(
      document.querySelectorAll(".gallery-grid a"),
    );
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

    function openBox(link) {
      lastFocus = document.activeElement;
      current = thumbs.indexOf(link);
      show(current);
      if (typeof box.showModal === "function") box.showModal();
      else box.setAttribute("open", "");
      var closeBtn = box.querySelector(".lb-close");
      if (closeBtn) closeBtn.focus();
    }

    function closeBox() {
      if (typeof box.close === "function" && box.open) box.close();
      else box.removeAttribute("open");
      image.removeAttribute("src");
      // Return focus to the image that opened the viewer.
      if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
    }

    thumbs.forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        openBox(link);
      });
    });

    var lbClose = box.querySelector(".lb-close");
    var lbPrev = box.querySelector(".lb-prev");
    var lbNext = box.querySelector(".lb-next");
    if (lbClose) lbClose.addEventListener("click", closeBox);
    if (lbPrev)
      lbPrev.addEventListener("click", function () {
        show(current - 1);
      });
    if (lbNext)
      lbNext.addEventListener("click", function () {
        show(current + 1);
      });

    box.addEventListener("cancel", function (event) {
      event.preventDefault();
      closeBox();
    });
    box.addEventListener("click", function (event) {
      if (event.target === box) closeBox();
    });
    box.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeBox();
      } else if (event.key === "ArrowLeft") {
        show(current - 1);
      } else if (event.key === "ArrowRight") {
        show(current + 1);
      } else if (event.key === "Tab" && buttons.length) {
        var index = buttons.indexOf(document.activeElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          buttons[buttons.length - 1].focus();
        } else if (!event.shiftKey && index === buttons.length - 1) {
          event.preventDefault();
          buttons[0].focus();
        }
      }
    });
  }
})();
