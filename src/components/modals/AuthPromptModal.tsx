import React from 'react';
import { X } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEmailAuthOpen: boolean;
  setIsEmailAuthOpen: (open: boolean) => void;
  emailAuthMode: 'login' | 'signup';
  setEmailAuthMode: (mode: 'login' | 'signup') => void;
  emailAuthEmail: string;
  setEmailAuthEmail: (email: string) => void;
  emailAuthPassword: string;
  setEmailAuthPassword: (password: string) => void;
  handleLogin: () => void;
  handleEmailPasswordSubmit: (e: React.FormEvent) => void;
}

export function AuthPromptModal({
  isOpen,
  onClose,
  isEmailAuthOpen,
  setIsEmailAuthOpen,
  emailAuthMode,
  setEmailAuthMode,
  emailAuthEmail,
  setEmailAuthEmail,
  emailAuthPassword,
  setEmailAuthPassword,
  handleLogin,
  handleEmailPasswordSubmit
}: AuthPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-6 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-900">Registro requerido</h3>
            <p className="text-[9.5px] text-gray-500 mt-0.5">Únete a la comunidad colaborativa de PlayaLibre</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-900 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {isEmailAuthOpen ? (
          <form onSubmit={handleEmailPasswordSubmit} className="space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
              <span className="font-bold text-gray-700">
                {emailAuthMode === 'login' ? 'Iniciar sesión con correo' : 'Crear cuenta con correo'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setEmailAuthMode(emailAuthMode === 'login' ? 'signup' : 'login');
                }}
                className="text-[#0871E7] font-semibold hover:underline"
              >
                {emailAuthMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Correo electrónico</label>
              <input
                type="email"
                required
                placeholder="correo@ejemplo.com"
                value={emailAuthEmail}
                onChange={(e) => setEmailAuthEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-gray-600 mb-1">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={emailAuthPassword}
                onChange={(e) => setEmailAuthPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-905 outline-none font-mono"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setIsEmailAuthOpen(false)}
                className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-all text-center"
              >
                Volver
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-[#0871E7] hover:bg-[#065ec2] text-white rounded-xl font-semibold transition-all text-center shadow"
              >
                {emailAuthMode === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 text-xs">
            <div className="bg-[#0871E7]/5 border border-[#0871E7]/25 p-4 rounded-2xl text-gray-700 leading-relaxed">
              <p>
                Para registrar una nueva playa o acceso público, necesitamos validar tu cuenta. Esto nos ayuda a:
              </p>
              <ul className="list-disc pl-4 mt-2 space-y-1 text-gray-600 font-medium">
                <li>Evitar registros falsos o duplicados en el mapa.</li>
                <li>Construir tu reputación como colaborador confiable.</li>
                <li>Permitirte gestionar y actualizar la información de las playas que registres.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleLogin}
                type="button"
                className="w-full py-3 bg-white hover:bg-gray-50 active:scale-[0.99] rounded-xl font-semibold text-gray-700 border border-gray-300 transition-all shadow-sm flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                </svg>
                <span>Continuar con Google</span>
              </button>
            </div>

            <div className="pt-4 text-center border-t border-gray-250 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEmailAuthOpen(true);
                  setEmailAuthMode('login');
                }}
                className="text-[#0871E7] font-semibold hover:underline"
              >
                O registrarse/iniciar sesión con correo y contraseña
              </button>
              <p className="text-[9.5px] text-gray-500 leading-normal">
                Al registrarte, aceptas nuestros términos de servicio y políticas de privacidad.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
