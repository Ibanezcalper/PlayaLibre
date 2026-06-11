import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ONBOARDING_TOUR_STEPS, type TourStep } from '../../constants/guideSteps';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onSkip: () => void;
  isMobile: boolean;
  onBeforeStep?: (step: TourStep) => void;
}

interface SpotlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 8;

function getVisibleSteps(isMobile: boolean): TourStep[] {
  return ONBOARDING_TOUR_STEPS.filter((step) => {
    if (step.mobileOnly && !isMobile) return false;
    if (step.desktopOnly && isMobile) return false;
    return true;
  });
}

export function OnboardingTour({
  isOpen,
  onClose,
  onComplete,
  onSkip,
  isMobile,
  onBeforeStep,
}: OnboardingTourProps) {
  const steps = useMemo(() => getVisibleSteps(isMobile), [isMobile]);
  const [stepIndex, setStepIndex] = useState(0);
  const [spotlight, setSpotlight] = useState<SpotlightRect | null>(null);
  const [tooltipPlacement, setTooltipPlacement] = useState<'below' | 'above'>('below');

  const currentStep = steps[stepIndex];
  const isLastStep = stepIndex >= steps.length - 1;

  const measureTarget = useCallback(() => {
    if (!currentStep) return;
    const target = document.getElementById(currentStep.targetId);
    if (!target) {
      setSpotlight(null);
      return;
    }

    const rect = target.getBoundingClientRect();
    const next: SpotlightRect = {
      top: Math.max(PADDING, rect.top - PADDING),
      left: Math.max(PADDING, rect.left - PADDING),
      width: Math.min(window.innerWidth - PADDING * 2, rect.width + PADDING * 2),
      height: rect.height + PADDING * 2,
    };
    setSpotlight(next);
    setTooltipPlacement(next.top + next.height + 220 > window.innerHeight ? 'above' : 'below');
  }, [currentStep]);

  const goToStep = useCallback(
    (index: number) => {
      const step = steps[index];
      if (!step) return;

      if (step.scrollTo) {
        document.getElementById(step.scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      onBeforeStep?.(step);

      if (step.id === 'map' && isMobile) {
        // Ensure map tab is visible for the spotlight on mobile
        window.dispatchEvent(new CustomEvent('playalibre:guide-show-map'));
      }
      if (step.id === 'beach-list' && isMobile) {
        window.dispatchEvent(new CustomEvent('playalibre:guide-show-list'));
      }

      setStepIndex(index);
    },
    [steps, onBeforeStep, isMobile]
  );

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      setSpotlight(null);
      return;
    }

    const timer = window.setTimeout(() => goToStep(0), 400);
    return () => clearTimeout(timer);
  }, [isOpen, goToStep]);

  useEffect(() => {
    if (!isOpen || !currentStep) return;

    const timers = [120, 350, 700].map((ms) => window.setTimeout(measureTarget, ms));
    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);

    return () => {
      timers.forEach(clearTimeout);
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [isOpen, currentStep, stepIndex, measureTarget]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSkip();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onSkip]);

  if (!isOpen || !currentStep) return null;

  const tooltipStyle =
    spotlight && tooltipPlacement === 'below'
      ? { top: spotlight.top + spotlight.height + 16, left: Math.max(16, Math.min(spotlight.left, window.innerWidth - 360)) }
      : spotlight
        ? { top: Math.max(16, spotlight.top - 16), left: Math.max(16, Math.min(spotlight.left, window.innerWidth - 360)), transform: 'translateY(-100%)' }
        : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  return (
    <div className="fixed inset-0 z-[25000]" role="dialog" aria-modal="true" aria-labelledby="onboarding-tour-title">
      <div className="absolute inset-0 bg-black/55" onClick={onSkip} aria-hidden />

      {spotlight ? (
        <div
          className="absolute rounded-xl border-2 border-white/90 pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
          }}
        />
      ) : null}

      <div
        className="absolute w-[min(92vw,340px)] rounded-2xl border border-gray-200 bg-white shadow-2xl p-5 text-left"
        style={spotlight ? tooltipStyle : { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Paso {stepIndex + 1} de {steps.length}
            </p>
            <h3 id="onboarding-tour-title" className="text-base font-bold text-gray-900 mt-1">
              {currentStep.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"
            aria-label="Omitir recorrido"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{currentStep.body}</p>

        {!spotlight ? (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 mt-3">
            Desplácese hasta el área de trabajo si el elemento resaltado no es visible.
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onSkip}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            Omitir recorrido
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={stepIndex === 0}
              onClick={() => goToStep(stepIndex - 1)}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
              Anterior
            </button>
            <button
              type="button"
              onClick={() => {
                if (isLastStep) {
                  onComplete();
                  onClose();
                  return;
                }
                goToStep(stepIndex + 1);
              }}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold"
            >
              {isLastStep ? 'Finalizar' : 'Siguiente'}
              {!isLastStep ? <ChevronRight size={14} /> : null}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
