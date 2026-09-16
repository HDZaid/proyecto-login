export default function Credencial({ usuario, token, alSalir }) {
  return (
    <div className="credencial">
      <p className="aviso aviso--exito">Autenticacion exitosa.</p>

      <dl className="datos">
        <dt>Usuario</dt>
        <dd>{usuario.username}</dd>

        <dt>Correo</dt>
        <dd>{usuario.email || "sin correo registrado"}</dd>

        <dt>ID interno</dt>
        <dd>{usuario.id}</dd>
      </dl>

      <div className="token">
        <p className="token__nombre">Token JWT guardado en el navegador</p>
        {/* Se muestra recortado solo para la demostracion del video */}
        <code>{token.slice(0, 48)}...</code>
      </div>

      <button type="button" className="boton boton--secundario" onClick={alSalir}>
        Cerrar sesion
      </button>
    </div>
  );
}
