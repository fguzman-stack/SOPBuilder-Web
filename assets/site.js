const localized = [...document.querySelectorAll("[data-es]")];
localized.forEach((element) => (element.dataset.en = element.innerHTML));
let locale = "en";
try {
  locale =
    localStorage.getItem("sopbuilder-site-language") ||
    (navigator.language.startsWith("es") ? "es" : "en");
} catch {}
function setLanguage(value) {
  locale = value === "es" ? "es" : "en";
  document.documentElement.lang = locale;
  localized.forEach((element) => (element.innerHTML = element.dataset[locale]));
  const button = document.getElementById("language");
  if (button) {
    button.textContent = locale === "es" ? "EN" : "ES";
    button.setAttribute(
      "aria-label",
      locale === "es" ? "Switch to English" : "Cambiar a español",
    );
  }
  try {
    localStorage.setItem("sopbuilder-site-language", locale);
  } catch {}
}
setLanguage(locale);
document
  .getElementById("language")
  ?.addEventListener("click", () => setLanguage(locale === "es" ? "en" : "es"));
const dialog = document.getElementById("lightbox");
document.querySelectorAll(".gallery img").forEach((image) => {
  const open = () => {
    const target = document.getElementById("lightbox-image");
    target.src = image.src;
    target.alt = image.alt;
    dialog.showModal();
  };
  image.addEventListener("click", open);
  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      open();
    }
  });
});
document
  .getElementById("close-lightbox")
  ?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});
