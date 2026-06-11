# Resume de sesión — PlayaLibre

> **Propósito:** Resumen compacto para agentes. Leer esto antes que el historial del chat.
> **Última actualización:** 2026-06-09

## Proyecto en una línea

PlayaLibre (`playas-libres.web.app`) es una PWA React + Vite que mapea playas mexicanas (polígonos Leaflet) y sus accesos peatonales, con backend Firebase SQL Connect + Auth e IndexedDB offline.

## Flujo operativo (orden obligatorio)

1. Iniciar sesión (Google o correo verificado)
2. **Registrar playa** → dibujar polígono en mapa satelital
3. **Registrar acceso** → pin + sendero opcional + formulario (requiere playa existente)
4. Consultar ficha, reportes y comentarios

## Trabajo realizado en esta sesión

### A. Bugs móvil / Leaflet (resueltos)

| Problema | Causa | Solución |
|----------|-------|----------|
| Mapa no visible al abrir en teléfono | Pestaña por defecto era «Lista»; `MapContainer` no montado | `mobileSection` por defecto `'map'` en `<1024px` |
| Mapa solo en franja superior (~20%) | Flex sin altura explícita; Leaflet ~80px | Panel `h-[55vh] min-h-[420px]` + mapa `absolute inset-0` + CSS `.leaflet-container { height:100% }` |
| Vista previa del modal en gris | Leaflet init en contenedor 0×0 | Montaje diferido 80ms + `MapResizer` con `ResizeObserver` |
| Error React **#310** al abrir ficha | `useMemo` después de `return null` en `BeachDetailsModal` | Todos los hooks **antes** del early return |

**Archivos tocados:** `src/App.tsx`, `src/components/map/MapResizer.tsx`, `src/components/modals/BeachDetailsModal.tsx`, `src/index.css`

### B. Guía de uso + tour (Fase 1, implementado)

- Sección `#guide-section` entre Propósito y Mapa
- 6 pasos formales (sin tono cívico): explorar → auth → playa → acceso → ficha → offline
- Tour guiado omitible con spotlight sobre UI real
- Banner primera visita + enlace nav «Guía de uso»
- Persistencia: `localStorage` keys `playalibre:guide-banner-dismissed:v1`, `playalibre:onboarding-tour:v1`

**Archivos nuevos:**

```
src/constants/guideSteps.ts
src/hooks/useGuidePreferences.ts
src/components/guide/PlatformGuideSection.tsx
src/components/guide/OnboardingTour.tsx
src/components/guide/GuideFirstVisitBanner.tsx
```

**IDs del tour en DOM:** `guide-target-explorer-header`, `guide-target-register-beach`, `guide-target-map-pane`, `guide-target-register-access`, `guide-target-mobile-tabs`, `guide-target-beach-list`

**Eventos custom (cambio pestaña móvil durante tour):** `playalibre:guide-show-map`, `playalibre:guide-show-list`

### C. Convención acordada con el usuario

Tras cada modificación futura, sugerir mensaje de commit (no commitear salvo que lo pida).

## Estado git (sin commitear al cierre de sesión)

Cambios pendientes incluyen guía/tour + integración en `App.tsx`. Build verificado: `pnpm run build` OK.

## Commits sugeridos (pendientes de aplicar)

```text
fix(mobile): corregir altura Leaflet, hooks del modal y vista previa en móvil

feat(guide): add formal usage guide section and skippable onboarding tour
```

(O un solo commit combinado si el usuario prefiere.)

## Pendiente / no hecho

- Deploy a Firebase Hosting tras fixes móvil + guía
- Fase 3: ayudas contextuales en `NewBeachModal` / `NewAccessModal` (primera apertura)
- Botón flotante «?» para reabrir guía desde el mapa
- Imágenes base64 muy pesadas en móvil (límite memoria Safari) — no investigado a fondo

## Comandos útiles

```bash
pnpm dev          # http://localhost:4000
pnpm run build
firebase deploy --only hosting
```

Reset guía/tour en navegador:

```js
localStorage.removeItem('playalibre:guide-banner-dismissed:v1');
localStorage.removeItem('playalibre:onboarding-tour:v1');
```

## Referencia

Constitución y arquitectura estable: [`agents.md`](./agents.md)
