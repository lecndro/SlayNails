// ===== Mobile Navigation =====
const navToggle = document.getElementById("navToggle");
const nav = document.getElementById("nav");

navToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", open);
  navToggle.setAttribute("aria-label", t(open ? "aria.menuClose" : "aria.menuOpen"));
});

nav.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  })
);

// ===== Header-Linie beim Scrollen =====
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Heutigen Tag in den Öffnungszeiten markieren =====
const today = new Date().getDay();
const todayRow = document.querySelector(`#hours tr[data-day="${today}"]`);
if (todayRow) todayRow.classList.add("is-today");

// ===== Google Maps erst nach Zustimmung laden =====
const map = document.getElementById("map");
document.getElementById("loadMap").addEventListener("click", () => {
  const iframe = document.createElement("iframe");
  iframe.src = map.dataset.src;
  iframe.loading = "lazy";
  iframe.title = t("map.title");
  iframe.referrerPolicy = "no-referrer-when-downgrade";
  map.innerHTML = "";
  map.appendChild(iframe);
});

// ===== Sanftes Einblenden der Abschnitte =====
const revealTargets = document.querySelectorAll(
  ".section__head, .price-group, .gallery__item, .about > *, .contact > *"
);
revealTargets.forEach((el) => {
  el.classList.add("reveal");
  // Geschwister nacheinander einblenden (gestaffelt)
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal") || c === el);
  el.style.setProperty("--d", Math.min(siblings.indexOf(el), 5) * 0.09 + "s");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.classList.add("is-visible");
        observer.unobserve(el);
        // Verzögerung danach entfernen, damit Hover-Effekte sofort reagieren
        setTimeout(() => el.style.removeProperty("--d"), 1500);
      }
    });
  },
  { threshold: 0.12 }
);
revealTargets.forEach((el) => observer.observe(el));

// ===== Aktiven Menüpunkt beim Scrollen hervorheben =====
const spyLinks = [...document.querySelectorAll('.nav a[href^="#"]:not(.btn)')];
const spyMap = new Map(spyLinks.map((a) => [document.querySelector(a.getAttribute("href")), a]));
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        spyLinks.forEach((a) => a.classList.remove("is-active"));
        spyMap.get(entry.target)?.classList.add("is-active");
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
spyMap.forEach((_, section) => section && spy.observe(section));
document.getElementById("start") && new IntersectionObserver(
  ([e]) => e.isIntersecting && spyLinks.forEach((a) => a.classList.remove("is-active")),
  { rootMargin: "-45% 0px -50% 0px" }
).observe(document.getElementById("start"));

// ===== Preisliste filtern =====
document.querySelectorAll(".filter").forEach((btn) =>
  btn.addEventListener("click", () => {
    const cat = btn.dataset.filter;
    document.querySelectorAll(".filter").forEach((b) => b.classList.toggle("is-active", b === btn));
    document.querySelectorAll(".price-group").forEach((group) => {
      group.hidden = cat !== "all" && group.dataset.cat !== cat;
    });
  })
);

// ===== Jahr im Footer =====
document.getElementById("year").textContent = new Date().getFullYear();
