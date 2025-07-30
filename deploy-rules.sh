#!/bin/bash

echo "🚀 Desplegando reglas de Firebase Realtime Database..."

# Verificar si firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# Verificar si estás logueado
if ! firebase projects:list &> /dev/null; then
    echo "❌ No estás logueado en Firebase. Ejecuta: firebase login"
    exit 1
fi

# Desplegar las reglas
echo "📝 Desplegando reglas de seguridad..."
firebase deploy --only database

echo "✅ Reglas desplegadas exitosamente!"
echo "🔍 Ahora puedes hacer consultas por roomCode sin problemas." 