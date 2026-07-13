
## Instrucciones para desplegar en Vercel:

1. **Crear un repositorio en GitHub** con todos estos archivos
2. **Conectar Vercel con GitHub**:
   - Ve a [vercel.com](https://vercel.com)
   - Inicia sesión con tu cuenta de GitHub
   - Haz clic en "New Project"
   - Importa el repositorio de GitHub
   - Vercel detectará automáticamente la configuración

3. **Despliegue automático**: Cada vez que hagas un push a GitHub, Vercel desplegará automáticamente los cambios.

El proyecto está completamente listo para Vercel con:
- ✅ Configuración de Vercel (`vercel.json`)
- ✅ Package.json con scripts de build
- ✅ Estructura de archivos organizada
- ✅ Rutas relativas corregidas
- ✅ Archivos estáticos en carpeta `public/`
- ✅ Documentación completa

## Integración con Instagram

La web incluye un feed que consume el endpoint serverless `/api/instagram`. Para activarlo en Vercel, configura estas variables de entorno:

```env
INSTAGRAM_ACCESS_TOKEN=tu_token_de_meta
INSTAGRAM_USER_ID=me
INSTAGRAM_GRAPH_VERSION=v25.0
INSTAGRAM_API_BASE_URL=https://graph.instagram.com
INSTAGRAM_MEDIA_LIMIT=12
CONTACT_EMAIL_RECIPIENTS=consultas@floreriacamelia.com
CONTACT_EMAIL_FROM=Floreria Camelia <consultas@floreriacamelia.com>
RESEND_API_KEY=tu_api_key_de_resend
ADMIN_PASSWORD=una_contraseña_para_el_admin
ADMIN_SESSION_SECRET=una_clave_larga_para_firmar_sesiones
```

Notas:
- La cuenta de Instagram debe ser profesional, Business o Creator.
- No pongas el token en JavaScript del navegador; la función `api/instagram.js` lo lee desde variables de entorno.
- Si usas Instagram API con Facebook Login, puedes cambiar `INSTAGRAM_API_BASE_URL` a `https://graph.facebook.com` y definir `INSTAGRAM_USER_ID` con el ID de la cuenta profesional.
- También puedes configurar el token desde `/admin`. Para que esa pantalla pueda guardar cambios en producción, agrega Vercel Blob Storage al proyecto y define `ADMIN_PASSWORD` en las variables de entorno.
- El formulario de consulta envía correos desde `/api/contact-request` usando Resend. Configura `RESEND_API_KEY` y un remitente verificado en `CONTACT_EMAIL_FROM`.
- La lista que recibe consultas se puede configurar desde `/admin` en "Correos que reciben consultas". También puedes definir una lista inicial con `CONTACT_EMAIL_RECIPIENTS`.
- `/admin` crea una sesión con cookie segura después de ingresar la contraseña. Si marcas "Recordarme", la sesión dura más; si no, queda como sesión efímera del navegador.
- En desarrollo local con API serverless, usa `vercel dev` o despliega en Vercel para probar `/api/instagram`, `/api/contact-request` y `/admin`.

¡Tu sitio estará en línea en minutos! 🚀
