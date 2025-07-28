import { useState } from 'react';
import { COLORS } from '@/config/colors';
import { useGameInitializer } from '@/hooks/useGameInitializer';
import type { GameConfig } from '@/game/logic/gameInitializer';

export const GameInitializerPanel = () => {
  const {
    currentConfig,
    isInitializing,
    error,
    initializeCustomGame,
    initializeQuickGame,
    initializeClassicGame,
    initializeChallengingGame,
    restartCurrentGame,
    resetGame,
  } = useGameInitializer();

  const [showCustomConfig, setShowCustomConfig] = useState(false);
  const [customConfig, setCustomConfig] = useState<Partial<GameConfig>>({
    boardWidth: 10,
    boardHeight: 10,
    shipCounts: {
      small: 4,
      medium: 3,
      large: 2,
      xlarge: 1
    },
    initialTurn: 'random',
    enemyAI: 'random'
  });

  const handleCustomConfigChange = (key: string, value: string | number) => {
    if (key.includes('.')) {
      const [parent, child] = key.split('.');
      setCustomConfig(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof GameConfig] as Record<string, unknown>),
          [child]: value
        }
      }));
    } else {
      setCustomConfig(prev => ({
        ...prev,
        [key]: value
      }));
    }
  };

  const renderConfigInfo = (config: GameConfig, title: string) => (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.05)', 
      padding: '8px', 
      borderRadius: '4px',
      marginBottom: '8px',
      fontSize: '10px'
    }}>
      <strong>{title}</strong>
      <div>Tablero: {config.boardWidth}x{config.boardHeight}</div>
      <div>Barcos: {Object.values(config.shipCounts).reduce((a, b) => a + b, 0)}</div>
      <div>IA: {config.enemyAI}</div>
    </div>
  );

  const renderCustomConfigForm = () => (
    <div style={{ 
      background: 'rgba(255, 255, 255, 0.05)', 
      padding: '10px', 
      borderRadius: '4px',
      marginTop: '10px'
    }}>
      <h4 style={{ margin: '0 0 8px 0', fontSize: '12px' }}>Configuración Personalizada</h4>
      
      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}>
          Tamaño del Tablero:
        </label>
        <div style={{ display: 'flex', gap: '4px' }}>
          <input
            type="number"
            value={customConfig.boardWidth}
            onChange={(e) => handleCustomConfigChange('boardWidth', parseInt(e.target.value))}
            style={{ width: '50px', fontSize: '10px', padding: '2px' }}
            min="5"
            max="15"
          />
          <span style={{ fontSize: '10px', lineHeight: '20px' }}>x</span>
          <input
            type="number"
            value={customConfig.boardHeight}
            onChange={(e) => handleCustomConfigChange('boardHeight', parseInt(e.target.value))}
            style={{ width: '50px', fontSize: '10px', padding: '2px' }}
            min="5"
            max="15"
          />
        </div>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}>
          Barcos:
        </label>
        {(['small', 'medium', 'large', 'xlarge'] as const).map(variant => (
          <div key={variant} style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '2px' }}>
            <span style={{ fontSize: '9px', width: '40px' }}>{variant}:</span>
            <input
              type="number"
              value={customConfig.shipCounts?.[variant] || 0}
              onChange={(e) => handleCustomConfigChange(`shipCounts.${variant}`, parseInt(e.target.value))}
              style={{ width: '30px', fontSize: '9px', padding: '1px' }}
              min="0"
              max="10"
            />
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}>
          Turno Inicial:
        </label>
        <select
          value={customConfig.initialTurn}
          onChange={(e) => handleCustomConfigChange('initialTurn', e.target.value)}
          style={{ fontSize: '10px', padding: '2px', width: '100%' }}
        >
          <option value="random">Aleatorio</option>
          <option value="player">Jugador</option>
          <option value="enemy">Enemigo</option>
        </select>
      </div>

      <div style={{ marginBottom: '8px' }}>
        <label style={{ fontSize: '10px', display: 'block', marginBottom: '2px' }}>
          IA Enemiga:
        </label>
        <select
          value={customConfig.enemyAI}
          onChange={(e) => handleCustomConfigChange('enemyAI', e.target.value)}
          style={{ fontSize: '10px', padding: '2px', width: '100%' }}
        >
          <option value="random">Aleatoria</option>
          <option value="smart">Inteligente</option>
          <option value="deterministic">Determinista</option>
        </select>
      </div>

      <button
        onClick={() => {
          initializeCustomGame(customConfig);
        }}
        disabled={isInitializing}
        style={{
          background: COLORS.ui.debug.button,
          color: 'white',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '3px',
          cursor: isInitializing ? 'not-allowed' : 'pointer',
          fontSize: '10px',
          width: '100%',
          opacity: isInitializing ? 0.6 : 1,
        }}
      >
        {isInitializing ? '⏳' : '🎮'} Inicializar Personalizada
      </button>
    </div>
  );

  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Inicializar Partida</h3>
      
      {error && (
        <div style={{ 
          marginBottom: '10px', 
          padding: '6px', 
          backgroundColor: '#ffebee', 
          color: '#c62828',
          fontSize: '10px',
          borderRadius: '3px'
        }}>
          ❌ {error}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <button
          onClick={initializeQuickGame}
          disabled={isInitializing}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: isInitializing ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            opacity: isInitializing ? 0.6 : 1,
          }}
        >
          {isInitializing ? '⏳' : '⚡'} Partida Rápida
        </button>

        <button
          onClick={initializeClassicGame}
          disabled={isInitializing}
          style={{
            background: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: isInitializing ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            opacity: isInitializing ? 0.6 : 1,
          }}
        >
          {isInitializing ? '⏳' : '🎯'} Partida Clásica
        </button>

        <button
          onClick={initializeChallengingGame}
          disabled={isInitializing}
          style={{
            background: '#FF9800',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: isInitializing ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            opacity: isInitializing ? 0.6 : 1,
          }}
        >
          {isInitializing ? '⏳' : '🔥'} Partida Desafiante
        </button>

        <button
          onClick={restartCurrentGame}
          disabled={isInitializing || !currentConfig}
          style={{
            background: '#9C27B0',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: (isInitializing || !currentConfig) ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            opacity: (isInitializing || !currentConfig) ? 0.6 : 1,
          }}
        >
          🔄 Reiniciar Partida Actual
        </button>

        <button
          onClick={resetGame}
          disabled={isInitializing}
          style={{
            background: '#F44336',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: isInitializing ? 'not-allowed' : 'pointer',
            fontSize: '11px',
            opacity: isInitializing ? 0.6 : 1,
          }}
        >
          🗑️ Limpiar Juego
        </button>
      </div>

      {currentConfig && (
        <div style={{ marginTop: '10px' }}>
          <h4 style={{ margin: '0 0 5px 0', fontSize: '12px' }}>Configuración Actual:</h4>
          {renderConfigInfo(currentConfig, 'Partida Actual')}
        </div>
      )}

      <div style={{ marginTop: '10px' }}>
        <button
          onClick={() => setShowCustomConfig(!showCustomConfig)}
          style={{
            background: 'transparent',
            color: COLORS.ui.debug.button,
            border: `1px solid ${COLORS.ui.debug.button}`,
            padding: '4px 8px',
            borderRadius: '3px',
            cursor: 'pointer',
            fontSize: '10px',
            width: '100%',
          }}
        >
          {showCustomConfig ? '▼' : '▶'} Configuración Personalizada
        </button>
        
        {showCustomConfig && renderCustomConfigForm()}
      </div>
    </div>
  );
}; 