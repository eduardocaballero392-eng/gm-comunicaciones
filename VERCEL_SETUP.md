# Configuración para Vercel

## Pasos para desplegar en Vercel

### 1. Instalar Vercel CLI (opcional)
```bash
npm i -g vercel
```

### 2. Configurar Variables de Entorno en Vercel

En el dashboard de Vercel, ve a tu proyecto → Settings → Environment Variables y agrega:

- `DB_HOST`: Host de tu base de datos MySQL (ej: tu-host.mysql.com)
- `DB_USER`: Usuario de la base de datos
- `DB_PASSWORD`: Contraseña de la base de datos
- `DB_NAME`: Nombre de la base de datos (ej: facturacion)
- `SECRET_KEY`: Clave secreta para JWT (usa una clave segura)

### 3. Desplegar

#### Opción A: Desde el Dashboard de Vercel
1. Conecta tu repositorio de GitHub/GitLab/Bitbucket
2. Vercel detectará automáticamente la configuración
3. Asegúrate de que las variables de entorno estén configuradas

#### Opción B: Desde la terminal
```bash
vercel
```

### 4. Rutas disponibles

Una vez desplegado, todas las rutas estarán disponibles:

- `GET /` - Información de la API
- `POST /api/login` - Iniciar sesión
- `POST /api/register` - Registrar usuario
- `GET /api/clientes` - Obtener clientes
- `POST /api/clientes` - Crear cliente
- `GET /api/productos` - Obtener productos
- `POST /api/productos` - Crear producto
- `GET /api/facturas` - Obtener facturas
- `POST /api/facturas` - Crear factura
- `GET /api/dashboard/summary` - Resumen del dashboard

### 5. Desplegar el Frontend (siatec-frontend)

El frontend también necesita ser desplegado. Tienes dos opciones:

#### Opción A: Desplegar el frontend en Vercel por separado

1. Ve a Vercel y crea un nuevo proyecto
2. Selecciona la carpeta `siatec-frontend` como directorio raíz
3. Configura las variables de entorno:
   - `VITE_API_URL`: URL de tu backend desplegado (ej: `https://tu-backend.vercel.app`)
4. Vercel detectará automáticamente que es un proyecto Vite

#### Opción B: Desplegar desde la terminal

```bash
cd siatec-frontend
vercel
```

Cuando te pregunte por las variables de entorno, agrega:
- `VITE_API_URL` = `https://tu-backend.vercel.app` (reemplaza con tu URL real)

### Notas importantes

**Backend:**
- Asegúrate de que tu base de datos MySQL esté accesible desde internet (no solo localhost)
- Considera usar una base de datos en la nube como:
  - PlanetScale
  - AWS RDS
  - Google Cloud SQL
  - Railway
  - Render
- El archivo `api/index.js` es el punto de entrada para Vercel
- El archivo `server.js` sigue funcionando para desarrollo local

**Frontend:**
- Todas las llamadas a la API ahora usan la configuración de `src/config.js`
- En desarrollo local, usa `http://localhost:3001`
- En producción, configura `VITE_API_URL` con la URL de tu backend en Vercel
- El frontend está configurado para usar rutas con prefijo `/api` automáticamente

### Resumen de variables de entorno

**Backend (en Vercel):**
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `SECRET_KEY`

**Frontend (en Vercel):**
- `VITE_API_URL` (ej: `https://tu-backend.vercel.app`)

