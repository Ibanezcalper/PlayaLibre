# PlayaLibre — Free access to Mexico's beaches

PlayaLibre is a crowdsourced, mobile-first platform and progressive web application designed to map, audit, and advocate for free public access to Mexican beaches. The application enables citizens to report illegal blockages, unlawful fees, and privatization of coastal federal zones.

---

## Project purpose and problem it solves

In Mexico, beaches are public property by law, and free access must be guaranteed. However, in practice, hotel developments, private condominiums, beach clubs, and restaurants frequently block traditional pedestrian pathways or charge illegal fees to grant passage to the shore.

PlayaLibre addresses this issue by providing a citizen-driven cartographic and auditing tool where users can:
* Register pedestrian access points and audit their status (free or blocked).
* Delineate beach boundaries directly on satellite maps.
* Report incidents of illegal fees, physical blockades, or safety concerns.
* Consult the real-time status of beach accesses before visiting them.

---

## Target audience

The platform is built for:
* **Local citizens and activists**: Individuals interested in monitoring and ensuring coastal transit laws are respected.
* **National and international tourists**: Visitors seeking to find free, safe pathways to the ocean without being extorted or turned away.
* **Non-governmental organizations**: Collectives and legal defense groups protecting communal rights and coastal environments.

---

## Technology stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS.
* **Maps and interaction**: Leaflet, OpenStreetMap, and Esri World Imagery (satellite views).
* **Relational database**: Firebase SQL Connect (PostgreSQL managed and exposed via GraphQL queries and mutations).
* **Authentication**: Firebase Auth (Google Sign-In and Email/Password registration with client-side SHA-1 hashing).
* **Local database and caching**: IndexedDB v3 (complete offline support and deferred synchronization queues).

---

## Governance and profiles

* **Karma and reputation system**: Legitimate contributions award karma to the user's profile (+5 points for positive votes). Authorized curators have a x3 vote moderation weight.
* **Strict curator role assignment**: The curator role cannot be manually toggled. It is validated server-side based on the verified email address, currently assigned to marpc331@gmail.com.
* **Contributor profile details**: Interactive modal showing user biography (editable if self), karma score, and reactive contribution statistics (total beaches, accesses, and photos registered).
* **Contributor verification**: Clicking on avatars or usernames in comments, beach cards, or access lists opens the contributor's profile details.

---

## Image optimization and storage cost control

* **Automatic WebP compression**: To minimize database storage size, every photo uploaded is processed on the client side using the Canvas API.
* **Resizing and quality control**: Images are scaled down proportionally to a maximum of 1200 pixels on their largest dimension and exported as WebP with 0.75 quality. This results in a 70-80% file size reduction while maintaining high visual detail.

---

## Security and local sync

* **Email verification block**: Users signing up with email and password must verify their email address before they can register beaches, accesses, or edit their profiles.
* **Account linking**: Automatically unifies user identities when a Google account email matches a pre-existing email/password account.
* **Offline functionality**: In the absence of network connection, beaches, accesses, comments, and reports are queued in IndexedDB. Upon reconnection, mock IDs are resolved and mapped to definitive UUIDs in PostgreSQL.
* **Hybrid emulation fallback**: If the local development environment lacks a Java Runtime Environment (JRE) required to launch the Auth emulator on port 9099, the application bypasses the local Auth emulator and connects directly to the production cloud Firebase Auth service, allowing authentication testing to continue seamlessly while preserving the local database emulator connection (port 9399).
* **Proactive security**: Strict gitignore configurations exclude environment variables, service account keys, developer credentials, and local logs from source control.

---

## Firebase configuration guide

Follow these steps to connect your Firebase project:

### 1. Create a project in the Firebase console
1. Go to the Firebase Console.
2. Create a new project.
3. Enable Firebase Authentication (Google and Email/Password).
4. Enable Firebase SQL Connect.

### 2. Configure environment variables
Create a .env file in the root directory based on .env.example and populate the values:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Continuous deployment with GitHub Actions

To automate building and deploying the application to Firebase Hosting whenever you push changes (git push) or merge to the main branch, set up GitHub Actions workflows.

### Initial CI/CD setup
1. Ensure the application compiles locally:
   ```bash
   pnpm run build
   ```
2. Run the interactive GitHub initialization wizard:
   ```bash
   npx firebase init hosting:github
   ```
3. Complete the terminal wizard by linking your repository (`user/repository-name`), setting the installation and build script (`pnpm install && pnpm run build`), and enabling automatic deployment.
4. Push the autogenerated `.github/` workflow configurations to your remote GitHub repository.

---

## Useful commands

### Install dependencies
```bash
pnpm install
```

### Run development server
```bash
pnpm dev
```
The application will be available at http://localhost:4000.

### Build for production
```bash
pnpm run build
```
