import { ArrowRight, PlayCircle } from 'lucide-react';
import { PLATFORM_GUIDE_STEPS, WORKFLOW_STAGES } from '../../constants/guideSteps';
import { BeachDrawingGuidePanel } from './BeachDrawingGuidePanel';
import { AccessRegistrationGuidePanel } from './AccessRegistrationGuidePanel';

interface PlatformGuideSectionProps {
  onStartTour: () => void;
  tourCompleted: boolean;
}

export function PlatformGuideSection({ onStartTour, tourCompleted }: PlatformGuideSectionProps) {
  return (
    <section
      id="guide-section"
      className="relative bg-[#F8F8F8] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28 border-t border-gray-200"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
          <div className="max-w-3xl text-left">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 tracking-wide uppercase select-none mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0871E7]" />
              <span>Documentación de uso</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight font-fustat">
              Guía de uso de la plataforma
            </h2>
            <p className="text-[15px] sm:text-base text-gray-600 leading-relaxed mt-4 max-w-2xl">
              PlayaLibre documenta playas y accesos peatonales mediante un flujo secuencial:
              primero se delimita la playa en el mapa y, posteriormente, se registran los accesos
              vinculados a esa playa.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              type="button"
              onClick={onStartTour}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0871E7] hover:bg-[#0762cb] text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <PlayCircle size={16} />
              <span>{tourCompleted ? 'Repetir recorrido guiado' : 'Iniciar recorrido guiado'}</span>
            </button>
            <a
              href="#explorer-section"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('explorer-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-gray-800 text-sm font-semibold transition-colors"
            >
              <span>Ir al mapa de trabajo</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Workflow summary */}
        <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-5">
            Secuencia operativa recomendada
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {WORKFLOW_STAGES.map((stage, index) => (
              <div key={stage.label} className="relative flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="text-left pt-1">
                  <p className="font-bold text-gray-900">{stage.label}</p>
                  <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
                </div>
                {index < WORKFLOW_STAGES.length - 1 && (
                  <ArrowRight
                    size={16}
                    className="hidden sm:block absolute top-3 -right-3 text-gray-300"
                    aria-hidden
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Beach drawing guide */}
        <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <BeachDrawingGuidePanel />
        </div>

        <div className="mb-12 rounded-2xl border border-gray-200 bg-white p-6 sm:p-8">
          <AccessRegistrationGuidePanel />
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {PLATFORM_GUIDE_STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.id}
                className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 text-left shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center">
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      Paso {step.number}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 leading-tight">{step.title}</h3>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800 mb-2">{step.summary}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{step.detail}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
