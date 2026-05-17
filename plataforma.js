const btnAlerta = document.getElementById("btnAlerta");
const alertBox = document.getElementById("alertBox");
const horaActual = document.getElementById("horaActual");
const coordActual = document.getElementById("coordActual");

const btnUbicacion = document.getElementById("btnUbicacion");
const btnNormal = document.getElementById("btnNormal");
const btnSatelite = document.getElementById("btnSatelite");

const layerBase = document.getElementById("layerBase");
const layerDrone = document.getElementById("layerDrone");
const layerZona = document.getElementById("layerZona");
const layerIncidente = document.getElementById("layerIncidente");

/* HORA */

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

/* MAPA BASE */

const ubicacionInicial = [-33.4489, -70.6693];

const map = L.map("map", {
  zoomControl: true
}).setView(ubicacionInicial, 14);

const mapaNormal = L.tileLayer(
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    maxZoom: 19,
    attribution: "© OpenStreetMap"
  }
);

const mapaSatelital = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19,
    attribution: "Tiles © Esri"
  }
);

mapaNormal.addTo(map);

/* ICONOS */

function crearIcono(clase, texto) {
  return L.divIcon({
    className: "",
    html: `
      <div style="display:flex;align-items:center;gap:8px;">
        <div class="custom-marker ${clase}"></div>
        <div class="marker-label">${texto}</div>
      </div>
    `,
    iconSize: [120, 30],
    iconAnchor: [12, 15]
  });
}

const iconoBase = crearIcono("marker-base", "UMAEF");
const iconoDrone = crearIcono("marker-drone", "DRON");
const iconoIncidente = crearIcono("marker-incident", "INCIDENTE");

/* CAPAS OPERACIONALES */

const grupoBase = L.layerGroup().addTo(map);
const grupoDrone = L.layerGroup().addTo(map);
const grupoZona = L.layerGroup().addTo(map);
const grupoIncidente = L.layerGroup().addTo(map);

/* MARCADORES INICIALES */

let baseCoords = ubicacionInicial;
let droneCoords = [-33.4459, -70.6649];
let incidenteCoords = [-33.4446, -70.6608];

let marcadorBase = L.marker(baseCoords, {
  icon: iconoBase
}).addTo(grupoBase);

let marcadorDrone = L.marker(droneCoords, {
  icon: iconoDrone
}).addTo(grupoDrone);

let marcadorIncidente = L.marker(incidenteCoords, {
  icon: iconoIncidente
}).addTo(grupoIncidente);

let lineaOperacion = L.polyline(
  [baseCoords, droneCoords, incidenteCoords],
  {
    color: "#2dd36f",
    weight: 4,
    opacity: 0.85,
    dashArray: "8, 8"
  }
).addTo(grupoZona);

let zonaOperacion = L.polygon(
  [
    [-33.4475, -70.6668],
    [-33.4438, -70.6645],
    [-33.4427, -70.6604],
    [-33.4469, -70.6582],
    [-33.4491, -70.6625]
  ],
  {
    color: "#ff8c2a",
    weight: 2,
    dashArray: "8, 8",
    fillColor: "#ff8c2a",
    fillOpacity: 0.14
  }
).addTo(grupoZona);

zonaOperacion.bindPopup("Zona operacional de inspección aérea");
marcadorBase.bindPopup("Unidad UMAEF");
marcadorDrone.bindPopup("RPAS en operación");
marcadorIncidente.bindPopup("Punto crítico / incidente");

/* COORDENADAS EN PANEL */

function actualizarCoordenadas(latlng) {
  coordActual.textContent =
    `${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`;
}

actualizarCoordenadas(L.latLng(baseCoords));

/* CAMBIO MAPA NORMAL / SATELITAL */

btnNormal.addEventListener("click", () => {
  map.removeLayer(mapaSatelital);
  mapaNormal.addTo(map);

  btnNormal.classList.add("active");
  btnSatelite.classList.remove("active");
});

btnSatelite.addEventListener("click", () => {
  map.removeLayer(mapaNormal);
  mapaSatelital.addTo(map);

  btnSatelite.classList.add("active");
  btnNormal.classList.remove("active");
});

/* USAR MI UBICACIÓN */

btnUbicacion.addEventListener("click", () => {
  if (!navigator.geolocation) {
    alert("Este navegador no permite geolocalización.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      baseCoords = [lat, lng];

      marcadorBase.setLatLng(baseCoords);

      droneCoords = [lat + 0.0025, lng + 0.0030];
      incidenteCoords = [lat + 0.0042, lng + 0.0050];

      marcadorDrone.setLatLng(droneCoords);
      marcadorIncidente.setLatLng(incidenteCoords);

      lineaOperacion.setLatLngs([
        baseCoords,
        droneCoords,
        incidenteCoords
      ]);

      zonaOperacion.setLatLngs([
        [lat + 0.0010, lng + 0.0010],
        [lat + 0.0040, lng + 0.0028],
        [lat + 0.0052, lng + 0.0062],
        [lat + 0.0022, lng + 0.0075],
        [lat - 0.0004, lng + 0.0041]
      ]);

      map.setView(baseCoords, 15);

      actualizarCoordenadas(L.latLng(baseCoords));
    },
    () => {
      alert("No se pudo obtener la ubicación.");
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    }
  );
});

/* ACTIVAR / DESACTIVAR CAPAS */

function toggleLayer(button, group) {
  button.classList.toggle("active");

  if (map.hasLayer(group)) {
    map.removeLayer(group);
  } else {
    map.addLayer(group);
  }
}

layerBase.addEventListener("click", () => {
  toggleLayer(layerBase, grupoBase);
});

layerDrone.addEventListener("click", () => {
  toggleLayer(layerDrone, grupoDrone);
});

layerZona.addEventListener("click", () => {
  toggleLayer(layerZona, grupoZona);
});

layerIncidente.addEventListener("click", () => {
  toggleLayer(layerIncidente, grupoIncidente);
});

/* ALERTA */

btnAlerta.addEventListener("click", () => {
  alertBox.classList.add("show");

  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 3500);
});
