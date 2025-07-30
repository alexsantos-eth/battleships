# Guía de Firebase Realtime Database - Armada.io

## Descripción General

El sistema de Firebase Realtime Database proporciona una capa de abstracción sobre Firebase Realtime Database para simplificar las operaciones comunes de CRUD, consultas, suscripciones y transacciones.

## Diferencias con Firestore

### Firebase Realtime Database vs Firestore

| Característica | Realtime Database | Firestore |
|----------------|-------------------|-----------|
| **Estructura** | JSON tree | Documentos y colecciones |
| **Consultas** | Basadas en nodos | Consultas complejas |
| **Escalabilidad** | Hasta 100,000 conexiones | Escalabilidad automática |
| **Costo** | Basado en transferencia | Basado en operaciones |
| **Tiempo real** | Nativo | Nativo |
| **Offline** | Soporte básico | Soporte avanzado |

## Arquitectura

### Clase `RealtimeDatabase`

Clase singleton que encapsula todas las operaciones de Firebase Realtime Database con manejo de errores y tipado fuerte.

### Objeto `dbUtils`

Interfaz simplificada que expone los métodos más comunes de la clase `RealtimeDatabase`.

## Funciones Principales

### Operaciones CRUD Básicas

#### `createDocument<T>`
```typescript
async createDocument<T extends Record<string, unknown>>(
  path: string,
  data: T,
  documentId?: string
): Promise<string>
```

**Descripción**: Crea un nuevo documento en la ruta especificada.

**Parámetros**:
- `path`: Ruta en la base de datos (ej: 'rooms/room123')
- `data`: Datos del documento
- `documentId`: ID opcional (si no se proporciona, se genera automáticamente)

**Retorna**: ID del documento creado

**Ejemplo**:
```typescript
const roomId = await dbUtils.createDocument('rooms', {
  roomCode: 'ABC12',
  status: 'waiting',
  host: { uid: 'user123', displayName: 'Player1' }
});
```

#### `getDocument<T>`
```typescript
async getDocument<T>(
  path: string
): Promise<T | null>
```

**Descripción**: Obtiene un documento por su ruta.

**Ejemplo**:
```typescript
const room = await dbUtils.getDocument<GameRoom>('rooms/room123');
if (room) {
  console.log('Room found:', room.roomCode);
}
```

#### `updateDocument<T>`
```typescript
async updateDocument<T extends Record<string, unknown>>(
  path: string,
  data: Partial<T>
): Promise<void>
```

**Descripción**: Actualiza un documento existente.

**Ejemplo**:
```typescript
await dbUtils.updateDocument('rooms/room123', {
  status: 'playing',
  gameConfig: { boardWidth: 10, boardHeight: 10 }
});
```

#### `deleteDocument`
```typescript
async deleteDocument(
  path: string
): Promise<void>
```

**Descripción**: Elimina un documento.

### Consultas

#### `queryDocuments<T>`
```typescript
async queryDocuments<T>(
  path: string,
  constraints: RealtimeQueryConstraint[] = []
): Promise<T[]>
```

**Descripción**: Ejecuta una consulta con restricciones opcionales.

**Ejemplo**:
```typescript
const activeRooms = await dbUtils.queryDocuments<GameRoom>('rooms', [
  { type: 'orderByChild', field: 'status', value: 'waiting' },
  { type: 'orderByChild', field: 'createdAt', limit: 10, limitType: 'first' }
]);
```

#### `queryDocumentsPaginated<T>`
```typescript
async queryDocumentsPaginated<T>(
  path: string,
  options: PaginationOptions,
  constraints: RealtimeQueryConstraint[] = []
): Promise<{
  documents: T[];
  lastKey: string | null;
  hasMore: boolean;
}>
```

**Descripción**: Ejecuta una consulta paginada.

**Ejemplo**:
```typescript
const result = await dbUtils.queryDocumentsPaginated<GameRoom>('rooms', {
  pageSize: 10,
  orderByField: 'createdAt',
  orderDirection: 'desc'
}, [
  { type: 'orderByChild', field: 'status', value: 'waiting' }
]);

console.log(`Found ${result.documents.length} rooms`);
console.log('Has more:', result.hasMore);
```

### Suscripciones en Tiempo Real

#### `subscribeToDocument<T>`
```typescript
subscribeToDocument<T>(
  path: string,
  callback: (data: T | null) => void,
  options?: RealtimeOptions
): Unsubscribe
```

