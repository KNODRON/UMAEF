const btnAlerta = document.getElementById("btnAlerta");
const alertBox = document.getElementById("alertBox");
const horaActual = document.getElementById("horaActual");

function actualizarHora() {
  const ahora = new Date();

  horaActual.textContent = ahora.toLocaleTimeString("es-CL", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
}

actualizarHora();
setInterval(actualizarHora, 1000);

btnAlerta.addEventListener("click", () => {
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3500);
});

/* BOTONES DE CAPAS */

const layerButtons = document.querySelectorAll(".layers button");

layerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("active");
  });
});
