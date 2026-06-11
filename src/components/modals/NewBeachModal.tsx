import React from 'react';
import { ArrowLeft, PenTool, X } from 'lucide-react';
import { MEXICAN_STATES } from '../../constants';
import { BeachDrawingGuidePanel } from '../guide/BeachDrawingGuidePanel';

export type BeachFormStep = 'draw' | 'details';

interface NewBeachModalProps {
  isOpen: boolean;
  onClose: () => void;
  step: BeachFormStep;
  newBeachName: string;
  setNewBeachName: (name: string) => void;
  newBeachState: string;
  setNewBeachState: (state: string) => void;
  stateAutoDetected: boolean;
  newBeachImages: string[];
  setNewBeachImages: React.Dispatch<React.SetStateAction<string[]>>;
  drawingPoints: [number, number][];
  onStartDrawing: () => void;
  onBackToDrawing: () => void;
  handleBeachImagesUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function NewBeachModal({
  isOpen,
  onClose,
  step,
  newBeachName,
  setNewBeachName,
  newBeachState,
  setNewBeachState,
  stateAutoDetected,
  newBeachImages,
  setNewBeachImages,
  drawingPoints,
  onStartDrawing,
  onBackToDrawing,
  handleBeachImagesUpload,
  onSubmit,
}: NewBeachModalProps) {
  if (!isOpen) return null;

  const isDrawStep = step === 'draw';

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div
        className={`relative w-full bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 max-h-[85vh] overflow-y-auto ${
          isDrawStep ? 'max-w-lg' : 'max-w-md'
        }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
          <div className="text-left">
            <h3 className="text-base font-bold text-gray-905">
              {isDrawStep ? 'Paso 1: Delimitar playa' : 'Paso 2: Datos de la playa'}
            </h3>
            <p className="text-[9.5px] text-gray-500 mt-0.5">
              {isDrawStep
                ? 'Trace el polígono territorial antes de completar la ficha'
                : 'Complete la información y guarde el registro'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-200/60 text-gray-500 hover:text-gray-900"
          >
            <X size={16} />
          </button>
        </div>

        {isDrawStep ? (
          <div className="space-y-5 text-left">
            <div className="max-h-[40vh] overflow-y-auto pr-1">
              <BeachDrawingGuidePanel />
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-[10.5px] text-emerald-900">
              <p>
                <strong>Orden del registro:</strong> primero delimitación en el mapa, después datos
                de la ficha. Puede corregir vértices punto por punto sin reiniciar todo el trazo.
              </p>
            </div>

            <button
              type="button"
              onClick={onStartDrawing}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-105 rounded-xl font-semibold text-white transition-all shadow"
            >
              <PenTool size={16} />
              <span>Comenzar delimitación en el mapa</span>
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 text-xs text-left">
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-[10.5px] flex items-start justify-between gap-3">
              <span>
                Polígono delimitado: <strong>{drawingPoints.length} vértices</strong>
              </span>
              <button
                type="button"
                onClick={onBackToDrawing}
                className="shrink-0 inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold underline"
              >
                <ArrowLeft size={12} />
                Editar trazo
              </button>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">
                Nombre oficial de la playa *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Playa Carrizalillo"
                value={newBeachName}
                onChange={(e) => setNewBeachName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
              />
            </div>

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
              {stateAutoDetected && (
                <p className="text-[9px] text-gray-500 mt-1.5">
                  Estado detectado automáticamente según la ubicación del polígono. Puede corregirlo
                  si es necesario.
                </p>
              )}
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">
                Fotos de la playa
              </label>
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
                    <div
                      key={idx}
                      className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-300"
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewBeachImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 bg-black/60 hover:bg-black/80 text-white rounded-full p-0.5"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={drawingPoints.length < 3}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:brightness-105 rounded-xl font-semibold text-white transition-all shadow disabled:opacity-50"
            >
              Guardar playa registrada
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
