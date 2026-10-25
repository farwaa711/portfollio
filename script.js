(() => {
  "use strict";

  const progress = document.getElementById("progress");
  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modalImg");
  const modalCaption = document.getElementById("modalCaption");
  const modalClose = document.getElementById("modalClose");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress: passive so it doesn't block touch scrolling.
  let ticking = false;
  const updateProgress = () => {
    if (!progress) return;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0}%`;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateProgress);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateProgress, { passive: true });
  updateProgress();

  // Mobile navigation. Close on navigation, outside tap, and Escape.
  const closeMenu = () => {
    if (!navLinks || !menuBtn) return;
    navLinks.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Open menu");
  };
  menuBtn?.addEventListener("click", () => {
    if (!navLinks) return;
    const open = !navLinks.classList.contains("open");
    navLinks.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks?.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const target = document.querySelector(link.getAttribute("href"));
      if (target) {
        event.preventDefault();
        closeMenu();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
        history.replaceState(null, "", link.getAttribute("href"));
      }
    });
  });

  document.addEventListener("click", event => {
    if (!navLinks || !menuBtn || !navLinks.classList.contains("open")) return;
    if (!navLinks.contains(event.target) && !menuBtn.contains(event.target)) closeMenu();
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 720) closeMenu();
  }, { passive: true });

  // Buttons that scroll to a section.
  document.querySelectorAll("[data-scroll]").forEach(button => {
    button.addEventListener("click", () => {
      const selector = button.getAttribute("data-scroll");
      const target = selector ? document.querySelector(selector) : null;
      if (target) {
        closeMenu();
        target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      }
    });
  });

  // Reveal elements as they enter the viewport; keep content visible if unsupported.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -20px 0px" });
    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  // Evidence filters are real buttons and remain usable on touch screens.
  const filters = [...document.querySelectorAll(".filter")];
  const items = [...document.querySelectorAll(".gallery-item")];
  filters.forEach(filter => {
    filter.setAttribute("aria-pressed", String(filter.classList.contains("active")));
    filter.addEventListener("click", () => {
      filters.forEach(button => {
        const active = button === filter;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      const value = filter.dataset.filter || "all";
      items.forEach(item => {
        const show = value === "all" || item.dataset.category === value;
        item.classList.toggle("hidden", !show);
        item.setAttribute("aria-hidden", String(!show));
        item.tabIndex = show ? 0 : -1;
      });
    });
  });

  // Full-screen image viewer: tap image, close button, backdrop, or Escape.
  let previousFocus = null;
  const openModal = item => {
    if (!modal || !modalImg || !modalCaption) return;
    const image = item.querySelector("img");
    const fullImage = item.dataset.full || image?.getAttribute("src");
    if (!fullImage || !image) return;
    previousFocus = item;
    modalImg.src = fullImage;
    modalImg.alt = image.alt || "Selected lab evidence";
    modalCaption.textContent = item.querySelector("span")?.textContent?.trim() || image.alt || "Lab evidence";
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalClose?.focus({ preventScroll: true });
  };
  const closeModal = () => {
    if (!modal || !modalImg) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    modalImg.removeAttribute("src");
    if (previousFocus && document.contains(previousFocus)) previousFocus.focus({ preventScroll: true });
    previousFocus = null;
  };

  items.forEach(item => item.addEventListener("click", () => openModal(item)));
  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
      closeMenu();
    }
    // Keep keyboard focus in the open viewer.
    if (event.key === "Tab" && modal?.classList.contains("open") && modalClose) {
      event.preventDefault();
      modalClose.focus();
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
