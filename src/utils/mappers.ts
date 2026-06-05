import type { Beach, IncidentReport } from '../types';

export const mapDbBeachToFrontend = (dbBeach: any): Beach => {
  const accesses = (dbBeach.accesses_on_beach || []).map((acc: any) => {
    const incidentReports: IncidentReport[] = (acc.reports_on_access || []).map((r: any) => ({
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
