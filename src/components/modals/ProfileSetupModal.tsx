import React from 'react';
import { AVATAR_PRESETS } from '../../constants';

interface ProfileSetupModalProps {
  isOpen: boolean;
  profileSetupUsername: string;
  setProfileSetupUsername: (username: string) => void;
  profileSetupAvatarUrl: string;
  setProfileSetupAvatarUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function ProfileSetupModal({
  isOpen,
  profileSetupUsername,
  setProfileSetupUsername,
  profileSetupAvatarUrl,
  setProfileSetupAvatarUrl,
  onSubmit
}: ProfileSetupModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-6 text-left">
        <div className="flex items-center justify-between pb-3 border-b border-gray-250 mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Crear perfil de usuario</h3>
            <p className="text-[9.5px] text-gray-500 mt-0.5">Elige un apodo y avatar para mantener tu privacidad</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-[9.5px] font-bold uppercase text-gray-600 mb-1">Nombre de usuario</label>
            <input
              type="text"
              required
              placeholder="Ej. GuardiánDeLaCosta"
              value={profileSetupUsername}
              onChange={(e) => setProfileSetupUsername(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-900 outline-none"
            />
            <p className="text-[10px] text-gray-500 mt-1.5 select-none leading-normal">
              Para garantizar la unicidad de tu cuenta, se le anexará automáticamente una etiqueta numérica derivada del tiempo de registro (ej. <strong>{profileSetupUsername.trim() || 'GuardiánDeLaCosta'}_{Date.now().toString().slice(-4)}</strong>).
            </p>
          </div>

          <div>
            <label className="block text-[9.5px] font-bold uppercase text-gray-600 mb-2">Elige tu avatar</label>
            <div className="grid grid-cols-4 gap-3 bg-gray-200/50 p-4 rounded-2xl border border-gray-300/40">
              {AVATAR_PRESETS.map((preset) => {
                const presetVal = `preset:${preset.emoji}:${preset.bg}`;
                const isSelected = profileSetupAvatarUrl === presetVal;
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setProfileSetupAvatarUrl(presetVal)}
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${preset.bg} flex items-center justify-center text-2xl transition-all duration-200 relative ${
                      isSelected ? 'scale-110 shadow-lg ring-4 ring-[#0871E7] ring-offset-2 ring-offset-[#EFEFEF]' : 'opacity-70 hover:opacity-100 hover:scale-105'
                    }`}
                    title={preset.label}
                  >
                    <span>{preset.emoji}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#0871E7] hover:brightness-105 rounded-xl font-semibold text-white transition-all shadow"
          >
            Guardar perfil
          </button>
        </form>
      </div>
    </div>
  );
}
