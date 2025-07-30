import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/auth/stores/data/authStore";
import { useUserProfile } from "@/user/hooks/profile/useUserProfile";
import { roomService } from "@/services/room/realtime";
import type { PlayerRole } from "@/types/game/common";

const MultiplayerPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { profile, loadProfile } = useUserProfile();
  const [roomCode, setRoomCode] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/");
      return;
    }

    if (user && !profile) {
      loadProfile(user.uid);
    }
  }, [isAuthenticated, user, navigate, profile, loadProfile]);

  const handleCreateRoom = async () => {
    if (!user || !profile) {
      setError("Debes estar autenticado para crear una sala");
      return;
    }

    setIsCreating(true);
    setError(null);
    setSuccess(null);

    try {
      const room = await roomService.createRoom({
        uid: user.uid,
        displayName: profile.displayName,
        role: "host" as PlayerRole,
      });

      setSuccess(`Sala creada exitosamente! Código: ${room.roomCode}`);
      setTimeout(() => {
        navigate(`/match/${room.id}`);
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al crear la sala");
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!user || !profile) {
      setError("Debes estar autenticado para unirte a una sala");
      return;
    }

    if (!roomCode.trim()) {
      setError("Por favor ingresa un código de sala");
      return;
    }

    setIsJoining(true);
    setError(null);
    setSuccess(null);

    try {
      const room = await roomService.joinRoom(roomCode.trim().toUpperCase(), {
        uid: user.uid,
        displayName: profile.displayName,
        role: "guest" as PlayerRole,
      });

      setSuccess("Te has unido exitosamente a la sala!");
      setTimeout(() => {
        navigate(`/match/${room.id}`);
      }, 2000);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Error al unirse a la sala");
    } finally {
      setIsJoining(false);
    }
  };

  const handleRoomCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setRoomCode(value);
    setError(null);
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Acceso Requerido
          </h1>
          <p className="text-white/80">
            Debes iniciar sesión para acceder al modo multijugador.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          Multijugador
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <p className="text-green-200 text-sm">{success}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white mb-4">
              Crear Nueva Sala
            </h2>
            <button
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
            >
              {isCreating ? "Creando..." : "Crear Sala"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-transparent text-white/60">o</span>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4 text-center">
              Unirse a Sala
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="roomCode" className="block text-white/80 text-sm font-medium mb-2">
                  Código de Sala
                </label>
                <input
                  id="roomCode"
                  type="text"
                  value={roomCode}
                  onChange={handleRoomCodeChange}
                  placeholder="Ej: ABC12"
                  maxLength={5}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleJoinRoom}
                disabled={isJoining || !roomCode.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isJoining ? "Uniéndose..." : "Unirse a Sala"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            ← Volver al Inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerPage; 