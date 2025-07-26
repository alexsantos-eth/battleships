# Diagrama de Flujo de Armada.io

## Flujo Principal del Juego

```mermaid
flowchart TD
    A[Inicio del Juego] --> B[Inicializar Estado]
    B --> C[Generar Barcos Aleatorios]
    C --> D[Seleccionar Turno Inicial]
    D --> E{¿Es Turno del Jugador?}
    
    E -->|Sí| F[Posicionar Cámara en Tablero Enemigo]
    E -->|No| G[Posicionar Cámara en Tablero Jugador]
    
    F --> H[Jugador Hace Click]
    H --> I[Verificar Celda Válida]
    I -->|No Válida| F
    I -->|Válida| J[Verificar Impacto]
    
    G --> K[IA Dispara Aleatoriamente]
    K --> L[Verificar Impacto IA]
    
    J --> M{¿Impacto?}
    L --> N{¿Impacto IA?}
    
    M -->|Sí| O[Registrar Hit]
    M -->|No| P[Registrar Miss]
    
    N -->|Sí| Q[Registrar Hit IA]
    N -->|No| R[Registrar Miss IA]
    
    O --> S[Mostrar Efecto de Explosión]
    P --> T[Mostrar Efecto de Agua]
    
    Q --> U[Mostrar Efecto de Explosión]
    R --> V[Mostrar Efecto de Agua]
    
    S --> W[Verificar Barco Destruido]
    T --> X[Cambiar Turno]
    
    U --> Y[Verificar Barco Destruido IA]
    V --> Z[Cambiar Turno]
    
    W --> AA{¿Barco Destruido?}
    Y --> BB{¿Barco Destruido IA?}
    
    AA -->|Sí| CC[Verificar Fin de Juego]
    AA -->|No| X
    
    BB -->|Sí| DD[Verificar Fin de Juego]
    BB -->|No| Z
    
    X --> E
    Z --> E
    
    CC --> EE{¿Juego Terminado?}
    DD --> EE
    
    EE -->|Sí| FF[Mostrar Modal de Victoria]
    EE -->|No| E
    
    FF --> GG[Opción de Reiniciar]
    GG -->|Reiniciar| A
    GG -->|Salir| HH[Fin]
```

## Arquitectura de Componentes

```mermaid
graph TB
    subgraph "App.tsx"
        A[App Component]
    end
    
    subgraph "Game Store (Zustand)"
        B[gameStore]
        B1[currentTurn]
        B2[playerShips]
        B3[enemyShips]
        B4[playerShots]
        B5[enemyShots]
        B6[isGameOver]
    end
    
    subgraph "Componentes Visuales"
        C[GameGrid]
        D[PressGrid]
        E[PlayerShotsGrid]
        F[EnemyShotsGrid]
        G[ShipsPlane]
        H[WaterExplosion]
    end
    
    subgraph "Sistema de Cámara"
        I[CameraController]
        J[useCameraEvents]
        K[EventBus]
    end
    
    subgraph "Lógica del Juego"
        L[armada.ts]
        M[shipGenerator.ts]
        N[math.ts]
    end
    
    A --> B
    A --> C
    A --> I
    
    C --> D
    C --> E
    C --> F
    C --> G
    C --> H
    
    B --> D
    B --> E
    B --> F
    B --> G
    
    I --> J
    J --> K
    
    D --> K
    F --> K
    
    L --> B
    M --> B
    N --> B
```

## Flujo de Eventos

```mermaid
sequenceDiagram
    participant Player as Jugador
    participant PressGrid as PressGrid
    participant GameStore as GameStore
    participant Camera as CameraController
    participant EventBus as EventBus
    participant Enemy as IA Enemiga
    
    Player->>PressGrid: Click en celda
    PressGrid->>GameStore: checkShot(x, y)
    GameStore-->>PressGrid: {hit, shipId}
    PressGrid->>GameStore: addPlayerShot(shot)
    GameStore->>GameStore: checkGameOver()
    
    alt Si es hit
        PressGrid->>GameStore: isShipDestroyed(shipId)
        GameStore-->>PressGrid: destroyed
    end
    
    PressGrid->>EventBus: CAMERA_SHOOT_END
    EventBus->>Camera: handleShootEnd
    Camera->>GameStore: setEnemyTurn
    
    GameStore->>Enemy: Turno del enemigo
    Enemy->>GameStore: addEnemyShot(shot)
    GameStore->>GameStore: checkGameOver()
    
    alt Si juego terminado
        GameStore->>GameStore: setGameOver
    else Continuar
        EventBus->>Camera: CAMERA_SHOOT_START
        Camera->>GameStore: setPlayerTurn
    end
```

