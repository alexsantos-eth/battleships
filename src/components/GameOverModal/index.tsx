import { useGameStore } from "@/stores/gameStore";

export const GameOverModal = () => {
  const { isGameOver, winner, resetGame } = useGameStore();

  if (!isGameOver) return null;

  const winnerText = winner === "player" ? "¡Jugador Gana!" : "¡Enemigo Gana!";
  const winnerColor = winner === "player" ? "text-green-500" : "text-red-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">¡Juego Terminado!</h2>
          <p className={`text-2xl font-semibold mb-6 ${winnerColor}`}>
            {winnerText}
          </p>
          <p className="text-gray-600 mb-8">
            {winner === "player" 
              ? "¡Felicitaciones! Has destruido todos los barcos enemigos."
              : "El enemigo ha destruido todos tus barcos. ¡Mejor suerte la próxima vez!"
            }
          </p>
          <button
            onClick={resetGame}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Jugar de Nuevo
          </button>
        </div>
      </div>
    </div>
  );
}; 