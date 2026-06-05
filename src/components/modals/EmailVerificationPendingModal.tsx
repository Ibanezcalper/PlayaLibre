import { Info } from 'lucide-react';

interface EmailVerificationPendingModalProps {
  isOpen: boolean;
  currentUser: any;
  emailAuthEmail: string;
  onVerifyCheck: () => void;
  onResendEmail: () => void;
  onCancel: () => void;
}

export function EmailVerificationPendingModal({
  isOpen,
  currentUser,
  emailAuthEmail,
  onVerifyCheck,
  onResendEmail,
  onCancel
}: EmailVerificationPendingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-6 text-left space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-250">
          <Info className="text-[#0871E7]" size={20} />
          <div>
            <h3 className="text-base font-bold text-gray-900">Verifica tu correo electrónico</h3>
            <p className="text-[9.5px] text-gray-500 mt-0.5">Requerido para activar tu cuenta colaborativa</p>
          </div>
        </div>

        <div className="text-xs text-gray-700 leading-relaxed space-y-3">
          <p>
            Hemos enviado un enlace de verificación a la dirección de correo:
          </p>
          <div className="p-3 bg-gray-200/60 border border-gray-350 rounded-xl text-center font-semibold text-gray-900">
            {currentUser?.email || emailAuthEmail}
          </div>
          <p>
            Sigue las instrucciones del enlace recibido en tu bandeja de entrada (revisa también tu carpeta de spam o correo no deseado) para verificar tu identidad. Una vez completado, pulsa el botón de abajo.
          </p>
        </div>

        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={onVerifyCheck}
            className="w-full py-3 bg-[#0871E7] hover:bg-[#065ec2] active:scale-[0.99] text-white rounded-xl font-semibold transition-all text-center shadow"
          >
            Ya verifiqué mi correo
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onResendEmail}
              className="flex-1 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-medium transition-all text-center text-[10px]"
            >
              Reenviar correo
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-all text-center text-[10px]"
            >
              Cancelar / Salir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
