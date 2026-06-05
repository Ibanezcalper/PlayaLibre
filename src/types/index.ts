export interface UserProfile {
  id: string;
  username: string;
  avatarUrl?: string;
  reputation: number;
  bio?: string;
}

// Beach Data Interface (territorial boundary polygon)
export interface Beach {
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
export interface Access {
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

export interface IncidentReport {
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
