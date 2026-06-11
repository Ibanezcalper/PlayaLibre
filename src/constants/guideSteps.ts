import type { LucideIcon } from 'lucide-react';
import { Map, LogIn, PenTool, Route, FileSearch, WifiOff } from 'lucide-react';

export const GUIDE_STORAGE_VERSION = 'v1';

export interface GuideStep {
  id: string;
  number: number;
  title: string;
  summary: string;
  detail: string;
  icon: LucideIcon;
}

export const PLATFORM_GUIDE_STEPS: GuideStep[] = [
  {
    id: 'explore',
    number: 1,
    title: 'Exploración del mapa',
    summary: 'Consulte playas y accesos mediante la lista o el mapa satelital.',
    detail:
      'Utilice la búsqueda por nombre o estado y los filtros por tipo de obstáculo. En dispositivos móviles alterne entre la lista de playas y el mapa interactivo.',
    icon: Map,
  },
  {
    id: 'auth',
    number: 2,
    title: 'Autenticación',
    summary: 'El registro de datos requiere una sesión activa.',
    detail:
      'Inicie sesión con Google o correo electrónico. Las cuentas registradas por correo deben verificarse antes de publicar playas, accesos o comentarios.',
    icon: LogIn,
  },
  {
    id: 'beach',
    number: 3,
    title: 'Registro de playas',
    summary: 'Delimite primero la playa sobre el mapa satelital.',
    detail:
      'Seleccione «Registrar playa», delimite el polígono sobre el mapa satelital (mínimo tres vértices) y, una vez confirmado el trazo, complete los datos de la ficha.',
    icon: PenTool,
  },
  {
    id: 'access',
    number: 4,
    title: 'Registro de accesos',
    summary: 'Cada acceso peatonal se vincula a una playa ya registrada.',
    detail:
      'Seleccione «Registrar acceso», fije el punto de entrada en el mapa, trace el sendero si corresponde y, posteriormente, complete la ficha con servicios, obstáculos y evidencia fotográfica.',
    icon: Route,
  },
  {
    id: 'details',
    number: 5,
    title: 'Consulta de fichas',
    summary: 'Revise la información consolidada de cada playa.',
    detail:
      'Al seleccionar una playa podrá consultar accesos vinculados, galería de imágenes, reportes históricos por categoría y comentarios asociados.',
    icon: FileSearch,
  },
  {
    id: 'offline',
    number: 6,
    title: 'Operación sin conexión',
    summary: 'Los registros pendientes se conservan en el dispositivo.',
    detail:
      'Si la conexión se interrumpe, las playas, accesos y reportes se almacenan localmente y se sincronizan automáticamente al restablecer el acceso a la red.',
    icon: WifiOff,
  },
];

export interface TourStep {
  id: string;
  title: string;
  body: string;
  targetId: string;
  mobileOnly?: boolean;
  desktopOnly?: boolean;
  scrollTo?: 'explorer-section' | 'guide-section';
}

export const ONBOARDING_TOUR_STEPS: TourStep[] = [
  {
    id: 'workspace',
    title: 'Área de trabajo',
    body: 'Esta sección concentra el mapa, el listado de playas y las herramientas de registro. Es el punto de partida para consultar y capturar información.',
    targetId: 'guide-target-explorer-header',
    scrollTo: 'explorer-section',
  },
  {
    id: 'register-beach',
    title: 'Registrar playa',
    body: 'Utilice este control para iniciar el registro. Primero delimitará la playa en el mapa satelital; después completará la ficha con nombre, estado y fotografías.',
    targetId: 'guide-target-register-beach',
    scrollTo: 'explorer-section',
  },
  {
    id: 'map',
    title: 'Mapa interactivo',
    body: 'En el mapa puede visualizar playas existentes, alternar entre vista satelital y calles, y trazar polígonos o senderos durante el registro.',
    targetId: 'guide-target-map-pane',
    scrollTo: 'explorer-section',
  },
  {
    id: 'register-access',
    title: 'Registrar acceso',
    body: 'Disponible una vez exista al menos una playa registrada. Primero documente la entrada y el sendero en el mapa; después complete la ficha del acceso.',
    targetId: 'guide-target-register-access',
    scrollTo: 'explorer-section',
  },
  {
    id: 'mobile-tabs',
    title: 'Vista en dispositivos móviles',
    body: 'En pantallas reducidas alterne entre la lista de playas y el mapa interactivo mediante estas pestañas.',
    targetId: 'guide-target-mobile-tabs',
    mobileOnly: true,
    scrollTo: 'explorer-section',
  },
  {
    id: 'beach-list',
    title: 'Listado de playas',
    body: 'Seleccione una playa del listado para consultar sus accesos, abrir la ficha detallada y revisar la información asociada.',
    targetId: 'guide-target-beach-list',
    scrollTo: 'explorer-section',
  },
];

