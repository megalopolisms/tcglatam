/* ==========================================================================
   TCG Latam - Main JavaScript
   Navigation, language switching, smooth interactions
   ========================================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // ===== Mobile Menu Toggle =====
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
      navLinks.classList.toggle("active");
      // Animate hamburger
      this.classList.toggle("open");
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");
      });
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("open");
      }
    });
  }

  // ===== Language Switcher =====
  const langButtons = document.querySelectorAll(".lang-switch button");
  const langElements = document.querySelectorAll("[data-lang]");

  // Get saved language or default to English
  let currentLang = localStorage.getItem("tcg-lang") || "en";
  setLanguage(currentLang);

  langButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      const lang = this.dataset.setLang;
      setLanguage(lang);
      localStorage.setItem("tcg-lang", lang);
    });
  });

  function setLanguage(lang) {
    currentLang = lang;

    // Update buttons
    langButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.setLang === lang);
    });

    // Show/hide content
    langElements.forEach((el) => {
      el.classList.toggle("active", el.dataset.lang === lang);
    });
  }

  // ===== Smooth Scroll for Anchor Links =====
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // ===== Intersection Observer for Animations =====
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  document
    .querySelectorAll(
      ".brand-card, .service-card, .why-card, .stat-item, .product-card, .team-card, .coverage-item",
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  // Add animate-in class styles
  const style = document.createElement("style");
  style.textContent =
    ".animate-in { opacity: 1 !important; transform: translateY(0) !important; }";
  document.head.appendChild(style);

  // ===== Active Nav Link =====
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  // ===== Contact Form Handler =====
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const data = Object.fromEntries(formData);

      // Build WhatsApp message
      const message = encodeURIComponent(
        `*New TCG Latam Inquiry*\n\n` +
          `Name: ${data.name}\n` +
          `Company: ${data.company || "N/A"}\n` +
          `Email: ${data.email}\n` +
          `Country: ${data.country || "N/A"}\n` +
          `Interest: ${data.interest || "General"}\n` +
          `Message: ${data.message || "N/A"}`,
      );

      // Open WhatsApp with pre-filled message
      window.open(`https://wa.me/13055041323?text=${message}`, "_blank");

      // Show success feedback
      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = currentLang === "es" ? "Enviado!" : "Sent!";
      btn.style.background = "#10b981";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        this.reset();
      }, 3000);
    });
  }

  // ===== Counter Animation for Stats =====
  function animateCounters() {
    const counters = document.querySelectorAll(".stat-number");
    counters.forEach((counter) => {
      const target = counter.dataset.count;
      if (!target) return;

      const isNumeric = /^\d+$/.test(target);
      if (!isNumeric) {
        counter.textContent = target;
        return;
      }

      const num = parseInt(target);
      const duration = 2000;
      const start = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(eased * num);

        counter.textContent =
          current.toLocaleString() + (counter.dataset.suffix || "");

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent =
            num.toLocaleString() + (counter.dataset.suffix || "");
        }
      }

      requestAnimationFrame(update);
    });
  }

  // Trigger counter animation when stats section is visible
  const statsSection = document.querySelector(".stats-grid");
  if (statsSection) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );
    statsObserver.observe(statsSection);
  }
});
