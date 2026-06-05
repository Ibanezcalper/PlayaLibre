import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Plus,
  MapPin,
  Check,
  ThumbsUp,
  ThumbsDown,
  WifiOff,
  X,
  Info,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  User,
  LogOut,
  MessageSquare,
  Send,
  Camera,
  Award
} from 'lucide-react';

import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  Legend
} from 'recharts';

// React-Leaflet Map Imports for OpenStreetMap
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, useMapEvents, ZoomControl, useMap } from 'react-leaflet';
import * as L from 'leaflet';

// Firebase SQL Connect Imports
import { dataConnectInstance, authInstance, googleProvider, isFirebaseConfigured } from './lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, linkWithCredential, GoogleAuthProvider, EmailAuthProvider, sendEmailVerification } from 'firebase/auth';
import { subscribe } from 'firebase/data-connect';
import {
  listBeachesRef,
  createBeach,
  createAccess,
  createReport,
  updateAccessCuration,
  updateReportScore,
  deleteReport,
  upsertUser,
  updateUserReputation,
  createComment,
  getUser,
  getCommentsForBeach
} from './dataconnect-generated';

// Fix default marker icon assets in Vite compiled bundle
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  reputation: number;
}

// Beach Data Interface (territorial boundary polygon)
interface Beach {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  boundaryPolygon?: [number, number][];
  images?: string[];
  user?: UserProfile;
  accesses: Access[];
  createdAt?: string;
}

// Access Point Interface (entrance coordinates, walking trail polyline and reports)
interface Access {
  id: string;
  beachId: string;
  name: string;
  latitude: number;
  longitude: number;
  trailGeometry?: [number, number][];
  images?: string[];
  user?: UserProfile;
  pets: boolean;
  shade: boolean;
  showers: boolean;
  parking: boolean;
  security: boolean;
  ramps: boolean;
  wheelchair: boolean;
  parkingReserved: boolean;
  alcoholAllowed: boolean;
  campingAllowed: boolean;
  feeRequired: boolean;
  wifi: boolean;
  cellular4G: boolean;
  blockerType: 'None' | 'Hotel' | 'Condo' | 'Restaurant' | 'Beach Club' | 'Private Property' | 'Insecurity' | 'Other';
  blockerName?: string;
  blockerDescription?: string;
  illegalFeeAmount: number;
  reputation: number; // 0-100 score
  isPendingCuration?: boolean;
  incidentReports: IncidentReport[];
  reportsHistory: { month: string; reports: number; fees: number }[];
}

interface IncidentReport {
  id: string;
  reporterName: string;
  blockerType: 'Hotel' | 'Condo' | 'Restaurant' | 'Beach Club' | 'Private Property' | 'Insecurity' | 'Other';
  blockerName: string;
  description: string;
  hasIllegalFee: boolean;
  feeAmount?: number;
  score: number;
  timestamp: number;
  user?: UserProfile;
}

// Haversine formula to compute distance in km between coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 17 coastal states of Mexico
const MEXICAN_STATES = [
  'Baja California',
  'Baja California Sur',
  'Sonora',
  'Sinaloa',
  'Nayarit',
  'Jalisco',
  'Colima',
  'Michoacán',
  'Guerrero',
  'Oaxaca',
  'Chiapas',
  'Tamaulipas',
  'Veracruz',
  'Tabasco',
  'Campeche',
  'Yucatán',
  'Quintana Roo'
];

const STATE_COASTAL_COORDINATES: Record<string, [number, number]> = {
  'Baja California': [31.8667, -116.6000],
  'Baja California Sur': [24.1426, -110.3128],
  'Sonora': [27.9179, -110.8989],
  'Sinaloa': [23.2329, -106.4168],
  'Nayarit': [20.7678, -105.3117],
  'Jalisco': [20.6534, -105.2253],
  'Colima': [19.0522, -104.3158],
  'Michoacán': [17.9859, -102.2031],
  'Guerrero': [16.8531, -99.8236],
  'Oaxaca': [15.8617, -97.0786],
  'Chiapas': [15.9000, -93.7500],
  'Tamaulipas': [22.2816, -97.8349],
  'Veracruz': [19.1738, -96.1342],
  'Tabasco': [18.4239, -93.0211],
  'Campeche': [19.8301, -90.5418],
  'Yucatán': [21.2811, -89.6647],
  'Quintana Roo': [21.1619, -86.8515]
};

const AVATAR_PRESETS = [
  { emoji: '🏄‍♂️', label: 'Surfista', bg: 'from-blue-400 to-indigo-500' },
  { emoji: '🌴', label: 'Palmera', bg: 'from-emerald-400 to-teal-500' },
  { emoji: '🐬', label: 'Delfín', bg: 'from-cyan-400 to-blue-500' },
  { emoji: '🦀', label: 'Cangrejo', bg: 'from-red-400 to-orange-500' },
  { emoji: '🌅', label: 'Amanecer', bg: 'from-amber-400 to-rose-500' },
  { emoji: '⛵', label: 'Velero', bg: 'from-sky-400 to-indigo-500' },
  { emoji: '🐚', label: 'Concha', bg: 'from-pink-400 to-rose-500' },
  { emoji: '🐠', label: 'Pez', bg: 'from-yellow-400 to-orange-500' }
];

const INITIAL_BEACHES: Beach[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Playa Carrizalillo',
    state: 'Oaxaca',
    latitude: 15.8617,
    longitude: -97.0786,
    boundaryPolygon: [
      [15.8622, -97.0789],
      [15.8626, -97.0780],
      [15.8612, -97.0776],
      [15.8610, -97.0785]
    ],
    images: [],
    accesses: [
      {
        id: '00000000-0000-0000-0000-000000000101',
        beachId: '00000000-0000-0000-0000-000000000001',
        name: 'Acceso peatonal Rinconada',
        latitude: 15.8624,
        longitude: -97.0783,
        trailGeometry: [
          [15.8624, -97.0783],
          [15.8621, -97.0782],
          [15.8617, -97.0786]
        ],
        images: [],
        pets: true,
        shade: true,
        showers: true,
        parking: false,
        security: true,
        ramps: false,
        wheelchair: false,
        parkingReserved: false,
        alcoholAllowed: true,
        campingAllowed: false,
        feeRequired: false,
        wifi: false,
        cellular4G: true,
        blockerType: 'Restaurant',
        blockerName: 'Club de Playa Sunset',
        blockerDescription: 'Restaurantes locales invaden la bajada principal con camastros privados y exigen consumo obligatorio de $500 MXN para transitar por la arena.',
        illegalFeeAmount: 500,
        reputation: 72,
        isPendingCuration: false,
        reportsHistory: [
          { month: 'Ene', reports: 1, fees: 0 },
          { month: 'Feb', reports: 2, fees: 1 },
          { month: 'Mar', reports: 4, fees: 2 }
        ],
        incidentReports: [
          {
            id: '00000000-0000-0000-0000-000000000201',
            reporterName: 'Rodrigo M.',
            blockerType: 'Restaurant',
            blockerName: 'Restaurante El Faro',
            description: 'Intentaron cobrarme $200 MXN solo por cruzar entre sus mesas para llegar a la playa pública.',
            hasIllegalFee: true,
            feeAmount: 200,
            score: 8,
            timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000
          },
          {
            id: '00000000-0000-0000-0000-000000000202',
            reporterName: 'Sofía G.',
            blockerType: 'Private Property',
            blockerName: 'Condominios Vista Hermosa',
            description: 'Cerraron la reja metálica del sendero peatonal tradicional de bajada a la bahía.',
            hasIllegalFee: false,
            score: 12,
            timestamp: Date.now() - 12 * 24 * 60 * 60 * 1000
          },
          {
            id: '00000000-0000-0000-0000-000000000203',
            reporterName: 'Carlos T.',
            blockerType: 'Insecurity',
            blockerName: 'Zona Federal',
            description: 'Guardias de seguridad privados amedrentan y acosan a surfistas locales cerca del acceso principal.',
            hasIllegalFee: false,
            score: 5,
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
          }
        ]
      }
    ]
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Playa Delfines',
    state: 'Quintana Roo',
    latitude: 21.0604,
    longitude: -86.7797,
    boundaryPolygon: [
      [21.0610, -86.7802],
      [21.0615, -86.7792],
      [21.0598, -86.7788],
      [21.0593, -86.7798]
    ],
    images: [],
    accesses: [
      {
        id: '00000000-0000-0000-0000-000000000102',
        beachId: '00000000-0000-0000-0000-000000000002',
        name: 'Acceso público El Mirador',
        latitude: 21.0608,
        longitude: -86.7800,
        trailGeometry: [
          [21.0608, -86.7800],
          [21.0605, -86.7798],
          [21.0604, -86.7797]
        ],
        images: [],
        pets: false,
        shade: true,
        showers: true,
        parking: true,
        security: true,
        ramps: true,
        wheelchair: true,
        parkingReserved: true,
        alcoholAllowed: false,
        campingAllowed: false,
        feeRequired: false,
        wifi: true,
        cellular4G: true,
        blockerType: 'Hotel',
        blockerName: 'Gran Oasis Riviera',
        blockerDescription: 'El hotel coloca guardias armados y vallas en la zona federal marítima para prohibir a turistas que no son huéspedes transitar o tender toallas.',
        illegalFeeAmount: 0,
        reputation: 85,
        isPendingCuration: false,
        reportsHistory: [
          { month: 'Ene', reports: 0, fees: 0 },
          { month: 'Feb', reports: 1, fees: 0 }
        ],
        incidentReports: [
          {
            id: '00000000-0000-0000-0000-000000000204',
            reporterName: 'Mariana K.',
            blockerType: 'Hotel',
            blockerName: 'Resort Paradisus',
            description: 'Los elementos de seguridad del hotel exigen que te retires de la arena enfrente de sus instalaciones alegando que es propiedad del hotel.',
            hasIllegalFee: false,
            score: 15,
            timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000
          }
        ]
      }
    ]
  }
];

// Leaflet Map Click Events Subcomponent
interface MapEventsProps {
  onMapClick: (lat: number, lng: number) => void;
}

function MapEvents({ onMapClick }: MapEventsProps) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

// Component to programmatically re-center and zoom Leaflet map
function ChangeMapView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

// User Avatar renderer component
function UserAvatar({ avatarUrl, username, size = 'md' }: { avatarUrl?: string; username: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-lg',
    lg: 'w-16 h-16 text-3xl'
  }[size];

  if (avatarUrl && avatarUrl.startsWith('preset:')) {
    const [_, emoji, bg] = avatarUrl.split(':');
    return (
      <div className={`rounded-full bg-gradient-to-br ${bg || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white font-sans ${sizeClasses} shadow-sm border border-white/20 select-none`}>
        {emoji}
      </div>
    );
  }

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={`rounded-full object-cover border border-black/10 shadow-sm ${sizeClasses}`}
      />
    );
  }

  // Fallback to initial letters
  const initial = username ? username.charAt(0).toUpperCase() : '?';
  return (
    <div className={`rounded-full bg-gradient-to-br from-blue-500 to-indigo-655 flex items-center justify-center text-white font-bold font-sans ${sizeClasses} border border-white/20 select-none`}>
      {initial}
    </div>
  );
}

import {
  saveOfflineReport,
  getOfflineReports,
  saveOfflineBeach,
  getOfflineBeaches,
  saveOfflineAccess,
  getOfflineAccesses,
  saveOfflineComment,
  getOfflineComments,
  saveOfflineUserProfile,
  getOfflineUserProfile,
  registerSyncHandler
} from './lib/offline-sync';
import type {
  OfflineBeach,
  OfflineAccess,
  OfflineReport
} from './lib/offline-sync';

// Map database flat SQL Connect output structure into nested hierarchy expected by the client
const mapDbBeachToFrontend = (dbBeach: any): Beach => {
  const accesses = (dbBeach.accesses_on_beach || []).map((acc: any) => {
    const incidentReports = (acc.reports_on_access || []).map((r: any) => ({
      id: r.id,
      reporterName: r.reporterName || 'Anónimo',
      blockerType: r.blockerType,
      blockerName: r.blockerName,
      description: r.description,
      hasIllegalFee: r.hasIllegalFee,
      feeAmount: r.feeAmount || 0,
      score: r.score || 1,
      timestamp: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
      user: r.user ? {
        id: r.user.id,
        username: r.user.username,
        avatarUrl: r.user.avatarUrl,
        reputation: r.user.reputation
      } : undefined
    }));

    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const historyMap: Record<string, { reports: number; fees: number }> = {};
    const currentMonthIdx = new Date().getMonth();
    const prevMonthIdx = (currentMonthIdx - 1 + 12) % 12;
    historyMap[months[prevMonthIdx]] = { reports: 0, fees: 0 };
    historyMap[months[currentMonthIdx]] = { reports: 0, fees: 0 };

    incidentReports.forEach((r: any) => {
      const m = months[new Date(r.timestamp).getMonth()];
      if (!historyMap[m]) {
        historyMap[m] = { reports: 0, fees: 0 };
      }
      historyMap[m].reports += 1;
      if (r.hasIllegalFee) {
        historyMap[m].fees += 1;
      }
    });

    const reportsHistory = Object.entries(historyMap).map(([month, data]) => ({
      month,
      reports: data.reports,
      fees: data.fees,
    }));

    return {
      id: acc.id,
      beachId: dbBeach.id,
      name: acc.name,
      latitude: acc.latitude,
      longitude: acc.longitude,
      trailGeometry: typeof acc.trailGeometry === 'string' ? JSON.parse(acc.trailGeometry) : acc.trailGeometry,
      images: acc.images ? (typeof acc.images === 'string' ? JSON.parse(acc.images) : acc.images) : [],
      pets: acc.pets,
      shade: acc.shade,
      showers: acc.showers,
      parking: acc.parking,
      security: acc.security,
      ramps: acc.ramps,
      wheelchair: acc.wheelchair,
      parkingReserved: acc.parkingReserved,
      alcoholAllowed: acc.alcoholAllowed,
      campingAllowed: acc.campingAllowed,
      feeRequired: acc.feeRequired,
      wifi: acc.wifi,
      cellular4G: acc.cellular4G,
      blockerType: acc.blockerType as any,
      blockerName: acc.blockerName || undefined,
      blockerDescription: acc.blockerDescription || undefined,
      illegalFeeAmount: acc.illegalFeeAmount || 0,
      reputation: acc.reputation ?? 90,
      isPendingCuration: acc.isPendingCuration ?? true,
      reportsHistory,
      incidentReports,
      user: acc.user ? {
        id: acc.user.id,
        username: acc.user.username,
        avatarUrl: acc.user.avatarUrl,
        reputation: acc.user.reputation
      } : undefined
    };
  });

  return {
    id: dbBeach.id,
    name: dbBeach.name,
    state: dbBeach.state,
    latitude: dbBeach.latitude,
    longitude: dbBeach.longitude,
    boundaryPolygon: typeof dbBeach.boundaryPolygon === 'string' ? JSON.parse(dbBeach.boundaryPolygon) : dbBeach.boundaryPolygon,
    images: dbBeach.images ? (typeof dbBeach.images === 'string' ? JSON.parse(dbBeach.images) : dbBeach.images) : [],
    accesses,
    user: dbBeach.user ? {
      id: dbBeach.user.id,
      username: dbBeach.user.username,
      avatarUrl: dbBeach.user.avatarUrl,
      reputation: dbBeach.user.reputation
    } : undefined
  };
};

