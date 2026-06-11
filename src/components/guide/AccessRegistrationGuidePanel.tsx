import { ACCESS_REGISTRATION_STEPS } from '../../constants/guideSteps';

interface AccessRegistrationGuidePanelProps {
  compact?: boolean;
}

export function AccessRegistrationGuidePanel({ compact = false }: AccessRegistrationGuidePanelProps) {
  return (
    <div className={compact ? 'space-y-2' : 'space-y-4'}>
      {!compact && (
        <div className="text-left mb-6">
          <h3 className="text-lg font-bold text-gray-900">Registro de accesos peatonales</h3>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Cada acceso se documenta primero en el mapa (entrada y sendero) y después en la ficha
            de datos. A continuación se describe el procedimiento recomendado.
          </p>
        </div>
      )}
      <ol className={`${compact ? 'space-y-2' : 'space-y-3'} text-left`}>
        {ACCESS_REGISTRATION_STEPS.map((step) => (
          <li
            key={step.number}
            className={`flex gap-3 ${compact ? 'text-[10px] text-gray-300' : 'rounded-xl border border-gray-200 bg-white p-4 text-sm'}`}
          >
            <span
              className={`shrink-0 font-bold ${
                compact
                  ? 'w-5 h-5 rounded-full bg-blue-600/30 text-blue-300 flex items-center justify-center text-[9px]'
                  : 'w-7 h-7 rounded-full bg-[#0871E7] text-white flex items-center justify-center text-xs'
              }`}
            >
              {step.number}
            </span>
            <div>
              <p className={`font-semibold ${compact ? 'text-blue-300' : 'text-gray-900'}`}>
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