export const WORKFLOW_STAGES = [
  { label: 'Playa', description: 'Polígono territorial' },
  { label: 'Acceso', description: 'Punto de entrada y sendero' },
  { label: 'Consulta', description: 'Ficha, reportes y comentarios' },
];

export interface BeachDrawingStep {
  number: number;
  title: string;
  detail: string;
}

/** Paso a paso para delimitar una playa en el mapa. */
export const BEACH_DRAWING_STEPS: BeachDrawingStep[] = [
  {
    number: 1,
    title: 'Activar vista satelital',
    detail:
      'En el mapa de trabajo, seleccione la capa «Satélite» para visualizar la línea de costa y delimitar con precisión el contorno de la playa.',
  },
  {
    number: 2,
    title: 'Marcar vértices del polígono',
    detail:
      'Haga clic sucesivo sobre el mapa para colocar cada vértice. El sistema trazará el contorno conforme agregue puntos. Se requieren al menos tres vértices para cerrar el polígono.',
  },
  {
    number: 3,
    title: 'Corregir el trazo',
    detail:
      'Si coloca un vértice incorrecto, utilice «Deshacer último punto» para eliminar solo el último marcador. Para reiniciar por completo, use «Limpiar polígono».',
  },
  {
    number: 4,
    title: 'Confirmar delimitación',
    detail:
      'Cuando el contorno sea correcto, presione «Continuar» para pasar al formulario de datos. El polígono quedará registrado en el mapa.',
  },
  {
    number: 5,
    title: 'Completar la ficha',
    detail:
      'Indique el nombre oficial, revise el estado (detectado automáticamente según la ubicación) y adjunte fotografías de referencia antes de guardar.',
  },
];

export interface AccessRegistrationStep {
  number: number;
  title: string;
  detail: string;
}

/** Paso a paso para registrar un acceso peatonal vinculado a una playa. */
export const ACCESS_REGISTRATION_STEPS: AccessRegistrationStep[] = [
  {
    number: 1,
    title: 'Verificar playa vinculada',
    detail:
      'El acceso debe asociarse a una playa ya registrada en la plataforma. Si aún no existe la playa correspondiente, regístrela antes de continuar.',
  },
  {
    number: 2,
    title: 'Fijar el punto de entrada',
    detail:
      'En vista satelital, haga clic sobre la entrada peatonal, portón o acceso visible desde la vía pública. Este punto es obligatorio para el registro.',
  },
  {
    number: 3,
    title: 'Trazar el sendero (opcional)',
    detail:
      'Si el recorrido desde la entrada hasta la playa no es directo, marque vértices sucesivos sobre el camino peatonal. Puede deshacer el último punto o limpiar el sendero completo.',
  },
  {
    number: 4,
    title: 'Confirmar ubicación en el mapa',
    detail:
      'Cuando la entrada (y el sendero, si aplica) sean correctos, presione «Continuar» para pasar al formulario de datos del acceso.',
  },
  {
    number: 5,
    title: 'Completar la ficha del acceso',
    detail:
      'Indique el nombre del acceso, confirme la playa vinculada, documente servicios, obstáculos, cobros irregulares y adjunte fotografías de evidencia.',
  },
];
