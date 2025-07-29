# Firebase Realtime Database Troubleshooting Guide

## Problema: Los mensajes se envían pero no se actualiza la UI en tiempo real

### Descripción del Problema
Los mensajes se envían correctamente a Firebase, pero la interfaz de usuario no se actualiza en tiempo real para mostrar los nuevos mensajes.

### Causa Raíz
El problema principal es que la configuración de Firebase está usando valores de demostración en lugar de credenciales reales de un proyecto Firebase. Específicamente:

1. **Falta `databaseURL`**: La configuración de Firebase no incluye la URL de la base de datos en tiempo real
2. **Credenciales de demostración**: Se están usando valores de demo que no conectan a una base de datos real

### Solución

#### Paso 1: Configurar un Proyecto Firebase Real

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Realtime Database** en tu proyecto
4. Configura las reglas de seguridad para permitir lectura/escritura

#### Paso 2: Obtener las Credenciales

En la configuración del proyecto Firebase, obtén:
- API Key
- Auth Domain
- Project ID
- Storage Bucket
- Messaging Sender ID
- App ID
- **Database URL** (importante para Realtime Database)

#### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
VITE_FIREBASE_API_KEY=tu-api-key-real
VITE_FIREBASE_AUTH_DOMAIN=tu-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu-project-id
VITE_FIREBASE_STORAGE_BUCKET=tu-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_DATABASE_URL=https://tu-project-id-default-rtdb.firebaseio.com
```

#### Paso 4: Verificar la Configuración

La configuración en `src/config/firebase.ts` ya está actualizada para incluir `databaseURL`:

```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://demo-project-id-default-rtdb.firebaseio.com",
};
```

### Verificación

#### 1. Verificar Conexión
Abre las herramientas de desarrollador del navegador y verifica:
- No hay errores de conexión en la consola
- Los logs muestran "✅ Conexión establecida para la sala"
- Los logs muestran "📨 Mensajes recibidos en suscripción"

#### 2. Probar Mensajes
1. Abre dos pestañas del navegador
2. Ve a `/multiplayer` en ambas
3. Crea una sala en una pestaña y únete desde la otra
4. Ve al match (`/match/{roomId}`)
5. Envía mensajes desde ambas pestañas
6. Verifica que los mensajes aparecen en tiempo real

### Debugging

#### Logs Esperados
```
✅ Conexión establecida para la sala: {roomId}
📨 Mensajes recibidos en suscripción: 0
💬 Hook: Intentando enviar mensaje: {message}
📤 Enviando mensaje: {message}
✅ Mensaje enviado exitosamente
📨 Mensajes recibidos en suscripción: 1
📨 Hook: Mensajes recibidos: 1 [{message}]
```

#### Logs de Error Comunes
```
❌ Error enviando mensaje: Error: permission_denied
❌ Error enviando mensaje: Error: database/not-found
❌ Document subscription error: Error: permission_denied
```

### Reglas de Seguridad

Asegúrate de que las reglas en `database.rules.json` permitan lectura/escritura:

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
    }
  }
}
```

### Comandos Útiles

#### Desplegar Reglas
```bash
./deploy-rules.sh
```

#### Verificar Estado de Firebase
```bash
firebase projects:list
firebase use <project-id>
firebase database:get /rooms
```

### Próximos Pasos

Una vez configurado correctamente:
1. Los mensajes se enviarán y recibirán en tiempo real
2. La UI se actualizará automáticamente
3. Podrás continuar con el desarrollo del juego multiplayer

### Notas Importantes

- **Nunca commits credenciales reales** al repositorio
- Usa `.env` para variables de entorno locales
- Para producción, configura las variables de entorno en tu plataforma de hosting
- Las reglas de seguridad deben ser apropiadas para tu caso de uso

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