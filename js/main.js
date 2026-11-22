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

// Menü schließen: Tippen daneben oder Escape
document.addEventListener("click", (e) => {
  if (nav.classList.contains("is-open") && !nav.contains(e.target) && !navToggle.contains(e.target)) {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", t("aria.menuOpen"));
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && nav.classList.contains("is-open")) navToggle.click();
});

// Feste Buchen-Leiste erst nach dem Startbereich zeigen
const bookBar = document.getElementById("bookBar");
const heroEl = document.getElementById("start");
const updateBookBar = () => {
  const pastHero = window.scrollY > heroEl.offsetHeight * 0.6;
  bookBar.classList.toggle("is-shown", pastHero && !nav.classList.contains("is-open"));
};
window.addEventListener("scroll", updateBookBar, { passive: true });
new MutationObserver(updateBookBar).observe(nav, { attributes: true, attributeFilter: ["class"] });
updateBookBar();

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
  ".section__head, .price-group, .gallery__item, .about > *, .safer__inner > *, .contact > *"
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

// ===== Galerie: Foto groß ansehen (Lightbox) =====
// Greift nur bei echten Bildern (<img class="gallery__item">), nicht bei Platzhaltern.
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
const lbCount = document.getElementById("lbCount");
const galleryImgs = [...document.querySelectorAll("img.gallery__item")];
let lbIndex = 0;

function showLightbox(i) {
  lbIndex = (i + galleryImgs.length) % galleryImgs.length;
  const img = galleryImgs[lbIndex];
  lbImg.src = img.currentSrc || img.src;
  lbImg.alt = img.alt;
  lbCount.textContent = lbIndex + 1 + " / " + galleryImgs.length;
}

if (galleryImgs.length) {
  galleryImgs.forEach((img, i) => {
    img.tabIndex = 0;
    img.setAttribute("role", "button");
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => { showLightbox(i); lightbox.showModal(); });
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); img.click(); }
    });
  });

  const single = galleryImgs.length < 2;
  document.getElementById("lbPrev").hidden = single;
  document.getElementById("lbNext").hidden = single;
  document.getElementById("lbPrev").addEventListener("click", () => showLightbox(lbIndex - 1));
  document.getElementById("lbNext").addEventListener("click", () => showLightbox(lbIndex + 1));
  document.getElementById("lbClose").addEventListener("click", () => lightbox.close());

  // Tippen neben das Bild schließt
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) lightbox.close(); });

  // Pfeiltasten
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") showLightbox(lbIndex - 1);
    if (e.key === "ArrowRight") showLightbox(lbIndex + 1);
  });

  // Wischen auf dem Handy
  let touchX = null;
  lightbox.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener("touchend", (e) => {
    if (touchX === null) return;
    const dx = e.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(dx) > 50) showLightbox(lbIndex + (dx < 0 ? 1 : -1));
  }, { passive: true });
}

// ===== Jahr im Footer =====
document.getElementById("year").textContent = new Date().getFullYear();
