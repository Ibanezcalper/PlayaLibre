import { X, Award, Edit3 } from 'lucide-react';
import type { UserProfile } from '../../types';

interface UserProfileViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUserProfile: any; // Can contain additional fields or fallback structures
  userProfile: UserProfile | null;
  isEditingBio: boolean;
  setIsEditingBio: (editing: boolean) => void;
  editBioText: string;
  setEditBioText: (text: string) => void;
  onSaveBio: () => void;
  userStats: { beachesCount: number; accessesCount: number; photosCount: number };
}

export function UserProfileViewModal({
  isOpen,
  onClose,
  selectedUserProfile,
  userProfile,
  isEditingBio,
  setIsEditingBio,
  editBioText,
  setEditBioText,
  onSaveBio,
  userStats
}: UserProfileViewModalProps) {
  if (!isOpen || !selectedUserProfile) return null;

  const isCurator =
    selectedUserProfile.email === 'marpc331@gmail.com' ||
    selectedUserProfile.id === 'curator-mock-id' ||
    (selectedUserProfile.id && selectedUserProfile.id.includes('curator')) ||
    selectedUserProfile.username?.includes('marpc331');

  const isOwnProfile = userProfile && userProfile.id === selectedUserProfile.id;

  return (
    <div className="fixed inset-0 z-[11000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#EFEFEF] border border-gray-300 rounded-3xl overflow-hidden shadow-2xl p-6 text-left space-y-5 animate-fade-in">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-gray-500 transition-colors"
          title="Cerrar"
        >
          <X size={16} />
        </button>

        {/* Header / Avatar */}
        <div className="flex items-center gap-4 pb-4 border-b border-gray-250">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0871E7] to-indigo-600 flex items-center justify-center text-3xl shadow-md select-none">
            {selectedUserProfile.avatarUrl && selectedUserProfile.avatarUrl.startsWith('preset:') ? (
              <span>{selectedUserProfile.avatarUrl.split(':')[1]}</span>
            ) : (
              <span>👤</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate flex items-center gap-2 font-fustat leading-none">
              {selectedUserProfile.username}
              {isCurator && (
                <span 
                  className="flex items-center gap-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-600 rounded-full px-1.5 py-0.2 text-[8px] font-bold select-none"
                  title="Curador de la comunidad"
                >
                  <Award size={9} />
                  <span>Curador</span>
                </span>
              )}
            </h3>
            <span className="text-[10px] font-semibold text-[#0871E7] bg-blue-50 border border-blue-150 px-2.5 py-0.5 rounded-full inline-block mt-1.5 select-none leading-none">
              ★ {selectedUserProfile.reputation} karma
            </span>
          </div>
        </div>

        {/* Biography / Description Section */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-gray-700 uppercase text-[9px] tracking-wider select-none">Acerca de</h4>
          {isOwnProfile ? (
            isEditingBio ? (
              <div className="space-y-2">
                <textarea
                  rows={3}
                  value={editBioText}
                  onChange={(e) => setEditBioText(e.target.value)}
                  placeholder="Escribe algo sobre ti..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 text-gray-955 placeholder-gray-400 outline-none focus:border-[#0871E7] font-sans"
                  maxLength={150}
                />
                <div className="flex gap-2">
                  <button
                    onClick={onSaveBio}
                    className="px-3.5 py-1.5 bg-[#0871E7] hover:bg-[#065ec2] text-white rounded-lg font-semibold text-[10px] transition-all shadow"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingBio(false);
                      setEditBioText(selectedUserProfile.bio || '');
                    }}
                    className="px-3.5 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold text-[10px] transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="group relative bg-gray-200/40 border border-gray-300/40 p-3.5 rounded-xl min-h-[50px] flex items-center justify-between gap-2">
                <p className="text-gray-655 leading-relaxed italic pr-8 text-left">
                  {selectedUserProfile.bio || 'Haz clic en el lápiz para agregar una descripción sobre ti.'}
                </p>
                <button
                  onClick={() => {
                    setIsEditingBio(true);
                    setEditBioText(selectedUserProfile.bio || '');
                  }}
                  className="absolute top-2.5 right-2.5 p-1 text-gray-400 hover:text-gray-700 hover:bg-black/5 rounded-full transition-all"
                  title="Editar descripción"
                >
                  <Edit3 size={12} />
                </button>
              </div>
            )
          ) : (
            <div className="bg-gray-200/40 border border-gray-300/40 p-3.5 rounded-xl min-h-[50px] flex items-center">
              <p className="text-gray-655 leading-relaxed italic text-left">
                {selectedUserProfile.bio || 'Este colaborador aún no ha escrito una descripción.'}
              </p>
            </div>
          )}
        </div>

        {/* Contributions / Aportes Section */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-gray-700 uppercase text-[9px] tracking-wider select-none">Aportes a la comunidad</h4>
          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white border border-gray-200 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-lg font-bold text-gray-800">{userStats.beachesCount}</span>
              <span className="text-[8px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider select-none">Playas</span>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-lg font-bold text-gray-800">{userStats.accessesCount}</span>
              <span className="text-[8px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider select-none">Rutas</span>
            </div>
            <div className="bg-white border border-gray-200 p-3 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
              <span className="text-lg font-bold text-gray-800">{userStats.photosCount}</span>
              <span className="text-[8px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider select-none">Fotos</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-center text-[9px] text-gray-400 border-t border-gray-200 leading-normal select-none">
          Colaborando por un México con playas públicas y libres
        </div>

      </div>
    </div>
  );
}
