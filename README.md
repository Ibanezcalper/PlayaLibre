# PlayaLibre — Libre acceso a las playas de México

PlayaLibre es una plataforma colaborativa móvil-first y aplicación web progresiva diseñada para mapear, auditar y defender el libre acceso a las playas mexicanas. La aplicación permite a los ciudadanos denunciar bloqueos ilegales, cobros indebidos y privatizaciones de zonas federales costeras.

---

## Propósito del proyecto y problema que resuelve

En México, por ley, todas las playas son públicas y de libre tránsito. Sin embargo, en la práctica, desarrollos hoteleros, condominios privados, clubes de playa y restaurantes a menudo obstruyen los accesos tradicionales peatonales o exigen tarifas ilegales para permitir el paso a la costa.

PlayaLibre resuelve este problema proporcionando una herramienta cartográfica y de auditoría ciudadana donde las personas pueden:
* Registrar puntos de acceso peatonal tradicionales y auditar su estado (libre u obstruido).
* Delinear polígonos territoriales de playas directamente sobre mapas satelitales.
* Reportar incidentes de cobro ilegal, bloqueos físicos o problemas de inseguridad.
* Consultar el estado en tiempo real de las playas antes de visitarlas.

---

## Público objetivo

La plataforma está dirigida a:
* **Ciudadanos locales y activistas**: Personas interesadas en vigilar y asegurar que las leyes de libre tránsito en playas se cumplan.
* **Turistas nacionales e internacionales**: Visitantes que buscan saber cómo acceder de manera libre y segura a las costas sin ser extorsionados o desviados.
* **Organizaciones no gubernamentales**: Colectivos que defienden los derechos comunales y el medio ambiente costero mexicano.

---

## Stack tecnológico

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
* **Mapas e interacción**: Leaflet, OpenStreetMap y Esri World Imagery (vistas satelitales).
* **Base de datos relacional**: Firebase SQL Connect (PostgreSQL administrado con interfaz de consultas y mutaciones GraphQL).
* **Autenticación**: Firebase Auth (Google Sign-In y registro por Correo/Contraseña con hash SHA-1 en el cliente).
* **Caché y base de datos local**: IndexedDB v3 (soporte completo para funcionamiento sin conexión y sincronización diferida).

---

## Características de gobernanza y perfiles

* **Sistema de karma y reputación**: Las contribuciones legítimas otorgan karma al perfil del usuario (+5 puntos por votos positivos). Los curadores autorizados tienen un multiplicador de impacto de voto de x3.
* **Asignación estricta de curador**: El rol de curador no se puede alternar manualmente. Se valida en base al correo electrónico verificado del usuario en el servidor, limitando los privilegios de moderación exclusivamente al curador principal asignado.
* **Ficha de perfil de colaborador**: Modal interactivo que muestra la biografía del usuario (editable si es el perfil propio), su karma y estadísticas reactivas de aportes cívicos (total de playas registradas, rutas creadas y fotos aportadas).
* **Verificación de colaboradores**: Posibilidad de hacer clic en los avatares y apodos en comentarios y registros para visualizar la ficha de perfil de cualquier usuario.

---

## Optimización de imágenes y costos

* **Compresión automática WebP**: Para reducir los costos de almacenamiento en base de datos, cada imagen subida por los usuarios se procesa en el cliente mediante Canvas API.
* **Redimensión y calidad**: Las imágenes se reducen proporcionalmente a un máximo de 1200 píxeles en su dimensión mayor y se exportan en formato WebP con calidad 0.75, reduciendo su peso entre un 70% y 80% manteniendo alta fidelidad visual.

---

## Seguridad y sincronización local

* **Bloqueo por verificación de correo**: Los usuarios que se registran por correo y contraseña deben confirmar su cuenta mediante un enlace antes de poder registrar playas, accesos o configurar su perfil.
* **Vinculación de cuentas**: Soporte automático para unificar identidades cuando un correo de Google coincide con un registro previo de correo/contraseña.
* **Funcionamiento sin conexión**: Si el usuario pierde conexión, las playas, accesos, comentarios y reportes se encolan en IndexedDB. Al recuperar la red, se resuelven y mapean los IDs mock a UUIDs definitivos en PostgreSQL.
* **Compatibilidad híbrida de emulación**: Si el entorno local de desarrollo carece de un entorno de ejecución de Java (JRE), el sistema desactiva el emulador de autenticación local (puerto 9099) y realiza una conexión directa a Firebase Auth en la nube, permitiendo probar el inicio de sesión sin interrumpir las consultas al emulador de base de datos local (puerto 9399).
* **Seguridad proactiva**: Configuración estricta en el archivo gitignore para excluir credenciales, variables de entorno, logs de desarrollo y bases de datos locales.

---

## Guía de configuración de Firebase

Sigue estos pasos para conectar tu proyecto de Firebase:

### 1. Crear el proyecto en la consola de Firebase
1. Ve a Firebase Console.
2. Crea un proyecto y asígnale un nombre.
3. Activa Firebase Authentication (Google y Correo/Contraseña).
4. Activa Firebase SQL Connect.

### 2. Configurar las variables de entorno
Crea un archivo .env en la raíz del proyecto basándote en .env.example y rellena los valores correspondientes:
```env
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_auth_domain
VITE_FIREBASE_PROJECT_ID=tu_project_id
VITE_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
```

---

## Despliegue continuo con GitHub Actions

Para automatizar la compilación y el despliegue de la aplicación a Firebase Hosting cada vez que realizas un envío (git push) o una fusión en la rama principal, se configuran flujos de trabajo con GitHub Actions.

### Configuración inicial de CI/CD
1. Asegúrate de compilar la aplicación localmente:
   ```bash
   pnpm run build
   ```
2. Ejecuta el asistente interactivo de inicialización de GitHub:
   ```bash
   npx firebase init hosting:github
   ```
3. Completa el asistente en la terminal asociando tu repositorio (`usuario/nombre-del-repositorio`), configurando el comando de instalación y construcción (`pnpm install && pnpm run build`) y habilitando el despliegue automático.
4. Sube las configuraciones autogeneradas de la carpeta `.github/` a tu repositorio remoto en GitHub.

---

## Comandos útiles

### Instalar dependencias
```bash
pnpm install
```

### Ejecutar servidor de desarrollo
```bash
pnpm dev
```
La aplicación estará disponible en http://localhost:4000.

### Compilar para producción
```bash
pnpm run build
```
