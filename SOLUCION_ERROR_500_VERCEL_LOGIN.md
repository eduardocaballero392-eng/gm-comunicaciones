# 🔧 Solución al Error 500 en Login desde Vercel

## Problema
El login funciona bien en local pero da error 500 cuando se despliega en Vercel.

## Causa Principal
El error 500 generalmente se debe a que **las variables de entorno no están configuradas en Vercel** o la **base de datos no es accesible desde internet**.

## Solución Paso a Paso

### Paso 1: Verificar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Verifica que tengas estas variables configuradas:

```
DB_HOST=tu-host-mysql.com
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=facturacion
SECRET_KEY=tu_clave_secreta_super_segura
```

**⚠️ IMPORTANTE:**
- `DB_HOST` **NO puede ser `localhost`** - debe ser una dirección IP pública o un hostname accesible desde internet
- Si tu base de datos está en tu computadora local, **NO funcionará desde Vercel**
- Necesitas una base de datos en la nube

### Paso 2: Configurar una Base de Datos en la Nube

Tu base de datos MySQL debe estar accesible desde internet. Opciones recomendadas:

#### Opción A: PlanetScale (Gratis - Recomendado)

1. Ve a https://planetscale.com
2. Crea una cuenta gratuita
3. Crea una base de datos nueva
4. Obtén las credenciales de conexión:
   - Host (ej: `aws.connect.psdb.cloud`)
   - Usuario
   - Contraseña
   - Nombre de la base de datos
5. Configura estas credenciales en las variables de entorno de Vercel

#### Opción B: Railway (Gratis con límite)

1. Ve a https://railway.app
2. Crea una cuenta
3. Crea un nuevo servicio MySQL
4. Obtén las credenciales de conexión
5. Configura en Vercel

#### Opción C: Render (Gratis con límite)

1. Ve a https://render.com
2. Crea una cuenta
3. Crea un servicio MySQL
4. Obtén las credenciales
5. Configura en Vercel

### Paso 3: Verificar que las Variables Estén Aplicadas

Después de agregar las variables de entorno en Vercel:

1. Ve a **Deployments**
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. Esto aplicará las nuevas variables de entorno

### Paso 4: Verificar los Logs de Vercel

1. Ve a tu proyecto en Vercel
2. Selecciona **Deployments**
3. Haz clic en el último deployment
4. Ve a la pestaña **Logs**
5. Busca mensajes como:
   - `✅ Conectado a MySQL con ID: X` (éxito)
   - `❌ Error al conectar con la BD` (error)

### Paso 5: Probar el Login

Una vez configurado todo:

1. Visita tu frontend desplegado en Vercel
2. Intenta hacer login
3. Si aún hay error, revisa la consola del navegador (F12) para ver el mensaje de error específico

## Mensajes de Error Mejorados

El código ahora proporciona mensajes de error más específicos:

- **503 - No se puede conectar a la base de datos**: Variables de entorno no configuradas o DB_HOST incorrecto
- **503 - Error de autenticación**: Credenciales (DB_USER/DB_PASSWORD) incorrectas
- **500 - Error de servidor**: Otro error de base de datos (revisa los logs)

## Checklist de Verificación

- [ ] Variables de entorno configuradas en Vercel (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, SECRET_KEY)
- [ ] DB_HOST no es `localhost` (debe ser un host accesible desde internet)
- [ ] Base de datos MySQL accesible desde internet
- [ ] Deployment redeployado después de agregar variables de entorno
- [ ] Logs de Vercel revisados para ver errores de conexión
- [ ] Frontend configurado con `VITE_API_URL` apuntando a tu backend en Vercel

## Si el Problema Persiste

1. **Revisa los logs de Vercel** para ver el error exacto
2. **Verifica la consola del navegador** (F12) para ver el mensaje de error
3. **Prueba la conexión a la base de datos** desde tu computadora usando las mismas credenciales
4. **Verifica que el firewall de tu base de datos** permita conexiones desde Vercel (algunos servicios requieren whitelist de IPs)

## Nota Importante

Si estás usando una base de datos local (localhost), **no funcionará desde Vercel**. Debes usar una base de datos en la nube que sea accesible desde internet.

