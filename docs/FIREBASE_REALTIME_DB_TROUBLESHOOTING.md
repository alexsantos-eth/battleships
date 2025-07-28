# Firebase Realtime Database - Guía de Solución de Problemas

## Errores Comunes y Soluciones

### 1. Error de Índice No Definido

**Error:**
```
Error querying documents: Error: Index not defined, add ".indexOn": "roomCode", for path "/rooms", to the rules
```

**Solución:**
Agregar índices en las reglas de seguridad (`database.rules.json`):
```json
{
  "rules": {
    "rooms": {
      ".indexOn": ["roomCode", "status", "createdAt"]
    }
  }
}
```

### 2. Error de Clave Inválida en Update

**Error:**
```
Error updating document: Error: update failed: values argument contains an invalid key (guest.isReady) in path /guest.isReady. Keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"
```

**Causa:**
Firebase Realtime Database no permite notación de punto (`.`) en las claves cuando usas `update()`.

**Solución 1: Actualizar el objeto completo**
```typescript
// ❌ Incorrecto
await dbUtils.updateDocument(`rooms/${roomId}`, {
  "guest.isReady": true
});

// ✅ Correcto
const updatedGuest = { ...room.guest, isReady: true };
await dbUtils.updateDocument(`rooms/${roomId}`, {
  guest: updatedGuest
});
```

**Solución 2: Usar el método updateNestedField**
```typescript
// ✅ Alternativa usando el método especializado
await dbUtils.updateNestedField(`rooms/${roomId}`, 'guest/isReady', true);
```

### 3. Error de Autenticación

**Error:**
```
Error: Permission denied
```

**Solución:**
Verificar que el usuario esté autenticado y las reglas de seguridad permitan la operación.

### 4. Error de Conexión

**Error:**
```
Error: Network error
```

**Solución:**
- Verificar conexión a internet
- Verificar configuración de Firebase
- Verificar que el proyecto esté activo

## Mejores Prácticas

### 1. Estructura de Datos
```typescript
// ✅ Estructura recomendada
interface GameRoom {
  id: string;
  roomCode: string;
  status: 'waiting' | 'playing' | 'finished';
  host: {
    uid: string;
    displayName: string;
    isReady: boolean;
    joinedAt: number;
  };
  guest?: {
    uid: string;
    displayName: string;
    isReady: boolean;
    joinedAt: number;
  };
  createdAt: number;
  updatedAt: number;
}
```

### 2. Actualizaciones Seguras
```typescript
// ✅ Siempre actualizar objetos completos
const updatePlayerReady = async (roomId: string, playerUid: string, isReady: boolean) => {
  const room = await getRoom(roomId);
  if (!room) return;

  if (room.host.uid === playerUid) {
    const updatedHost = { ...room.host, isReady };
    await updateDocument(`rooms/${roomId}`, { host: updatedHost });
  }
};
```

### 3. Consultas Optimizadas
```typescript
// ✅ Usar índices correctos
const getRoomByCode = async (roomCode: string) => {
  const rooms = await queryDocuments('rooms', [
    { type: 'orderByChild', field: 'roomCode', value: roomCode }
  ]);
  return rooms[0] || null;
};
```

## Reglas de Seguridad Recomendadas

```json
{
  "rules": {
    "rooms": {
      ".indexOn": ["roomCode", "status", "createdAt"],
      "$roomId": {
        ".read": "auth != null",
        ".write": "auth != null",
        ".validate": "newData.hasChildren(['roomCode', 'status', 'host'])"
      }
    },
    "users": {
      "$userId": {
        ".read": "auth != null && auth.uid == $userId",
        ".write": "auth != null && auth.uid == $userId"
      }
    }
  }
}
```

## Debugging

### 1. Habilitar Logs
```typescript
// En desarrollo
const db = getDatabase(app);
if (process.env.NODE_ENV === 'development') {
  connectDatabaseEmulator(db, 'localhost', 9000);
}
```

### 2. Verificar Datos
```typescript
// Verificar estructura antes de actualizar
console.log('Room data:', room);
console.log('Update data:', updateData);
```

### 3. Manejo de Errores
```typescript
try {
  await dbUtils.updateDocument(path, data);
} catch (error) {
  console.error('Database error:', error);
  // Manejar error apropiadamente
}
``` 