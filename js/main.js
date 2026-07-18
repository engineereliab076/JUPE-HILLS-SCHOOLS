/* Jupe Hills website interactions — dependency-free and progressively enhanced. */
(function () {
  "use strict";

  var header = document.querySelector(".site-header");
  var menuButton = document.querySelector(".menu-toggle");
  var nav = document.getElementById("site-nav");
  var backToTop = document.querySelector(".back-to-top");

  var footer = document.querySelector(".site-footer");
  var footerLegal = document.querySelector(".footer-legal");
  if (footer && footerLegal && !footer.querySelector(".footer-signup")) {
    var footerSignup = document.createElement("div");
    footerSignup.className = "shell footer-signup";
    footerSignup.innerHTML = '<div><h2>School updates</h2><p>Receive term reminders and important news by email.</p></div><form class="inline-form" data-form="newsletter" novalidate><div><label for="footer-email">Email address</label><input id="footer-email" name="email" type="email" autocomplete="email" required placeholder="parent@example.com"></div><button class="btn btn--solid" type="submit">Subscribe</button><p class="form-message" role="status" aria-live="polite"></p></form><p class="footer-social">Social media: <span>Facebook</span> · <span>Instagram</span> · <span>YouTube</span> <small>(official links pending)</small></p>';
    footer.insertBefore(footerSignup, footerLegal);
  }

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

  document.querySelectorAll("[data-form]").forEach(function (form) {
    var message = form.querySelector(".form-message");
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        if (message) {
          message.className = "form-message is-error";
          message.textContent = "Please check the highlighted fields and try again.";
        }
        var invalid = form.querySelector(":invalid");
        if (invalid) invalid.focus();
        return;
      }

      var kind = form.dataset.form;
      if (kind === "contact" || kind === "admission") {
        var data = new FormData(form);
        var subject = kind === "admission" ? "Admission inquiry" : (data.get("subject") || "Website message");
        var body = Array.from(data.entries()).map(function (entry) {
          return entry[0] + ": " + entry[1];
        }).join("\n");
        window.location.href = "mailto:nyagwaswafaith@gmail.com?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
        if (message) {
          message.className = "form-message is-success";
          message.textContent = "Your email app is opening with the message prepared. Send it to complete your inquiry.";
        }
      } else {
        if (message) {
          message.className = "form-message is-success";
          message.textContent = "Thank you. Your email has been recorded on this device for the school newsletter demo.";
        }
        try { localStorage.setItem("jupe-newsletter", String(new FormData(form).get("email"))); } catch (error) { /* storage is optional */ }
        form.reset();
      }
      form.classList.remove("was-validated");
    });
  });

  var filterButtons = document.querySelectorAll("[data-gallery-filter]");
  var galleryItems = document.querySelectorAll("[data-gallery-category]");
  filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      var filter = button.dataset.galleryFilter;
      filterButtons.forEach(function (item) {
        item.classList.toggle("is-active", item === button);
        item.setAttribute("aria-pressed", String(item === button));
      });
      galleryItems.forEach(function (item) {
        item.hidden = filter !== "all" && item.dataset.galleryCategory !== filter;
      });
    });
  });

  var box = document.getElementById("lightbox");
  if (box) {
    var thumbs = Array.prototype.slice.call(document.querySelectorAll(".gallery-grid a"));
    var image = box.querySelector("img");
    var caption = box.querySelector("figcaption");
    var buttons = Array.prototype.slice.call(box.querySelectorAll("button"));
    var current = -1;
    var lastFocus = null;

    function visibleThumbs() { return thumbs.filter(function (item) { return !item.closest("[hidden]"); }); }
    function show(index) {
      var active = visibleThumbs();
      if (!active.length) return;
      current = (index + active.length) % active.length;
      var link = active[current];
      image.src = link.getAttribute("href");
      image.alt = link.querySelector("img").alt;
      caption.textContent = link.dataset.caption || image.alt;
    }
    function open(link) {
      lastFocus = document.activeElement;
      current = visibleThumbs().indexOf(link);
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
