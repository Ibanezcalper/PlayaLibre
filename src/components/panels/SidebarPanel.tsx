import React from 'react';
import { ChevronLeft, MapPin, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import type { Beach, Access, UserProfile } from '../../types';

interface SidebarPanelProps {
  selectedBeach: Beach | null;
  selectedAccess: Access | null;
  selectedBeachId: string | null;
  setSelectedBeachId: (id: string | null) => void;
  selectedAccessId: string | null;
  setSelectedAccessId: (id: string | null) => void;
  beaches: Beach[];
  filteredBeaches: Beach[];
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  setBeachDetailOpen: (open: boolean) => void;
  setVisibleImagesLimit: React.Dispatch<React.SetStateAction<number>>;
  loadComments: (beachId: string) => void;
  userProfile: UserProfile | null;
  isHighReputationUser: boolean;
  handleCurationVerify: (accessId: string, actionType: 'resolve_conflict' | 'verify_public') => void;
  setIsReportOpen: (open: boolean) => void;
  handleReportVote: (accessId: string, reportId: string, diff: number) => void;
  setIsNewAccessOpen: (open: boolean) => void;
  setNewAccessBeachId: (id: string) => void;
  viewUserProfile: (userId: string) => void;
  setLightboxImage: (img: string | null) => void;
  mobileSection: 'list' | 'map';
}

export function SidebarPanel({
  selectedBeach,
  selectedAccess,
  setSelectedBeachId,
  selectedAccessId,
  setSelectedAccessId,
  filteredBeaches,
  setMapCenter,
  setMapZoom,
  setBeachDetailOpen,
  setVisibleImagesLimit,
  loadComments,
  isHighReputationUser,
  handleCurationVerify,
  setIsReportOpen,
  handleReportVote,
  setIsNewAccessOpen,
  setNewAccessBeachId,
  viewUserProfile,
  setLightboxImage,
  mobileSection
}: SidebarPanelProps) {
  return (
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
                      alt="Acceso"
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
                  <span 
                    onClick={() => selectedAccess.user?.id && viewUserProfile(selectedAccess.user.id)}
                    className="font-bold text-gray-800 flex items-center gap-1 cursor-pointer hover:text-[#0871E7] transition-colors"
                    title="Ver perfil del colaborador"
                  >
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
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-800">Sendero trazado</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">El camino a pie está trazado en el mapa interactivo.</p>
                  </div>
                </div>
              )}

              {/* Services checklist */}
              <div>
                <h4 className="font-bold text-gray-800 mb-1.5 text-left">Servicios en este acceso</h4>
                <div className="grid grid-cols-2 gap-1.5 bg-gray-50 p-3 rounded-xl border border-gray-150 text-[10px] text-left">
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
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mt-2 text-left">
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
                      <div key={report.id} className="p-3 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col gap-1.5 text-xs text-left">
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
                        <p className="text-gray-655 leading-snug">{report.description}</p>
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
                      alt="Playa"
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
                  <span 
                    onClick={() => selectedBeach.user?.id && viewUserProfile(selectedBeach.user.id)}
                    className="font-bold text-gray-800 flex items-center gap-1 cursor-pointer hover:text-[#0871E7] transition-colors"
                    title="Ver perfil del colaborador"
                  >
                    {selectedBeach.user.username}
                    <span className="text-[#0871E7]">★ {selectedBeach.user.reputation}</span>
                  </span>
                </div>
              )}

              <div className="text-left">
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
          <div className="mb-4 text-left">
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
                      if (typeof beach.latitude === 'number' && !isNaN(beach.latitude) && typeof beach.longitude === 'number' && !isNaN(beach.longitude)) {
                        setMapCenter([beach.latitude, beach.longitude]);
                      }
                      setMapZoom(15);
                      setBeachDetailOpen(true);
                      setVisibleImagesLimit(4);
                      loadComments(beach.id);
                    }}
                    className="p-3 border border-gray-150 rounded-xl hover:border-[#0871E7] cursor-pointer bg-white transition-all hover:shadow-sm flex items-center justify-between"
                  >
                    <div className="flex flex-col gap-0.5 text-left">
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
  );
}
