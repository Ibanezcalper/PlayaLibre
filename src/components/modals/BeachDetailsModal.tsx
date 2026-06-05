import React, { useMemo } from 'react';
import { X, MessageSquare, Send, Camera } from 'lucide-react';
import { MapContainer, TileLayer, ZoomControl, Marker, Popup, Polygon } from 'react-leaflet';
import * as L from 'leaflet';
import {
  ResponsiveContainer,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Area
} from 'recharts';
import { UserAvatar } from '../common/UserAvatar';
import type { Beach, UserProfile } from '../../types';

interface BeachDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBeach: Beach | null;
  selectedBeachComments: any[];
  newCommentText: string;
  setNewCommentText: (text: string) => void;
  onSubmitComment: (e: React.FormEvent) => void;
  userProfile: UserProfile | null;
  handleLogin: () => void;
  setLightboxImage: (img: string | null) => void;
  visibleImagesLimit: number;
  setVisibleImagesLimit: React.Dispatch<React.SetStateAction<number>>;
  setSelectedAccessId: (id: string | null) => void;
  setMapCenter: (center: [number, number]) => void;
  viewUserProfile: (userId: string) => void;
}

export function BeachDetailsModal({
  isOpen,
  onClose,
  selectedBeach,
  selectedBeachComments,
  newCommentText,
  setNewCommentText,
  onSubmitComment,
  userProfile,
  handleLogin,
  setLightboxImage,
  visibleImagesLimit,
  setVisibleImagesLimit,
  setSelectedAccessId,
  setMapCenter,
  viewUserProfile
}: BeachDetailsModalProps) {
  if (!isOpen || !selectedBeach) return null;

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

  const timelineData = useMemo(() => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const data: Record<string, { month: string; illegalFees: number; insecurity: number; blockages: number; other: number; sortKey: number }> = {};
    
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

    selectedBeach.accesses.forEach((acc) => {
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
  }, [selectedBeach]);

  const allPhotos = useMemo(() => {
    return [
      ...(selectedBeach.images || []),
      ...selectedBeach.accesses.flatMap(a => a.images || [])
    ];
  }, [selectedBeach]);

  const visiblePhotos = useMemo(() => {
    return allPhotos.slice(0, visibleImagesLimit);
  }, [allPhotos, visibleImagesLimit]);

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#EFEFEF] border border-gray-300 rounded-[28px] overflow-hidden shadow-2xl flex flex-col p-6 sm:p-8 text-left">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-250 mb-6">
          <div>
            <span className="text-[10px] font-bold text-[#0871E7] uppercase tracking-widest">{selectedBeach.state}</span>
            <h3 className="text-2xl font-bold text-gray-900 font-fustat leading-none mt-1">{selectedBeach.name}</h3>
          </div>
          <button
            onClick={onClose}
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
                          onClose(); // Close modal when inspecting single access in main page sidebar
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
              {allPhotos.length === 0 ? (
                <div className="py-8 bg-white rounded-2xl border border-gray-200 border-dashed flex flex-col items-center justify-center text-center text-gray-400 gap-2">
                  <Camera size={24} className="text-gray-300" />
                  <span>No hay fotos aún de esta playa.</span>
                </div>
              ) : (
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
              )}
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
                    data={timelineData}
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
                      <div 
                        onClick={() => comment.user?.id && viewUserProfile(comment.user.id)}
                        className="cursor-pointer hover:opacity-80 transition-opacity animate-fade-in"
                        title="Ver perfil del colaborador"
                      >
                        <UserAvatar avatarUrl={comment.user?.avatarUrl} username={comment.user?.username || 'Anónimo'} size="sm" />
                      </div>
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex justify-between items-center">
                          <span 
                            onClick={() => comment.user?.id && viewUserProfile(comment.user.id)}
                            className="font-bold text-gray-800 text-[10px] flex items-center gap-1 cursor-pointer hover:text-[#0871E7] transition-colors"
                            title="Ver perfil del colaborador"
                          >
                            {comment.user?.username || 'Anónimo'}
                            <span className="px-1 py-0.2 bg-blue-50 text-[#0871E7] border border-blue-100 rounded text-[7.5px] font-bold">
                              ★ {comment.user?.reputation ?? 10}
                            </span>
                          </span>
                          <span className="text-[8px] text-gray-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-655 leading-relaxed mt-0.5 text-left">{comment.text}</p>
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
                <form onSubmit={onSubmitComment} className="flex gap-2">
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
  );
}
