# ✅ Checklist para desplegar (backend + frontend)

## Backend (facturacion-backend raíz)

### ✅ Ya listo en código
- [x] `vercel.json` apunta a `api/index.js`
- [x] `api/index.js` reutiliza `src/app.js`
- [x] Rutas namespaced bajo `/api`
- [x] Datos simulados listos para trabajar sin MySQL

### ⚙️ Configuración pendiente en Vercel
- [ ] Crear un proyecto nuevo y conectar este repositorio
- [ ] Variables mínimas:
  - `SECRET_KEY`
  - `DATA_SOURCE=memory`
- [ ] Si más adelante activas MySQL agrega:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`

### ☁️ Pasos para desplegar backend
1. `npm install`
2. `vercel login`
3. `vercel --prod` (o desde el dashboard conectando GitHub)
4. Definir variables en **Settings → Environment Variables**
5. Validar:
   - `GET https://tu-api.vercel.app/api/health`
   - `POST https://tu-api.vercel.app/api/login`
   - `GET https://tu-api.vercel.app/api/dashboard/summary`

## Frontend (`siatec-frontend/`)

### ⚙️ Configuración en Vercel
- [ ] Crear un segundo proyecto apuntando a la carpeta `siatec-frontend`
- [ ] Variables:
  - `VITE_API_URL` = URL del backend desplegado (sin `/` final)

### Pasos sugeridos
1. `cd siatec-frontend`
2. `npm install`
3. `vercel --prod` (elige el scope del proyecto frontend)

## 🧷 Consejos adicionales
- Cuando migres a MySQL, implementa un adaptador en `src/data/` y cambia `DATA_SOURCE`.
- Usa los mismos valores de entorno en local y prod para evitar sorpresas.
- Para depurar errores en Vercel usa `vercel logs <url> --since 1h`.

Con estos pasos tendrás el backend y el frontend desplegados por separado pero conectados entre sí mediante `VITE_API_URL`. 

