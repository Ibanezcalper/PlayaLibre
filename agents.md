# PlayaLibre: Constitución y Arquitectura del Proyecto

## 🌊 1. Gobernanza y Calidad de Datos Colectiva
- **Dibujo de Polígonos (Crowd-Drawing):** Los usuarios delimitan playas dibujando polígonos interactivos sobre Leaflet (OpenStreetMap).
- **Accesos Públicos:** Múltiples caminos peatonales asociados a cada playa, detallando obstrucciones físicas (ej. rejas de hoteles, condominios) y servicios (estacionamiento, regaderas, rampas de accesibilidad).
- **Sistema de Karma (Reputación Cívica):** 
  - Las acciones colaborativas otorgan reputación al perfil del usuario.
  - Votos a favor (`Upvotes`) suman **+5** de Karma; votos en contra (`Downvotes`) lo restan.
  - Curadores autorizados (Karma alto) aplican un multiplicador **x3** en la moderación del estado de los accesos públicos.
- **Detalle de Playa:** Apertura automática de un panel detallado al hacer clic en una playa, mostrando mapa local ampliado, galería paginada de fotos (carga de 4 en 4), lista textual de accesos y una gráfica apilada de incidentes históricos (`AreaChart` de Recharts) diferenciados por color (Naranja = cobros, Rojo = inseguridad, Azul = privatización, Gris = otros).

---

## 🔒 2. Seguridad y Autenticación (Google / Correo y Contraseña)
- **Modal de Contexto:** Intercepta la creación de playas y accesos para usuarios no autenticados, explicando los beneficios cívicos del registro antes de redirigirlos.
- **Proveedores de Acceso:** 
  - **Google:** Integrado mediante Firebase Auth (`signInWithPopup`).
  - **Correo y Contraseña:** Formulario interactivo incorporado que valida inicios de sesión y registros de nuevas cuentas.
- **Verificación de Correo Obligatoria:**
  - Al registrarse con Correo y Contraseña, la aplicación envía un correo con un enlace de verificación (`sendEmailVerification`). El usuario es retenido en una pantalla de bloqueo y no puede crear playas ni configurar su perfil en la base de datos hasta que complete la verificación (validado reactivamente en el cliente recargando el estado con `currentUser.reload()`).
- **Seguridad y Encriptación SHA-1:**
  - Las contraseñas de cuentas de correo se encriptan con el algoritmo **SHA-1** en el cliente usando la API criptográfica nativa del navegador (`window.crypto.subtle.digest`) antes de enviarse a Firebase Auth.
- **Vinculación Automática de Cuentas:**
  - Si un usuario se registra con un correo idéntico al de otra cuenta (ej. tiene un registro por Correo y luego ingresa vía Google), el sistema captura la credencial mediante el error `auth/account-exists-with-different-credential` y efectúa un enlace automático usando `linkWithCredential` en el inicio de sesión del usuario original, consolidando ambas identidades en un único perfil de base de datos.
- **Unicidad de Usuario:** Nombres de usuario únicos asegurados anexando una etiqueta derivada del timestamp del sistema (ej. `apodo_17524`).

---

## 📴 3. Sincronización Local (Offline-First)
- **IndexedDB v3:** Estructura de almacenamiento local para Beaches, Accesses, Reports, Comments y User Profiles.
- **Consistencia de Claves Offline:**
  - Las referencias temporales creadas sin conexión (ej. `00000000-...`) se resuelven dinámicamente al recuperar la conexión mediante el resolvedor en `offline-sync.ts`. Se comparan los nombres contra el listado de producción para reasignar las claves primarias (UUIDs) correctas de PostgreSQL, evitando fallos de llave foránea.

---

## 🛠️ 4. Stack Tecnológico e Infraestructura
- **Sistema Operativo / Shell:** CachyOS (Arch Linux) utilizando **Fish Shell**.
- **Frontend:** Vite + React + TypeScript + Tailwind CSS.
- **Administrador de Paquetes:** pnpm.
- **Base de Datos Relacional:** Firebase SQL Connect (PostgreSQL respaldado por GraphQL).
- **Esquema GraphQL (SQL Connect):**
  - `User`: Tabla de perfiles con reputación y fecha de creación.
  - `Beach`: Geometría de polígono (`boundaryPolygon`), nombre, estado costero, creador e imágenes (almacenadas como arrays JSON de Base64).
  - `Access`: Atributos de amenidades, conectividad, tipo de bloqueo, tarifas ilegales y relación con playa y usuario.
  - `Report`: Denuncias vinculadas a accesos con montos cobrados y puntuaciones.
  - `Comment`: Mensajes de texto de usuarios para hilos de discusión locales de playas.
- **Entorno de Desarrollo Local:**
  - **Data Connect Emulator:** Operando en el puerto `9399` (`pgliteData` local).
  - **Firebase Auth Emulator:** Configurado y activo en el puerto `9099` (redirige las peticiones cliente localmente).
