import { useEffect, useState } from "react";
import FormularioLogin from "./components/FormularioLogin.jsx";
import FormularioRegistro from "./components/FormularioRegistro.jsx";
import Credencial from "./components/Credencial.jsx";
import { obtenerPerfil } from "./api.js";

const CLAVE_TOKEN = "token_acceso";

export default function App() {
  // sesion = null  -> nadie ha entrado
  // sesion = { usuario, access } -> hay alguien autenticado
  const [sesion, setSesion] = useState(null);
  const [vista, setVista] = useState("login"); // "login" | "registro"
  const [cargando, setCargando] = useState(true);

  // Al abrir la pagina: si quedo un token guardado, lo validamos contra /api/me/
  useEffect(() => {
    const token = localStorage.getItem(CLAVE_TOKEN);

    if (!token) {
      setCargando(false);
      return;
    }

    obtenerPerfil(token)
      .then((datos) => setSesion({ usuario: datos.usuario, access: token }))
      .catch(() => localStorage.removeItem(CLAVE_TOKEN)) // token vencido o invalido
      .finally(() => setCargando(false));
  }, []);

  function entrar(datos) {
    localStorage.setItem(CLAVE_TOKEN, datos.access);
    setSesion({ usuario: datos.usuario, access: datos.access });
  }

  function salir() {
    localStorage.removeItem(CLAVE_TOKEN);
    setSesion(null);
    setVista("login");
  }

  return (
    <main className="pantalla">
      <section className="tarjeta">
        <header className="tarjeta__encabezado">
          <p className="tarjeta__institucion">Facultad de Ingenieria</p>
          <h1 className="tarjeta__titulo">
            {sesion ? "Credencial activa" : "Acceso al sistema"}
          </h1>
        </header>

        <div className="tarjeta__cuerpo">
          {cargando && <p className="nota">Verificando sesion guardada...</p>}

          {!cargando && sesion && (
            <Credencial usuario={sesion.usuario} token={sesion.access} alSalir={salir} />
          )}

          {!cargando && !sesion && vista === "login" && (
            <FormularioLogin alEntrar={entrar} irARegistro={() => setVista("registro")} />
          )}

          {!cargando && !sesion && vista === "registro" && (
            <FormularioRegistro alEntrar={entrar} irALogin={() => setVista("login")} />
          )}
        </div>
      </section>
    </main>
  );
}
