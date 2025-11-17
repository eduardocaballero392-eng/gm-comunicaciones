# 🚀 Desplegar el Frontend en Vercel

## Paso a Paso

### 1. Ve al Dashboard de Vercel
- Abre: https://vercel.com/dashboard
- Haz clic en **"Add New..."** o **"New Project"**

### 2. Conecta tu Repositorio
- Selecciona el mismo repositorio que usaste para el backend
- Haz clic en **"Import"**

### 3. Configura el Proyecto

**⚠️ IMPORTANTE: Configura estos valores:**

- **Project Name**: `siatec-frontend` (o el nombre que prefieras)
- **Root Directory**: `siatec-frontend` ⚠️ **ESTO ES CRÍTICO**
  - Haz clic en "Edit"
  - Cambia de `./` a `siatec-frontend`
- **Framework Preset**: Vite (se detecta automáticamente)
- **Build Command**: `npm run build` (automático)
- **Output Directory**: `dist` (automático)

### 4. Configura Variables de Entorno

Antes de hacer clic en "Deploy", haz clic en **"Environment Variables"** y agrega:

- **Variable Name**: `VITE_API_URL`
- **Value**: `https://gm-comunicaciones.vercel.app` 
  - (Esta es la URL de tu backend que viste en la captura)

### 5. Despliega

- Haz clic en **"Deploy"**
- Espera a que termine el build (1-2 minutos)

### 6. ¡Listo!

Una vez desplegado, tendrás:
- **Backend**: `https://gm-comunicaciones.vercel.app` (muestra JSON)
- **Frontend**: `https://siatec-frontend.vercel.app` (muestra tu aplicación visual)

## 🔍 Verificación

1. Visita la URL del frontend
2. Deberías ver la pantalla de login
3. El frontend se conectará automáticamente al backend

## ⚠️ Si algo falla

1. **Revisa los Build Logs** en Vercel
2. **Verifica que la variable `VITE_API_URL` esté configurada**
3. **Asegúrate de que el Root Directory sea `siatec-frontend`**