**Descripción**: Suscribe a cambios en un documento específico.

**Ejemplo**:
```typescript
const unsubscribe = dbUtils.subscribeToDocument<GameRoom>('rooms/room123', (room) => {
  if (room) {
    console.log('Room updated:', room.status);
  } else {
    console.log('Room deleted');
  }
});

// Limpiar suscripción
unsubscribe();
```

#### `subscribeToCollection<T>`
```typescript
subscribeToCollection<T>(
  path: string,
  callback: (documents: T[]) => void,
  constraints?: RealtimeQueryConstraint[],
  options?: RealtimeOptions
): Unsubscribe
```

**Descripción**: Suscribe a cambios en una colección.

**Ejemplo**:
```typescript
const unsubscribe = dbUtils.subscribeToCollection<GameRoom>('rooms', (rooms) => {
  console.log(`Active rooms: ${rooms.length}`);
}, [
  { type: 'orderByChild', field: 'status', value: 'waiting' }
]);
```

#### `subscribeToChildEvents<T>`
```typescript
subscribeToChildEvents<T>(
  path: string,
  callbacks: {
    onChildAdded?: (data: T) => void;
    onChildChanged?: (data: T) => void;
    onChildRemoved?: (data: T) => void;
  },
  options?: RealtimeOptions
): Unsubscribe[]
```

**Descripción**: Suscribe a eventos específicos de hijos (agregar, cambiar, eliminar).

**Ejemplo**:
```typescript
const unsubscribes = dbUtils.subscribeToChildEvents<GameRoom>('rooms', {
  onChildAdded: (room) => console.log('New room:', room.roomCode),
  onChildChanged: (room) => console.log('Room updated:', room.status),
  onChildRemoved: (room) => console.log('Room deleted:', room.roomCode)
});

// Limpiar suscripciones
unsubscribes.forEach(unsubscribe => unsubscribe());
```

### Operaciones Avanzadas

#### `batchWrite`
```typescript
async batchWrite(operations: Array<{
  type: 'create' | 'update' | 'delete';
  path: string;
  data?: Record<string, unknown>;
}>): Promise<void>
```

**Descripción**: Ejecuta múltiples operaciones en una sola transacción.

**Ejemplo**:
```typescript
await dbUtils.batchWrite([
  {
    type: 'create',
    path: 'rooms/room123',
    data: { roomCode: 'ABC12', status: 'waiting' }
  },
  {
    type: 'update',
    path: 'users/user123',
    data: { lastRoomId: 'room123' }
  }
]);
```

### Utilidades

#### `documentExists`
```typescript
async documentExists(
  path: string
): Promise<boolean>
```

**Descripción**: Verifica si un documento existe.

#### `countDocuments`
```typescript
async countDocuments(
  path: string,
  constraints: RealtimeQueryConstraint[] = []
): Promise<number>
```

**Descripción**: Cuenta documentos que coinciden con las restricciones.

#### `generateUniqueId`
```typescript
generateUniqueId(): string
```

**Descripción**: Genera un ID único para documentos.

#### `createTimestamp`
```typescript
createTimestamp()
```

**Descripción**: Crea un timestamp del servidor.

## Opciones de Configuración

### `RealtimeOptions`
```typescript
interface RealtimeOptions {
  includeMetadata?: boolean;
  errorHandler?: (error: Error) => void;
}
```

### `PaginationOptions`
```typescript
interface PaginationOptions {
  pageSize: number;
  orderByField?: string;
  orderDirection?: 'asc' | 'desc';
}
```

### `RealtimeQueryConstraint`
```typescript
interface RealtimeQueryConstraint {
  type: 'orderByChild' | 'orderByKey' | 'orderByValue';
  field?: string;
  value?: unknown;
  startAt?: unknown;
  endAt?: unknown;
  limit?: number;
  limitType?: 'first' | 'last';
}
```

## Estructura de Datos

### Ejemplo de Estructura en Realtime Database

```json
{
  "rooms": {
    "room123": {
      "roomCode": "ABC12",
      "status": "waiting",
      "host": {
        "uid": "user123",
        "displayName": "Player1",
        "role": "host",
        "joinedAt": 1234567890,
        "isReady": false
      },
      "guest": {
        "uid": "user456",
        "displayName": "Player2",
        "role": "guest",
        "joinedAt": 1234567891,
        "isReady": true
      },
      "createdAt": 1234567890,
      "updatedAt": 1234567891,
      "gameConfig": {
        "boardWidth": 10,
        "boardHeight": 10,
        "shipCounts": {
          "small": 2,
          "medium": 2,
          "large": 1,
          "xlarge": 1
        }
      }
    }
  },
  "users": {
    "user123": {
      "displayName": "Player1",
      "lastRoomId": "room123",
      "createdAt": 1234567890
    }
  }
}
```

