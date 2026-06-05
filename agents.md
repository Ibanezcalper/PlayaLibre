# Playalibre: constitución y arquitectura del proyecto

## 1. Gobernanza y calidad de datos colectiva
- **Dibujo de polígonos (Crowd-Drawing):** Los usuarios delimitan playas dibujando polígonos interactivos sobre Leaflet (OpenStreetMap).
- **Accesos públicos:** Múltiples caminos peatonales asociados a cada playa, detallando obstrucciones físicas (ej. rejas de hoteles, condominios) y servicios (estacionamiento, regaderas, rampas de accesibilidad).
- **Sistema de karma (Reputación cívica):** 
  - Las acciones colaborativas otorgan reputación al perfil del usuario.
  - Votos a favor (upvotes) suman +5 de karma; votos en contra (downvotes) lo restan.
  - Curadores autorizados aplican un multiplicador x3 en la moderación del estado de los accesos públicos.
- **Detalle de playa:** Apertura automática de un panel detallado al hacer clic en una playa, mostrando mapa local ampliado, galería paginada de fotos (carga de 4 en 4), lista textual de accesos y una gráfica apilada de incidentes históricos (AreaChart de Recharts) diferenciados por color (naranja = cobros, rojo = inseguridad, azul = privatización, gris = otros).
- **Saneamiento inicial de datos:** La aplicación inicia sin registros de prueba (INITIAL_BEACHES vacío) para permitir que los usuarios registren playas y accesos desde cero de forma limpia.

## 2. Seguridad y autenticación (Google / correo y contraseña)
- **Modal de contexto:** Intercepta la creación de playas y accesos para usuarios no autenticados, explicando los beneficios cívicos del registro antes de redirigirlos.
- **Proveedores de acceso:** 
  - **Google:** Integrado mediante Firebase Auth (signInWithPopup). Se rediseñó el botón de acceso con un imagotipo oficial SVG multicolor y diseño minimalista premium.
  - **Correo y contraseña:** Formulario interactivo incorporado que valida inicios de sesión y registros de nuevas cuentas.
- **Verificación de correo obligatoria:**
  - Al registrarse con correo y contraseña, la aplicación envía un correo con un enlace de verificación (sendEmailVerification). El usuario es retenido en una pantalla de bloqueo y no puede crear playas ni configurar su perfil en la base de datos hasta que complete la verificación (validado reactivamente en el cliente cargando el estado con currentUser.reload()).
- **Seguridad y encriptación SHA-1:**
  - Las contraseñas de cuentas de correo se encriptan con el algoritmo SHA-1 en el cliente usando la API criptográfica nativa del navegador (window.crypto.subtle.digest) antes de enviarse a Firebase Auth.
- **Vinculación automática de cuentas:**
  - Si un usuario se registra con un correo idéntico al de otra cuenta (ej. tiene un registro por correo y luego ingresa vía Google), el sistema captura la credencial mediante el error auth/account-exists-with-different-credential y efectúa un enlace automático usando linkWithCredential en el inicio de sesión del usuario original, consolidando ambas identidades en un único perfil de base de datos.
- **Unicidad de usuario:** Nombres de usuario únicos asegurados anexando una etiqueta derivada del timestamp del sistema (ej. apodo_17524).
- **Seguridad en variables de entorno:** Las variables sensibles se trasladaron a la carpeta env/ (env/.env) que se encuentra excluida en el archivo .gitignore. Solo se distribuye la plantilla pública env/.env.example. Vite fue configurado con envDir apuntando a esta subcarpeta para evitar la exposición accidental de claves.
- **Reglas de seguridad en base de datos (Firebase SQL Connect):**
  - Se configuró autorización estricta en mutations.gql requiriendo autenticación del servidor (auth != null) para todas las operaciones de escritura (CreateBeach, CreateAccess, CreateReport, CreateComment).
  - Se previno la falsificación de identidad (identity spoofing) comparando en el servidor el identificador firmado del usuario contra el userId provisto por el cliente (auth.uid == vars.userId).
  - La actualización de perfil (UpsertUser) está restringida al propietario de la cuenta (auth.uid == vars.id).
  - El rol de curador no se puede alternar manualmente en el cliente y está restringido a nivel de base de datos mediante la verificación de correo electrónico del curador administrador principal (marpc331@gmail.com).

## 3. Sincronización local (Offline-First)
- **IndexedDB v3:** Estructura de almacenamiento local para Beaches, Accesses, Reports, Comments y User Profiles.
- **Consistencia de claves offline:**
  - Las referencias temporales creadas sin conexión (ej. 00000000-...) se resuelven dinámicamente al recuperar la conexión mediante el resolvedor en offline-sync.ts. Se comparan los nombres contra el listado de producción para reasignar las claves primarias (UUIDs) correctas de PostgreSQL, evitando fallos de llave foránea.

## 4. Stack tecnológico e infraestructura
- **Sistema operativo / Shell:** CachyOS (Arch Linux) utilizando Fish Shell / Bash.
- **Frontend:** Vite + React + TypeScript + Tailwind CSS.
- **Administrador de paquetes:** pnpm.
- **Base de Datos relacional:** Firebase SQL Connect (PostgreSQL respaldado por GraphQL).
- **Esquema GraphQL (SQL Connect):**
  - `User`: Tabla de perfiles con reputación y fecha de creación.
  - `Beach`: Geometría de polígono (boundaryPolygon), nombre, estado costero, creador e imágenes (almacenadas como arrays JSON de Base64 con redimensión automática a 1200px y compresión WebP para reducir espacio).
  - `Access`: Atributos de amenidades, conectividad, tipo de bloqueo, tarifas ilegales y relación con playa y usuario.
  - `Report`: Denuncias vinculadas a accesos con montos cobrados y puntuaciones.
  - `Comment`: Mensajes de texto de usuarios para hilos de discusión locales de playas.
- **Entorno de desarrollo local:**
  - **Data Connect Emulator:** Operando en el puerto 9399.
  - **Firebase Auth Emulator:** Configurado en el puerto 9099.
- **Remoción de residuos heredados:** Se eliminó por completo la carpeta supabase/ y la biblioteca @supabase/supabase-js para evitar confusiones de arquitectura.

## 5. Gobernanza de skills de agentes
- **Búsqueda y adición de skills:**
  - Cuando el usuario solicite información sobre una skill o requiera agregar una skill, el agente debe utilizar prioritariamente la skill de auto skills para buscar e integrar una skill externa existente del registro oficial, evitando la creación de una skill propia local desde cero.
