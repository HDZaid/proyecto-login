// Un solo lugar donde vive la direccion del backend.
// Si cambias el puerto de Django, lo cambias aqui y nada mas.
const API_URL = "http://127.0.0.1:8000/api";

/**
 * Envia una peticion al backend y convierte cualquier fallo
 * en un Error con un mensaje que se puede mostrar en pantalla.
 */
async function peticion(ruta, { metodo = "GET", datos, token } = {}) {
  const cabeceras = { "Content-Type": "application/json" };

  // Asi viaja el token JWT: en la cabecera Authorization
  if (token) {
    cabeceras.Authorization = `Bearer ${token}`;
  }

  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      method: metodo,
      headers: cabeceras,
      body: datos ? JSON.stringify(datos) : undefined,
    });
  } catch {
    // Aqui cae cuando el servidor de Django no esta encendido
    throw new Error("No hay conexion con el servidor. Revisa que Django este corriendo.");
  }

  const cuerpo = await respuesta.json().catch(() => ({}));

  if (!respuesta.ok) {
    throw new Error(leerError(cuerpo, respuesta.status));
  }

  return cuerpo;
}

/** Arma un mensaje legible a partir de la respuesta de error del backend. */
function leerError(cuerpo, estado) {
  // Errores de validacion campo por campo: {"errores": {"password": ["..."]}}
  if (cuerpo.errores) {
    const primero = Object.values(cuerpo.errores)[0];
    if (Array.isArray(primero)) return primero[0];
  }
  if (cuerpo.mensaje) return cuerpo.mensaje;
  if (cuerpo.detail) return cuerpo.detail;
  return `Error inesperado del servidor (codigo ${estado}).`;
}

export function iniciarSesion(username, password) {
  return peticion("/login/", { metodo: "POST", datos: { username, password } });
}

export function registrarUsuario(username, email, password) {
  return peticion("/register/", { metodo: "POST", datos: { username, email, password } });
}

export function obtenerPerfil(token) {
  return peticion("/me/", { token });
}