## Estados del Juego

```mermaid
stateDiagram-v2
    [*] --> Inicializando
    Inicializando --> Jugando
    Jugando --> TurnoJugador
    Jugando --> TurnoEnemigo
    
    TurnoJugador --> VerificandoDisparo
    VerificandoDisparo --> DisparoHit
    VerificandoDisparo --> DisparoMiss
    
    DisparoHit --> VerificandoBarco
    DisparoMiss --> TurnoEnemigo
    
    VerificandoBarco --> BarcoDestruido
    VerificandoBarco --> TurnoEnemigo
    
    BarcoDestruido --> VerificandoFinJuego
    TurnoEnemigo --> VerificandoDisparoIA
    
    VerificandoDisparoIA --> DisparoHitIA
    VerificandoDisparoIA --> DisparoMissIA
    
    DisparoHitIA --> VerificandoBarcoIA
    DisparoMissIA --> TurnoJugador
    
    VerificandoBarcoIA --> BarcoDestruidoIA
    VerificandoBarcoIA --> TurnoJugador
    
    BarcoDestruidoIA --> VerificandoFinJuego
    VerificandoFinJuego --> JuegoTerminado
    VerificandoFinJuego --> TurnoJugador
    
    JuegoTerminado --> [*]
```

## Estructura de Datos

```mermaid
classDiagram
    class Ship {
        +coords: [number, number]
        +variant: ShipVariant
        +orientation: "horizontal" | "vertical"
    }
    
    class Shot {
        +x: number
        +y: number
        +hit: boolean
        +shipId?: number
    }
    
    class GameState {
        +currentTurn: GameTurn
        +playerShips: Ship[]
        +enemyShips: Ship[]
        +playerShots: Shot[]
        +enemyShots: Shot[]
        +isGameOver: boolean
        +winner: "player" | "enemy" | null
        +checkShot()
        +isShipDestroyed()
        +checkGameOver()
        +toggleTurn()
    }
    
    class ArmadaGame {
        -playerBoard: GameBoard
        -enemyBoard: GameBoard
        -currentTurn: GameTurn
        +fireShot()
        +isShipDestroyed()
        +isGameOver()
        +getWinner()
    }
    
    GameState --> Ship
    GameState --> Shot
    ArmadaGame --> GameState
```

## Sistema de Coordenadas

```mermaid
graph LR
    subgraph "Coordenadas 3D (World)"
        A[x, y, z]
    end
    
    subgraph "Coordenadas de Cuadrícula (Grid)"
        B[gridX, gridY]
    end
    
    subgraph "Conversiones"
        C[worldToGridCoordinates]
        D[gridToWorldCoordinates]
        E[isValidGridPosition]
    end
    
    A --> C
    C --> B
    B --> D
    D --> A
    B --> E
```

## Flujo de Efectos Visuales

```mermaid
flowchart TD
    A[Disparo Realizado] --> B{¿Impacto?}
    
    B -->|Sí| C[WaterExplosion]
    B -->|No| D[Droplet Effect]
    
    C --> E[Animación de Explosión]
    D --> F[Animación de Gota]
    
    E --> G[Partículas de Agua]
    F --> H[Ondas en Superficie]
    
    G --> I[Cleanup de Efectos]
    H --> I
    
    I --> J[Efecto Terminado]
```

## Gestión de Memoria y Performance

```mermaid
graph TD
    A[Componente Montado] --> B[Crear Referencias]
    B --> C[Suscribir a Eventos]
    
    C --> D[Renderizado]
    D --> E[Animaciones]
    E --> F[Efectos Visuales]
    
    F --> G{¿Componente Desmontado?}
    G -->|No| D
    G -->|Sí| H[Cleanup]
    
    H --> I[Desuscribir Eventos]
    I --> J[Limpiar Referencias]
    J --> K[Disponer Objetos 3D]
    K --> L[Liberar Memoria]
``` 