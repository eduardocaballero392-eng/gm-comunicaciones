# GM Comunicaciones – Stack completo simulado

El proyecto vuelve a incluir **frontend + backend** con el mismo diseño anterior, pero ahora todo funciona con datos en memoria. Así puedes ver el login, dashboard y CRUDs sin preocuparte por configurar MySQL; cuando quieras conectar una base real sólo tendrás que cambiar variables de entorno.

## 🚀 Inicio rápido

### Backend (Express + datos simulados)
```bash
npm install
npm run dev
```
La API queda disponible en `http://localhost:3001`.

### Frontend (Vite + React)
```bash
cd siatec-frontend
npm install
npm run dev
```
Abrir `http://localhost:5173`. El frontend ya apunta a `http://localhost:3001` por defecto; si quieres cambiarlo usa `VITE_API_URL`.

## 📁 Estructura

```
facturacion-backend/
├── api/                # Punto de entrada para Vercel (serverless)
├── src/                # Backend modular (Express)
├── siatec-frontend/    # Frontend Vite con el diseño original
├── CHECKLIST_VERCEL.md # Guía de despliegue backend
└── README.md
```

## 🔐 Credenciales de prueba

- `admin@test.com` / `admin123`
- `user@test.com` / `user123`

Viven en `src/data/memoryStore.js`, así que la autenticación es puramente simulada.

## 🌐 Endpoints principales

- `POST /api/login`
- `POST /api/register`
- `GET /api/usuarios`
- CRUD completo para `clientes` y `productos`
- `POST /api/facturas`, `GET /api/facturas`, `GET /api/facturas/:id`
- `GET /api/dashboard/summary`
- `GET /api/health`

`GET /` devuelve un índice con todas las rutas disponibles.

## ⚙️ Configuración por entorno (backend)

| Variable        | Descripción                               | Valor por defecto |
|-----------------|--------------------------------------------|-------------------|
| `PORT`          | Puerto local                               | `3001`            |
| `SECRET_KEY`    | Clave para JWT                             | `clave_secreta...`|
| `DATA_SOURCE`   | `memory` o `mysql`                         | `memory`          |
| `DB_HOST`       | Host MySQL (cuando uses `mysql`)           | `localhost`       |
| `DB_USER`       | Usuario MySQL                              | `root`            |
| `DB_PASSWORD`   | Contraseña MySQL                           | `""`              |
| `DB_NAME`       | Base de datos                              | `facturacion`     |

> Actualmente sólo existe el adaptador `memory`. Cuando tengas MySQL listo, crea el adaptador en `src/data/` y cambia `DATA_SOURCE`.

## ☁️ Despliegue rápido

1. Sube este repo a GitHub.
2. En Vercel crea un proyecto para el backend (usa `vercel.json`). Variables mínimas: `SECRET_KEY`, `DATA_SOURCE=memory`.
3. Para el frontend crea un proyecto aparte apuntando a `siatec-frontend/` y define `VITE_API_URL` con la URL del backend.

`CHECKLIST_VERCEL.md` detalla los pasos y validaciones.

---

Licencia ISC. Disfruta construyendo. 💻