## Manejo de Errores

Todas las funciones incluyen manejo de errores automático:

```typescript
try {
  const room = await dbUtils.getDocument<GameRoom>('rooms/room123');
} catch (error) {
  console.error('Error getting room:', error.message);
}
```

Para suscripciones, se puede proporcionar un manejador de errores personalizado:

```typescript
const unsubscribe = dbUtils.subscribeToDocument<GameRoom>('rooms/room123', 
  (room) => console.log('Room updated:', room),
  {
    errorHandler: (error) => {
      console.error('Subscription error:', error);
      // Reintentar conexión
    }
  }
);
```

## Patrones de Uso Comunes

### 1. Crear y Suscribir
```typescript
// Crear documento
const roomId = await dbUtils.createDocument('rooms', roomData);

// Suscribir a cambios
const unsubscribe = dbUtils.subscribeToDocument('rooms/' + roomId, (room) => {
  if (room) {
    setRoom(room);
  }
});

// Limpiar al desmontar
return () => unsubscribe();
```

### 2. Consulta con Filtros
```typescript
const waitingRooms = await dbUtils.queryDocuments<GameRoom>('rooms', [
  { type: 'orderByChild', field: 'status', value: 'waiting' },
  { type: 'orderByChild', field: 'host/uid', value: currentUserId },
  { type: 'orderByChild', field: 'createdAt', limit: 10, limitType: 'first' }
]);
```

### 3. Actualización Condicional
```typescript
const room = await dbUtils.getDocument<GameRoom>('rooms/room123');
if (room && room.status === 'waiting') {
  await dbUtils.updateDocument('rooms/room123', {
    status: 'playing',
    gameConfig: gameConfig
  });
}
```

### 4. Operaciones en Lote
```typescript
await dbUtils.batchWrite([
  { type: 'update', path: 'rooms/room123', data: { status: 'finished' } },
  { type: 'create', path: 'gameHistory/history123', data: { roomId: 'room123', winner: 'player1', timestamp: Date.now() } }
]);
```

## Ventajas del Sistema

### 1. **Tipado Fuerte**
- TypeScript completo con genéricos
- Autocompletado en IDEs
- Detección de errores en tiempo de compilación

### 2. **Consistencia**
- Manejo uniforme de timestamps
- Estructura de datos consistente
- Patrones de error estandarizados

### 3. **Simplicidad**
- API simplificada sobre Firebase Realtime Database
- Reducción de código boilerplate
- Funciones de alto nivel

### 4. **Rendimiento**
- Operaciones optimizadas
- Suscripciones eficientes
- Manejo de memoria automático

### 5. **Mantenibilidad**
- Código centralizado
- Fácil de extender
- Documentación completa

## Migración desde Firestore

### Antes (Firestore)
```typescript
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const roomDoc = await getDoc(doc(db, 'rooms', roomId));
if (roomDoc.exists()) {
  const room = roomDoc.data() as GameRoom;
  await updateDoc(doc(db, 'rooms', roomId), {
    status: 'playing',
    updatedAt: serverTimestamp()
  });
}
```

### Después (Realtime Database)
```typescript
import { dbUtils } from '@/utils/realtimeDatabase';

const room = await dbUtils.getDocument<GameRoom>(`rooms/${roomId}`);
if (room) {
  await dbUtils.updateDocument(`rooms/${roomId}`, {
    status: 'playing'
  });
}
```

## Consideraciones de Rendimiento

### 1. **Suscripciones**
- Limpiar suscripciones al desmontar componentes
- Usar restricciones para limitar datos
- Evitar suscripciones innecesarias

### 2. **Consultas**
- Usar índices apropiados en Firebase
- Limitar resultados con `limit`
- Usar paginación para grandes conjuntos de datos

### 3. **Estructura de Datos**
- Diseñar estructura plana cuando sea posible
- Evitar anidación profunda
- Usar IDs como claves para acceso directo

### 4. **Reglas de Seguridad**
- Configurar reglas de seguridad apropiadas
- Validar datos en el cliente y servidor
- Usar autenticación para proteger datos sensibles 