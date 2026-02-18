const BASE_URL = "http://www.raydelto.org/agenda.php"; 
export async function getContactos() {
  const resp = await fetch(BASE_URL, { method: "GET" });

  // Si el server responde pero no es 2xx:
  if (!resp.ok) {
    throw new Error(`GET falló: ${resp.status} ${resp.statusText}`);
    }

  // Debe ser JSON (lista de contactos)
  return await resp.json();
}

export async function addContacto(contacto) {
  const resp = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contacto),
  });

  if (!resp.ok) {
    throw new Error(`POST falló: ${resp.status} ${resp.statusText}`);
  }

  
  try {
    return await resp.json();
  } catch {
    return null;
  }
}
