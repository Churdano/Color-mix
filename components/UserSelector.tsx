
import React from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

interface UserSelectorProps {
  onLoginSuccess: () => void;
  onGuestLogin: () => void;
}

const UserSelector: React.FC<UserSelectorProps> = ({ onLoginSuccess, onGuestLogin }) => {
  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLoginSuccess();
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user') {
        console.log("El usuario cerró la ventana emergente de inicio de sesión.");
        return;
      }
      console.error("Error logging in:", error);
      alert("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in-up">
      <div className="text-center mb-12 relative">
        <div className="absolute -inset-10 bg-orange-500/10 blur-[50px] rounded-full pointer-events-none"></div>
        <h1 className="relative text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-stone-100 to-stone-400 mb-4 tracking-tight drop-shadow-sm font-sans">
          ColorMix Atelier
        </h1>
        <p className="text-orange-200/60 text-lg font-light">Inicia sesión para acceder a tu mesa de trabajo y guardar tus mezclas.</p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={handleLogin}
          className="flex items-center space-x-3 bg-white text-stone-900 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-stone-200 transition-colors w-full justify-center"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          <span>Continuar con Google</span>
        </button>
        
        <button
          onClick={onGuestLogin}
          className="flex items-center space-x-2 text-stone-400 hover:text-stone-200 transition-colors text-sm font-medium px-4 py-2"
        >
          <span>Probar sin iniciar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default UserSelector;
