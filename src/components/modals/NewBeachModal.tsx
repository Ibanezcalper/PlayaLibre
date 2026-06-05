import React from 'react';
import { X } from 'lucide-react';
import { MEXICAN_STATES } from '../../constants';

interface NewBeachModalProps {
  isOpen: boolean;
  onClose: () => void;
  newBeachName: string;
  setNewBeachName: (name: string) => void;
  newBeachState: string;
  setNewBeachState: (state: string) => void;
  newBeachImages: string[];
  setNewBeachImages: React.Dispatch<React.SetStateAction<string[]>>;
  drawingPoints: [number, number][];
  onMinimizeDraw: () => void;
  handleBeachImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function NewBeachModal({
  isOpen,
  onClose,
  newBeachName,
  setNewBeachName,
  newBeachState,
  setNewBeachState,
  newBeachImages,
  setNewBeachImages,
  drawingPoints,
  onMinimizeDraw,
  handleBeachImagesUpload,
  onSubmit
}: NewBeachModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
          <div className="text-left">
            <h3 className="text-base font-bold text-gray-905">Registrar playa</h3>
            <p className="text-[9.5px] text-gray-500 mt-0.5">Define los límites y demarca el territorio de la playa pública</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-200/60 text-gray-500 hover:text-gray-900"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs text-left">
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
                onChange={(e) => setNewBeachState(e.target.value)}
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
                onClick={onMinimizeDraw}
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
  );
}
