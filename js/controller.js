import { getContactos, addContacto } from "./agendaApi.js";

const form = document.getElementById("contactForm");
const tbody = document.getElementById("contactsTbody");
const statusEl = document.getElementById("status");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");
const countPill = document.getElementById("countPill");

function setStatus(msg, isError = false) {
  statusEl.textContent = msg;
  statusEl.style.color = isError ? "#ff6b6b" : "";
}

function sanitizeText(x) {
  return String(x ?? "").trim();
}

function validar({ nombre, apellido, telefono }) {
  if (!nombre || !apellido || !telefono) return "Completa nombre, apellido y teléfono.";
  if (telefono.length < 6) return "Ese teléfono se ve demasiado corto 👀";
  return null;
}

function renderRows(contactos) {
  tbody.innerHTML = "";

  for (const c of contactos) {
    const tr = document.createElement("tr");

    const tdNombre = document.createElement("td");
    tdNombre.textContent = c.nombre ?? "";

    const tdApellido = document.createElement("td");
    tdApellido.textContent = c.apellido ?? "";

    const tdTel = document.createElement("td");
    tdTel.textContent = c.telefono ?? "";

    tr.append(tdNombre, tdApellido, tdTel);
    tbody.appendChild(tr);
  }

  countPill.textContent = String(contactos.length);
}

async function cargarContactos() {
  setStatus("Cargando contactos...");
  btnRecargar.disabled = true;

  try {
    const contactos = await getContactos();
  
    if (!Array.isArray(contactos)) throw new Error("La respuesta no fue una lista.");
    renderRows(contactos);
    setStatus(`Listo. Contactos cargados: ${contactos.length}`);
  } catch (err) {
    setStatus(`Error cargando: ${err.message}`, true);
  } finally {
    btnRecargar.disabled = false;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const contacto = {
    nombre: sanitizeText(document.getElementById("nombre").value),
    apellido: sanitizeText(document.getElementById("apellido").value),
    telefono: sanitizeText(document.getElementById("telefono").value),
  };

  const error = validar(contacto);
  if (error) {
    setStatus(error, true);
    return;
  }

  setStatus("Guardando contacto...");
  btnGuardar.disabled = true;

  try {
    await addContacto(contacto);
    form.reset();
    setStatus("Guardado ✅ Recargando lista...");
    await cargarContactos();
  } catch (err) {
    setStatus(`Error guardando: ${err.message}`, true);
  } finally {
    btnGuardar.disabled = false;
  }
});

btnRecargar.addEventListener("click", cargarContactos);

// Inicial
cargarContactos();
