# Guía de Multiplayer - Armada.io

## Descripción General

El sistema de multiplayer permite a los jugadores crear y unirse a salas de juego para enfrentarse entre sí. La primera fase implementa la funcionalidad básica de salas con códigos de 5 caracteres.

## Arquitectura

### Tipos de Datos

#### `GameRoom`
```typescript
interface GameRoom {
  id: string;
  roomCode: string;        // Código de 5 caracteres para unirse
  status: RoomStatus;      // 'waiting' | 'playing' | 'finished'
  host: RoomPlayer;        // Jugador que creó la sala
  guest?: RoomPlayer;      // Jugador que se unió
  createdAt: number;
  updatedAt: number;
  gameConfig?: GameConfig;
  gameState?: GameState;
}
```

#### `RoomPlayer`
```typescript
interface RoomPlayer {
  uid: string;             // ID del usuario autenticado
  displayName: string;     // Nombre mostrado en el juego
  role: PlayerRole;        // 'host' | 'guest'
  joinedAt: number;        // Timestamp de cuando se unió
  isReady: boolean;        // Estado de listo para jugar
}
```

### Servicios

#### `RoomService`
- **createRoom**: Crea una nueva sala con un código único
- **joinRoom**: Une un jugador a una sala existente
- **getRoom**: Obtiene información de una sala
- **updatePlayerReady**: Actualiza el estado de "listo" de un jugador
- **startGame**: Inicia el juego cuando ambos jugadores están listos
- **leaveRoom**: Permite a un jugador salir de la sala
- **subscribeToRoom**: Suscripción en tiempo real a cambios en la sala

### Hooks

#### `useRoom`
Proporciona una interfaz React para manejar el estado de las salas:

```typescript
const {
  room,           // Estado actual de la sala
  loading,        // Estado de carga
  error,          // Errores
  createRoom,     // Función para crear sala
  joinRoom,       // Función para unirse
  setPlayerReady, // Marcar como listo
  startGame,      // Iniciar juego
  leaveRoom,      // Salir de la sala
  isHost,         // Si el usuario es host
  isGuest,        // Si el usuario es invitado
  currentPlayer,  // Información del jugador actual
  otherPlayer     // Información del otro jugador
} = useRoom(roomId);
```

## Componentes UI

### `MultiplayerMenu`
Componente principal para crear o unirse a salas:

- **Modo Menú**: Opciones para crear o unirse
- **Modo Crear**: Formulario para crear nueva sala
- **Modo Unirse**: Formulario para unirse con código

### `RoomLobby`
Componente de sala de espera:

- Muestra el código de la sala
- Lista de jugadores y su estado
- Botones para marcar como listo
- Botón para iniciar juego (solo host)

## Flujo de Usuario

### Crear Sala
1. Usuario hace clic en "Crear Nueva Sala"
2. Ingresa su nombre de jugador
3. Se genera un código único de 5 caracteres
4. Usuario espera a que otro jugador se una

### Unirse a Sala
1. Usuario hace clic en "Unirse a Sala"
2. Ingresa su nombre y el código de sala
3. Se valida que la sala existe y tiene espacio
4. Usuario se une a la sala de espera

### Sala de Espera
1. Ambos jugadores ven el código de la sala
2. Cada jugador marca "Estoy Listo"
3. Cuando ambos están listos, el host puede iniciar
4. El juego comienza con la configuración predeterminada

## Estructura de Firestore

### Colección `rooms`
```javascript
{
  id: "auto-generated",
  roomCode: "ABC12",
  status: "waiting",
  host: {
    uid: "user123",
    displayName: "Jugador1",
    role: "host",
    joinedAt: 1234567890,
    isReady: false
  },
  guest: {
    uid: "user456",
    displayName: "Jugador2", 
    role: "guest",
    joinedAt: 1234567891,
    isReady: true
  },
  createdAt: 1234567890,
  updatedAt: 1234567891,
  gameConfig: {
    boardWidth: 10,
    boardHeight: 10,
    shipCounts: {
      small: 2,
      medium: 2,
      large: 1,
      xlarge: 1
    }
  }
}
```

## Validaciones

### Código de Sala
- Debe ser exactamente 5 caracteres
- Solo letras mayúsculas y números
- Debe ser único en la base de datos
- Máximo 10 intentos para generar código único

### Unirse a Sala
- La sala debe existir
- La sala debe estar en estado "waiting"
- No debe tener un invitado ya
- El código debe coincidir exactamente

### Iniciar Juego
- Solo el host puede iniciar
- Ambos jugadores deben estar listos
- La sala debe estar en estado "waiting"

## Manejo de Errores

### Errores Comunes
- "Sala no encontrada": Código incorrecto
- "La sala ya está llena": Ya hay un invitado
- "La sala ya no está disponible": Estado diferente a "waiting"
- "No se pudo generar un código único": Error interno

### Recuperación
- Los usuarios pueden intentar unirse nuevamente
- Las salas vacías se eliminan automáticamente
- Los usuarios pueden salir y crear nuevas salas

## Próximas Fases

### Fase 2: Juego en Tiempo Real
- Sincronización del estado del juego
- Turnos alternados entre jugadores
- Actualización en tiempo real de disparos
- Detección de fin de juego

### Fase 3: Características Avanzadas
- Chat en tiempo real
- Configuración personalizada de partidas
- Historial de partidas
- Estadísticas de jugadores

## Consideraciones Técnicas

### Seguridad
- Validación de autenticación en todas las operaciones
- Verificación de permisos (solo host puede iniciar)
- Sanitización de datos de entrada

### Rendimiento
- Suscripciones en tiempo real optimizadas
- Limpieza automática de salas vacías
- Índices en Firestore para consultas eficientes

### Escalabilidad
- Códigos de sala únicos distribuidos
- Manejo de concurrencia en operaciones críticas
- Estructura preparada para múltiples salas simultáneas 