# 🔧 Solución al Error 500 en Vercel

## Problema
El servidor funciona bien en local pero da error 500 cuando se despliega en Vercel.

## Causas Comunes

### 1. ⚠️ Variables de Entorno No Configuradas

El error 500 generalmente se debe a que las variables de entorno no están configuradas en Vercel.

## Solución Paso a Paso

### Paso 1: Configurar Variables de Entorno en Vercel

1. Ve a tu proyecto en Vercel: https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega las siguientes variables:

```
DB_HOST=tu-host-mysql.com
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=facturacion
SECRET_KEY=tu_clave_secreta_super_segura
```

**⚠️ IMPORTANTE:**
- `DB_HOST` NO puede ser `localhost` - debe ser una dirección IP pública o un hostname accesible desde internet
- Si tu base de datos está en tu computadora local, NO funcionará desde Vercel
- Necesitas una base de datos en la nube

### Paso 2: Verificar que tu Base de Datos sea Accesible

Tu base de datos MySQL debe estar accesible desde internet. Opciones:

#### Opción A: Usar un Servicio en la Nube (Recomendado)

**PlanetScale (Gratis):**
1. Ve a https://planetscale.com
2. Crea una cuenta gratuita
3. Crea una base de datos
4. Obtén las credenciales de conexión
5. Usa esas credenciales en las variables de entorno de Vercel

**Railway (Gratis con límite):**
1. Ve a https://railway.app
2. Crea una cuenta
3. Crea un servicio MySQL
4. Obtén las credenciales

**Render (Gratis con límite):**
1. Ve a https://render.com
2. Crea una cuenta
3. Crea un servicio MySQL
4. Obtén las credenciales

#### Opción B: Configurar tu MySQL Local para Acceso Remoto (No Recomendado)

Si quieres usar tu MySQL local:
1. Configura tu router para hacer port forwarding del puerto 3306
2. Obtén tu IP pública
3. Configura MySQL para aceptar conexiones remotas
4. **⚠️ Esto es inseguro y no recomendado para producción**

### Paso 3: Verificar las Variables de Entorno

Después de agregar las variables:

1. Ve a **Settings** → **Environment Variables**
2. Verifica que todas estén configuradas
3. Asegúrate de que estén configuradas para **Production**, **Preview** y **Development**

### Paso 4: Redesplegar

Después de configurar las variables:

1. Ve a **Deployments**
2. Haz clic en los tres puntos (⋯) del último deployment
3. Selecciona **Redeploy**
4. O haz un nuevo commit y push a tu repositorio

### Paso 5: Verificar los Logs

Si aún hay errores:

1. Ve a **Deployments**
2. Selecciona el deployment
3. Ve a la pestaña **Functions**
4. Revisa los logs para ver el error específico

## Verificación Rápida

### Probar la API directamente:

```bash
curl https://tu-backend.vercel.app/
```

Deberías ver:
```json
{
  "mensaje": "GM Comunicaciones API",
  "status": "✅ Funcionando correctamente",
  ...
}
```

### Probar el login:

```bash
curl -X POST https://tu-backend.vercel.app/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@prueba.com","password":"admin123"}'
```

## Errores Comunes y Soluciones

### Error: "ECONNREFUSED" o "Cannot connect to database"
- **Causa:** `DB_HOST` está configurado como `localhost` o la base de datos no es accesible
- **Solución:** Usa una base de datos en la nube o configura tu MySQL para acceso remoto

### Error: "Access denied for user"
- **Causa:** Credenciales incorrectas
- **Solución:** Verifica `DB_USER` y `DB_PASSWORD` en Vercel

### Error: "Unknown database"
- **Causa:** `DB_NAME` incorrecto o la base de datos no existe
- **Solución:** Verifica el nombre de la base de datos

### Error: "Timeout"
- **Causa:** La base de datos está muy lejos o lenta
- **Solución:** Usa una base de datos más cercana o verifica la conexión

## Checklist Final

- [ ] Variables de entorno configuradas en Vercel
- [ ] `DB_HOST` NO es `localhost`
- [ ] Base de datos accesible desde internet
- [ ] Credenciales correctas
- [ ] Proyecto redesplegado después de configurar variables
- [ ] Logs revisados para errores específicos

## Si el Problema Persiste

1. Revisa los logs en Vercel (Deployments → Functions → Logs)
2. Verifica que todas las variables de entorno estén correctas
3. Prueba la conexión a la base de datos desde tu computadora usando las mismas credenciales
4. Asegúrate de que la base de datos tenga las tablas necesarias creadas