// Helper to hash password to SHA-1 using browser SubtleCrypto API
async function hashSHA1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-1', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function App() {
  const [mobileSection, setMobileSection] = useState<'list' | 'map'>('list');
  const [isHighReputationUser, setIsHighReputationUser] = useState(false);

  // Sync state & connection queues
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineBeachesCount, setOfflineBeachesCount] = useState(0);
  const [offlineAccessesCount, setOfflineAccessesCount] = useState(0);
  const [offlineReportsCount, setOfflineReportsCount] = useState(0);
  const [offlineCommentsCount, setOfflineCommentsCount] = useState(0);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Auth States
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileSetupOpen, setIsProfileSetupOpen] = useState(false);
  const [profileSetupUsername, setProfileSetupUsername] = useState('');
  const [profileSetupAvatarUrl, setProfileSetupAvatarUrl] = useState(`preset:${AVATAR_PRESETS[0].emoji}:${AVATAR_PRESETS[0].bg}`);

  // Beach detailed modal states
  const [beachDetailOpen, setBeachDetailOpen] = useState(false);
  const [selectedBeachComments, setSelectedBeachComments] = useState<any[]>([]);
  const [newCommentText, setNewCommentText] = useState('');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [visibleImagesLimit, setVisibleImagesLimit] = useState(4);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<'beach' | 'access' | null>(null);
  const [isEmailAuthOpen, setIsEmailAuthOpen] = useState(false);
  const [emailAuthMode, setEmailAuthMode] = useState<'login' | 'signup'>('login');
  const [emailAuthEmail, setEmailAuthEmail] = useState('');
  const [emailAuthPassword, setEmailAuthPassword] = useState('');
  const [pendingLinkCredential, setPendingLinkCredential] = useState<any>(null);
  const [isEmailVerificationPending, setIsEmailVerificationPending] = useState(false);

  // Base64 Images Upload
  const [newBeachImages, setNewBeachImages] = useState<string[]>([]);
  const [newAccessImages, setNewAccessImages] = useState<string[]>([]);

  // App core state
  const [beaches, setBeaches] = useState<Beach[]>(INITIAL_BEACHES);
  const [selectedBeachId, setSelectedBeachId] = useState<string | null>(null);
  const [selectedAccessId, setSelectedAccessId] = useState<string | null>(null);

  // UI Drawer / Form Controls
  const [isNewBeachOpen, setIsNewBeachOpen] = useState(false);
  const [isNewAccessOpen, setIsNewAccessOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isFormMinimized, setIsFormMinimized] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'warn' | 'info' } | null>(null);

  // Search query & filters (all text styled in Spanish sentence-case)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBlocker, setFilterBlocker] = useState<string>('ALL');

  // Map configs
  const [mapLayer, setMapLayer] = useState<'satellite' | 'streets'>('satellite');
  const [mapCenter, setMapCenter] = useState<[number, number]>([15.8617, -97.0786]);
  const [mapZoom, setMapZoom] = useState<number>(13);
  const [drawMode, setDrawMode] = useState<'beach' | 'access_pin' | 'trail' | null>(null);
  const [drawingPoints, setDrawingPoints] = useState<[number, number][]>([]);
  const [placedPinCoordinates, setPlacedPinCoordinates] = useState<[number, number] | null>(null);
  const [trailDrawingPoints, setTrailDrawingPoints] = useState<[number, number][]>([]);

  // Form State - Beach Creation
  const [newBeachName, setNewBeachName] = useState('');
  const [newBeachState, setNewBeachState] = useState('Oaxaca');

  // Form State - Access Creation
  const newAccessPolicy = {
    alcoholAllowed: true,
    campingAllowed: false,
    feeRequired: false
  };
  const newAccessConnectivity = {
    wifi: false,
    cellular4G: true
  };

  const [newAccessName, setNewAccessName] = useState('');
  const [newAccessBeachId, setNewAccessBeachId] = useState('');
  const [newAccessBlocker, setNewAccessBlocker] = useState<'None' | 'Hotel' | 'Condo' | 'Restaurant' | 'Beach Club' | 'Private Property' | 'Insecurity' | 'Other'>('None');
  const [newAccessBlockerName, setNewAccessBlockerName] = useState('');
  const [newAccessBlockerDesc, setNewAccessBlockerDesc] = useState('');
  const [newAccessIllegalFee, setNewAccessIllegalFee] = useState(false);
  const [newAccessFeeAmount, setNewAccessFeeAmount] = useState('');

  const [newAccessAmenities, setNewAccessAmenities] = useState({
    pets: false,
    shade: false,
    showers: false,
    parking: false,
    security: false
  });
  const [newAccessAccessibility, setNewAccessAccessibility] = useState({
    ramps: false,
    wheelchair: false,
    parkingReserved: false
  });

  // Form State - Report Submission
  const [reportBlockerType, setReportBlockerType] = useState<IncidentReport['blockerType']>('Hotel');
  const [reportBlockerName, setReportBlockerName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportReporterName, setReportReporterName] = useState('');
  const [reportHasFee, setReportHasFee] = useState(false);
  const [reportFeeAmount, setReportFeeAmount] = useState('');

  // Selected Beach reference
  const selectedBeach = useMemo(() => {
    return beaches.find((b) => b.id === selectedBeachId) || null;
  }, [beaches, selectedBeachId]);

  // Selected Access point reference
  const selectedAccess = useMemo(() => {
    if (!selectedBeach) return null;
    return selectedBeach.accesses.find((a) => a.id === selectedAccessId) || null;
  }, [selectedBeach, selectedAccessId]);

  // Dynamic Beach Auto-Association by proximity (Distance < 3 km)
  const nearestBeach = useMemo(() => {
    if (!placedPinCoordinates || beaches.length === 0) return null;
    const [pinLat, pinLng] = placedPinCoordinates;
    let minDistance = Infinity;
    let closest: Beach | null = null;
    for (const b of beaches) {
      const dist = calculateDistance(pinLat, pinLng, b.latitude, b.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        closest = b;
      }
    }
    return closest ? { beach: closest, distance: minDistance } : null;
  }, [placedPinCoordinates, beaches]);

  // Apply default auto-selection in form
  useEffect(() => {
    if (nearestBeach && nearestBeach.distance < 3.0) {
      setNewAccessBeachId(nearestBeach.beach.id);
    }
  }, [nearestBeach]);

  // Auth details initial loading
  useEffect(() => {
    const cached = localStorage.getItem('playalibre_user_profile');
    if (cached) {
      setUserProfile(JSON.parse(cached));
    }
  }, []);

  // Firebase Auth state listener
  useEffect(() => {
    if (!isFirebaseConfigured || !authInstance) return;

    const unsubscribe = onAuthStateChanged(authInstance, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Lock out unverified email/password accounts
        if (!user.emailVerified) {
          setUserProfile(null);
          setIsEmailVerificationPending(true);
          return;
        }
        setIsEmailVerificationPending(false);
        try {
          if (dataConnectInstance) {
            const res = await getUser(dataConnectInstance, { id: user.uid });
            if (res.data?.user) {
              const profile = {
                id: user.uid,
                username: res.data.user.username,
                avatarUrl: res.data.user.avatarUrl || undefined,
                reputation: res.data.user.reputation
              };
              setUserProfile(profile);
              localStorage.setItem('playalibre_user_profile', JSON.stringify(profile));
            } else {
              setProfileSetupUsername(user.displayName || '');
              setProfileSetupAvatarUrl(`preset:${AVATAR_PRESETS[0].emoji}:${AVATAR_PRESETS[0].bg}`);
              setIsProfileSetupOpen(true);
            }
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          const offlineProfile = await getOfflineUserProfile(user.uid);
          if (offlineProfile) {
            setUserProfile(offlineProfile);
          } else {
            setProfileSetupUsername(user.displayName || '');
            setIsProfileSetupOpen(true);
          }
        }
      } else {
        setUserProfile(null);
        localStorage.removeItem('playalibre_user_profile');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSuccessfulVerification = async () => {
    if (!authInstance?.currentUser) return;
    const user = authInstance.currentUser;
    setIsEmailVerificationPending(false);
    
    try {
      if (dataConnectInstance) {
        const res = await getUser(dataConnectInstance, { id: user.uid });
        if (res.data?.user) {
          const profile = {
            id: user.uid,
            username: res.data.user.username,
            avatarUrl: res.data.user.avatarUrl || undefined,
            reputation: res.data.user.reputation
          };
          setUserProfile(profile);
          localStorage.setItem('playalibre_user_profile', JSON.stringify(profile));
        } else {
          setProfileSetupUsername(user.displayName || '');
          setProfileSetupAvatarUrl(`preset:${AVATAR_PRESETS[0].emoji}:${AVATAR_PRESETS[0].bg}`);
          setIsProfileSetupOpen(true);
        }
      }
    } catch (err) {
      console.error('Error fetching user profile post-verification:', err);
      setProfileSetupUsername(user.displayName || '');
      setIsProfileSetupOpen(true);
    }
  };

  // Trigger pending form action after successful auth
  useEffect(() => {
    if (userProfile && pendingAuthAction) {
      if (pendingAuthAction === 'beach') {
        const el = document.getElementById('explorer-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsNewBeachOpen(true);
      } else if (pendingAuthAction === 'access') {
        const el = document.getElementById('explorer-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        setIsNewAccessOpen(true);
      }
      setPendingAuthAction(null);
      setIsAuthPromptOpen(false);
    }
  }, [userProfile, pendingAuthAction]);

  // Automatically link accounts with identical emails
  useEffect(() => {
    if (currentUser && pendingLinkCredential) {
      if (!isFirebaseConfigured || !authInstance) {
        showToast('Cuentas vinculadas exitosamente (modo offline).', 'success');
        setPendingLinkCredential(null);
        return;
      }

      const doLink = async () => {
        try {
          await linkWithCredential(currentUser, pendingLinkCredential);
          showToast('Cuentas vinculadas exitosamente.', 'success');
        } catch (linkErr: any) {
          console.error('Error linking credential:', linkErr);
          if (linkErr.code === 'auth/credential-already-in-use') {
            showToast('Esta cuenta ya está vinculada a otro perfil.', 'info');
          } else {
            showToast('No se pudieron vincular las cuentas automáticamente.', 'warn');
          }
        } finally {
          setPendingLinkCredential(null);
        }
      };
      doLink();
    }
  }, [currentUser, pendingLinkCredential]);

  const handleLogin = async () => {
    if (isFirebaseConfigured && authInstance) {
      try {
        await signInWithPopup(authInstance, googleProvider);
        showToast('Sesión iniciada exitosamente con Google.', 'success');
      } catch (err: any) {
        console.error('Error signing in with Google:', err);
        if (err.code === 'auth/account-exists-with-different-credential') {
          const credential = GoogleAuthProvider.credentialFromError(err);
          setPendingLinkCredential(credential);
          showToast('El correo de Google ya está registrado. Inicia sesión con tu otro método para vincularlas.', 'info');
        } else {
          showToast('No se pudo iniciar sesión con Google.', 'warn');
        }
      }
    } else {
      // Offline/Mock mode login
      const mockUid = `mock-google-${Date.now()}`;
      setCurrentUser({ uid: mockUid, displayName: 'Colaborador Google' });
      setProfileSetupUsername('');
      setProfileSetupAvatarUrl(`preset:${AVATAR_PRESETS[0].emoji}:${AVATAR_PRESETS[0].bg}`);
      setIsProfileSetupOpen(true);
      setIsAuthPromptOpen(false);
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAuthEmail.trim() || !emailAuthPassword.trim()) return;

    // Encrypt password with SHA-1 on the client
    const sha1Password = await hashSHA1(emailAuthPassword.trim());

    if (isFirebaseConfigured && authInstance) {
      try {
        if (emailAuthMode === 'signup') {
          const userCredential = await createUserWithEmailAndPassword(authInstance, emailAuthEmail.trim(), sha1Password);
          await sendEmailVerification(userCredential.user);
          showToast('Registro de correo exitoso. Correo de verificación enviado.', 'success');
          setIsEmailVerificationPending(true);
        } else {
          const userCredential = await signInWithEmailAndPassword(authInstance, emailAuthEmail.trim(), sha1Password);
          if (!userCredential.user.emailVerified) {
            setIsEmailVerificationPending(true);
            showToast('Tu cuenta aún no está verificada. Revisa tu correo.', 'warn');
          } else {
            showToast('Sesión iniciada exitosamente.', 'success');
          }
        }
        setIsEmailAuthOpen(false);
        setIsAuthPromptOpen(false);
      } catch (err: any) {
        console.error('Error in email/password auth:', err);
        let errorMsg = 'Error en la autenticación.';
        if (err.code === 'auth/email-already-in-use') {
          errorMsg = 'El correo ya está registrado.';
          // Capture the credential to link if they later log in with Google/Apple
          const credential = EmailAuthProvider.credential(emailAuthEmail.trim(), sha1Password);
          setPendingLinkCredential(credential);
          showToast('El correo ya está registrado. Inicia sesión con tu otro proveedor para vincularlos.', 'info');
        } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
          errorMsg = 'Correo o contraseña incorrectos.';
        } else if (err.code === 'auth/weak-password') {
          errorMsg = 'La contraseña debe tener al menos 6 caracteres.';
        }
        showToast(errorMsg, 'warn');
      }
    } else {
      // Offline/Mock mode login
      const mockUid = `mock-email-${Date.now()}`;
      setCurrentUser({ uid: mockUid, displayName: emailAuthEmail.split('@')[0] });
      setProfileSetupUsername(emailAuthEmail.split('@')[0]);
      setProfileSetupAvatarUrl(`preset:${AVATAR_PRESETS[3].emoji}:${AVATAR_PRESETS[3].bg}`);
      setIsProfileSetupOpen(true);
      setIsEmailAuthOpen(false);
      setIsAuthPromptOpen(false);
      showToast('Sesión iniciada (modo offline con contraseña SHA-1).', 'success');
    }
  };

  const handleLogout = async () => {
    if (isFirebaseConfigured && authInstance) {
      await signOut(authInstance);
    } else {
      setCurrentUser(null);
      setUserProfile(null);
      localStorage.removeItem('playalibre_user_profile');
    }
    showToast('Sesión cerrada.', 'info');
  };

  const submitProfileSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileSetupUsername.trim()) return;

    const uid = currentUser?.uid || `mock-user-${Date.now()}`;
    const timestampSuffix = Date.now().toString().slice(-5);
    const uniqueUsername = `${profileSetupUsername.trim()}_${timestampSuffix}`;

    const newProfile = {
      id: uid,
      username: uniqueUsername,
      avatarUrl: profileSetupAvatarUrl,
      reputation: 10
    };

    if (isOnline && isFirebaseConfigured && dataConnectInstance) {
      try {
        await upsertUser(dataConnectInstance, {
          id: uid,
          username: newProfile.username,
          avatarUrl: newProfile.avatarUrl || null,
          reputation: newProfile.reputation
        });
        showToast('Perfil de usuario guardado exitosamente.', 'success');
      } catch (err) {
        console.error('Error saving profile to database:', err);
        await saveOfflineUserProfile({ ...newProfile, timestamp: Date.now() });
        showToast('Error de red. Perfil guardado localmente.', 'warn');
      }
    } else {
      await saveOfflineUserProfile({ ...newProfile, timestamp: Date.now() });
      showToast('Perfil guardado localmente (modo offline).', 'success');
    }

    setUserProfile(newProfile);
    localStorage.setItem('playalibre_user_profile', JSON.stringify(newProfile));
    setIsProfileSetupOpen(false);
  };

  // Image Upload Event Handlers
  const handleBeachImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewBeachImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAccessImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setNewAccessImages(prev => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Comments Loader
  const loadComments = async (beachId: string) => {
    if (isOnline && isFirebaseConfigured && dataConnectInstance) {
      try {
        let targetBeachId = beachId;
        if (targetBeachId === '00000000-0000-0000-0000-000000000001') {
          const realBeach = beaches.find(b => b.name === 'Playa Carrizalillo');
          if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000001') targetBeachId = realBeach.id;
        } else if (targetBeachId === '00000000-0000-0000-0000-000000000002') {
          const realBeach = beaches.find(b => b.name === 'Playa Delfines');
          if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000002') targetBeachId = realBeach.id;
        }

        const res = await getCommentsForBeach(dataConnectInstance, { beachId: targetBeachId });
        if (res.data?.comments) {
          setSelectedBeachComments(res.data.comments);
        }
      } catch (err) {
        console.error('Error fetching comments from database:', err);
        loadOfflineComments(beachId);
      }
    } else {
      loadOfflineComments(beachId);
    }
  };

  const loadOfflineComments = async (beachId: string) => {
    const offlineComments = await getOfflineComments();
    const filtered = offlineComments
      .filter((c) => c.beachId === beachId)
      .map((c) => ({
        id: c.id,
        text: c.text,
        createdAt: new Date(c.timestamp).toISOString(),
        user: {
          id: c.userId,
          username: 'Tú (offline)',
          avatarUrl: userProfile?.avatarUrl || undefined,
          reputation: userProfile?.reputation || 10
        }
      }));
    setSelectedBeachComments(filtered);
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !userProfile || !selectedBeachId) return;

    const commentId = 'comment-' + Math.random().toString(36).substr(2, 9);
    const commentText = newCommentText.trim();

    if (isOnline && isFirebaseConfigured && dataConnectInstance) {
      try {
        let targetBeachId = selectedBeachId;
        if (targetBeachId === '00000000-0000-0000-0000-000000000001') {
          const realBeach = beaches.find(b => b.name === 'Playa Carrizalillo');
          if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000001') targetBeachId = realBeach.id;
        } else if (targetBeachId === '00000000-0000-0000-0000-000000000002') {
          const realBeach = beaches.find(b => b.name === 'Playa Delfines');
          if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000002') targetBeachId = realBeach.id;
        }

        await createComment(dataConnectInstance, {
          beachId: targetBeachId,
          userId: userProfile.id,
          text: commentText
        });
        showToast('Comentario publicado exitosamente.', 'success');
        loadComments(selectedBeachId);
      } catch (err) {
        console.error('Error submitting comment to database:', err);
        await saveOfflineComment({
          id: commentId,
          beachId: selectedBeachId,
          userId: userProfile.id,
          text: commentText,
          timestamp: Date.now()
        });
        showToast('Error de red. Comentario guardado localmente.', 'warn');
        loadOfflineComments(selectedBeachId);
      }
    } else {
      await saveOfflineComment({
        id: commentId,
        beachId: selectedBeachId,
        userId: userProfile.id,
        text: commentText,
        timestamp: Date.now()
      });
      showToast('Comentario guardado localmente (modo offline).', 'success');
      loadOfflineComments(selectedBeachId);
    }

    setNewCommentText('');
  };

  // Timeline Data Generator
  const computeTimelineData = (beach: Beach) => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const data: Record<string, { month: string; illegalFees: number; insecurity: number; blockages: number; other: number; sortKey: number }> = {};
    
    // Last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mName = months[d.getMonth()];
      const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
      data[key] = {
        month: mName,
        illegalFees: 0,
        insecurity: 0,
        blockages: 0,
        other: 0,
        sortKey: d.getTime()
      };
    }

    // Add incidents
    beach.accesses.forEach((acc) => {
      acc.incidentReports.forEach((r) => {
        const rDate = new Date(r.timestamp);
        const rKey = `${rDate.getFullYear()}-${String(rDate.getMonth()).padStart(2, '0')}`;
        if (data[rKey]) {
          if (r.hasIllegalFee) {
            data[rKey].illegalFees += 1;
          } else if (r.blockerType === 'Insecurity') {
            data[rKey].insecurity += 1;
          } else if (['Hotel', 'Condo', 'Restaurant', 'Beach Club', 'Private Property'].includes(r.blockerType)) {
            data[rKey].blockages += 1;
          } else {
            data[rKey].other += 1;
          }
        }
      });
    });

    return Object.values(data).sort((a, b) => a.sortKey - b.sortKey);
  };

  // Live Real-Time database sync subscriptions (Firebase SQL Connect)
  useEffect(() => {
    if (!isFirebaseConfigured || !dataConnectInstance) {
      console.log('Running in local mock mode (configure VITE_FIREBASE credentials in .env to go live).');
      return;
    }

    const ref = listBeachesRef(dataConnectInstance);
    const unsubscribe = subscribe(ref, async (snapshot) => {
      try {
        if (!snapshot.data || !snapshot.data.beaches || snapshot.data.beaches.length === 0) {
          console.log('SQL Connect database is empty. Seeding with mock data...');
          for (const beach of INITIAL_BEACHES) {
            const res = await createBeach(dataConnectInstance, {
              name: beach.name,
              state: beach.state,
              latitude: beach.latitude,
              longitude: beach.longitude,
              boundaryPolygon: beach.boundaryPolygon || null,
              images: beach.images || null,
              userId: null
            });
            const newBeachId = res.data?.beach_insert?.id;
            if (newBeachId && beach.accesses) {
              for (const acc of beach.accesses) {
                const accRes = await createAccess(dataConnectInstance, {
                  beachId: newBeachId,
                  name: acc.name,
                  latitude: acc.latitude,
                  longitude: acc.longitude,
                  trailGeometry: acc.trailGeometry || null,
                  images: acc.images || null,
                  pets: acc.pets,
                  shade: acc.shade,
                  showers: acc.showers,
                  parking: acc.parking,
                  security: acc.security,
                  ramps: acc.ramps,
                  wheelchair: acc.wheelchair,
                  parkingReserved: acc.parkingReserved,
                  alcoholAllowed: acc.alcoholAllowed,
                  campingAllowed: acc.campingAllowed,
                  feeRequired: acc.feeRequired,
                  wifi: acc.wifi,
                  cellular4G: acc.cellular4G,
                  blockerType: acc.blockerType,
                  blockerName: acc.blockerName || null,
                  blockerDescription: acc.blockerDescription || null,
                  illegalFeeAmount: acc.illegalFeeAmount,
                  userId: null
                });
                const newAccessId = accRes.data?.access_insert?.id;
                if (newAccessId && acc.incidentReports && acc.incidentReports.length > 0) {
                  for (const report of acc.incidentReports) {
                    await createReport(dataConnectInstance, {
                      accessId: newAccessId,
                      reporterName: report.reporterName,
                      blockerType: report.blockerType,
                      blockerName: report.blockerName,
                      description: report.description,
                      hasIllegalFee: report.hasIllegalFee,
                      feeAmount: report.feeAmount || 0,
                      userId: null
                    });
                  }
                }
              }
            }
          }
        } else {
          // Map backend rows to client models
          const list = snapshot.data.beaches.map((b) => mapDbBeachToFrontend(b));
          setBeaches(list);
        }
      } catch (err) {
        console.error('Failed to process real-time SQL Connect subscription snapshot:', err);
      }
    });

    return () => unsubscribe();
  }, []);

  // Update online/offline queues and count indicators
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast('Se ha restablecido la conexión a internet.', 'success');
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast('Se ha perdido la conexión. Operando en modo local.', 'warn');
    };

    const updateOfflineCounters = async () => {
      const dbReports = await getOfflineReports();
      const dbBeaches = await getOfflineBeaches();
      const dbAccesses = await getOfflineAccesses();
      const dbComments = await getOfflineComments();
      setOfflineReportsCount(dbReports.length);
      setOfflineBeachesCount(dbBeaches.length);
      setOfflineAccessesCount(dbAccesses.length);
      setOfflineCommentsCount(dbComments.length);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    updateOfflineCounters();

    // Register offline sync processor
    const deregister = registerSyncHandler(async (offlineReports, offlineBeaches, offlineAccesses, offlineComments, offlineProfiles) => {
      if (!isFirebaseConfigured || !dataConnectInstance) return false;
      try {
        // 1. Sync profiles first
        for (const p of offlineProfiles) {
          await upsertUser(dataConnectInstance, {
            id: p.id,
            username: p.username,
            avatarUrl: p.avatarUrl || null,
            reputation: p.reputation
          });
        }

        // 2. Sync beaches
        const beachIdMap: Record<string, string> = {};
        for (const beach of offlineBeaches) {
          const res = await createBeach(dataConnectInstance, {
            name: beach.name,
            state: beach.state,
            latitude: beach.latitude,
            longitude: beach.longitude,
            boundaryPolygon: beach.boundaryPolygon || null,
            images: beach.images || null,
            userId: beach.userId || null
          });
          const newId = res.data?.beach_insert?.id;
          if (newId) beachIdMap[beach.id] = newId;
        }

        // Helper to map client-side beach ID to database UUID
        const getRealBeachId = (clientBeachId: string): string => {
          if (beachIdMap[clientBeachId]) {
            return beachIdMap[clientBeachId];
          }
          if (clientBeachId === 'carrizalillo' || clientBeachId === '00000000-0000-0000-0000-000000000001') {
            const realBeach = beaches.find(b => b.name === 'Playa Carrizalillo');
            if (realBeach && realBeach.id !== 'carrizalillo' && realBeach.id !== '00000000-0000-0000-0000-000000000001') {
              return realBeach.id;
            }
          }
          if (clientBeachId === 'delfines' || clientBeachId === '00000000-0000-0000-0000-000000000002') {
            const realBeach = beaches.find(b => b.name === 'Playa Delfines');
            if (realBeach && realBeach.id !== 'delfines' && realBeach.id !== '00000000-0000-0000-0000-000000000002') {
              return realBeach.id;
            }
          }
          return clientBeachId;
        };

        // Helper to map client-side access ID to database UUID
        const getRealAccessId = (clientAccessId: string): string => {
          if (accessIdMap[clientAccessId]) {
            return accessIdMap[clientAccessId];
          }
          if (clientAccessId === 'acc-c1' || clientAccessId === '00000000-0000-0000-0000-000000000101') {
            const realBeach = beaches.find(b => b.name === 'Playa Carrizalillo');
            const realAcc = realBeach?.accesses.find(a => a.name === 'Acceso peatonal Rinconada');
            if (realAcc) return realAcc.id;
          }
          if (clientAccessId === 'acc-d1' || clientAccessId === '00000000-0000-0000-0000-000000000102') {
            const realBeach = beaches.find(b => b.name === 'Playa Delfines');
            const realAcc = realBeach?.accesses.find(a => a.name === 'Acceso público El Mirador');
            if (realAcc) return realAcc.id;
          }
          return clientAccessId;
        };

        // 3. Sync accesses
        const accessIdMap: Record<string, string> = {};
        for (const acc of offlineAccesses) {
          const parentId = getRealBeachId(acc.beachId);
          const res = await createAccess(dataConnectInstance, {
            beachId: parentId,
            name: acc.name,
            latitude: acc.latitude,
            longitude: acc.longitude,
            trailGeometry: acc.trailGeometry || null,
            images: acc.images || null,
            pets: acc.pets,
            shade: acc.shade,
            showers: acc.showers,
            parking: acc.parking,
            security: acc.security,
            ramps: acc.ramps,
            wheelchair: acc.wheelchair,
            parkingReserved: acc.parkingReserved,
            alcoholAllowed: acc.alcoholAllowed,
            campingAllowed: acc.campingAllowed,
            feeRequired: acc.feeRequired,
            wifi: acc.wifi,
            cellular4G: acc.cellular4G,
            blockerType: acc.blockerType,
            blockerName: acc.blockerName || null,
            blockerDescription: acc.blockerDescription || null,
            illegalFeeAmount: acc.illegalFeeAmount,
            userId: acc.userId || null
          });
          const newId = res.data?.access_insert?.id;
          if (newId) accessIdMap[acc.id] = newId;
        }

        // 4. Sync comments
        for (const c of offlineComments) {
          const parentBeachId = getRealBeachId(c.beachId);
          await createComment(dataConnectInstance, {
            beachId: parentBeachId,
            userId: c.userId,
            text: c.text
          });
        }

        // 5. Sync reports
        for (const r of offlineReports) {
          const parentId = getRealAccessId(r.accessId);
          await createReport(dataConnectInstance, {
            accessId: parentId,
            reporterName: r.reporterName,
            blockerType: r.blockerType,
            blockerName: r.blockerName,
            description: r.description,
            hasIllegalFee: r.hasIllegalFee,
            feeAmount: r.feeAmount || 0,
            userId: r.userId || null
          });
        }

        setShowSyncSuccess(true);
        setTimeout(() => setShowSyncSuccess(false), 5000);
        updateOfflineCounters();
        return true;
      } catch (err) {
        console.error('Failed to run database synchronization:', err);
        return false;
      }
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      deregister();
    };
  }, [beaches]);

  const showToast = (text: string, type: 'success' | 'warn' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Upvoting or downvoting a specific report (curation curation threshold x3 multiplier)
  const handleReportVote = async (accessId: string, reportId: string, diff: number) => {
    const power = isHighReputationUser ? 3 : 1;
    
    let reporterId = '';
    let currentReporterRep = 10;
    if (selectedAccess) {
      const report = selectedAccess.incidentReports.find((r) => r.id === reportId);
      if (report && report.user) {
        reporterId = report.user.id;
        currentReporterRep = report.user.reputation;
      }
    }

    if (isFirebaseConfigured && dataConnectInstance && selectedAccess) {
      const report = selectedAccess.incidentReports.find((r) => r.id === reportId);
      if (report) {
        const newScore = report.score + diff * power;
        if (newScore < -4) {
          await deleteReport(dataConnectInstance, { id: reportId });
        } else {
          await updateReportScore(dataConnectInstance, { id: reportId, score: newScore });
          if (reporterId) {
            const newRep = Math.max(0, currentReporterRep + diff * power * 5);
            await updateUserReputation(dataConnectInstance, { id: reporterId, reputation: newRep });
          }
        }
      }
    } else {
      setBeaches((prev) => {
        return prev.map((b) => {
          if (b.id !== selectedBeachId) return b;
          const updatedAccesses = b.accesses.map((acc) => {
            if (acc.id !== accessId) return acc;
            const updatedReports = acc.incidentReports.map((r) => {
              if (r.id !== reportId) return r;
              return { ...r, score: r.score + diff * power };
            }).filter((r) => r.score >= -4);
            return { ...acc, incidentReports: updatedReports };
          });
          return { ...b, accesses: updatedAccesses };
        });
      });
    }

    showToast(
      isHighReputationUser
        ? 'Voto de alta reputación registrado. Impacto x3 y reputación de autor actualizados.'
        : 'Voto registrado. Reputación cívica actualizada.',
      'success'
    );
  };

  // Curador direct curation actions
  const handleCurationVerify = async (accessId: string, actionType: 'resolve_conflict' | 'verify_public') => {
    if (!isHighReputationUser) {
      showToast('Se requiere cuenta de alta reputación para curar directamente.', 'warn');
      return;
    }

    if (isFirebaseConfigured && dataConnectInstance && selectedAccess) {
      if (actionType === 'resolve_conflict') {
        await updateAccessCuration(dataConnectInstance, {
          id: accessId,
          blockerType: 'None',
          blockerName: null,
          blockerDescription: null,
          illegalFeeAmount: 0,
          reputation: Math.min(100, selectedAccess.reputation + 15),
          isPendingCuration: false
        });
      } else {
        await updateAccessCuration(dataConnectInstance, {
          id: accessId,
          blockerType: selectedAccess.blockerType,
          blockerName: selectedAccess.blockerName || null,
          blockerDescription: selectedAccess.blockerDescription || null,
          illegalFeeAmount: selectedAccess.illegalFeeAmount,
          reputation: Math.min(100, selectedAccess.reputation + 10),
          isPendingCuration: false
        });
      }
    } else {
      setBeaches((prev) => {
        return prev.map((b) => {
          if (b.id !== selectedBeachId) return b;
          const updatedAccesses = b.accesses.map((acc) => {
            if (acc.id !== accessId) return acc;
            if (actionType === 'resolve_conflict') {
              return {
                ...acc,
                blockerType: 'None',
                blockerName: undefined,
                blockerDescription: undefined,
                illegalFeeAmount: 0,
                reputation: Math.min(100, acc.reputation + 15),
                isPendingCuration: false
              } as Access;
            } else {
              return {
                ...acc,
                reputation: Math.min(100, acc.reputation + 10),
                isPendingCuration: false
              } as Access;
            }
          });
          return { ...b, accesses: updatedAccesses };
        });
      });
    }

    showToast('Acción de curaduría completada. Cambios publicados directamente.', 'success');
  };

  // Submit incident report for a specific access point
  const submitIncidentReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBeachId || !selectedAccessId || !selectedAccess) return;

    const reportId = 'rep-' + Math.random().toString(36).substr(2, 9);
    const feeVal = reportHasFee ? Number(reportFeeAmount) : undefined;

    const reportData: OfflineReport = {
      id: reportId,
      accessId: selectedAccessId,
      reporterName: reportReporterName || (userProfile ? userProfile.username : 'Anónimo'),
      blockerType: reportBlockerType,
      blockerName: reportBlockerName || 'Desconocido',
      description: reportDescription,
      hasIllegalFee: reportHasFee,
      feeAmount: feeVal,
      userId: userProfile?.id,
      timestamp: Date.now()
    };

    if (isOnline) {
      try {
        if (isFirebaseConfigured && dataConnectInstance) {
          let targetAccessId = selectedAccessId;
          if (targetAccessId === '00000000-0000-0000-0000-000000000101') {
            const realBeach = beaches.find(b => b.name === 'Playa Carrizalillo');
            const realAcc = realBeach?.accesses.find(a => a.name === 'Acceso peatonal Rinconada');
            if (realAcc) targetAccessId = realAcc.id;
          } else if (targetAccessId === '00000000-0000-0000-0000-000000000102') {
            const realBeach = beaches.find(b => b.name === 'Playa Delfines');
            const realAcc = realBeach?.accesses.find(a => a.name === 'Acceso público El Mirador');
            if (realAcc) targetAccessId = realAcc.id;
          }

          await createReport(dataConnectInstance, {
            accessId: targetAccessId,
            reporterName: reportData.reporterName,
            blockerType: reportData.blockerType,
            blockerName: reportData.blockerName,
            description: reportData.description,
            hasIllegalFee: reportData.hasIllegalFee,
            feeAmount: reportData.feeAmount || 0,
            userId: reportData.userId || null
          });

          await updateAccessCuration(dataConnectInstance, {
            id: targetAccessId,
            blockerType: reportData.blockerType,
            blockerName: reportData.blockerName,
            blockerDescription: reportData.description,
            illegalFeeAmount: reportData.feeAmount || 0,
            reputation: Math.max(10, selectedAccess.reputation - 8),
            isPendingCuration: true,
          });
        } else {
          setBeaches((prev) => {
            return prev.map((b) => {
              if (b.id !== selectedBeachId) return b;
              const updatedAccesses = b.accesses.map((acc) => {
                if (acc.id !== selectedAccessId) return acc;
                const newIncident: IncidentReport = {
                  id: reportId,
                  reporterName: reportData.reporterName,
                  blockerType: reportData.blockerType,
                  blockerName: reportData.blockerName,
                  description: reportData.description,
                  hasIllegalFee: reportData.hasIllegalFee,
                  feeAmount: reportData.feeAmount,
                  score: 1,
                  timestamp: reportData.timestamp,
                  user: userProfile ? { ...userProfile } : undefined
                };
                const updatedHistory = [...acc.reportsHistory];
                if (updatedHistory.length > 0) {
                  updatedHistory[updatedHistory.length - 1].reports += 1;
                  if (reportHasFee) {
                    updatedHistory[updatedHistory.length - 1].fees += 1;
                  }
                }
                return {
                  ...acc,
                  blockerType: reportData.blockerType,
                  blockerName: reportData.blockerName,
                  blockerDescription: reportData.description,
                  illegalFeeAmount: reportData.feeAmount || 0,
                  reputation: Math.max(10, acc.reputation - 8),
                  reportsHistory: updatedHistory,
                  incidentReports: [newIncident, ...acc.incidentReports]
                } as Access;
              });
              return { ...b, accesses: updatedAccesses };
            });
          });
        }
        showToast('Reporte enviado y registrado exitosamente.', 'success');
      } catch (err) {
        console.error('Failed to submit report to SQL Connect:', err);
        await saveOfflineReport(reportData);
        setOfflineReportsCount((prev) => prev + 1);
        showToast('Error al enviar reporte. Guardado localmente.', 'warn');
      }
    } else {
      await saveOfflineReport(reportData);
      setOfflineReportsCount((prev) => prev + 1);
      showToast('Sin señal. Reporte guardado localmente.', 'warn');
    }

    setReportBlockerName('');
    setReportDescription('');
    setReportReporterName('');
    setReportHasFee(false);
    setReportFeeAmount('');
    setIsReportOpen(false);
  };

  // Submit a new beach (polygon territory)
  const submitNewBeach = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      showToast('Debes iniciar sesión para registrar una playa.', 'warn');
      return;
    }
    if (!newBeachName) return;

    const beachId = 'beach-' + Math.random().toString(36).substr(2, 9);
    
    const finalPolygon: [number, number][] = drawingPoints.length > 2 
      ? drawingPoints 
      : [
          [15.8622, -97.0789],
          [15.8626, -97.0780],
          [15.8612, -97.0776],
          [15.8610, -97.0785]
        ];

    let totalLat = 0, totalLng = 0;
    finalPolygon.forEach(([lat, lng]) => {
      totalLat += lat;
      totalLng += lng;
    });
    const avgLat = Number((totalLat / finalPolygon.length).toFixed(6));
    const avgLng = Number((totalLng / finalPolygon.length).toFixed(6));

    const beachData: OfflineBeach = {
      id: beachId,
      name: newBeachName,
      state: newBeachState,
      latitude: avgLat,
      longitude: avgLng,
      boundaryPolygon: finalPolygon,
      images: newBeachImages,
      userId: userProfile?.id,
      timestamp: Date.now()
    };

    if (isOnline) {
      try {
        if (isFirebaseConfigured && dataConnectInstance) {
          await createBeach(dataConnectInstance, {
            name: newBeachName,
            state: newBeachState,
            latitude: avgLat,
            longitude: avgLng,
            boundaryPolygon: finalPolygon,
            images: newBeachImages,
            userId: userProfile?.id || null
          });
        } else {
          const formattedBeach: Beach = {
            id: beachId,
            name: newBeachName,
            state: newBeachState,
            latitude: avgLat,
            longitude: avgLng,
            boundaryPolygon: finalPolygon,
            images: newBeachImages,
            user: userProfile ? { ...userProfile } : undefined,
            accesses: []
          };
          setBeaches((prev) => [...prev, formattedBeach]);
        }
        showToast('Nueva playa guardada en el catálogo público.', 'success');
      } catch (err) {
        console.error('Failed to submit new beach to SQL Connect:', err);
        await saveOfflineBeach(beachData);
        setOfflineBeachesCount((prev) => prev + 1);
        showToast('Error al publicar playa. Guardado localmente.', 'warn');
      }
    } else {
      await saveOfflineBeach(beachData);
      setOfflineBeachesCount((prev) => prev + 1);
      showToast('Guardado localmente. La playa se publicará al tener conexión.', 'warn');
    }

    setNewBeachName('');
    setNewBeachImages([]);
    setDrawingPoints([]);
    setDrawMode(null);
    setIsNewBeachOpen(false);
  };

  // Submit a new access point (and optional walking path) linked to a beach
  const submitNewAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) {
      showToast('Debes iniciar sesión para registrar un acceso público.', 'warn');
      return;
    }
    if (!newAccessName || !newAccessBeachId || !placedPinCoordinates) {
      showToast('Falta ingresar el nombre del acceso o marcar la entrada en el mapa.', 'warn');
      return;
    }

    const accessId = 'acc-' + Math.random().toString(36).substr(2, 9);
    const [pinLat, pinLng] = placedPinCoordinates;

    const accessData: OfflineAccess = {
      id: accessId,
      beachId: newAccessBeachId,
      name: newAccessName,
      latitude: pinLat,
      longitude: pinLng,
      trailGeometry: trailDrawingPoints.length > 0 ? trailDrawingPoints : undefined,
      images: newAccessImages,
      userId: userProfile?.id,
      pets: newAccessAmenities.pets,
      shade: newAccessAmenities.shade,
      showers: newAccessAmenities.showers,
      parking: newAccessAmenities.parking,
      security: newAccessAmenities.security,
      ramps: newAccessAccessibility.ramps,
      wheelchair: newAccessAccessibility.wheelchair,
      parkingReserved: newAccessAccessibility.parkingReserved,
      alcoholAllowed: newAccessPolicy.alcoholAllowed,
      campingAllowed: newAccessPolicy.campingAllowed,
      feeRequired: newAccessPolicy.feeRequired,
      wifi: newAccessConnectivity.wifi,
      cellular4G: newAccessConnectivity.cellular4G,
      blockerType: newAccessBlocker,
      blockerName: newAccessBlocker !== 'None' ? newAccessBlockerName : undefined,
      blockerDescription: newAccessBlocker !== 'None' ? newAccessBlockerDesc : undefined,
      illegalFeeAmount: (newAccessBlocker !== 'None' && newAccessIllegalFee) ? Number(newAccessFeeAmount) : 0,
      reputation: 90,
      timestamp: Date.now()
    };

    if (isOnline) {
      try {
        if (isFirebaseConfigured && dataConnectInstance) {
          // Map client-side mock ID to real database UUID if needed
          let targetBeachId = newAccessBeachId;
          if (targetBeachId === '00000000-0000-0000-0000-000000000001') {
            const realBeach = beaches.find(b => b.name === 'Playa Carrizalillo');
            if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000001') targetBeachId = realBeach.id;
          } else if (targetBeachId === '00000000-0000-0000-0000-000000000002') {
            const realBeach = beaches.find(b => b.name === 'Playa Delfines');
            if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000002') targetBeachId = realBeach.id;
          }

          const res = await createAccess(dataConnectInstance, {
            beachId: targetBeachId,
            name: newAccessName,
            latitude: pinLat,
            longitude: pinLng,
            trailGeometry: accessData.trailGeometry || null,
            images: newAccessImages,
            pets: accessData.pets,
            shade: accessData.shade,
            showers: accessData.showers,
            parking: accessData.parking,
            security: accessData.security,
            ramps: accessData.ramps,
            wheelchair: accessData.wheelchair,
            parkingReserved: accessData.parkingReserved,
            alcoholAllowed: accessData.alcoholAllowed,
            campingAllowed: accessData.campingAllowed,
            feeRequired: accessData.feeRequired,
            wifi: accessData.wifi,
            cellular4G: accessData.cellular4G,
            blockerType: accessData.blockerType,
            blockerName: accessData.blockerName || null,
            blockerDescription: accessData.blockerDescription || null,
            illegalFeeAmount: accessData.illegalFeeAmount,
            userId: userProfile?.id || null
          });

          const newId = res.data?.access_insert?.id;
          if (newId && newAccessBlocker !== 'None') {
            await createReport(dataConnectInstance, {
              accessId: newId,
              reporterName: userProfile ? userProfile.username : 'Fundador PlayaLibre',
              blockerType: newAccessBlocker,
              blockerName: newAccessBlockerName || 'General',
              description: newAccessBlockerDesc || 'Reporte de bloqueo inicial.',
              hasIllegalFee: newAccessIllegalFee,
              feeAmount: newAccessIllegalFee ? Number(newAccessFeeAmount) : 0,
              userId: userProfile?.id || null
            });
          }
        } else {
          setBeaches((prev) => {
            return prev.map((b) => {
              if (b.id !== newAccessBeachId) return b;
              const formattedAccess: Access = {
                id: accessId,
                beachId: newAccessBeachId,
                name: newAccessName,
                latitude: pinLat,
                longitude: pinLng,
                trailGeometry: accessData.trailGeometry,
                images: newAccessImages,
                user: userProfile ? { ...userProfile } : undefined,
                pets: accessData.pets,
                shade: accessData.shade,
                showers: accessData.showers,
                parking: accessData.parking,
                security: accessData.security,
                ramps: accessData.ramps,
                wheelchair: accessData.wheelchair,
                parkingReserved: accessData.parkingReserved,
                alcoholAllowed: accessData.alcoholAllowed,
                campingAllowed: accessData.campingAllowed,
                feeRequired: accessData.feeRequired,
                wifi: accessData.wifi,
                cellular4G: accessData.cellular4G,
                blockerType: accessData.blockerType,
                blockerName: accessData.blockerName,
                blockerDescription: accessData.blockerDescription,
                illegalFeeAmount: accessData.illegalFeeAmount,
                reputation: 90,
                isPendingCuration: true,
                reportsHistory: [
                  { month: 'Jun', reports: newAccessBlocker !== 'None' ? 1 : 0, fees: newAccessIllegalFee ? 1 : 0 }
                ],
                incidentReports: newAccessBlocker !== 'None' ? [
                  {
                    id: 'rep-init',
                    reporterName: userProfile ? userProfile.username : 'Fundador PlayaLibre',
                    blockerType: newAccessBlocker as IncidentReport['blockerType'],
                    blockerName: newAccessBlockerName || 'General',
                    description: newAccessBlockerDesc || 'Reporte de bloqueo inicial.',
                    hasIllegalFee: newAccessIllegalFee,
                    feeAmount: newAccessIllegalFee ? Number(newAccessFeeAmount) : undefined,
                    score: 5,
                    timestamp: Date.now(),
                    user: userProfile ? { ...userProfile } : undefined
                  }
                ] : []
              };
              return { ...b, accesses: [...b.accesses, formattedAccess] };
            });
          });
        }
        showToast('Nuevo acceso público guardado exitosamente.', 'success');
      } catch (err) {
        console.error('Failed to submit new access to SQL Connect:', err);
        await saveOfflineAccess(accessData);
        setOfflineAccessesCount((prev) => prev + 1);
        showToast('Error al publicar acceso. Guardado localmente.', 'warn');
      }
    } else {
      await saveOfflineAccess(accessData);
      setOfflineAccessesCount((prev) => prev + 1);
      showToast('Guardado localmente. Se publicará al recuperar conexión.', 'warn');
    }

    setNewAccessName('');
    setNewAccessImages([]);
    setPlacedPinCoordinates(null);
    setTrailDrawingPoints([]);
    setNewAccessBlocker('None');
    setNewAccessBlockerName('');
    setNewAccessBlockerDesc('');
    setNewAccessIllegalFee(false);
    setNewAccessFeeAmount('');
    setNewAccessAmenities({ pets: false, shade: false, showers: false, parking: false, security: false });
    setNewAccessAccessibility({ ramps: false, wheelchair: false, parkingReserved: false });
    setDrawMode(null);
    setIsNewAccessOpen(false);
  };

  const handleMapClick = (lat: number, lng: number) => {
    const latRounded = Number(lat.toFixed(6));
    const lngRounded = Number(lng.toFixed(6));

    if (drawMode === 'beach') {
      setDrawingPoints((prev) => [...prev, [latRounded, lngRounded]]);
      showToast(`Punto de playa agregado: [${latRounded}, ${lngRounded}]`, 'info');
    } else if (drawMode === 'access_pin') {
      setPlacedPinCoordinates([latRounded, lngRounded]);
      showToast(`Ubicación de entrada fijada en: [${latRounded}, ${lngRounded}]`, 'info');
      setDrawMode(null);
    } else if (drawMode === 'trail') {
      setTrailDrawingPoints((prev) => [...prev, [latRounded, lngRounded]]);
      showToast(`Punto de sendero agregado: [${latRounded}, ${lngRounded}]`, 'info');
    }
  };

  const filteredBeaches = useMemo(() => {
    return beaches.filter((b) => {
      const matchSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.state.toLowerCase().includes(searchQuery.toLowerCase());

      const matchFilter =
        filterBlocker === 'ALL' ||
        b.accesses.some((acc) => {
          if (filterBlocker === 'OPEN') return acc.blockerType === 'None';
          if (filterBlocker === 'CONFLICT') return acc.blockerType !== 'None';
          return acc.blockerType === filterBlocker;
        });

      return matchSearch && matchFilter;
    });
  }, [beaches, searchQuery, filterBlocker]);

  const createAccessIcon = (isBlocked: boolean, isSelected: boolean) => {
    const color = isSelected ? '#F26522' : isBlocked ? '#ef4444' : '#10b981';
    const shadowColor = isSelected ? 'rgba(242,101,34,0.4)' : isBlocked ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)';
    return L.divIcon({
      html: `<div class="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-lg transition-transform hover:scale-110" style="background-color: ${color}; box-shadow: 0 0 10px ${shadowColor};">
        <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
        </svg>
      </div>`,
      className: '',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      popupAnchor: [0, -24]
    });
  };

  return (
    <div className="relative min-h-screen bg-[#EFEFEF] text-gray-900 font-sans selection:bg-[#F26522]/30 selection:text-gray-900 overflow-x-hidden">
      
      {/* Offline indicators bar */}
      <div className="z-50 w-full text-xs font-semibold select-none">
        {!isOnline && (
          <div className="flex items-center justify-center gap-2 px-4 py-2 text-amber-900 bg-amber-300">
            <WifiOff size={14} className="animate-pulse" />
            <span>Estás en modo offline. {offlineBeachesCount} playas, {offlineAccessesCount} accesos, {offlineReportsCount} reportes y {offlineCommentsCount} comentarios se sincronizarán al reconectar.</span>
          </div>
        )}
        {showSyncSuccess && (
          <div className="flex items-center justify-center gap-2 px-4 py-2.5 text-white bg-emerald-700 animate-bounce">
            <CheckCircle2 size={16} />
            <span>¡Datos sincronizados! La cola local de IndexedDB se ha subido exitosamente a PlayaLibre.</span>
          </div>
        )}
      </div>

      {/* SECTION 1: HERO */}
      <section className="relative min-h-screen bg-white overflow-hidden flex flex-col justify-between select-none antialiased">
        
        {/* Glow effects */}
        <div className="absolute top-[-200px] left-[-200px] w-[600px] h-[600px] rounded-full bg-[#60B1FF]/25 blur-[130px] pointer-events-none z-0" />
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-[#319AFF]/15 blur-[100px] pointer-events-none z-0" />
        <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#319AFF]/10 blur-[120px] pointer-events-none z-0" />

        {/* Navigation Bar */}
        <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 pointer-events-none">
          <div className="pointer-events-auto flex items-center justify-between px-6 py-3 rounded-[16px] border border-black/10 bg-white/30 backdrop-blur-[50px] shadow-[inset_0_4px_4px_rgba(255,255,255,0.25)]">
            
            {/* Logo */}
            <div className="flex items-center gap-2.5 cursor-pointer font-fustat font-bold text-[22px] tracking-tight text-[#1a1a1a]" onClick={() => { setSelectedBeachId(null); setSelectedAccessId(null); }}>
              <div className="w-6 h-6 rounded-md bg-[#0871E7] flex items-center justify-center text-white shadow-sm font-sans font-black text-[10px] tracking-tighter">
                PL
              </div>
              <span className="font-semibold text-lg tracking-tight">PlayaLibre</span>
            </div>

            {/* Links */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#about-us" className="font-sans text-[14px] text-[#1a1a1a] font-medium hover:opacity-60 transition-opacity">
                Propósito
              </a>
              <a 
                href="#explorer-section" 
                onClick={(e) => {
                  e.preventDefault();
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-sans text-[14px] text-[#1a1a1a] font-medium hover:opacity-60 transition-opacity"
              >
                Explorar accesos
              </a>
               <button 
                onClick={() => {
                  if (!userProfile) {
                    setPendingAuthAction('beach');
                    setIsAuthPromptOpen(true);
                    return;
                  }
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setIsNewBeachOpen(true);
                }}
                className="font-sans text-[14px] text-[#1a1a1a] font-medium hover:opacity-60 transition-opacity pointer-events-auto"
              >
                Añadir playa
              </button>
              <button 
                onClick={() => {
                  if (!userProfile) {
                    setPendingAuthAction('access');
                    setIsAuthPromptOpen(true);
                    return;
                  }
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  setIsNewAccessOpen(true);
                }}
                className="font-sans text-[14px] text-[#1a1a1a] font-medium hover:opacity-60 transition-opacity pointer-events-auto"
              >
                Añadir acceso
              </button>
            </nav>

            {/* Auth / Profile display */}
            <div className="flex items-center gap-4 pointer-events-auto">
              {userProfile ? (
                <div className="flex items-center gap-3 bg-black/[0.04] pl-2.5 pr-3 py-1 rounded-full border border-black/5">
                  <UserAvatar avatarUrl={userProfile.avatarUrl} username={userProfile.username} size="sm" />
                  <div className="flex flex-col text-left select-none leading-none">
                    <span className="text-[11px] font-bold text-gray-800 tracking-tight">{userProfile.username}</span>
                    <span className="text-[8.5px] font-semibold text-[#0871E7] mt-0.5">★ {userProfile.reputation} karma</span>
                  </div>

                  {/* Curator Toggle only if user has profile */}
                  <button 
                    onClick={() => {
                      setIsHighReputationUser(!isHighReputationUser);
                      showToast(
                        !isHighReputationUser
                          ? 'Modo curador activado. Tienes poderes de moderación de accesos.'
                          : 'Modo turista activado. Tus reportes requerirán moderación colectiva.',
                        'info'
                      );
                    }}
                    className={`p-1 rounded-full border transition-all duration-300 ${
                      isHighReputationUser
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                        : 'bg-white/10 border-black/10 text-gray-400 hover:text-gray-600'
                    }`}
                    title={isHighReputationUser ? 'Desactivar modo curador' : 'Activar modo curador'}
                  >
                    <Award size={13} className={isHighReputationUser ? 'animate-pulse' : ''} />
                  </button>

                  <button
                    onClick={handleLogout}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                    title="Cerrar sesión"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogin}
                  className="px-4 py-1.5 rounded-full font-sans text-[12px] font-bold bg-[#0871E7] text-white hover:brightness-105 transition-all shadow-[inset_0_2px_4px_rgba(255,255,255,0.4)] flex items-center gap-1.5"
                >
                  <User size={13} />
                  <span>Iniciar sesión</span>
                </button>
              )}
            </div>

          </div>
        </header>

        {/* Hero Grid Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-36 md:pt-44 pb-16 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 mb-5">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-3.5 h-3.5 text-[#FF801E]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[13px] font-sans font-medium text-gray-600 tracking-tight">
                8,500+ colaboradores cívicos activos
              </span>
            </div>

            <motion.h1 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-fustat font-bold text-[48px] sm:text-[62px] md:text-[75px] leading-[1.05] tracking-[-2.5px] text-[#1a1a1a] mb-6"
            >
              Mapea accesos,<br />libera playas.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-[16px] sm:text-[18px] text-[#1a1a1a]/70 leading-relaxed font-normal max-w-lg mb-8"
            >
              Reporta cobros ilegales, dibuja accesos bloqueados y comparte servicios. La primera plataforma colectiva para defender el libre tránsito en las costas de México.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center justify-between pl-6 pr-2 py-2 rounded-full bg-[#0871E7] text-white font-sans font-medium text-[14px] shadow-lg shadow-[#0871E7]/20 outline-1 outline-[#0871E7] -outline-offset-1 overflow-hidden pointer-events-auto"
              onClick={() => {
                const el = document.getElementById('explorer-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div className="absolute w-[80%] h-3 left-[10%] top-[1px] bg-gradient-to-b from-[#DEF0FC]/60 to-transparent rounded-[12px] group-hover:scale-x-105 transition-transform duration-300" />
              <span className="mr-6 relative z-10">Comenzar exploración</span>
              <span className="relative z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center text-[#0871E7] shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45">
                <ArrowRight size={14} />
              </span>
            </motion.button>
          </div>

          <div className="lg:col-span-5 flex justify-center items-center relative h-full w-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-[420px] sm:max-w-[480px] lg:max-w-none h-auto aspect-square object-cover scale-125 mix-blend-screen pointer-events-none"
              style={{ filter: 'hue-rotate(-55deg) saturate(250%) brightness(1.2) contrast(1.1)' }}
              src="https://future.co/images/homepage/glassy-orb/orb-purple.webm"
            />
          </div>
        </div>

        {/* Footer Coastal States (only 17 coastal states in Mexico) */}
        <div className="relative z-20 w-full max-w-5xl mx-auto px-6 border-t border-black/5 pt-10 pb-8 mt-auto flex flex-col gap-5 items-center">
          <p className="text-[11px] sm:text-[12px] font-sans font-medium text-gray-400 uppercase tracking-widest text-center">
            Monitoreando la costa mexicana en sus 17 estados costeros
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 opacity-90 select-none py-2 max-w-4xl">
            {MEXICAN_STATES.map((state) => (
              <div 
                key={state} 
                onClick={() => {
                  const coords = STATE_COASTAL_COORDINATES[state];
                  if (coords) {
                    setMapCenter(coords);
                    setMapZoom(11);
                    setSearchQuery(state);
                    const el = document.getElementById('explorer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    showToast(`Mostrando zona costera de ${state}`, 'info');
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-black/5 bg-black/[0.02] text-gray-500 font-fustat font-bold text-[14px] sm:text-[15px] tracking-tight hover:text-[#0871E7] hover:bg-[#0871E7]/5 hover:border-[#0871E7]/10 transition-all duration-300 cursor-pointer"
              >
                <svg className="w-4 h-4 text-[#0871E7]/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
                </svg>
                <span>{state}</span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* SECTION 2: PURPOSE */}
      <section id="about-us" className="relative bg-white pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden">
        <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
          
          <div className="flex items-center gap-3 mb-6 sm:mb-8 select-none">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center">
              1
            </div>
            <span className="text-[12px] sm:text-[13px] font-medium border border-gray-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-gray-800 bg-gray-50">
              Introduciendo PlayaLibre
            </span>
          </div>

          <h2 className="text-gray-900 font-medium leading-[1.12] tracking-[-0.02em] mb-12 sm:mb-16 lg:mb-28 max-w-5xl" style={{ fontSize: 'clamp(1.5rem, 4.5vw, 3.2rem)' }}>
            Organización cívica colectiva, garantizando <br className="hidden sm:block" />
            el libre tránsito en las costas del país.
          </h2>

          <div className="lg:hidden flex flex-col gap-8">
            <p className="text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 max-w-xl">
              Mediante la recopilación comunitaria de coordenadas, delimitación geográfica de playas públicas y auditorías de cobros ilegales, ayudamos a mantener las playas libres para todos.
            </p>
            
            <div className="self-start">
              <button
                onClick={() => {
                  const el = document.getElementById('explorer-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="group relative flex items-center gap-3.5 pl-5 sm:pl-6 pr-2 py-2 rounded-full bg-[#F26522] hover:bg-[#e05a1a] transition-colors duration-300"
              >
                <div className="h-[20px] overflow-hidden text-[13px] sm:text-[14px] font-medium text-white flex flex-col relative leading-none select-none">
                  <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                    <span className="h-[20px] flex items-center">Explorar mapa costero</span>
                    <span className="h-[20px] flex items-center">Explorar mapa costero</span>
                  </div>
                </div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white flex items-center justify-center text-[#F26522]">
                  <ArrowRight size={14} className="transition-transform duration-500 group-hover:rotate-[-45deg] rotate-0" />
                </div>
              </button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-12 gap-8 items-start">
            <div className="col-span-5">
              <p className="text-[18px] leading-[1.6] text-gray-900 font-medium max-w-md">
                Mediante la recopilación comunitaria de coordenadas, delimitación de accesos peatonales y reportes ciudadanos de cobros, buscamos mantener el libre acceso a nuestras playas.
              </p>
            </div>
            <div className="col-span-4 col-start-7 flex flex-col gap-10">
              <p className="text-[14px] leading-[1.7] text-gray-500 font-normal">
                Nuestras costas pertenecen a la nación. Con la participación de colaboradores, registramos y auditamos los senderos tradicionales, identificando cercados privados, hoteles y cobros indebidos.
              </p>
              <div>
                <button
                  onClick={() => {
                    const el = document.getElementById('explorer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative flex items-center gap-3.5 pl-6 pr-2 py-2 rounded-full bg-[#F26522] hover:bg-[#e05a1a] transition-colors duration-300"
                >
                  <div className="h-[20px] overflow-hidden text-[14px] font-medium text-white flex flex-col relative leading-none select-none">
                    <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
                      <span className="h-[20px] flex items-center">Explorar mapa costero</span>
                      <span className="h-[20px] flex items-center">Explorar mapa costero</span>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#F26522]">
                    <ArrowRight size={14} className="transition-transform duration-500 group-hover:rotate-[-45deg] rotate-0" />
                  </div>
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: MAP AND REGISTER OF BEACHES */}
      <section id="explorer-section" className="relative bg-[#F5F5F5] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 border-t border-gray-200">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>Registro de playas</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight mt-2 font-fustat">
                Mapa de accesos y reportes comunitarios
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  if (!userProfile) {
                    setPendingAuthAction('beach');
                    setIsAuthPromptOpen(true);
                    return;
                  }
                  setIsNewBeachOpen(true);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Plus size={14} />
                <span>Registrar playa</span>
              </button>
              <button
                onClick={() => {
                  if (!userProfile) {
                    setPendingAuthAction('access');
                    setIsAuthPromptOpen(true);
                    return;
                  }
                  if (beaches.length === 0) {
                    showToast('Primero registra una playa en el sistema.', 'warn');
                    return;
                  }
                  setIsNewAccessOpen(true);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0871E7] hover:bg-[#0762cb] text-white text-xs font-semibold transition-all shadow-sm"
              >
                <Plus size={14} />
                <span>Registrar acceso</span>
              </button>
            </div>
          </div>

          {/* Search and filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 text-xs">
            <input
              type="text"
              placeholder="Buscar playas por nombre o estado..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 outline-none shadow-sm focus:border-gray-400 placeholder-gray-400 font-sans"
            />
            
            <div className="flex items-center gap-2">
              <span className="text-gray-500 font-medium whitespace-nowrap">Filtrar por obstáculo:</span>
              <select
                value={filterBlocker}
                onChange={(e) => setFilterBlocker(e.target.value)}
                className="px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-800 outline-none shadow-sm cursor-pointer focus:border-gray-400"
              >
                <option value="ALL">Todos los accesos</option>
                <option value="OPEN">Sin bloqueos (libres)</option>
                <option value="CONFLICT">Bloqueados / con cobro</option>
                <option value="Hotel">Hoteles comerciales</option>
                <option value="Condo">Condominios residenciales</option>
                <option value="Restaurant">Restaurantes / comercios</option>
                <option value="Beach Club">Clubs de playa privados</option>
                <option value="Private Property">Cercado de propiedad privada</option>
                <option value="Insecurity">Inseguridad / violencia</option>
              </select>
            </div>
          </div>

          {/* Mobile view selector */}
          <div className="flex lg:hidden rounded-xl bg-gray-200 p-1 mb-4 select-none">
            <button
              onClick={() => setMobileSection('list')}
              className={`flex-1 py-2.5 rounded-lg text-center text-xs font-semibold transition-all ${
                mobileSection === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Lista de playas
            </button>
            <button
              onClick={() => setMobileSection('map')}
              className={`flex-1 py-2.5 rounded-lg text-center text-xs font-semibold transition-all ${
                mobileSection === 'map' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
              }`}
            >
              Mapa interactivo
            </button>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[600px]">
            
            {/* Sidebar list */}
            <div className={`w-full lg:w-[400px] flex flex-col gap-4 ${
              mobileSection === 'map' ? 'hidden lg:flex' : 'flex'
            }`}>
              
              {selectedBeach ? (
                <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5">
                  <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                    <button
                      onClick={() => {
                        if (selectedAccessId) {
                          setSelectedAccessId(null);
                        } else {
                          setSelectedBeachId(null);
                        }
                      }}
                      className="p-1.5 rounded-lg bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                      title="Volver"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <div>
                      <span className="text-[10px] font-bold text-[#0871E7] uppercase tracking-widest leading-none">{selectedBeach.state}</span>
                      <h3 className="font-bold text-sm text-gray-900 leading-tight mt-0.5">{selectedBeach.name}</h3>
                    </div>
                  </div>

                  {selectedAccess ? (
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 text-xs">
                      
                      {/* Access images preview if exists */}
                      {selectedAccess.images && selectedAccess.images.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto py-1">
                          {selectedAccess.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              onClick={() => setLightboxImage(img)}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-250 cursor-pointer hover:opacity-90 flex-shrink-0"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-2">
                        <span className="font-bold text-gray-800">Ubicación del acceso:</span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          [{selectedAccess.latitude.toFixed(4)}, {selectedAccess.longitude.toFixed(4)}]
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-800">Nombre del acceso:</span>
                        <span className="text-gray-650 font-medium">{selectedAccess.name}</span>
                      </div>

                      {selectedAccess.user && (
                        <div className="flex justify-between items-center text-[10px] bg-gray-50 p-2 rounded-lg border border-gray-150">
                          <span className="text-gray-500 font-medium">Registrado por:</span>
                          <span className="font-bold text-gray-800 flex items-center gap-1">
                            {selectedAccess.user.username}
                            <span className="text-[#0871E7]">★ {selectedAccess.user.reputation}</span>
                          </span>
                        </div>
                      )}

                      <div className="p-3.5 rounded-xl border flex flex-col gap-2.5 bg-gray-50 border-gray-200">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-700">Estado del acceso:</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                            selectedAccess.blockerType !== 'None' ? 'bg-red-100 text-red-800 border border-red-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}>
                            {selectedAccess.blockerType !== 'None' ? 'Obstruido' : 'Acceso libre'}
                          </span>
                        </div>

                        {selectedAccess.blockerType !== 'None' && (
                          <div className="border-t border-gray-200 pt-2.5 mt-1 space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-gray-500">Bloqueo por:</span>
                              <span className="font-semibold text-gray-800">{selectedAccess.blockerType}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Responsable:</span>
                              <span className="font-semibold text-gray-800">{selectedAccess.blockerName}</span>
                            </div>
                            {selectedAccess.illegalFeeAmount > 0 && (
                              <div className="flex justify-between text-red-650 font-bold">
                                <span>Cobro reportado:</span>
                                <span>${selectedAccess.illegalFeeAmount} MXN</span>
                              </div>
                            )}
                            <p className="text-[10px] text-gray-650 bg-red-50/50 p-2 rounded-lg border border-red-100 mt-1 italic">
                              "{selectedAccess.blockerDescription}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Walking path */}
                      {selectedAccess.trailGeometry && selectedAccess.trailGeometry.length > 0 && (
                        <div className="p-3.5 rounded-xl border bg-blue-50/30 border-blue-100 flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                            <MapPin size={14} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">Sendero trazado</h4>
                            <p className="text-[10px] text-gray-500 mt-0.5">El camino a pie está trazado en el mapa interactivo.</p>
                          </div>
                        </div>
                      )}

                      {/* Services checklist */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-1.5">Servicios en este acceso</h4>
                        <div className="grid grid-cols-2 gap-1.5 bg-gray-50 p-3 rounded-xl border border-gray-150 text-[10px]">
                          <span className={`flex items-center gap-1 ${selectedAccess.parking ? 'text-emerald-700 font-semibold' : 'text-gray-400 line-through'}`}>
                            Estacionamiento
                          </span>
                          <span className={`flex items-center gap-1 ${selectedAccess.security ? 'text-emerald-700 font-semibold' : 'text-gray-400 line-through'}`}>
                            Seguridad
                          </span>
                          <span className={`flex items-center gap-1 ${selectedAccess.showers ? 'text-emerald-700 font-semibold' : 'text-gray-400 line-through'}`}>
                            Regaderas
                          </span>
                          <span className={`flex items-center gap-1 ${selectedAccess.pets ? 'text-emerald-700 font-semibold' : 'text-gray-400 line-through'}`}>
                            Mascotas
                          </span>
                          <span className={`flex items-center gap-1 ${selectedAccess.ramps ? 'text-emerald-700 font-semibold' : 'text-gray-400 line-through'}`}>
                            Rampas (a11y)
                          </span>
                          <span className={`flex items-center gap-1 ${selectedAccess.wheelchair ? 'text-emerald-700 font-semibold' : 'text-gray-400 line-through'}`}>
                            Silla de ruedas
                          </span>
                        </div>
                      </div>

                      {/* Curator controls */}
                      {isHighReputationUser && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mt-2">
                          <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1">
                            <span>Herramientas de curaduría</span>
                          </h4>
                          <p className="text-[10px] text-amber-800 mb-3">Como curador, puedes resolver conflictos reportados o certificar el acceso público.</p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleCurationVerify(selectedAccess.id, 'resolve_conflict')}
                              className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold text-center"
                            >
                              Resolver conflicto
                            </button>
                            <button
                              onClick={() => handleCurationVerify(selectedAccess.id, 'verify_public')}
                              className="flex-1 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold text-center"
                            >
                              Certificar acceso
                            </button>
                          </div>
                        </div>
                      )}

                      {/* incident reports */}
                      <div className="border-t border-gray-150 pt-4 mt-2">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-gray-800">Reportes de la comunidad</h4>
                          <button
                            onClick={() => setIsReportOpen(true)}
                            className="text-[10px] text-[#0871E7] hover:underline font-semibold"
                          >
                            + Reportar anomalía
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {selectedAccess.incidentReports.length > 0 ? (
                            selectedAccess.incidentReports.map((report) => (
                              <div key={report.id} className="p-3 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col gap-1.5 text-xs">
                                <div className="flex justify-between items-start">
                                  <span className="font-bold text-gray-800 text-[10px] flex items-center gap-1">
                                    {report.reporterName}
                                    {report.user && (
                                      <span className="text-[#0871E7] font-semibold text-[8px]">★ {report.user.reputation}</span>
                                    )}
                                  </span>
                                  <span className="text-[8.5px] text-gray-400">
                                    {new Date(report.timestamp).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-650 leading-snug">{report.description}</p>
                                {report.hasIllegalFee && (
                                  <span className="text-red-650 font-bold text-[9.5px]">Cobro forzado: ${report.feeAmount} MXN</span>
                                )}
                                
                                <div className="flex justify-between items-center pt-1.5 border-t border-dashed border-gray-200 mt-1">
                                  <span className="text-[9px] text-gray-500">Puntaje cívico: <strong>{report.score}</strong></span>
                                  <div className="flex gap-1.5">
                                    <button
                                      onClick={() => handleReportVote(selectedAccess.id, report.id, 1)}
                                      className="p-1 rounded bg-gray-105 hover:bg-gray-200 text-emerald-600"
                                      title="Votar a favor"
                                    >
                                      <ThumbsUp size={11} />
                                    </button>
                                    <button
                                      onClick={() => handleReportVote(selectedAccess.id, report.id, -1)}
                                      className="p-1 rounded bg-gray-105 hover:bg-gray-200 text-red-600"
                                      title="Reportar información incorrecta"
                                    >
                                      <ThumbsDown size={11} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="py-6 text-center text-gray-450 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-[10px]">
                              No hay anomalías reportadas para este acceso.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Beach Details View button and list of accesses */
                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-1 text-xs">
                      
                      <button
                        onClick={() => {
                          setBeachDetailOpen(true);
                          loadComments(selectedBeach.id);
                        }}
                        className="w-full py-3 bg-[#0871E7] hover:bg-[#0762cb] text-white rounded-xl font-bold text-xs transition-all shadow-sm flex items-center justify-center gap-2 mb-2"
                      >
                        <Info size={14} />
                        <span>Ver ficha de playa y comentarios</span>
                      </button>

                      {selectedBeach.images && selectedBeach.images.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto py-1">
                          {selectedBeach.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img}
                              onClick={() => setLightboxImage(img)}
                              className="w-14 h-14 object-cover rounded-lg border border-gray-250 cursor-pointer hover:opacity-90 flex-shrink-0"
                            />
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center border-b border-gray-150 pb-2">
                        <span className="font-bold text-gray-800">Coordenadas de la playa:</span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          [{selectedBeach.latitude.toFixed(4)}, {selectedBeach.longitude.toFixed(4)}]
                        </span>
                      </div>

                      {selectedBeach.user && (
                        <div className="flex justify-between items-center text-[10px] bg-gray-50 p-2 rounded-lg border border-gray-150">
                          <span className="text-gray-500 font-medium">Registrada por:</span>
                          <span className="font-bold text-gray-800 flex items-center gap-1">
                            {selectedBeach.user.username}
                            <span className="text-[#0871E7]">★ {selectedBeach.user.reputation}</span>
                          </span>
                        </div>
                      )}

                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">Accesos peatonales registrados</h4>
                        
                        {selectedBeach.accesses && selectedBeach.accesses.length > 0 ? (
                          <div className="space-y-2">
                            {selectedBeach.accesses.map((acc) => {
                              const isBlocked = acc.blockerType !== 'None';
                              return (
                                <div
                                  key={acc.id}
                                  onClick={() => setSelectedAccessId(acc.id)}
                                  className="p-3 border border-gray-200 rounded-xl hover:border-[#0871E7] cursor-pointer bg-white transition-all hover:shadow-sm flex justify-between items-center"
                                >
                                  <div>
                                    <h5 className="font-bold text-gray-800 text-[11.5px]">{acc.name}</h5>
                                    <span className="text-[9px] text-gray-400 font-mono mt-0.5 block">
                                      [{acc.latitude.toFixed(4)}, {acc.longitude.toFixed(4)}]
                                    </span>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase text-white ${
                                    isBlocked ? 'bg-red-500' : 'bg-emerald-500'
                                  }`}>
                                    {isBlocked ? 'Bloqueado' : 'Libre'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="py-8 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-250 rounded-xl text-[10px] space-y-2">
                            <p>No hay accesos peatonales registrados para esta playa pública.</p>
                            <button
                              onClick={() => {
                                setNewAccessBeachId(selectedBeach.id);
                                setIsNewAccessOpen(true);
                              }}
                              className="px-3 py-1.5 bg-gray-905 text-white rounded-lg font-bold text-[9.5px]"
                            >
                              Registrar acceso
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                </div>
              ) : (
                /* Playas registradas list */
                <div className="flex-1 flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-5 max-h-[600px] overflow-y-auto">
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 text-sm">Playas registradas</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5">Selecciona una playa para consultar sus accesos</p>
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                    {filteredBeaches.length > 0 ? (
                      filteredBeaches.map((beach) => {
                        const totalAccesses = beach.accesses.length;
                        const blockedAccesses = beach.accesses.filter(a => a.blockerType !== 'None').length;
                        const hasConflict = blockedAccesses > 0;

                        return (
                          <div
                            key={beach.id}
                            onClick={() => {
                              setSelectedBeachId(beach.id);
                              setSelectedAccessId(null);
                              setMapCenter([beach.latitude, beach.longitude]);
                              setMapZoom(15);
                              setBeachDetailOpen(true);
                              setVisibleImagesLimit(4);
                              loadComments(beach.id);
                            }}
                            className="p-3 border border-gray-150 rounded-xl hover:border-[#0871E7] cursor-pointer bg-white transition-all hover:shadow-sm flex items-center justify-between"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-[9px] text-[#0871E7] uppercase font-bold tracking-wide">{beach.state}</span>
                              <h4 className="font-bold text-gray-905 text-[12.5px] leading-tight">{beach.name}</h4>
                              <span className="text-[9.5px] text-gray-500 mt-1">
                                {totalAccesses} {totalAccesses === 1 ? 'acceso público' : 'accesos públicos'}
                              </span>
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-bold uppercase text-white ${
                              hasConflict ? 'bg-red-500' : 'bg-emerald-500'
                            }`}>
                              {hasConflict ? 'Con conflicto' : 'Libre'}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-gray-400 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-xs">
                        No hay playas registradas que coincidan con la búsqueda.
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Map pane */}
            <div className={`flex-1 relative flex flex-col rounded-2xl bg-[#151c14] border border-gray-200 overflow-hidden shadow ${
              mobileSection === 'list' ? 'hidden lg:flex' : 'flex'
            }`} style={{ minHeight: '500px' }}>
              
              {/* Toggle layer */}
              <div className="absolute top-4 left-4 z-[1000] flex flex-col gap-2">
                <div className="p-1 flex gap-1 rounded-xl bg-gray-950/85 backdrop-blur-sm border border-gray-800 shadow">
                  <button
                    onClick={() => setMapLayer('satellite')}
                    className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                      mapLayer === 'satellite' ? 'bg-[#F26522] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Satélite
                  </button>
                  <button
                    onClick={() => setMapLayer('streets')}
                    className={`px-3 py-1 rounded-lg text-[9px] font-bold uppercase transition-all ${
                      mapLayer === 'streets' ? 'bg-[#F26522] text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Mapa
                  </button>
                </div>

                {drawMode && (
                  <div className="p-2 flex flex-col gap-2 rounded-xl bg-gray-950/90 backdrop-blur-sm border border-emerald-600/50 shadow max-w-[200px] text-[10px] text-white">
                    <span className="font-semibold text-emerald-400">
                      {drawMode === 'beach' && 'Dibujando límites de playa:'}
                      {drawMode === 'access_pin' && 'Fijando entrada del acceso:'}
                      {drawMode === 'trail' && 'Dibujando sendero a pie:'}
                    </span>
                    <p className="text-[8.5px] text-gray-400">
                      {drawMode === 'beach' && 'Haz clic en el mapa para delinear el polígono territorial.'}
                      {drawMode === 'access_pin' && 'Haz clic en la entrada o reja del acceso.'}
                      {drawMode === 'trail' && 'Haz clic en el mapa para trazar el sendero de entrada.'}
                    </p>
                    {drawMode === 'beach' && (
                      <div className="flex gap-1.5 items-center justify-between mt-1">
                        <span className="text-gray-500">{drawingPoints.length} vértices</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setDrawMode(null);
                              setIsNewBeachOpen(true);
                              setIsFormMinimized(false);
                            }}
                            className="px-2 py-1 bg-emerald-600 text-white rounded text-[8.5px] font-bold uppercase"
                          >
                            Listo
                          </button>
                          <button
                            onClick={() => setDrawingPoints([])}
                            className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-[8.5px] font-bold uppercase"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                    )}
                    {drawMode === 'trail' && (
                      <div className="flex gap-1.5 items-center justify-between mt-1">
                        <span className="text-gray-500">{trailDrawingPoints.length} puntos</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              setDrawMode(null);
                              setIsNewAccessOpen(true);
                              setIsFormMinimized(false);
                            }}
                            className="px-2 py-1 bg-[#319AFF] text-white rounded text-[8.5px] font-bold uppercase"
                          >
                            Listo
                          </button>
                          <button
                            onClick={() => setTrailDrawingPoints([])}
                            className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-[8.5px] font-bold uppercase"
                          >
                            Limpiar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MapContainer */}
              <div className="flex-1 w-full h-full relative z-10">
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  zoomControl={false}
                  className="w-full h-full"
                >
                  <ChangeMapView center={mapCenter} zoom={mapZoom} />
                  
                  {mapLayer === 'streets' ? (
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                  ) : (
                    <TileLayer
                      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                  )}

                  <ZoomControl position="topright" />
                  <MapEvents onMapClick={handleMapClick} />

                  {/* Polygons */}
                  {beaches.map((b) => {
                    if (!b.boundaryPolygon || b.boundaryPolygon.length < 3) return null;
                    const isSelected = b.id === selectedBeachId;
                    const isBlocked = b.accesses.some(a => a.blockerType !== 'None');

                    return (
                      <Polygon
                        key={`poly-${b.id}`}
                        positions={b.boundaryPolygon}
                        pathOptions={{
                          color: isSelected ? '#F26522' : isBlocked ? '#ef4444' : '#10b981',
                          fillColor: isSelected ? '#F26522' : isBlocked ? '#ef4444' : '#10b981',
                          fillOpacity: isSelected ? 0.35 : 0.15,
                          weight: isSelected ? 3 : 1.5
                        }}
                        eventHandlers={{
                          click: () => {
                            setSelectedBeachId(b.id);
                            setSelectedAccessId(null);
                            setBeachDetailOpen(true);
                            setVisibleImagesLimit(4);
                            loadComments(b.id);
                          }
                        }}
                      />
                    );
                  })}

                  {/* Access Markers */}
                  {beaches.map((b) =>
                    b.accesses.map((acc) => {
                      const isBlocked = acc.blockerType !== 'None';
                      const isSelected = acc.id === selectedAccessId;

                      return (
                        <Marker
                          key={`marker-${acc.id}`}
                          position={[acc.latitude, acc.longitude]}
                          icon={createAccessIcon(isBlocked, isSelected)}
                          eventHandlers={{
                            click: () => {
                              setSelectedBeachId(b.id);
                              setSelectedAccessId(acc.id);
                            }
                          }}
                        >
                          <Popup>
                            <div className="text-gray-900 font-sans p-1 leading-normal text-xs">
                              <h4 className="font-bold text-gray-950 leading-tight">{acc.name}</h4>
                              <p className="text-[10px] text-gray-500 font-medium">Playa: {b.name}</p>
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase mt-1 inline-block text-white ${
                                isBlocked ? 'bg-red-500' : 'bg-emerald-500'
                              }`}>
                                {isBlocked ? 'Bloqueado' : 'Acceso libre'}
                              </span>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })
                  )}

                  {/* Selected access path */}
                  {selectedAccess && selectedAccess.trailGeometry && selectedAccess.trailGeometry.length > 0 && (
                    <Polyline
                      positions={selectedAccess.trailGeometry}
                      pathOptions={{
                        color: '#319AFF',
                        weight: 4,
                        dashArray: '5, 10',
                        lineCap: 'round',
                        lineJoin: 'round'
                      }}
                    />
                  )}

                  {/* Draw polygon points */}
                  {drawMode === 'beach' && drawingPoints.length > 0 && (
                    <>
                      {drawingPoints.map((pt, idx) => (
                        <Marker
                          key={`draw-vertex-${idx}`}
                          position={pt}
                          icon={L.divIcon({
                            className: 'w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm',
                            iconSize: [10, 10]
                          })}
                        />
                      ))}
                      {drawingPoints.length > 1 && (
                        <Polygon
                          positions={drawingPoints}
                          pathOptions={{
                            color: '#10b981',
                            fillColor: '#10b981',
                            fillOpacity: 0.2,
                            dashArray: '5, 5'
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* Draw trail path */}
                  {drawMode === 'trail' && trailDrawingPoints.length > 0 && (
                    <>
                      {trailDrawingPoints.map((pt, idx) => (
                        <Marker
                          key={`draw-trail-vertex-${idx}`}
                          position={pt}
                          icon={L.divIcon({
                            className: 'w-2 h-2 rounded-full bg-blue-500 border border-white shadow-sm',
                            iconSize: [8, 8]
                          })}
                        />
                      ))}
                      {trailDrawingPoints.length > 1 && (
                        <Polyline
                          positions={trailDrawingPoints}
                          pathOptions={{
                            color: '#319AFF',
                            weight: 3,
                            dashArray: '5, 5'
                          }}
                        />
                      )}
                    </>
                  )}

                  {/* Access pin target */}
                  {placedPinCoordinates && (
                    <Marker
                      position={placedPinCoordinates}
                      icon={L.divIcon({
                        className: 'w-6 h-6 flex items-center justify-center',
                        html: `<div class="w-4 h-4 bg-orange-500 border-2 border-white rounded-full animate-bounce shadow"></div>`,
                        iconSize: [24, 24]
                      })}
                    />
                  )}

                </MapContainer>
              </div>

              <div className="absolute bottom-4 right-4 z-[1000] font-mono text-[8.5px] text-gray-400 bg-gray-950/85 px-2.5 py-1.5 rounded-lg border border-gray-850">
                <span>OpenStreetMap Live Engine</span>
              </div>
            </div>

          </div>

          {/* Form minimized drawing toast */}
          {isFormMinimized && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-gray-900 border border-emerald-500/50 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-6 text-xs max-w-lg w-[90%] select-none">
              <div className="flex-1 text-left">
                <span className="font-bold text-emerald-400 block">Modo interactivo activo</span>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  {drawMode === 'beach' && 'Haz clic en el mapa para delimitar la playa. Presiona "Listo" cuando termines.'}
                  {drawMode === 'access_pin' && 'Haz clic en el punto de entrada o portón del acceso.'}
                  {drawMode === 'trail' && 'Haz clic para ir trazando el sendero peatonal en el mapa.'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsFormMinimized(false);
                  if (drawMode === 'beach') setIsNewBeachOpen(true);
                  else setIsNewAccessOpen(true);
                  setDrawMode(null);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-bold uppercase text-[9.5px] transition-all text-white shadow"
              >
                Volver
              </button>
            </div>
          )}

        </div>
      </section>

      {/* SECTION 4: CONSTITUTION / HELP */}
      <section className="bg-white py-16 sm:py-20 lg:py-24 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 text-xs text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide uppercase select-none mb-3">
            <Info size={14} className="text-gray-400" />
            <span>Marco legal</span>
          </div>
          <h3 className="text-xl font-bold text-gray-955 tracking-tight leading-none mb-4 font-fustat">
            Artículo 127 de la Ley General de Bienes Nacionales
          </h3>
          <p className="text-gray-655 leading-relaxed font-normal">
            En México, la ley federal decreta expresamente que el acceso a las playas marítimas y la zona federal marítimo terrestre contigua a ellas es público y libre. No existen playas privadas. Los propietarios de terrenos colindantes tienen la obligación jurídica de permitir libre tránsito a pie a través de los accesos públicos ya declarados o de los senderos tradicionales de servidumbre de paso. Cualquier cobro forzado por transitar, reja soldada, cercado electrificado o agresión física por cruzar representa una violación legal susceptible de ser reportada y sancionada administrativamente por las autoridades federales.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white/50 py-12 border-t border-gray-800 select-none">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
              <span className="text-[8.5px] font-bold text-white/80">PL</span>
            </div>
            <span className="text-xs text-white/80 font-semibold tracking-tight">PlayaLibre Beta</span>
          </div>
          <p className="text-xs">
            © 2026 PlayaLibre. Ley General de Bienes Nacionales. Libre tránsito costero.
          </p>
        </div>
      </footer>

      {/* MODAL: ADD NEW BEACH */}
      {isNewBeachOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
              <div className="text-left">
                <h3 className="text-base font-bold text-gray-905">Registrar playa</h3>
                <p className="text-[9.5px] text-gray-500 mt-0.5">Define los límites y demarca el territorio de la playa pública</p>
              </div>
              <button
                onClick={() => setIsNewBeachOpen(false)}
                className="p-1.5 rounded-lg bg-gray-200/60 text-gray-500 hover:text-gray-900"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submitNewBeach} className="space-y-4 text-xs text-left">
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Nombre oficial de la playa *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Playa Carrizalillo"
                  value={newBeachName}
                  onChange={(e) => setNewBeachName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Estado</label>
                  <select
                    value={newBeachState}
                    onChange={(e) => {
                      const stateName = e.target.value;
                      setNewBeachState(stateName);
                      const coords = STATE_COASTAL_COORDINATES[stateName];
                      if (coords) {
                        setMapCenter(coords);
                        setMapZoom(11);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 outline-none cursor-pointer"
                  >
                    {MEXICAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewBeachOpen(false);
                      setIsFormMinimized(true);
                      setDrawMode('beach');
                      setDrawingPoints([]);
                      const el = document.getElementById('explorer-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 bg-gray-200 hover:bg-gray-300/80 border border-gray-350 text-gray-800 rounded-xl text-center font-bold"
                  >
                    Delinear límites
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Fotos de la playa</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleBeachImagesUpload}
                  className="w-full text-[10px] text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
                />
                {newBeachImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newBeachImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-300">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewBeachImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {drawingPoints.length > 0 && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[10.5px]">
                  <span>Polígono delimitado exitosamente en el mapa: <strong>{drawingPoints.length} vértices</strong> registrados.</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-105 rounded-xl font-semibold text-white transition-all shadow"
              >
                Guardar playa registrada
              </button>

            </form>
          </div>
        </div>
      )}

      {/* MODAL: REGISTER ACCESS */}
      {isNewAccessOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
              <div className="text-left">
                <h3 className="text-base font-bold text-gray-905">Registrar acceso público</h3>
                <p className="text-[9.5px] text-gray-500 mt-0.5">Agrega un sendero de entrada, servicios y reportes de cobros</p>
              </div>
              <button
                onClick={() => setIsNewAccessOpen(false)}
                className="p-1.5 rounded-lg bg-gray-200/60 text-gray-500 hover:text-gray-900"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submitNewAccess} className="space-y-4 text-xs text-left">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Nombre del acceso *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Entrada Rinconada"
                    value={newAccessName}
                    onChange={(e) => setNewAccessName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Vincular a playa pública</label>
                  <select
                    value={newAccessBeachId}
                    onChange={(e) => {
                      const bId = e.target.value;
                      setNewAccessBeachId(bId);
                      const beach = beaches.find(b => b.id === bId);
                      if (beach) {
                        setMapCenter([beach.latitude, beach.longitude]);
                        setMapZoom(15);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 outline-none cursor-pointer font-medium"
                  >
                    <option value="">Selecciona playa...</option>
                    {beaches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.state})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsNewAccessOpen(false);
                    setIsFormMinimized(true);
                    setDrawMode('access_pin');
                    const el = document.getElementById('explorer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-2.5 bg-gray-200 hover:bg-gray-300/80 border border-gray-350 text-gray-800 rounded-xl text-center font-bold"
                >
                  Fijar entrada en mapa
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsNewAccessOpen(false);
                    setIsFormMinimized(true);
                    setDrawMode('trail');
                    setTrailDrawingPoints([]);
                    const el = document.getElementById('explorer-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="py-2.5 bg-gray-200 hover:bg-gray-300/80 border border-gray-350 text-gray-800 rounded-xl text-center font-bold"
                >
                  Trazar sendero a pie
                </button>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Fotos de obstrucción / acceso</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleAccessImagesUpload}
                  className="w-full text-[10px] text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300 cursor-pointer"
                />
                {newAccessImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {newAccessImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-300">
                        <img src={img} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setNewAccessImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {placedPinCoordinates && nearestBeach && (
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-[10.5px] leading-relaxed">
                  {nearestBeach.distance < 3.0 ? (
                    <span>Playa vinculada automáticamente: <strong>{nearestBeach.beach.name}</strong> a una distancia estimada de <strong>{(nearestBeach.distance * 1000).toFixed(0)} metros</strong> de la entrada marcada.</span>
                  ) : (
                    <span className="text-amber-800">
                      <strong>Advertencia:</strong> La playa más cercana está a <strong>{nearestBeach.distance.toFixed(1)} km</strong> de este acceso. Te recomendamos crear una playa colindante antes.
                    </span>
                  )}
                </div>
              )}

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1.5">Servicios de acceso y a11y</label>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 p-3 rounded-xl bg-gray-205/50 border border-gray-300/40 text-gray-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAccessAmenities.parking}
                      onChange={(e) => setNewAccessAmenities({ ...newAccessAmenities, parking: e.target.checked })}
                      className="accent-[#0871E7]"
                    />
                    <span>Estacionamiento público</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAccessAmenities.security}
                      onChange={(e) => setNewAccessAmenities({ ...newAccessAmenities, security: e.target.checked })}
                      className="accent-[#0871E7]"
                    />
                    <span>Seguridad / salvavidas</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAccessAmenities.showers}
                      onChange={(e) => setNewAccessAmenities({ ...newAccessAmenities, showers: e.target.checked })}
                      className="accent-[#0871E7]"
                    />
                    <span>Baños / regaderas</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAccessAmenities.pets}
                      onChange={(e) => setNewAccessAmenities({ ...newAccessAmenities, pets: e.target.checked })}
                      className="accent-[#0871E7]"
                    />
                    <span>Admite mascotas</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAccessAccessibility.ramps}
                      onChange={(e) => setNewAccessAccessibility({ ...newAccessAccessibility, ramps: e.target.checked })}
                      className="accent-[#0871E7]"
                    />
                    <span>Rampa de acceso</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newAccessAccessibility.wheelchair}
                      onChange={(e) => setNewAccessAccessibility({ ...newAccessAccessibility, wheelchair: e.target.checked })}
                      className="accent-[#0871E7]"
                    />
                    <span>Silla de ruedas</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Estado de obstrucción de acceso</label>
                <select
                  value={newAccessBlocker}
                  onChange={(e) => setNewAccessBlocker(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-800 outline-none cursor-pointer font-medium"
                >
                  <option value="None">Abierto - Libre tránsito peatonal</option>
                  <option value="Hotel">Obstruido por hotel comercial</option>
                  <option value="Condo">Obstruido por condominios residenciales</option>
                  <option value="Restaurant">Obstruido por restaurante / comercio</option>
                  <option value="Beach Club">Obstruido por club de playa privado</option>
                  <option value="Private Property">Cercado de propiedad privada</option>
                  <option value="Insecurity">Inseguridad / violencia en la zona</option>
                  <option value="Other">Otro bloqueo o reja soldada</option>
                </select>
              </div>

              {newAccessBlocker !== 'None' && (
                <div className="space-y-3 p-3.5 rounded-xl bg-red-50 border border-red-200/60 transition-all duration-300">
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-red-705 mb-1">Nombre de entidad responsable *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Beach Club Coral"
                      value={newAccessBlockerName}
                      onChange={(e) => setNewAccessBlockerName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-905 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold uppercase text-red-705 mb-1">Detallar obstrucción *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Ej. Obstruyen la servidumbre de paso argumentando que es propiedad del club..."
                      value={newAccessBlockerDesc}
                      onChange={(e) => setNewAccessBlockerDesc(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-905 outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1.5 cursor-pointer text-gray-750">
                      <input
                        type="checkbox"
                        checked={newAccessIllegalFee}
                        onChange={(e) => setNewAccessIllegalFee(e.target.checked)}
                        className="accent-red-600"
                      />
                      <span>¿Exigen cobro ilegal para cruzar?</span>
                    </label>
                    {newAccessIllegalFee && (
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-gray-400 font-bold">$</span>
                        <input
                          type="number"
                          required
                          placeholder="Monto MXN"
                          value={newAccessFeeAmount}
                          onChange={(e) => setNewAccessFeeAmount(e.target.value)}
                          className="w-24 px-2 py-1 rounded bg-white border border-gray-300 text-gray-905 font-mono text-center outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0871E7] hover:brightness-105 rounded-xl font-semibold text-white transition-all shadow"
              >
                Guardar acceso público registrado
              </button>
            </form>

          </div>
        </div>
      )}

      {/* MODAL: REPORT BLOCKER */}
      {isReportOpen && selectedAccess && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 text-left">
            
            <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-955">Reportar privatización o anomalía</h3>
                <p className="text-[9.5px] text-gray-500 mt-0.5">Acceso: {selectedAccess.name}</p>
              </div>
              <button
                onClick={() => setIsReportOpen(false)}
                className="p-1.5 rounded-lg bg-gray-200/60 text-gray-500 hover:text-gray-900"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={submitIncidentReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Entidad responsable de la obstrucción *</label>
                <select
                  value={reportBlockerType}
                  onChange={(e) => setReportBlockerType(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-800 outline-none cursor-pointer"
                >
                  <option value="Hotel">Hotel comercial</option>
                  <option value="Condo">Condominios residenciales</option>
                  <option value="Restaurant">Restaurante / local comercial</option>
                  <option value="Beach Club">Club de playa privado</option>
                  <option value="Private Property">Cercado de propiedad privada</option>
                  <option value="Insecurity">Inseguridad / violencia en la zona</option>
                  <option value="Other">Otro tipo de bloqueo peatonal o rejas</option>
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Nombre de la entidad responsable *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Condominio Las Brisas"
                  value={reportBlockerName}
                  onChange={(e) => setReportBlockerName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Tu nombre (opcional)</label>
                <input
                  type="text"
                  placeholder="Dejar vacío para enviar anónimamente"
                  value={reportReporterName}
                  onChange={(e) => setReportReporterName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Detalles del incidente *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe qué obstrucción encontraste: portones cerrados, guardias privados, cobros de peaje..."
                  value={reportDescription}
                  onChange={(e) => setReportDescription(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
                <label className="flex items-center gap-1.5 cursor-pointer text-gray-750">
                  <input
                    type="checkbox"
                    checked={reportHasFee}
                    onChange={(e) => setReportHasFee(e.target.checked)}
                    className="accent-red-600"
                  />
                  <span>¿Exigen cobro obligatorio para cruzar?</span>
                </label>
                {reportHasFee && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      placeholder="MXN"
                      value={reportFeeAmount}
                      onChange={(e) => setReportFeeAmount(e.target.value)}
                      className="w-20 px-2 py-1 rounded bg-white border border-gray-300 text-gray-905 text-center font-mono outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-white shadow transition-all border border-red-500/20"
              >
                Enviar denuncia a PlayaLibre
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AUTH PROMPT */}
      {isAuthPromptOpen && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-5">
              <div>
                <h3 className="text-base font-bold text-gray-900">Registro requerido</h3>
                <p className="text-[9.5px] text-gray-500 mt-0.5">Únete a la comunidad colaborativa de PlayaLibre</p>
              </div>
              <button
                onClick={() => {
                  setIsAuthPromptOpen(false);
                  setPendingAuthAction(null);
                  setIsEmailAuthOpen(false);
                  setEmailAuthEmail('');
                  setEmailAuthPassword('');
                }}
                className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {isEmailAuthOpen ? (
              <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
                  <span className="font-bold text-gray-700">
                    {emailAuthMode === 'login' ? 'Iniciar sesión con correo' : 'Crear cuenta con correo'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmailAuthMode(emailAuthMode === 'login' ? 'signup' : 'login');
                    }}
                    className="text-[#0871E7] font-semibold hover:underline"
                  >
                    {emailAuthMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                  </button>
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Correo electrónico</label>
                  <input
                    type="email"
                    required
                    placeholder="correo@ejemplo.com"
                    value={emailAuthEmail}
                    onChange={(e) => setEmailAuthEmail(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 outline-none font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Contraseña</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={emailAuthPassword}
                    onChange={(e) => setEmailAuthPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 outline-none font-mono"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEmailAuthOpen(false)}
                    className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all text-center"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#0871E7] hover:bg-[#065ec2] text-white rounded-xl font-semibold transition-all text-center shadow"
                  >
                    {emailAuthMode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-[#0871E7]/5 border border-[#0871E7]/25 p-4 rounded-2xl text-gray-700 leading-relaxed">
                  <p>
                    Para registrar una nueva playa o acceso público, necesitamos validar tu cuenta. Esto nos ayuda a:
                  </p>
                  <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-600 font-medium">
                    <li>Evitar registros falsos o duplicados en el mapa.</li>
                    <li>Construir tu reputación como colaborador confiable.</li>
                    <li>Permitirte gestionar y actualizar la información de las playas que registres.</li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleLogin}
                    type="button"
                    className="w-full py-3 bg-[#0871E7] hover:bg-[#065ec2] active:scale-[0.99] rounded-xl font-semibold text-white transition-all shadow flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 5.923 1 12.24s4.923 11.24 11.24 11.24c6.59 0 11.01-4.636 11.01-11.24 0-.756-.08-1.333-.18-1.955H12.24z"/>
                    </svg>
                    <span>Continuar con Google</span>
                  </button>
                </div>

                <div className="pt-4 text-center border-t border-gray-250 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEmailAuthOpen(true);
                      setEmailAuthMode('login');
                    }}
                    className="text-[#0871E7] font-semibold hover:underline"
                  >
                    O registrarse/iniciar sesión con correo y contraseña
                  </button>
                  <p className="text-[9.5px] text-gray-500 leading-normal">
                    Al registrarte, aceptas nuestros términos de servicio y políticas de privacidad.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* MODAL: EMAIL VERIFICATION PENDING */}
      {isEmailVerificationPending && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-6 text-left space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-gray-250">
              <Info className="text-[#0871E7]" size={20} />
              <div>
                <h3 className="text-base font-bold text-gray-900">Verifica tu correo electrónico</h3>
                <p className="text-[9.5px] text-gray-500 mt-0.5">Requerido para activar tu cuenta colaborativa</p>
              </div>
            </div>

            <div className="text-xs text-gray-700 leading-relaxed space-y-3">
              <p>
                Hemos enviado un enlace de verificación a la dirección de correo:
              </p>
              <div className="p-3 bg-gray-200/60 border border-gray-350 rounded-xl text-center font-semibold text-gray-900">
                {currentUser?.email || emailAuthEmail}
              </div>
              <p>
                Sigue las instrucciones del enlace recibido en tu bandeja de entrada (revisa también tu carpeta de spam o correo no deseado) para verificar tu identidad. Una vez completado, pulsa el botón de abajo.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={async () => {
                  if (authInstance?.currentUser) {
                    await authInstance.currentUser.reload();
                    if (authInstance.currentUser.emailVerified) {
                      showToast('Correo verificado exitosamente.', 'success');
                      await handleSuccessfulVerification();
                    } else {
                      showToast('El correo aún no ha sido verificado. Por favor, haz clic en el enlace que te enviamos.', 'warn');
                    }
                  }
                }}
                className="w-full py-3 bg-[#0871E7] hover:bg-[#065ec2] active:scale-[0.99] text-white rounded-xl font-semibold transition-all text-center shadow"
              >
                Ya verifiqué mi correo
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    if (authInstance?.currentUser) {
                      try {
                        await sendEmailVerification(authInstance.currentUser);
                        showToast('Correo de verificación reenviado.', 'success');
                      } catch (err) {
                        console.error('Error resending email:', err);
                        showToast('No se pudo reenviar el correo. Inténtalo más tarde.', 'warn');
                      }
                    }
                  }}
                  className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all text-center text-[10px]"
                >
                  Reenviar correo
                </button>

                <button
                  type="button"
                  onClick={async () => {
                    if (authInstance) {
                      await signOut(authInstance);
                    }
                    setIsEmailVerificationPending(false);
                  }}
                  className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-all text-center text-[10px]"
                >
                  Cancelar / Salir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PROFILE SETUP */}
      {isProfileSetupOpen && (
        <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-6 text-left">
            <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-900">Crear perfil de usuario</h3>
                <p className="text-[9.5px] text-gray-500 mt-0.5">Elige un apodo y avatar para mantener tu privacidad</p>
              </div>
            </div>

            <form onSubmit={submitProfileSetup} className="space-y-5 text-xs">
              <div>
                <label className="block text-[9.5px] font-bold uppercase text-gray-600 mb-1">Nombre de usuario</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. GuardiánDeLaCosta"
                  value={profileSetupUsername}
                  onChange={(e) => setProfileSetupUsername(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 outline-none"
                />
                <p className="text-[10px] text-gray-500 mt-1.5 select-none leading-normal">
                  Para garantizar la unicidad de tu cuenta, se le anexará automáticamente una etiqueta numérica derivada del tiempo de registro (ej. <strong>{profileSetupUsername.trim() || 'GuardiánDeLaCosta'}_{Date.now().toString().slice(-4)}</strong>).
                </p>
              </div>

              <div>
                <label className="block text-[9.5px] font-bold uppercase text-gray-600 mb-2">Elige tu avatar</label>
                <div className="grid grid-cols-4 gap-3 bg-gray-200/50 p-4 rounded-2xl border border-gray-300/40">
                  {AVATAR_PRESETS.map((preset) => {
                    const presetVal = `preset:${preset.emoji}:${preset.bg}`;
                    const isSelected = profileSetupAvatarUrl === presetVal;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setProfileSetupAvatarUrl(presetVal)}
                        className={`w-12 h-12 rounded-full bg-gradient-to-br ${preset.bg} flex items-center justify-center text-2xl transition-all duration-200 relative ${
                          isSelected ? 'scale-110 shadow-lg ring-4 ring-[#0871E7] ring-offset-2 ring-offset-[#EFEFEF]' : 'opacity-70 hover:opacity-100 hover:scale-105'
                        }`}
                        title={preset.label}
                      >
                        <span>{preset.emoji}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#0871E7] hover:brightness-105 rounded-xl font-semibold text-white transition-all shadow"
              >
                Guardar perfil
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: BEACH DETAILS */}
      {beachDetailOpen && selectedBeach && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="relative w-full max-w-5xl h-[90vh] bg-[#EFEFEF] border border-gray-300 rounded-[28px] overflow-hidden shadow-2xl flex flex-col p-6 sm:p-8 text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-250 mb-6">
              <div>
                <span className="text-[10px] font-bold text-[#0871E7] uppercase tracking-widest">{selectedBeach.state}</span>
                <h3 className="text-2xl font-bold text-gray-900 font-fustat leading-none mt-1">{selectedBeach.name}</h3>
              </div>
              <button
                onClick={() => setBeachDetailOpen(false)}
                className="p-2 rounded-xl bg-gray-200 hover:bg-gray-300/80 text-gray-500 hover:text-gray-900 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-y-auto pr-1 flex-1 text-xs">
              
              {/* Left Column */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* Local Zoom Map */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Ubicación y accesos en el mapa</h4>
                  <div className="w-full h-72 rounded-2xl border border-gray-300 overflow-hidden shadow-sm bg-[#151c14] relative z-10">
                    <MapContainer
                      key={`detail-map-${selectedBeach.id}`}
                      center={[selectedBeach.latitude, selectedBeach.longitude]}
                      zoom={15}
                      zoomControl={false}
                      className="w-full h-full"
                    >
                      <TileLayer
                        attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                      />
                      <ZoomControl position="topright" />
                      
                      {selectedBeach.boundaryPolygon && selectedBeach.boundaryPolygon.length > 2 && (
                        <Polygon
                          positions={selectedBeach.boundaryPolygon}
                          pathOptions={{
                            color: '#F26522',
                            fillColor: '#F26522',
                            fillOpacity: 0.3,
                            weight: 3
                          }}
                        />
                      )}

                      {selectedBeach.accesses.map((acc) => {
                        const isBlocked = acc.blockerType !== 'None';
                        return (
                          <Marker
                            key={`detail-marker-${acc.id}`}
                            position={[acc.latitude, acc.longitude]}
                            icon={createAccessIcon(isBlocked, false)}
                          >
                            <Popup>
                              <div className="text-gray-900 font-sans p-1 text-[11px] leading-tight">
                                <h5 className="font-bold">{acc.name}</h5>
                                <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase mt-1 inline-block text-white ${
                                  isBlocked ? 'bg-red-500' : 'bg-emerald-500'
                                }`}>
                                  {isBlocked ? 'Bloqueado' : 'Acceso libre'}
                                </span>
                              </div>
                            </Popup>
                          </Marker>
                        );
                      })}
                    </MapContainer>
                  </div>
                </div>

                {/* Available Accesses List */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 font-fustat">Accesos públicos vinculados</h4>
                  {selectedBeach.accesses && selectedBeach.accesses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-1">
                      {selectedBeach.accesses.map((acc) => {
                        const isBlocked = acc.blockerType !== 'None';
                        return (
                          <div 
                            key={acc.id} 
                            onClick={() => {
                              setSelectedAccessId(acc.id);
                              setMapCenter([acc.latitude, acc.longitude]);
                            }}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                              isBlocked 
                                ? 'bg-red-50/40 border-red-200/60 hover:bg-red-50/70' 
                                : 'bg-emerald-50/30 border-emerald-200/50 hover:bg-emerald-50/50'
                            }`}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="font-bold text-gray-800 leading-tight block">{acc.name}</span>
                              <span className={`text-[8.5px] px-1.5 py-0.5 rounded font-bold uppercase text-white flex-shrink-0 ${
                                isBlocked ? 'bg-red-500' : 'bg-emerald-500'
                              }`}>
                                {isBlocked ? 'Bloqueado' : 'Abierto'}
                              </span>
                            </div>
                            {isBlocked && (
                              <p className="text-[9.5px] text-red-700/80 mt-1 leading-normal">
                                Obstrucción: <strong>{acc.blockerName}</strong> ({acc.blockerDescription})
                              </p>
                            )}
                            <div className="flex gap-2.5 mt-2 text-[10px] text-gray-500 font-medium">
                              <span>🅿️ {acc.parking ? 'Sí' : 'No'}</span>
                              <span>🚿 {acc.showers ? 'Sí' : 'No'}</span>
                              <span>♿ {acc.wheelchair ? 'Sí' : 'No'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-6 bg-white rounded-2xl border border-gray-200 border-dashed text-center text-gray-400">
                      No hay accesos públicos registrados para esta playa.
                    </div>
                  )}
                </div>

                {/* Photo Gallery */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 font-fustat">Galería de fotos</h4>
                  {(() => {
                    const allPhotos = [
                      ...(selectedBeach.images || []),
                      ...selectedBeach.accesses.flatMap(a => a.images || [])
                    ];

                    if (allPhotos.length === 0) {
                      return (
                        <div className="py-8 bg-white rounded-2xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-center text-gray-400 gap-2">
                          <Camera size={24} className="text-gray-300" />
                          <span>No hay fotos aún de esta playa.</span>
                        </div>
                      );
                    }

                    const visiblePhotos = allPhotos.slice(0, visibleImagesLimit);

                    return (
                      <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-3">
                        <div className="grid grid-cols-4 gap-3">
                          {visiblePhotos.map((photo, idx) => (
                            <div
                              key={idx}
                              onClick={() => setLightboxImage(photo)}
                              className="aspect-square rounded-xl overflow-hidden border border-gray-300 shadow-sm cursor-pointer hover:opacity-90 hover:scale-102 transition-all animate-fade-in"
                            >
                              <img src={photo} className="w-full h-full object-cover" alt="Playa" />
                            </div>
                          ))}
                        </div>
                        {allPhotos.length > visibleImagesLimit && (
                          <button
                            type="button"
                            onClick={() => setVisibleImagesLimit(prev => prev + 4)}
                            className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-center transition-colors text-[10.5px]"
                          >
                            Cargar más fotos ({allPhotos.length - visibleImagesLimit} restantes)
                          </button>
                        )}
                      </div>
                    );
                  })()}
                </div>

              </div>

              {/* Right Column */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                
                {/* Timeline Chart */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-1">Reportes históricos por categoría</h4>
                  <p className="text-[10px] text-gray-400 mb-4">Número acumulado de reportes en los últimos meses</p>
                  
                  <div className="h-40 w-full font-mono text-[9px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={computeTimelineData(selectedBeach)}
                        margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorInsec" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorBlock" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorOther" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="month" style={{ fontSize: '9px' }} />
                        <YAxis style={{ fontSize: '9px' }} allowDecimals={false} />
                        <Tooltip contentStyle={{ fontSize: '10px', borderRadius: '12px' }} />
                        <Legend wrapperStyle={{ fontSize: '9px', paddingTop: '10px' }} />
                        <Area type="monotone" name="Cobros" dataKey="illegalFees" stroke="#f97316" fill="url(#colorFees)" strokeWidth={1.5} stackId="1" />
                        <Area type="monotone" name="Inseguridad" dataKey="insecurity" stroke="#ef4444" fill="url(#colorInsec)" strokeWidth={1.5} stackId="1" />
                        <Area type="monotone" name="Bloqueos" dataKey="blockages" stroke="#3b82f6" fill="url(#colorBlock)" strokeWidth={1.5} stackId="1" />
                        <Area type="monotone" name="Otros" dataKey="other" stroke="#9ca3af" fill="url(#colorOther)" strokeWidth={1.5} stackId="1" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col flex-1 min-h-[300px]">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-1.5 font-fustat">
                    <MessageSquare size={14} className="text-gray-400" />
                    <span>Comentarios y reseñas</span>
                  </h4>
                  
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-[220px] pr-1">
                    {selectedBeachComments.length > 0 ? (
                      selectedBeachComments.map((comment) => (
                        <div key={comment.id} className="p-3 bg-gray-50 border border-gray-150 rounded-2xl flex gap-3">
                          <UserAvatar avatarUrl={comment.user?.avatarUrl} username={comment.user?.username || 'Anónimo'} size="sm" />
                          <div className="flex-1 flex flex-col gap-0.5">
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-gray-800 text-[10px] flex items-center gap-1">
                                {comment.user?.username || 'Anónimo'}
                                <span className="px-1 py-0.2 bg-blue-50 text-[#0871E7] border border-blue-100 rounded text-[7.5px] font-bold">
                                  ★ {comment.user?.reputation ?? 10}
                                </span>
                              </span>
                              <span className="text-[8px] text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-650 leading-relaxed mt-0.5 text-left">{comment.text}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center text-gray-450 gap-2 py-8">
                        <MessageSquare size={24} className="text-gray-300" />
                        <span>No hay comentarios aún. ¡Escribe el primero!</span>
                      </div>
                    )}
                  </div>

                  {userProfile ? (
                    <form onSubmit={submitComment} className="flex gap-2">
                      <input
                        type="text"
                        required
                        placeholder="Escribe un comentario..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-405 outline-none focus:border-gray-400"
                      />
                      <button
                        type="submit"
                        className="px-4 bg-[#0871E7] hover:bg-[#0762cb] text-white rounded-xl flex items-center justify-center shadow-sm"
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  ) : (
                    <div className="p-3 bg-gray-150/40 rounded-xl border border-gray-200 text-center">
                      <span className="text-[10px] text-gray-505 block mb-2">Debes iniciar sesión para publicar comentarios</span>
                      <button
                        type="button"
                        onClick={handleLogin}
                        className="px-4 py-1.5 bg-[#0871E7] hover:bg-[#0762cb] text-white text-[10px] font-bold rounded-lg shadow-sm"
                      >
                        Iniciar sesión
                      </button>
                    </div>
                  )}

                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* MODAL: LIGHTBOX */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img src={lightboxImage} className="max-w-full max-h-full object-contain" alt="Ampliada" />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* MODAL: PROFILE SETUP */}
      {/* Toast notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[10000] max-w-sm rounded-xl p-3.5 shadow-xl border flex gap-2.5 items-center transition-opacity duration-300 bg-white border-gray-200 text-xs font-semibold text-gray-900 select-none">
          {toastMessage.type === 'success' && <Check className="text-emerald-500 flex-shrink-0" size={16} />}
          {toastMessage.type === 'warn' && <AlertTriangle className="text-amber-500 flex-shrink-0" size={16} />}
          {toastMessage.type === 'info' && <Info className="text-blue-500 flex-shrink-0" size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

    </div>
  );
}
