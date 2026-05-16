const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");

menuBtn.addEventListener("click", () => {
  navMenu.classList.toggle("open");
});

document.querySelectorAll(".nav a").forEach(link => {

  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
  });

});

/* BOTÓN CONTACTO */

const contactBtn = document.getElementById("contactBtn");

contactBtn.addEventListener("click", () => {

  const subject = encodeURIComponent(
    "Solicitud de presentación técnica UMAEF"
  );

  const body = encodeURIComponent(
`Hola UMAEF,

Quisiera solicitar una presentación técnica del servicio.

Empresa:
Cargo:
Tipo de operación:
Requerimiento:

Saludos.`
  );

  window.location.href =
    `mailto:contacto@umaef.cl?subject=${subject}&body=${body}`;

});

/* ANIMACIÓN SUAVE AL HACER SCROLL */

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.classList.add("show");

    }

  });

}, {
  threshold: 0.15
});

cards.forEach(card => {
  observer.observe(card);
});
