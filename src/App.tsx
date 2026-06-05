import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Plus,
  Check,
  WifiOff,
  Info,
  CheckCircle2,
  ArrowRight,
  User,
  LogOut,
  Award
} from 'lucide-react';

import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, ZoomControl } from 'react-leaflet';
import * as L from 'leaflet';

// Firebase SQL Connect Imports
import { dataConnectInstance, authInstance, googleProvider, isFirebaseConfigured } from './lib/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  linkWithCredential,
  GoogleAuthProvider,
  EmailAuthProvider,
  sendEmailVerification
} from 'firebase/auth';
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

// Shared Types
import type { UserProfile, Beach, Access, IncidentReport } from './types';

// Shared Constants
import {
  MEXICAN_STATES,
  STATE_COASTAL_COORDINATES,
  AVATAR_PRESETS,
  INITIAL_BEACHES
} from './constants';

// Utilities
import { calculateDistance } from './utils/geo';
import { hashSHA1 } from './utils/crypto';
import { mapDbBeachToFrontend } from './utils/mappers';

// Components
import { UserAvatar } from './components/common/UserAvatar';
import { MapEvents } from './components/map/MapEvents';
import { ChangeMapView } from './components/map/ChangeMapView';
import { SidebarPanel } from './components/panels/SidebarPanel';

// Modals
import { LightboxModal } from './components/modals/LightboxModal';
import { AuthPromptModal } from './components/modals/AuthPromptModal';
import { EmailVerificationPendingModal } from './components/modals/EmailVerificationPendingModal';
import { ProfileSetupModal } from './components/modals/ProfileSetupModal';
import { UserProfileViewModal } from './components/modals/UserProfileViewModal';
import { ReportBlockerModal } from './components/modals/ReportBlockerModal';
import { NewBeachModal } from './components/modals/NewBeachModal';
import { NewAccessModal } from './components/modals/NewAccessModal';
import { BeachDetailsModal } from './components/modals/BeachDetailsModal';

// Offline Sync
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
import type { OfflineReport, OfflineBeach, OfflineAccess } from './lib/offline-sync';

