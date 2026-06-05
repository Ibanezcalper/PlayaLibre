// IndexedDB Offline storage helper for PlayaLibre

const DB_NAME = 'PlayaLibreDB';
const DB_VERSION = 3; // Incremented version to support comments and user profiles

export interface OfflineReport {
  id: string;
  accessId: string;
  reporterName: string;
  blockerType: 'Hotel' | 'Condo' | 'Restaurant' | 'Beach Club' | 'Private Property' | 'Insecurity' | 'Other';
  blockerName: string;
  description: string;
  hasIllegalFee: boolean;
  feeAmount?: number;
  userId?: string;
  timestamp: number;
}

export interface OfflineBeach {
  id: string;
  name: string;
  state: string;
  latitude: number;
  longitude: number;
  boundaryPolygon?: [number, number][];
  images?: string[];
  userId?: string;
  timestamp: number;
}

export interface OfflineAccess {
  id: string;
  beachId: string;
  name: string;
  latitude: number;
  longitude: number;
  trailGeometry?: [number, number][];
  images?: string[];
  userId?: string;
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
  reputation: number;
  timestamp: number;
}

export interface OfflineComment {
  id: string;
  beachId: string;
  userId: string;
  text: string;
  timestamp: number;
}

export interface OfflineUserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  reputation: number;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains('reports')) {
        db.createObjectStore('reports', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('beaches')) {
        db.createObjectStore('beaches', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('accesses')) {
        db.createObjectStore('accesses', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('comments')) {
        db.createObjectStore('comments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('user_profiles')) {
        db.createObjectStore('user_profiles', { keyPath: 'id' });
      }
    };
  });
}

export async function saveOfflineReport(report: OfflineReport): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('reports', 'readwrite');
    const store = transaction.objectStore('reports');
    const request = store.put(report);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineReports(): Promise<OfflineReport[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('reports', 'readonly');
    const store = transaction.objectStore('reports');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOfflineReport(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('reports', 'readwrite');
    const store = transaction.objectStore('reports');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineBeach(beach: OfflineBeach): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('beaches', 'readwrite');
    const store = transaction.objectStore('beaches');
    const request = store.put(beach);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineBeaches(): Promise<OfflineBeach[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('beaches', 'readonly');
    const store = transaction.objectStore('beaches');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOfflineBeach(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('beaches', 'readwrite');
    const store = transaction.objectStore('beaches');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineAccess(access: OfflineAccess): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('accesses', 'readwrite');
    const store = transaction.objectStore('accesses');
    const request = store.put(access);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineAccesses(): Promise<OfflineAccess[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('accesses', 'readonly');
    const store = transaction.objectStore('accesses');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOfflineAccess(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('accesses', 'readwrite');
    const store = transaction.objectStore('accesses');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineComment(comment: OfflineComment): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('comments', 'readwrite');
    const store = transaction.objectStore('comments');
    const request = store.put(comment);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineComments(): Promise<OfflineComment[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('comments', 'readonly');
    const store = transaction.objectStore('comments');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOfflineComment(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('comments', 'readwrite');
    const store = transaction.objectStore('comments');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function saveOfflineUserProfile(profile: OfflineUserProfile): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('user_profiles', 'readwrite');
    const store = transaction.objectStore('user_profiles');
    const request = store.put(profile);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineUserProfile(id: string): Promise<OfflineUserProfile | undefined> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('user_profiles', 'readonly');
    const store = transaction.objectStore('user_profiles');
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function getOfflineUserProfiles(): Promise<OfflineUserProfile[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('user_profiles', 'readonly');
    const store = transaction.objectStore('user_profiles');
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteOfflineUserProfile(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('user_profiles', 'readwrite');
    const store = transaction.objectStore('user_profiles');
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export function registerSyncHandler(
  onSync: (
    reports: OfflineReport[],
    beaches: OfflineBeach[],
    accesses: OfflineAccess[],
    comments: OfflineComment[],
    profiles: OfflineUserProfile[]
  ) => Promise<boolean>
) {
  const checkAndSync = async () => {
    if (!navigator.onLine) return;
    
    try {
      const reports = await getOfflineReports();
      const beaches = await getOfflineBeaches();
      const accesses = await getOfflineAccesses();
      const comments = await getOfflineComments();
      const profiles = await getOfflineUserProfiles();
      
      if (
        reports.length > 0 ||
        beaches.length > 0 ||
        accesses.length > 0 ||
        comments.length > 0 ||
        profiles.length > 0
      ) {
        const success = await onSync(reports, beaches, accesses, comments, profiles);
        if (success) {
          for (const report of reports) {
            await deleteOfflineReport(report.id);
          }
          for (const beach of beaches) {
            await deleteOfflineBeach(beach.id);
          }
          for (const access of accesses) {
            await deleteOfflineAccess(access.id);
          }
          for (const comment of comments) {
            await deleteOfflineComment(comment.id);
          }
          for (const profile of profiles) {
            await deleteOfflineUserProfile(profile.id);
          }
          console.log('Offline queue successfully synchronized!');
        }
      }
    } catch (e) {
      console.error('Failed to run background synchronization:', e);
    }
  };

  window.addEventListener('online', checkAndSync);
  checkAndSync();

  return () => {
    window.removeEventListener('online', checkAndSync);
  };
}
