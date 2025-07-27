import React from 'react';
import type { LoadingScreenProps } from './LoadingScreen.types';

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = "Inicializando partida...",
  className = ''
}) => {
  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center z-50 ${className}`}>
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 max-w-md w-full mx-4 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h2 className="text-2xl font-bold text-white mb-2">Armada.io</h2>
        <p className="text-blue-200">{message}</p>
      </div>
    </div>
  );
}; 