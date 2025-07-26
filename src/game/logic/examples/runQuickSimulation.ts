import { runQuickGameSimulation } from "./quickGameSimulation";

console.log("🚀 Iniciando simulación de juego rápido...\n");

const result = runQuickGameSimulation();

console.log("\n🎯 Resumen de la simulación:");
console.log(`- Turnos totales: ${result.totalTurns}`);
console.log(`- Ganador: ${result.winner}`);
console.log(`- Juego terminado: ${result.isGameOver ? "Sí" : "No"}`);

if (result.winner) {
  console.log(`\n🏆 ¡${result.winner === "player" ? "El jugador" : "El enemigo"} ha ganado!`);
} else {
  console.log("\n🤔 El juego no terminó correctamente");
} 