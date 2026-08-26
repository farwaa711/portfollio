const progress = document.getElementById("progress");
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

window.addEventListener("scroll", () => {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${h ? (window.scrollY / h) * 100 : 0}%`;
}, {passive:true});

menuBtn?.addEventListener("click", () => {
  const open = navLinks.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
});

navLinks?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtn?.setAttribute("aria-expanded", "false");
}));

document.querySelectorAll("[data-scroll]").forEach(btn => {
  btn.addEventListener("click", () => document.querySelector(btn.dataset.scroll)?.scrollIntoView({behavior:"smooth"}));
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: .08});
document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const filters = document.querySelectorAll(".filter");
const items = document.querySelectorAll(".gallery-item");
filters.forEach(filter => {
  filter.addEventListener("click", () => {
    filters.forEach(f => f.classList.remove("active"));
    filter.classList.add("active");
    const value = filter.dataset.filter;
    items.forEach(item => {
      item.classList.toggle("hidden", value !== "all" && item.dataset.category !== value);
    });
  });
});

const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const modalCaption = document.getElementById("modalCaption");
const closeModal = () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  modalImg.src = "";
};
items.forEach(item => item.addEventListener("click", () => {
  modalImg.src = item.dataset.full;
  modalImg.alt = item.querySelector("img").alt;
  modalCaption.textContent = item.querySelector("span").textContent;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
}));
document.getElementById("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

document.getElementById("year").textContent = new Date().getFullYear();
