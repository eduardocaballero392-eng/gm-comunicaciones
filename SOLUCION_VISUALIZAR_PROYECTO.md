# 🔍 Solución: No puedo visualizar mi proyecto en Vercel

## ¿Qué está pasando?

Cuando despliegas solo el **backend** en Vercel, verás un JSON con información de la API. Esto es **normal** porque:

- El backend es solo una API (no tiene interfaz visual)
- El frontend (la parte visual) debe desplegarse **por separado**

## ✅ Solución: Desplegar el Frontend

Tienes **2 opciones**:

### Opción 1: Desplegar Frontend en Vercel (Recomendado)

1. **Ve a tu dashboard de Vercel**
2. **Crea un NUEVO proyecto**
3. **Conecta el mismo repositorio**
4. **Configura el proyecto:**
   - **Root Directory**: Selecciona `siatec-frontend`
   - **Framework Preset**: Vite (se detecta automáticamente)
   - **Build Command**: `npm run build` (automático)
   - **Output Directory**: `dist` (automático)

5. **Agrega la variable de entorno:**
   - `VITE_API_URL` = URL de tu backend (ej: `https://tu-backend.vercel.app`)

6. **Despliega**

### Opción 2: Desde la terminal

```bash
# 1. Ve a la carpeta del frontend
cd siatec-frontend

# 2. Despliega
vercel

# 3. Cuando te pregunte:
# - ¿Set up and deploy? → Y
# - ¿Which scope? → Tu cuenta
# - ¿Link to existing project? → N (crear nuevo)
# - ¿What's your project's name? → siatec-frontend (o el nombre que quieras)
# - ¿In which directory is your code located? → ./
# - ¿Want to override the settings? → N
# - ¿Want to add environment variables? → Y
#   → Variable name: VITE_API_URL
#   → Value: https://tu-backend.vercel.app (reemplaza con tu URL real)
```

## 📋 Checklist

- [ ] Backend desplegado en Vercel ✅ (ya lo tienes)
- [ ] Obtener la URL del backend (ej: `https://facturacion-backend.vercel.app`)
- [ ] Frontend desplegado en Vercel (proyecto separado)
- [ ] Variable `VITE_API_URL` configurada en el frontend
- [ ] Probar la URL del frontend

## 🎯 Resultado Final

Después de desplegar el frontend, tendrás:

- **Backend URL**: `https://tu-backend.vercel.app` (muestra JSON de la API)
- **Frontend URL**: `https://tu-frontend.vercel.app` (muestra tu aplicación visual)

## 🔧 Si aún no funciona

1. **Verifica las variables de entorno:**
   - En el proyecto del frontend en Vercel
   - Settings → Environment Variables
   - Debe estar: `VITE_API_URL` = URL de tu backend

2. **Verifica que el backend responda:**
   - Visita: `https://tu-backend.vercel.app`
   - Debes ver un JSON con información de la API

3. **Revisa los logs en Vercel:**
   - Ve a tu proyecto del frontend
   - Pestaña "Deployments"
   - Revisa los logs si hay errores

## 💡 Nota Importante

- El **backend** solo muestra JSON (es normal)
- El **frontend** es lo que verás como aplicación web
- Ambos deben estar desplegados **por separado** en Vercel

