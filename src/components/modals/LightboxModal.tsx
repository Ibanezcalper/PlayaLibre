import { X } from 'lucide-react';

interface LightboxModalProps {
  image: string | null;
  onClose: () => void;
}

export function LightboxModal({ image, onClose }: LightboxModalProps) {
  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[12000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm cursor-zoom-out"
      onClick={onClose}
    >
      <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <img src={image} className="max-w-full max-h-full object-contain" alt="Ampliada" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
