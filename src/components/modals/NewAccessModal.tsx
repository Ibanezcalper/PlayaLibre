import React from 'react';
import { X } from 'lucide-react';
import type { Beach } from '../../types';

interface NewAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  beaches: Beach[];
  newAccessName: string;
  setNewAccessName: (name: string) => void;
  newAccessBeachId: string;
  setNewAccessBeachId: (id: string) => void;
  placedPinCoordinates: [number, number] | null;
  trailDrawingPoints: [number, number][];
  newAccessImages: string[];
  setNewAccessImages: React.Dispatch<React.SetStateAction<string[]>>;
  newAccessBlocker: 'None' | 'Hotel' | 'Condo' | 'Restaurant' | 'Beach Club' | 'Private Property' | 'Insecurity' | 'Other';
  setNewAccessBlocker: (blocker: any) => void;
  newAccessBlockerName: string;
  setNewAccessBlockerName: (name: string) => void;
  newAccessBlockerDesc: string;
  setNewAccessBlockerDesc: (desc: string) => void;
  newAccessIllegalFee: boolean;
  setNewAccessIllegalFee: (illegal: boolean) => void;
  newAccessFeeAmount: string;
  setNewAccessFeeAmount: (amount: string) => void;
  newAccessAmenities: {
    pets: boolean;
    shade: boolean;
    showers: boolean;
    parking: boolean;
    security: boolean;
  };
  setNewAccessAmenities: (amenities: any) => void;
  newAccessAccessibility: {
    ramps: boolean;
    wheelchair: boolean;
    parkingReserved: boolean;
  };
  setNewAccessAccessibility: (accessibility: any) => void;
  onMinimizeDraw: (mode: 'access_pin' | 'trail') => void;
  handleAccessImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  nearestBeach: { beach: Beach; distance: number } | null;
}

export function NewAccessModal({
  isOpen,
  onClose,
  beaches,
  newAccessName,
  setNewAccessName,
  newAccessBeachId,
  setNewAccessBeachId,
  placedPinCoordinates,
  newAccessImages,
  setNewAccessImages,
  newAccessBlocker,
  setNewAccessBlocker,
  newAccessBlockerName,
  setNewAccessBlockerName,
  newAccessBlockerDesc,
  setNewAccessBlockerDesc,
  newAccessIllegalFee,
  setNewAccessIllegalFee,
  newAccessFeeAmount,
  setNewAccessFeeAmount,
  newAccessAmenities,
  setNewAccessAmenities,
  newAccessAccessibility,
  setNewAccessAccessibility,
  onMinimizeDraw,
  handleAccessImagesUpload,
  onSubmit,
  nearestBeach
}: NewAccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
          <div className="text-left">
            <h3 className="text-base font-bold text-gray-905">Registrar acceso público</h3>
            <p className="text-[9.5px] text-gray-500 mt-0.5">Agrega un sendero de entrada, servicios y reportes de cobros</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-200/60 text-gray-500 hover:text-gray-900"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs text-left">
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
                onChange={(e) => setNewAccessBeachId(e.target.value)}
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
              onClick={() => onMinimizeDraw('access_pin')}
              className="py-2.5 bg-gray-200 hover:bg-gray-300/80 border border-gray-350 text-gray-800 rounded-xl text-center font-bold"
            >
              Fijar entrada en mapa
            </button>
            <button
              type="button"
              onClick={() => onMinimizeDraw('trail')}
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
  );
}