// Fix default marker icon assets in Vite compiled bundle
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function App() {
  const [mobileSection, setMobileSection] = useState<'list' | 'map'>('list');
  const [isMobile, setIsMobile] = useState(false);
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

  // Profile View States
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null);
  const [isProfileViewOpen, setIsProfileViewOpen] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editBioText, setEditBioText] = useState('');

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

  // Search query & filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBlocker, setFilterBlocker] = useState<string>('ALL');

  // Map configs
  const [mapLayer, setMapLayer] = useState<'satellite' | 'streets'>('satellite');
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.1619, -86.8515]);
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
      const parsed = JSON.parse(cached);
      setUserProfile(parsed);
      if (!isFirebaseConfigured || !authInstance) {
        // Mock currentUser for offline/mock testing
        setCurrentUser({
          uid: parsed.id,
          displayName: parsed.username,
          email: parsed.id.includes('curator') || parsed.username.includes('marpc331') ? 'marpc331@gmail.com' : 'colaborador@playalibre.org'
        });
      }
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
                reputation: res.data.user.reputation,
                bio: res.data.user.bio || undefined
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
            reputation: res.data.user.reputation,
            bio: res.data.user.bio || undefined
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

  // Assign curator mode role dynamically based on verified email
  useEffect(() => {
    if (currentUser && currentUser.email === 'marpc331@gmail.com') {
      setIsHighReputationUser(true);
    } else {
      setIsHighReputationUser(false);
    }
  }, [currentUser]);

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
      setCurrentUser({ uid: mockUid, displayName: 'Colaborador Google', email: 'marpc331@gmail.com' });
      setProfileSetupUsername('marpc331');
      setProfileSetupAvatarUrl(`preset:${AVATAR_PRESETS[0].emoji}:${AVATAR_PRESETS[0].bg}`);
      setIsProfileSetupOpen(true);
      setIsAuthPromptOpen(false);
    }
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAuthEmail.trim() || !emailAuthPassword.trim()) return;

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
      setCurrentUser({ uid: mockUid, displayName: emailAuthEmail.split('@')[0], email: emailAuthEmail.trim() });
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

  // Helper to map client-side mock ID to real database UUID if needed
  const resolveBeachId = (id: string): string => {
    if (id === '00000000-0000-0000-0000-000000000001') {
      const realBeach = beaches.find(b => b.name === 'Playa Carrizalillo');
      if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000001') return realBeach.id;
    } else if (id === '00000000-0000-0000-0000-000000000002') {
      const realBeach = beaches.find(b => b.name === 'Playa Delfines');
      if (realBeach && realBeach.id !== '00000000-0000-0000-0000-000000000002') return realBeach.id;
    }
    return id;
  };

  // Memoized stats calculation for the selected profile user
  const userStats = useMemo(() => {
    if (!selectedProfileId) return { beachesCount: 0, accessesCount: 0, photosCount: 0 };
    let beachesCount = 0;
    let accessesCount = 0;
    let photosCount = 0;

    beaches.forEach((b) => {
      const isBeachCreator = b.user?.id === selectedProfileId;
      if (isBeachCreator) {
        beachesCount++;
        if (Array.isArray(b.images)) {
          photosCount += b.images.length;
        }
      }
      if (b.accesses) {
        b.accesses.forEach((acc) => {
          const isAccessCreator = acc.user?.id === selectedProfileId;
          if (isAccessCreator) {
            accessesCount++;
            if (Array.isArray(acc.images)) {
              photosCount += acc.images.length;
            }
          }
        });
      }
    });

    return { beachesCount, accessesCount, photosCount };
  }, [beaches, selectedProfileId]);

  const viewUserProfile = async (userId: string) => {
    setSelectedProfileId(userId);
    setSelectedUserProfile(null);
    setIsProfileViewOpen(true);
    setIsEditingBio(false);
    setEditBioText('');

    // If it is the current logged-in user
    if (userProfile && userProfile.id === userId) {
      setSelectedUserProfile(userProfile);
      setEditBioText(userProfile.bio || '');
      // Fetch latest from DB to ensure bio/reputation is fresh if online
      if (isOnline && isFirebaseConfigured && dataConnectInstance) {
        try {
          const res = await getUser(dataConnectInstance, { id: userId });
          if (res.data?.user) {
            const freshProfile = {
              id: userId,
              username: res.data.user.username,
              avatarUrl: res.data.user.avatarUrl || undefined,
              reputation: res.data.user.reputation,
              bio: res.data.user.bio || undefined
            };
            setUserProfile(freshProfile);
            localStorage.setItem('playalibre_user_profile', JSON.stringify(freshProfile));
            setSelectedUserProfile(freshProfile);
            setEditBioText(res.data.user.bio || '');
          }
        } catch (e) {
          console.error("Error refreshing own profile:", e);
        }
      }
      return;
    }

    // Try to load user profile from database
    if (isOnline && isFirebaseConfigured && dataConnectInstance) {
      try {
        const res = await getUser(dataConnectInstance, { id: userId });
        if (res.data?.user) {
          setSelectedUserProfile({
            id: userId,
            username: res.data.user.username,
            avatarUrl: res.data.user.avatarUrl || undefined,
            reputation: res.data.user.reputation,
            bio: res.data.user.bio || undefined
          });
          return;
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    }

    // Fallback: look in offline storage
    try {
      const offlineProfile = await getOfflineUserProfile(userId);
      if (offlineProfile) {
        setSelectedUserProfile(offlineProfile);
        return;
      }
    } catch (err) {
      console.error('Error getting offline user profile:', err);
    }

    // Fallback: traverse existing data in memory
    let foundUser: any = null;
    for (const b of beaches) {
      if (b.user && b.user.id === userId) {
        foundUser = b.user;
        break;
      }
      if (b.accesses) {
        for (const acc of b.accesses) {
          if (acc.user && acc.user.id === userId) {
            foundUser = acc.user;
            break;
          }
          if (acc.incidentReports) {
            for (const r of acc.incidentReports) {
              if (r.user && r.user.id === userId) {
                foundUser = r.user;
                break;
              }
            }
          }
        }
      }
      if (foundUser) break;
    }

    if (!foundUser && selectedBeachComments) {
      const commentUser = selectedBeachComments.find(c => c.user?.id === userId)?.user;
      if (commentUser) foundUser = commentUser;
    }

    if (foundUser) {
      setSelectedUserProfile({
        id: userId,
        username: foundUser.username,
        avatarUrl: foundUser.avatarUrl || undefined,
        reputation: foundUser.reputation,
        bio: ''
      });
    } else {
      setSelectedUserProfile({
        id: userId,
        username: 'Colaborador PlayaLibre',
        avatarUrl: undefined,
        reputation: 10,
        bio: ''
      });
    }
  };

  const saveUserBio = async () => {
    if (!userProfile || !selectedProfileId || userProfile.id !== selectedProfileId) return;
    
    const updatedProfile = {
      ...userProfile,
      bio: editBioText.trim()
    };

    if (isOnline && isFirebaseConfigured && dataConnectInstance) {
      try {
        await upsertUser(dataConnectInstance, {
          id: userProfile.id,
          username: userProfile.username,
          avatarUrl: userProfile.avatarUrl || null,
          bio: updatedProfile.bio || null,
          reputation: userProfile.reputation
        });
        showToast('Descripción de perfil guardada exitosamente.', 'success');
      } catch (err) {
        console.error('Error saving user bio to database:', err);
        await saveOfflineUserProfile({ ...updatedProfile, timestamp: Date.now() });
        showToast('Error de red. Descripción guardada localmente.', 'warn');
      }
    } else {
      await saveOfflineUserProfile({ ...updatedProfile, timestamp: Date.now() });
      showToast('Descripción guardada localmente (modo offline).', 'success');
    }

    setUserProfile(updatedProfile);
    localStorage.setItem('playalibre_user_profile', JSON.stringify(updatedProfile));
    setSelectedUserProfile(updatedProfile);
    setIsEditingBio(false);
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

  // Image Upload Event Handlers with automatic WebP compression & scaling
  const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const webpDataUrl = canvas.toDataURL('image/webp', 0.75);
            setter(prev => [...prev, webpDataUrl]);
          } else {
            setter(prev => [...prev, event.target?.result as string]);
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBeachImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => handleImagesUpload(e, setNewBeachImages);
  const handleAccessImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => handleImagesUpload(e, setNewAccessImages);

  // Comments Loader
  const loadComments = async (beachId: string) => {
    if (isOnline && isFirebaseConfigured && dataConnectInstance) {
      try {
        const targetBeachId = resolveBeachId(beachId);
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
        const targetBeachId = resolveBeachId(selectedBeachId);

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

  // Live Real-Time database sync subscriptions
  useEffect(() => {
    if (!isFirebaseConfigured || !dataConnectInstance) {
      console.log('Running in local mock mode.');
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
          const list = snapshot.data.beaches.map((b) => mapDbBeachToFrontend(b));
          setBeaches(list);
        }
      } catch (err) {
        console.error('Failed to process real-time subscription snapshot:', err);
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

  // Monitor mobile screen size for rendering performance and Leaflet safety
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (text: string, type: 'success' | 'warn' | 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Upvoting or downvoting a specific report
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

  // Submit a new beach
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

  // Submit a new access point linked to a beach
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
          const targetBeachId = resolveBeachId(newAccessBeachId);

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
            <div className="flex items-center gap-2.5 cursor-pointer font-fustat font-bold text-[22px] tracking-tight text-[#1a1a1a]" onClick={() => { 
              setSelectedBeachId(null); 
              setSelectedAccessId(null); 
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}>
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
                  <div 
                    onClick={() => viewUserProfile(userProfile.id)}
                    className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-all select-none"
                    title="Ver mi perfil"
                  >
                    <UserAvatar avatarUrl={userProfile.avatarUrl} username={userProfile.username} size="sm" />
                    <div className="flex flex-col text-left leading-none">
                      <span className="text-[11px] font-bold text-gray-800 tracking-tight">{userProfile.username}</span>
                      <span className="text-[8.5px] font-semibold text-[#0871E7] mt-0.5">★ {userProfile.reputation} karma</span>
                    </div>
                  </div>

                  {isHighReputationUser && (
                    <div 
                      className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-full px-2 py-0.5 text-[8px] font-bold select-none"
                      title="Curador de la comunidad"
                    >
                      <Award size={10} className="animate-pulse" />
                      <span>Curador</span>
                    </div>
                  )}

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

        {/* Footer Coastal States */}
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
            Organización colectiva, garantizando <br className="hidden sm:block" />
            el libre tránsito en las costas de México.
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
            
            {/* Sidebar list panel */}
            <SidebarPanel
              selectedBeach={selectedBeach}
              selectedAccess={selectedAccess}
              selectedBeachId={selectedBeachId}
              setSelectedBeachId={setSelectedBeachId}
              selectedAccessId={selectedAccessId}
              setSelectedAccessId={setSelectedAccessId}
              beaches={beaches}
              filteredBeaches={filteredBeaches}
              setMapCenter={setMapCenter}
              setMapZoom={setMapZoom}
              setBeachDetailOpen={setBeachDetailOpen}
              setVisibleImagesLimit={setVisibleImagesLimit}
              loadComments={loadComments}
              userProfile={userProfile}
              isHighReputationUser={isHighReputationUser}
              handleCurationVerify={handleCurationVerify}
              setIsReportOpen={setIsReportOpen}
              handleReportVote={handleReportVote}
              setIsNewAccessOpen={setIsNewAccessOpen}
              setNewAccessBeachId={setNewAccessBeachId}
              viewUserProfile={viewUserProfile}
              setLightboxImage={setLightboxImage}
              mobileSection={mobileSection}
            />

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
                        <button
                          onClick={() => submitNewBeach({ preventDefault: () => {} } as any)}
                          disabled={drawingPoints.length < 3}
                          className="px-2.5 py-1 bg-emerald-600 text-white rounded text-[8.5px] font-bold uppercase disabled:opacity-50"
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
                    )}
                    {drawMode === 'trail' && (
                      <div className="flex gap-1.5 items-center justify-between mt-1">
                        <button
                          onClick={() => {
                            setIsNewAccessOpen(true);
                            setIsFormMinimized(false);
                            setDrawMode(null);
                          }}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded text-[8.5px] font-bold uppercase"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => setTrailDrawingPoints([])}
                          className="px-2 py-1 bg-gray-800 text-gray-300 rounded text-[8.5px] font-bold uppercase"
                        >
                          Limpiar
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* MapContainer */}
              <div className="flex-1 w-full h-full relative z-10">
                {(!isMobile || mobileSection === 'map') ? (
                  <MapContainer
                    center={
                      (mapCenter && typeof mapCenter[0] === 'number' && !isNaN(mapCenter[0]) && typeof mapCenter[1] === 'number' && !isNaN(mapCenter[1])) 
                        ? mapCenter 
                        : [21.1619, -86.8515]
                    }
                    zoom={mapZoom}
                    zoomControl={false}
                    {...({ tap: false } as any)}
                    className="w-full h-full"
                  >
                    <ChangeMapView 
                      center={
                        (mapCenter && typeof mapCenter[0] === 'number' && !isNaN(mapCenter[0]) && typeof mapCenter[1] === 'number' && !isNaN(mapCenter[1])) 
                          ? mapCenter 
                          : [21.1619, -86.8515]
                      } 
                      zoom={mapZoom} 
                    />
                    
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
                      if (b.boundaryPolygon.some(([lat, lng]) => typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng))) return null;
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
                        if (typeof acc.latitude !== 'number' || isNaN(acc.latitude) || typeof acc.longitude !== 'number' || isNaN(acc.longitude)) return null;
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
                                <h4 className="font-bold text-gray-955 leading-tight">{acc.name}</h4>
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
                    {selectedAccess && selectedAccess.trailGeometry && selectedAccess.trailGeometry.length > 0 && 
                     !selectedAccess.trailGeometry.some(([lat, lng]) => typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) && (
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
                        {drawingPoints.map((pt, idx) => {
                          if (typeof pt[0] !== 'number' || isNaN(pt[0]) || typeof pt[1] !== 'number' || isNaN(pt[1])) return null;
                          return (
                            <Marker
                              key={`draw-vertex-${idx}`}
                              position={pt}
                              icon={L.divIcon({
                                className: 'w-2.5 h-2.5 rounded-full bg-emerald-500 border border-white shadow-sm',
                                iconSize: [10, 10]
                              })}
                            />
                          );
                        })}
                        {drawingPoints.length > 1 && !drawingPoints.some(([lat, lng]) => typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) && (
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
                        {trailDrawingPoints.map((pt, idx) => {
                          if (typeof pt[0] !== 'number' || isNaN(pt[0]) || typeof pt[1] !== 'number' || isNaN(pt[1])) return null;
                          return (
                            <Marker
                              key={`draw-trail-vertex-${idx}`}
                              position={pt}
                              icon={L.divIcon({
                                className: 'w-2 h-2 rounded-full bg-blue-500 border border-white shadow-sm',
                                iconSize: [8, 8]
                              })}
                            />
                          );
                        })}
                        {trailDrawingPoints.length > 1 && !trailDrawingPoints.some(([lat, lng]) => typeof lat !== 'number' || isNaN(lat) || typeof lng !== 'number' || isNaN(lng)) && (
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
                    {placedPinCoordinates && 
                     typeof placedPinCoordinates[0] === 'number' && !isNaN(placedPinCoordinates[0]) && 
                     typeof placedPinCoordinates[1] === 'number' && !isNaN(placedPinCoordinates[1]) && (
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
                ) : (
                  <div className="w-full h-full bg-[#151c14] flex flex-col items-center justify-center text-gray-400 gap-2">
                    <p className="text-xs font-semibold">Cargando mapa interactivo...</p>
                  </div>
                )}
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
            © 2026 PlayaLibre.
          </p>
        </div>
      </footer>

      {/* MODALS SECTION */}
      
      {/* Lightbox view */}
      <LightboxModal image={lightboxImage} onClose={() => setLightboxImage(null)} />

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => {
          setIsAuthPromptOpen(false);
          setPendingAuthAction(null);
          setIsEmailAuthOpen(false);
          setEmailAuthEmail('');
          setEmailAuthPassword('');
        }}
        isEmailAuthOpen={isEmailAuthOpen}
        setIsEmailAuthOpen={setIsEmailAuthOpen}
        emailAuthMode={emailAuthMode}
        setEmailAuthMode={setEmailAuthMode}
        emailAuthEmail={emailAuthEmail}
        setEmailAuthEmail={setEmailAuthEmail}
        emailAuthPassword={emailAuthPassword}
        setEmailAuthPassword={setEmailAuthPassword}
        handleLogin={handleLogin}
        handleEmailPasswordSubmit={handleEmailPasswordSubmit}
      />

      {/* Email verification modal */}
      <EmailVerificationPendingModal
        isOpen={isEmailVerificationPending}
        currentUser={currentUser}
        emailAuthEmail={emailAuthEmail}
        onVerifyCheck={async () => {
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
        onResendEmail={async () => {
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
        onCancel={async () => {
          if (authInstance) {
            await signOut(authInstance);
          }
          setIsEmailVerificationPending(false);
        }}
      />

      {/* Profile setup modal */}
      <ProfileSetupModal
        isOpen={isProfileSetupOpen}
        profileSetupUsername={profileSetupUsername}
        setProfileSetupUsername={setProfileSetupUsername}
        profileSetupAvatarUrl={profileSetupAvatarUrl}
        setProfileSetupAvatarUrl={setProfileSetupAvatarUrl}
        onSubmit={submitProfileSetup}
      />

      {/* User profile view details modal */}
      <UserProfileViewModal
        isOpen={isProfileViewOpen}
        onClose={() => setIsProfileViewOpen(false)}
        selectedUserProfile={selectedUserProfile}
        userProfile={userProfile}
        isEditingBio={isEditingBio}
        setIsEditingBio={setIsEditingBio}
        editBioText={editBioText}
        setEditBioText={setEditBioText}
        onSaveBio={saveUserBio}
        userStats={userStats}
      />

      {/* Report incident blocker modal */}
      <ReportBlockerModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedAccess={selectedAccess}
        reportBlockerType={reportBlockerType}
        setReportBlockerType={setReportBlockerType}
        reportBlockerName={reportBlockerName}
        setReportBlockerName={setReportBlockerName}
        reportReporterName={reportReporterName}
        setReportReporterName={setReportReporterName}
        reportDescription={reportDescription}
        setReportDescription={setReportDescription}
        reportHasFee={reportHasFee}
        setReportHasFee={setReportHasFee}
        reportFeeAmount={reportFeeAmount}
        setReportFeeAmount={setReportFeeAmount}
        onSubmit={submitIncidentReport}
      />

      {/* Add new Beach modal */}
      <NewBeachModal
        isOpen={isNewBeachOpen}
        onClose={() => setIsNewBeachOpen(false)}
        newBeachName={newBeachName}
        setNewBeachName={setNewBeachName}
        newBeachState={newBeachState}
        setNewBeachState={setNewBeachState}
        newBeachImages={newBeachImages}
        setNewBeachImages={setNewBeachImages}
        drawingPoints={drawingPoints}
        onMinimizeDraw={() => {
          setIsNewBeachOpen(false);
          setIsFormMinimized(true);
          setDrawMode('beach');
          setDrawingPoints([]);
          const el = document.getElementById('explorer-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        handleBeachImagesUpload={handleBeachImagesUpload}
        onSubmit={submitNewBeach}
      />

      {/* Add new Access modal */}
      <NewAccessModal
        isOpen={isNewAccessOpen}
        onClose={() => setIsNewAccessOpen(false)}
        beaches={beaches}
        newAccessName={newAccessName}
        setNewAccessName={setNewAccessName}
        newAccessBeachId={newAccessBeachId}
        setNewAccessBeachId={setNewAccessBeachId}
        placedPinCoordinates={placedPinCoordinates}
        trailDrawingPoints={trailDrawingPoints}
        newAccessImages={newAccessImages}
        setNewAccessImages={setNewAccessImages}
        newAccessBlocker={newAccessBlocker}
        setNewAccessBlocker={setNewAccessBlocker}
        newAccessBlockerName={newAccessBlockerName}
        setNewAccessBlockerName={setNewAccessBlockerName}
        newAccessBlockerDesc={newAccessBlockerDesc}
        setNewAccessBlockerDesc={setNewAccessBlockerDesc}
        newAccessIllegalFee={newAccessIllegalFee}
        setNewAccessIllegalFee={setNewAccessIllegalFee}
        newAccessFeeAmount={newAccessFeeAmount}
        setNewAccessFeeAmount={setNewAccessFeeAmount}
        newAccessAmenities={newAccessAmenities}
        setNewAccessAmenities={setNewAccessAmenities}
        newAccessAccessibility={newAccessAccessibility}
        setNewAccessAccessibility={setNewAccessAccessibility}
        onMinimizeDraw={(mode) => {
          setIsNewAccessOpen(false);
          setIsFormMinimized(true);
          setDrawMode(mode);
          if (mode === 'trail') {
            setTrailDrawingPoints([]);
          }
          const el = document.getElementById('explorer-section');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        handleAccessImagesUpload={handleAccessImagesUpload}
        onSubmit={submitNewAccess}
        nearestBeach={nearestBeach}
      />

      {/* Ficha de playa completa y comentarios modal */}
      <BeachDetailsModal
        isOpen={beachDetailOpen}
        onClose={() => setBeachDetailOpen(false)}
        selectedBeach={selectedBeach}
        selectedBeachComments={selectedBeachComments}
        newCommentText={newCommentText}
        setNewCommentText={setNewCommentText}
        onSubmitComment={submitComment}
        userProfile={userProfile}
        handleLogin={handleLogin}
        setLightboxImage={setLightboxImage}
        visibleImagesLimit={visibleImagesLimit}
        setVisibleImagesLimit={setVisibleImagesLimit}
        setSelectedAccessId={setSelectedAccessId}
        setMapCenter={setMapCenter}
        viewUserProfile={viewUserProfile}
      />

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
