# PlayaLibre — Libre Acceso a las Playas de México 🌊🇲🇽

PlayaLibre es una aplicación web móvil-first y PWA diseñada para denunciar bloqueos ilegales en los accesos públicos a las playas mexicanas. Permite a los usuarios visualizar mapas interactivos, reportar incidencias (hoteles, condominios, restaurantes privatizando accesos), delinear límites de playas con GPS y guardar reportes sin conexión (offline sync) mediante IndexedDB.

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 (Vite) + TypeScript
- **Estilos**: Tailwind CSS 3.4
- **Animaciones**: Transiciones nativas de Tailwind + `framer-motion` para destellos del texto de héroe (`ShinyText`)
- **Mapas**: Leaflet + OpenStreetMap (OSM) y Esri World Imagery (Vista Satelital) sin necesidad de API Keys comerciales.
- **Base de Datos**: Firebase Firestore (Modo Dual) + IndexedDB (caché offline y cola de sincronización diferida).

---

## 🔌 Modo Dual de Base de Datos

La aplicación está diseñada con un **Modo Dual** que facilita el desarrollo y el despliegue:

1. **Modo Local (Mock Database)**: Si no se configuran las variables de entorno de Firebase, la aplicación utiliza un estado simulado local en memoria con sincronización a colas locales en IndexedDB. Esto permite probar toda la interfaz y flujos sin configurar un backend.
2. **Modo Real (Firebase Firestore)**: Al agregar las claves de Firebase en el archivo `.env`, la aplicación se conecta automáticamente al servicio en la nube en tiempo real, sincroniza la base de datos de playas y carga reportes al instante. Si la base de datos Firestore está vacía, se auto-siembra con tres playas de muestra (*Playa Carrizalillo*, *Playa Delfines*, *Playa Norte*).

---

## ⚙️ Guía de Configuración de Firebase

Sigue estos pasos para conectar tu proyecto real de Firebase:

### 1. Crear el Proyecto en la Consola de Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/).
2. Haz clic en **Agregar proyecto** (Add project) y asígnale un nombre (ej. `playalibre-mx`).
3. (Opcional) Puedes desactivar Google Analytics para desarrollo rápido.

### 2. Crear la Base de Datos Firestore
1. En el menú lateral izquierdo de Firebase, ve a **Firestore Database**.
2. Haz clic en **Crear base de datos**.
3. Selecciona la ubicación del servidor de tu preferencia (ej. `us-central` para México) y selecciona **Comenzar en modo de prueba** (esto habilita permisos de lectura/escritura iniciales por 30 días).
4. Configura las reglas oficiales de Firestore para el proyecto:
   Ve a la pestaña **Reglas** (Rules) e ingresa la siguiente política de acceso:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Permitir a cualquiera ver las playas y reportes
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```
   *(Nota: Para producción en producción real, restringe las reglas según autenticación de Firebase).*

### 3. Registrar una Aplicación Web
1. En la página de inicio del proyecto en Firebase, haz clic en el icono de **Web** (`</>`) para registrar una app.
2. Nómbrala `playalibre-web`.
3. Firebase te mostrará un objeto de configuración similar a este:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "playalibre-mx.firebaseapp.com",
     projectId: "playalibre-mx",
     storageBucket: "playalibre-mx.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234:web:abcd"
   };
   ```

### 4. Configurar las Variables de Entorno en el Proyecto
1. En la raíz de este proyecto, duplica el archivo `.env.example` y cámbiale el nombre a `.env`.
2. Llena los valores correspondientes con la información obtenida en el paso anterior:
   ```env
   VITE_FIREBASE_API_KEY=AIzaSy...
   VITE_FIREBASE_AUTH_DOMAIN=playalibre-mx.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=playalibre-mx
   VITE_FIREBASE_STORAGE_BUCKET=playalibre-mx.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234:web:abcd
   ```

---

## 🚀 Comandos Útiles

### Instalar dependencias
```bash
pnpm install
```

### Ejecutar Servidor de Desarrollo (Puerto 4000)
```bash
pnpm dev
```
La aplicación estará disponible en [http://localhost:4000](http://localhost:4000).

### Compilar para Producción
```bash
pnpm run build
```

### Probar Compilación de Producción
```bash
pnpm run preview
```
