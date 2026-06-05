import React from 'react';
import { X } from 'lucide-react';
import type { Access, IncidentReport } from '../../types';

interface ReportBlockerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAccess: Access | null;
  reportBlockerType: IncidentReport['blockerType'];
  setReportBlockerType: (type: IncidentReport['blockerType']) => void;
  reportBlockerName: string;
  setReportBlockerName: (name: string) => void;
  reportReporterName: string;
  setReportReporterName: (name: string) => void;
  reportDescription: string;
  setReportDescription: (desc: string) => void;
  reportHasFee: boolean;
  setReportHasFee: (hasFee: boolean) => void;
  reportFeeAmount: string;
  setReportFeeAmount: (amount: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ReportBlockerModal({
  isOpen,
  onClose,
  selectedAccess,
  reportBlockerType,
  setReportBlockerType,
  reportBlockerName,
  setReportBlockerName,
  reportReporterName,
  setReportReporterName,
  reportDescription,
  setReportDescription,
  reportHasFee,
  setReportHasFee,
  reportFeeAmount,
  setReportFeeAmount,
  onSubmit
}: ReportBlockerModalProps) {
  if (!isOpen || !selectedAccess) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-5 sm:p-6 text-left">
        
        <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-955">Reportar privatización o anomalía</h3>
            <p className="text-[9.5px] text-gray-500 mt-0.5">Acceso: {selectedAccess.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-200/60 text-gray-500 hover:text-gray-900"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Entidad responsable de la obstrucción *</label>
            <select
              value={reportBlockerType}
              onChange={(e) => setReportBlockerType(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-800 outline-none cursor-pointer"
            >
              <option value="Hotel">Hotel comercial</option>
              <option value="Condo">Condominios residenciales</option>
              <option value="Restaurant">Restaurante / local comercial</option>
              <option value="Beach Club">Club de playa privado</option>
              <option value="Private Property">Cercado de propiedad privada</option>
              <option value="Insecurity">Inseguridad / violencia en la zona</option>
              <option value="Other">Otro tipo de bloqueo peatonal o rejas</option>
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Nombre de la entidad responsable *</label>
            <input
              type="text"
              required
              placeholder="Ej. Condominio Las Brisas"
              value={reportBlockerName}
              onChange={(e) => setReportBlockerName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Tu nombre (opcional)</label>
            <input
              type="text"
              placeholder="Dejar vacío para enviar anónimamente"
              value={reportReporterName}
              onChange={(e) => setReportReporterName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Detalles del incidente *</label>
            <textarea
              required
              rows={3}
              placeholder="Describe qué obstrucción encontraste: portones cerrados, guardias privados, cobros de peaje..."
              value={reportDescription}
              onChange={(e) => setReportDescription(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 placeholder-gray-400 outline-none"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 border border-red-200">
            <label className="flex items-center gap-1.5 cursor-pointer text-gray-750">
              <input
                type="checkbox"
                checked={reportHasFee}
                onChange={(e) => setReportHasFee(e.target.checked)}
                className="accent-red-600"
              />
              <span>¿Exigen cobro obligatorio para cruzar?</span>
            </label>
            {reportHasFee && (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-gray-400 font-bold">$</span>
                <input
                  type="number"
                  required
                  placeholder="MXN"
                  value={reportFeeAmount}
                  onChange={(e) => setReportFeeAmount(e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-white border border-gray-300 text-gray-905 text-center font-mono outline-none"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 rounded-xl font-semibold text-white shadow transition-all border border-red-500/20"
          >
            Enviar denuncia a PlayaLibre
          </button>
        </form>
      </div>
    </div>
  );
}
