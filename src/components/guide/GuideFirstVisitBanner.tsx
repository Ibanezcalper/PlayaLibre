import { BookOpen, X } from 'lucide-react';

interface GuideFirstVisitBannerProps {
  visible: boolean;
  onDismiss: () => void;
  onScrollToGuide: () => void;
}

export function GuideFirstVisitBanner({
  visible,
  onDismiss,
  onScrollToGuide,
}: GuideFirstVisitBannerProps) {
  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9000] w-[min(92vw,520px)] rounded-2xl border border-gray-200 bg-white shadow-xl px-4 py-3.5 flex items-start gap-3"
      role="status"
      aria-live="polite"
    >
      <div className="w-9 h-9 rounded-xl bg-[#0871E7]/10 text-[#0871E7] flex items-center justify-center flex-shrink-0">
        <BookOpen size={18} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-semibold text-gray-900">Guía de uso disponible</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
          Consulte el manual de la plataforma o inicie el recorrido guiado antes de registrar playas y accesos.
        </p>
        <button
          type="button"
          onClick={onScrollToGuide}
          className="mt-2 text-xs font-semibold text-[#0871E7] hover:underline"
        >
          Ver guía de uso
        </button>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex-shrink-0"
        aria-label="Cerrar aviso"
      >
        <X size={16} />
      </button>
    </div>
  );
}
