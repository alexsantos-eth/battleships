# Guía de Match Multiplayer - Prueba de Conexión

## Descripción

La página de Match es una nueva funcionalidad que permite probar la conexión en tiempo real entre dos jugadores en una sala. Esta página sirve como base para futuras implementaciones del juego multiplayer.

## Características

### 🔗 **Conexión en Tiempo Real**
- Suscripción automática a cambios en la sala
- Actualización en tiempo real del estado de los jugadores
- Chat en tiempo real entre jugadores

### 👥 **Gestión de Jugadores**
- Visualización del estado de ambos jugadores (Host e Invitado)
- Indicadores visuales de "Listo/No Listo"
- Estado de conexión visible

### 💬 **Sistema de Chat**
- Mensajes en tiempo real
- Identificación del remitente
- Timestamps en los mensajes
- Botones de prueba predefinidos

### 🎮 **Botones de Prueba**
- **Mensaje de Saludo**: Envía un saludo automático
- **Test Conexión**: Prueba la conectividad
- **Identificarse**: Envía un mensaje con el nombre del jugador
- **Cambiar Estado**: Alterna el estado "Listo/No Listo"

## Cómo Usar

### 1. **Acceso a la Página**
```
URL: /match/{roomId}
Ejemplo: /match/abc123def456
```

### 2. **Flujo de Uso**

#### **Paso 1: Crear/Unirse a una Sala**
1. Ve a `/multiplayer`
2. Crea una sala o únete a una existente
3. Ambos jugadores deben marcarse como "Listos"

#### **Paso 2: Ir al Match**
1. Cuando ambos jugadores estén listos, aparecerá el botón "Ir al Match"
2. Haz clic en el botón para ir a la página de prueba

#### **Paso 3: Probar la Conexión**
1. **Enviar mensajes**: Usa el chat para comunicarte
2. **Cambiar estado**: Prueba el botón "Listo/No Listo"
3. **Usar botones de prueba**: Prueba los botones predefinidos
4. **Observar cambios**: Los cambios se reflejan en tiempo real

### 3. **Funcionalidades del Chat**

#### **Enviar Mensaje Manual**
```typescript
// En el input de texto
Escribe tu mensaje y presiona Enter o haz clic en "Enviar"
```

#### **Botones de Prueba Automática**
```typescript
// Mensaje de saludo
sendMessage('¡Hola! ¿Cómo estás?');

// Test de conexión
sendMessage('Probando conexión en tiempo real...');

// Identificación
sendMessage(`Soy ${currentPlayer.displayName} y estoy conectado!`);
```

## Estructura de Datos

### **GameRoom (Actualizada)**
```typescript
interface GameRoom {
  id: string;
  roomCode: string;
  status: 'waiting' | 'playing' | 'finished';
  host: RoomPlayer;
  guest?: RoomPlayer;
  createdAt: number;
  updatedAt: number;
  gameConfig?: GameConfig;
  gameState?: GameState;
  messages?: MatchMessage[]; // ✅ Nuevo campo
}
```

### **MatchMessage**
```typescript
interface MatchMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}
```

### **MatchConnectionState**
```typescript
interface MatchConnectionState {
  room: GameRoom | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  messages: MatchMessage[];
  currentPlayer: RoomPlayer | null;
  otherPlayer: RoomPlayer | null;
}
```

## Componentes Creados

### **1. useMatchConnection Hook**
- **Archivo**: `src/hooks/useMatchConnection.ts`
- **Función**: Maneja toda la lógica de conexión y estado
- **Características**:
  - Suscripción automática a la sala
  - Gestión de mensajes
  - Control de estado de jugadores
  - Manejo de errores

### **2. Página Match**
- **Archivo**: `src/pages/Match/index.tsx`
- **Función**: Interfaz de usuario para la prueba de conexión
- **Características**:
  - Diseño responsive
  - Chat en tiempo real
  - Panel de jugadores
  - Botones de prueba

### **3. RoomService (Actualizado)**
- **Archivo**: `src/services/room.ts`
- **Nuevos métodos**:
  - `sendMessage()`: Envía mensajes a la sala
  - `subscribeToMessages()`: Suscripción a mensajes

## Rutas Configuradas

### **App.tsx**
```typescript
<Route path="/match/:roomId" element={<Match />} />
```

### **RoomLobby**
- Botón "Ir al Match" aparece cuando ambos jugadores están listos
- Redirección automática a `/match/{roomId}`

## Pruebas de Funcionalidad

### **1. Conexión Básica**
- ✅ Crear sala
- ✅ Unirse a sala
- ✅ Ver estado de jugadores
- ✅ Cambiar estado "Listo"

### **2. Chat en Tiempo Real**
- ✅ Enviar mensajes
- ✅ Recibir mensajes
- ✅ Ver timestamps
- ✅ Identificar remitente

### **3. Sincronización**
- ✅ Estado de jugadores sincronizado
- ✅ Mensajes sincronizados
- ✅ Cambios en tiempo real

### **4. Manejo de Errores**
- ✅ Sala no encontrada
- ✅ Sin acceso a sala
- ✅ Error de conexión
- ✅ Desconexión

## Próximos Pasos

### **Fase 1: Juego Básico** ✅
- [x] Conexión en tiempo real
- [x] Chat entre jugadores
- [x] Estado de jugadores
- [x] Pruebas de conectividad

### **Fase 2: Juego Completo** 🚧
- [ ] Implementar tablero de juego
- [ ] Colocación de barcos
- [ ] Turnos de disparo
- [ ] Lógica de victoria/derrota

### **Fase 3: Mejoras** 📋
- [ ] Sonidos y efectos
- [ ] Animaciones
- [ ] Estadísticas
- [ ] Historial de partidas

## Troubleshooting

### **Problemas Comunes**

#### **1. No se conecta a la sala**
- Verificar que el `roomId` sea correcto
- Verificar que el usuario esté autenticado
- Verificar las reglas de Firebase

#### **2. Los mensajes no aparecen**
- Verificar conexión a internet
- Verificar suscripción a mensajes
- Verificar permisos de Firebase

#### **3. Estado no se actualiza**
- Verificar suscripción a la sala
- Verificar que el usuario esté en la sala
- Verificar permisos de escritura

### **Debug**
```typescript
// En la consola del navegador
console.log('Room state:', room);
console.log('Connection state:', isConnected);
console.log('Messages:', messages);
```

## Conclusión

La página de Match proporciona una base sólida para probar la conectividad en tiempo real entre jugadores. Esta implementación sienta las bases para el desarrollo del juego multiplayer completo.

**Estado Actual**: ✅ **Funcional y listo para pruebas** 