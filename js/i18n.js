// ===== Sprachumschaltung DE / EN =====
// Deutsch steht direkt im HTML. Hier stehen die englischen Texte.
// Neue Texte: im HTML data-i18n="schluessel" setzen und hier ergänzen.
const EN = {
  "nav.services": "Services", "nav.gallery": "Gallery", "nav.about": "About", "nav.contact": "Contact", "nav.book": "Book now",

  "hero.eyebrow": "Queer Nail Tech · Berlin",
  "hero.text": "Nail art for every version of you. Gel X and Shellac in a safer space for FLINTA*, queers and allies.",
  "hero.book": "Book now", "hero.prices": "View prices",

  "services.eyebrow": "Services", "services.title": "Price list",
  "services.fix": "Repair", "services.removal": "Removal",
  "services.note": "Prices as in the online booking. You'll find duration and details there for each service.",
  "s.firstRemoval": "First-time removal (previous set)",
  "filter.all": "All",

  "gallery.eyebrow": "Gallery", "gallery.title": "Our work", "gallery.more": "More on Instagram:",

  "about.photo": "Photo of Rachel", "about.eyebrow": "About me", "about.title": "Nail art for every version of you.",
  "about.p1": "Hi, I'm Rachel Harmony – a nail tech in Berlin. I offer Gel X and Shellac, from a simple single colour to an elaborate design.",
  "about.p2": "My studio is a safer space for FLINTA*, queers and allies. I want you to feel comfortable here, just as you are.",

  "contact.eyebrow": "Contact", "contact.title": "Find us", "contact.hours": "Opening hours",
  "day.mon": "Monday", "day.tue": "Tuesday", "day.wed": "Wednesday", "day.thu": "Thursday", "day.fri": "Friday", "day.sat": "Saturday", "day.sun": "Sunday",
  "hours.closed": "Closed",
  "hours.today": "Today",
  "hours.note": "Appointments by arrangement via the online booking only.",
  "map.consent": "Loading the map transfers data to Google.", "map.show": "Show map", "map.title": "Location of Slay Nails by Harmony",

  "footer.imprint": "Legal notice", "footer.privacy": "Privacy policy",

  "aria.menuOpen": "Open menu", "aria.menuClose": "Close menu",

  "meta.title": "Slay Nails by Harmony – Queer Nail Tech Berlin",
  "meta.description": "Slay Nails by Harmony – queer nail tech in Berlin. Gel X and Shellac, nail art for every version of you. A safer space for FLINTA*. Book your appointment now."
};

const I18N = { en: EN, de: {} };

// Deutsche Originaltexte aus dem HTML merken
document.querySelectorAll("[data-i18n]").forEach((el) => {
  I18N.de[el.dataset.i18n] = el.textContent;
});
Object.assign(I18N.de, {
  "hours.today": "Heute",
  "map.title": "Standort Slay Nails by Harmony",
  "aria.menuOpen": "Menü öffnen", "aria.menuClose": "Menü schließen",
  "meta.title": document.title,
  "meta.description": document.querySelector('meta[name="description"]').content
});

let currentLang = "de";
const t = (key) => (I18N[currentLang] && I18N[currentLang][key]) ?? I18N.de[key] ?? key;

function setLang(lang) {
  currentLang = lang === "en" ? "en" : "de";
  document.documentElement.lang = currentLang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });

  // Buchungsseite in der passenden Sprache öffnen
  document.querySelectorAll(".js-book").forEach((a) => {
    a.href = a.href.replace(/locale=\w+/, "locale=" + currentLang);
  });

  document.querySelectorAll(".lang__btn").forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active);
  });

  document.title = t("meta.title");
  document.querySelector('meta[name="description"]').content = t("meta.description");
  document.querySelectorAll("#hours td:first-child").forEach((td) => (td.dataset.today = t("hours.today")));

  const iframe = document.querySelector("#map iframe");
  if (iframe) iframe.title = t("map.title");

  const navToggle = document.getElementById("navToggle");
  const open = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-label", t(open ? "aria.menuClose" : "aria.menuOpen"));

  try { localStorage.setItem("lang", currentLang); } catch (e) {}
}

document.querySelectorAll(".lang__btn").forEach((btn) =>
  btn.addEventListener("click", () => setLang(btn.dataset.lang))
);

// Startsprache: gespeicherte Wahl, sonst Browsersprache
let startLang = "de";
try { startLang = localStorage.getItem("lang"); } catch (e) {}
if (!startLang) startLang = (navigator.language || "de").toLowerCase().startsWith("de") ? "de" : "en";
setLang(startLang);
