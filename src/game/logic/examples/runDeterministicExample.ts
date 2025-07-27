import { runAllExamples } from "./deterministicBattleExample.js";

console.log("🎯 Sistema Determinista de Armada");
console.log("=====================================\n");

try {
  runAllExamples();
} catch (error) {
  console.error("❌ Error ejecutando ejemplos:", error);
}
