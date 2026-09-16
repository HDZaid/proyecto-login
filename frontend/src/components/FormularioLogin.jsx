import { useState } from "react";
import { iniciarSesion } from "../api.js";

export default function FormularioLogin({ alEntrar, irARegistro }) {
  // Un estado por cada cosa que cambia en pantalla
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault(); // evita que el navegador recargue la pagina
    setError("");
    setEnviando(true);

    try {
      const datos = await iniciarSesion(username, password);
      alEntrar(datos); // le avisamos a App que ya hay sesion
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={manejarEnvio} className="formulario">
      <label className="campo">
        <span className="campo__nombre">Usuario</span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </label>

      <label className="campo">
        <span className="campo__nombre">Contrasena</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
      </label>

      {error && (
        <p className="aviso aviso--error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="boton" disabled={enviando}>
        {enviando ? "Verificando..." : "Entrar"}
      </button>

      <p className="pie">
        No tienes cuenta?{" "}
        <button type="button" className="enlace" onClick={irARegistro}>
          Crear una
        </button>
      </p>
    </form>
  );
}
