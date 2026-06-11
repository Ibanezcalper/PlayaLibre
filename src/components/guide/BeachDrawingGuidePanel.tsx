import { BEACH_DRAWING_STEPS } from '../../constants/guideSteps';

interface BeachDrawingGuidePanelProps {
  compact?: boolean;
}

export function BeachDrawingGuidePanel({ compact = false }: BeachDrawingGuidePanelProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {!compact && (
        <div className="text-left mb-6">
          <h3 className="text-lg font-bold text-gray-900">Delimitación de playas en el mapa</h3>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            El registro de una playa inicia siempre con el trazo del polígono territorial. A
            continuación se describe el procedimiento recomendado.
          </p>
        </div>
      )}
      <ol className={`${compact ? 'space-y-2' : 'space-y-3'} text-left`}>
        {BEACH_DRAWING_STEPS.map((step) => (
          <li
            key={step.number}
            className={`flex gap-3 ${compact ? 'text-[10px] text-gray-300' : 'rounded-xl border border-gray-200 bg-white p-4 text-sm'}`}
          >
            <span
              className={`shrink-0 font-bold ${
                compact
                  ? 'w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center text-[9px]'
                  : 'w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs'
              }`}
            >
              {step.number}
            </span>
            <div>
              <p className={`font-semibold ${compact ? 'text-emerald-300' : 'text-gray-900'}`}>
                {step.title}
              </p>
              <p className={`mt-0.5 leading-relaxed ${compact ? 'text-gray-400' : 'text-gray-600 text-xs'}`}>
                {step.detail}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
