import type { Beach } from '../types';

// 17 coastal states of Mexico
export const MEXICAN_STATES = [
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

export const STATE_COASTAL_COORDINATES: Record<string, [number, number]> = {
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

export const AVATAR_PRESETS = [
  { emoji: '🏄‍♂️', label: 'Surfista', bg: 'from-blue-400 to-indigo-500' },
  { emoji: '🌴', label: 'Palmera', bg: 'from-emerald-400 to-teal-500' },
  { emoji: '🐬', label: 'Delfín', bg: 'from-cyan-400 to-blue-500' },
  { emoji: '🦀', label: 'Cangrejo', bg: 'from-red-400 to-orange-500' },
  { emoji: '🌅', label: 'Amanecer', bg: 'from-amber-400 to-rose-500' },
  { emoji: '⛵', label: 'Velero', bg: 'from-sky-400 to-indigo-500' },
  { emoji: '🐚', label: 'Concha', bg: 'from-pink-400 to-rose-500' },
  { emoji: '🐠', label: 'Pez', bg: 'from-yellow-400 to-orange-500' }
];

export const INITIAL_BEACHES: Beach[] = [];
