# ✅ Checklist para Desplegar en Vercel

## Backend (facturacion-backend)

### ✅ Completado:
- [x] Archivo `vercel.json` creado
- [x] Archivo `api/index.js` creado con todas las rutas
- [x] Todas las rutas configuradas con prefijo `/api`
- [x] Variables de entorno configuradas en el código
- [x] CORS habilitado

### ⚠️ Pendiente (debes hacerlo):
- [ ] **Configurar variables de entorno en Vercel:**
  - `DB_HOST` - Host de tu base de datos MySQL
  - `DB_USER` - Usuario de MySQL
  - `DB_PASSWORD` - Contraseña de MySQL
  - `DB_NAME` - Nombre de la base de datos (ej: `facturacion`)
  - `SECRET_KEY` - Clave secreta para JWT

- [ ] **Asegurar que tu base de datos MySQL sea accesible desde internet**
  - No puede ser `localhost`
  - Usa un servicio en la nube como:
    - PlanetScale (recomendado, gratis)
    - Railway
    - Render
    - AWS RDS
    - Google Cloud SQL

- [ ] **Desplegar el backend en Vercel**
  - Conecta tu repositorio
  - O usa `vercel` desde la terminal

## Frontend (siatec-frontend)

### ✅ Completado:
- [x] Archivo `src/config.js` creado
- [x] Todas las llamadas a la API actualizadas
- [x] Configuración para usar variables de entorno

### ⚠️ Pendiente (debes hacerlo):
- [ ] **Desplegar el frontend en Vercel** (proyecto separado)
  - Crea un nuevo proyecto en Vercel
  - Selecciona la carpeta `siatec-frontend`
  - Configura la variable de entorno:
    - `VITE_API_URL` = URL de tu backend desplegado (ej: `https://tu-backend.vercel.app`)

## Pasos Finales

1. **Despliega el backend primero:**
   ```bash
   vercel
   ```
   O desde el dashboard de Vercel conectando tu repositorio

2. **Obtén la URL de tu backend** (ej: `https://facturacion-backend.vercel.app`)

3. **Despliega el frontend:**
   ```bash
   cd siatec-frontend
   vercel
   ```
   Cuando te pregunte, agrega la variable:
   - `VITE_API_URL` = `https://tu-backend.vercel.app`

4. **Verifica que todo funcione:**
   - Visita la URL del frontend
   - Intenta hacer login
   - Verifica que las rutas del backend respondan

## Problemas Comunes

### Error: "Cannot connect to database"
- Verifica que `DB_HOST` no sea `localhost`
- Asegúrate de que tu base de datos permita conexiones externas
- Verifica las credenciales en las variables de entorno

### Error: "CORS policy"
- Ya está configurado en `api/index.js` con `app.use(cors())`
- Si persiste, verifica que la URL del frontend esté permitida

### El frontend no se conecta al backend
- Verifica que `VITE_API_URL` esté configurada correctamente
- Asegúrate de que la URL termine sin `/` (ej: `https://backend.vercel.app` no `https://backend.vercel.app/`)

