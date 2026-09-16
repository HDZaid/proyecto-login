import { useState } from "react";
import { registrarUsuario } from "../api.js";

export default function FormularioRegistro({ alEntrar, irALogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");
    setEnviando(true);

    try {
      // El backend crea la cuenta y ya devuelve el token, asi que entramos directo
      const datos = await registrarUsuario(username, email, password);
      alEntrar(datos);
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
        <span className="campo__nombre">Correo</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </label>

      <label className="campo">
        <span className="campo__nombre">Contrasena</span>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
        />
        <span className="campo__ayuda">Minimo 8 caracteres, que no sea solo numeros.</span>
      </label>

      {error && (
        <p className="aviso aviso--error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="boton" disabled={enviando}>
        {enviando ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="pie">
        Ya tienes cuenta?{" "}
        <button type="button" className="enlace" onClick={irALogin}>
          Iniciar sesion
        </button>
      </p>
    </form>
  );
}
