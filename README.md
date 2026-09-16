# Sistema de login con React y Django

Proyecto para el ejercicio de Programación Web: autenticación de usuarios con
JWT, backend en Django REST Framework y frontend en React.

```
proyecto-login/
├── backend/      → Django + DRF + SimpleJWT (repositorio 1)
└── frontend/     → React + Vite (repositorio 2)
```

---

## 1. Levantar el backend

Necesitas Python 3.10 o superior.

```bash
cd backend

python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Queda corriendo en `http://127.0.0.1:8000`.

Opcional, para entrar al panel de administración y mostrar los usuarios creados
durante el video:

```bash
python manage.py createsuperuser
```

## 2. Levantar el frontend

En **otra terminal**, sin cerrar la del backend. Necesitas Node 18 o superior.

```bash
cd frontend

npm install
npm run dev
```

Abre `http://localhost:5173`.

---

## Endpoints de la API

| Método | Ruta             | Protegido | Qué hace                                    |
| ------ | ---------------- | --------- | ------------------------------------------- |
| POST   | `/api/register/` | No        | Crea un usuario y devuelve sus tokens       |
| POST   | `/api/login/`    | No        | Valida credenciales y devuelve los tokens   |
| GET    | `/api/me/`       | Sí        | Devuelve los datos del usuario del token    |
| POST   | `/api/refresh/`  | No        | Cambia un token `refresh` por uno `access`  |

### Probar sin el frontend

Sirve para la parte del video donde enseñas que el backend funciona solo.
Con Postman, o con estos comandos:

```bash
# Registro
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"mario","email":"mario@test.com","password":"Clave-Seg-2026"}'

# Login correcto  → 200
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"mario","password":"Clave-Seg-2026"}'

# Login incorrecto → 401
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"mario","password":"esta-no-es"}'

# Ruta protegida (pega el "access" que te devolvió el login)
curl http://127.0.0.1:8000/api/me/ -H "Authorization: Bearer TU_TOKEN_AQUI"
```

---

## Cómo está armado

### Backend

- **`core/settings.py`** — registra `rest_framework`, `corsheaders` y la app
  `authapi`. Define que la autenticación por defecto es JWT y abre CORS para
  los puertos donde corre React (5173 y 3000).
- **`authapi/serializers.py`** — `RegisterSerializer` valida el usuario nuevo y
  crea la cuenta con `create_user`, que guarda la contraseña como hash, nunca en
  texto plano. `UserSerializer` define qué datos del usuario salen hacia el
  frontend (el password nunca sale).
- **`authapi/views.py`** — las tres vistas. `LoginView` usa `authenticate()` de
  Django para comparar la contraseña contra el hash guardado, y si coincide
  genera el par de tokens con `RefreshToken.for_user()`.
- **`authapi/urls.py`** y **`core/urls.py`** — el ruteo.

No hay `models.py` propio: se usa el modelo `User` que Django ya trae en
`django.contrib.auth`. Ese es el modelo que se explica en el video.

### Frontend

- **`src/api.js`** — todas las llamadas `fetch` al backend en un solo archivo.
  Traduce los errores del servidor a mensajes en español.
- **`src/App.jsx`** — guarda la sesión con `useState`. Al cargar la página, un
  `useEffect` revisa si hay un token en `localStorage` y lo valida contra
  `/api/me/`; si el token venció, lo borra.
- **`src/components/FormularioLogin.jsx`** — el formulario. Cuatro estados:
  usuario, contraseña, error y "enviando" (que deshabilita el botón mientras
  se espera la respuesta).
- **`src/components/FormularioRegistro.jsx`** — crea la cuenta y entra directo.
- **`src/components/Credencial.jsx`** — lo que se ve ya autenticado.

---

## Guion sugerido para el video (5–10 min)

1. **Introducción (30 s)** — tu nombre, el curso, y qué hace el proyecto:
   un login donde React manda las credenciales a una API de Django y recibe
   un token JWT.

2. **Backend (2–3 min)** — enseña el árbol de carpetas. Abre `settings.py` y
   señala `INSTALLED_APPS`, el middleware de CORS arriba de todo, y el bloque
   `REST_FRAMEWORK` con JWT. Explica que el modelo es el `User` de Django.
   Pasa a `serializers.py` y `views.py`, y en `LoginView` detente en
   `authenticate()` y en la generación del token.

3. **Backend funcionando solo (1 min)** — con Postman o curl: registro, login
   correcto, login incorrecto (muestra el 401), y `/api/me/` con el token.

4. **Frontend (2 min)** — `App.jsx` primero (el estado de la sesión y el
   `useEffect`), luego `FormularioLogin.jsx` (los `useState`, el `onSubmit`,
   el `try/catch`), y por último `api.js` (dónde vive el `fetch`).

5. **Demostración (1–2 min)** — en el navegador:
   - Login con datos incorrectos → aparece el mensaje de error en rojo.
   - Login correcto → aparece la credencial con el token.
   - Abre DevTools → Application → Local Storage y enseña el token guardado.
   - Recarga la página: la sesión sigue activa porque el token se revalida.
   - Cierra sesión y muestra que el token desapareció.

6. **Cierre (20 s)** — los links de los dos repositorios.

Sube el video a YouTube como **no listado** ("oculto") y entrega ese enlace.

---

## Entregables del ejercicio

- Repositorio del backend (la carpeta `backend/`).
- Repositorio del frontend (la carpeta `frontend/`).
- Enlace al video en YouTube.
