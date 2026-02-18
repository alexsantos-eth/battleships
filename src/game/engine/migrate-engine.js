#!/usr/bin/env node

/**
 * Script de Migración Automática del Battleship Engine
 * 
 * Este script automatiza la copia y transformación de archivos
 * para mover la librería a un nuevo proyecto.
 * 
 * Uso:
 *   node migrate-engine.js /path/to/new/project
 * 
 * O si prefieres un proyecto npm:
 *   node migrate-engine.js /path/to/new/project --npm
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURACIÓN
// ============================================================================

const SOURCE_ROOT = __dirname; // Directorio actual (src/game/engine)
const PROJECT_ROOT = path.resolve(SOURCE_ROOT, '../../../');

const FILES_TO_COPY = [
  // Engine core
  { src: 'src/game/engine/GameEngine.ts', dest: 'src/engine/GameEngine.ts' },
  { src: 'src/game/engine/AIPlayer.ts', dest: 'src/engine/AIPlayer.ts' },
  { src: 'src/game/engine/index.ts', dest: 'src/engine/index.ts' },
  { src: 'src/game/engine/examples.ts', dest: 'src/engine/examples.ts' },
  { src: 'src/game/engine/README.md', dest: 'README.md' },
  { src: 'src/game/engine/QUICK_START.md', dest: 'QUICK_START.md' },
  
  // Tools
  { src: 'src/tools/ship/calculations.ts', dest: 'src/tools/ship/calculations.ts' },
  
  // Types
  { src: 'src/types/game/common.ts', dest: 'src/types/common.ts' },
  { src: 'src/types/game/config.ts', dest: 'src/types/config.ts' },
];

// Transformaciones de import
const IMPORT_TRANSFORMS = [
  // Engine imports
  { from: /from ["']@\/game\/engine["']/g, to: 'from "./index"' },
  { from: /from ["']@\/game\/engine\/([^"']+)["']/g, to: 'from "./$1"' },
  
  // Tools imports
  { from: /from ["']@\/tools\/ship\/calculations["']/g, to: 'from "../../tools/ship/calculations"' },
  
  // Types imports
  { from: /from ["']@\/types\/game\/common["']/g, to: 'from "../../types/common"' },
  { from: /from ["']@\/types\/game\/config["']/g, to: 'from "../../types/config"' },
  
  // Constants imports
  { from: /from ["']@\/constants\/game\/board["']/g, to: 'from "../../constants/game"' },
];

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function transformImports(content, sourcePath) {
  let transformed = content;
  
  for (const { from, to } of IMPORT_TRANSFORMS) {
    transformed = transformed.replace(from, to);
  }
  
  return transformed;
}

function copyAndTransformFile(srcPath, destPath, targetRoot) {
  const fullSrcPath = path.resolve(PROJECT_ROOT, srcPath);
  const fullDestPath = path.resolve(targetRoot, destPath);
  
  if (!fs.existsSync(fullSrcPath)) {
    console.warn(`⚠️  Archivo no encontrado: ${srcPath}`);
    return false;
  }
  
  let content = fs.readFileSync(fullSrcPath, 'utf-8');
  content = transformImports(content, srcPath);
  
  ensureDirectoryExists(fullDestPath);
  fs.writeFileSync(fullDestPath, content, 'utf-8');
  
  console.log(`✅ ${srcPath} -> ${destPath}`);
  return true;
}

function createConstantsFile(targetRoot) {
  const content = `// Constantes del juego
export const GAME_CONSTANTS = {
  SHIPS: {
    SIZES: {
      small: 2,
      medium: 3,
      large: 4,
      xlarge: 5,
    } as const,
    DEFAULT_COUNTS: {
      small: 1,
      medium: 2,
      large: 1,
      xlarge: 1,
    } as const,
    MIN_DISTANCE: 2,
    MAX_PLACEMENT_ATTEMPTS: 200,
    MAX_GENERATION_ATTEMPTS: 1000,
  },
};
`;
  
  const destPath = path.resolve(targetRoot, 'src/constants/game.ts');
  ensureDirectoryExists(destPath);
  fs.writeFileSync(destPath, content, 'utf-8');
  console.log('✅ Creado: src/constants/game.ts');
}

function createPackageJson(targetRoot, isNpmProject) {
  const packageJson = {
    name: 'battleship-engine',
    version: '1.0.0',
    description: 'Pure JavaScript/TypeScript battleship game engine',
    main: isNpmProject ? 'dist/engine/index.js' : 'src/engine/index.ts',
    types: isNpmProject ? 'dist/engine/index.d.ts' : 'src/engine/index.ts',
    scripts: isNpmProject ? {
      build: 'tsc',
      dev: 'tsc --watch',
      test: 'node dist/engine/examples.js',
    } : {
      dev: 'ts-node src/engine/examples.ts',
    },
    keywords: ['battleship', 'game-engine', 'typescript', 'game-logic'],
    author: 'Your Name',
    license: 'MIT',
    devDependencies: {
      typescript: '^5.0.0',
      '@types/node': '^20.0.0',
    },
  };
  
  const destPath = path.resolve(targetRoot, 'package.json');
  fs.writeFileSync(destPath, JSON.stringify(packageJson, null, 2), 'utf-8');
  console.log('✅ Creado: package.json');
}

function createTsConfig(targetRoot) {
  const tsConfig = {
    compilerOptions: {
      target: 'ES2020',
      module: 'ESNext',
      lib: ['ES2020'],
      declaration: true,
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      moduleResolution: 'node',
    },
    include: ['src'],
    exclude: ['node_modules', 'dist'],
  };
  
  const destPath = path.resolve(targetRoot, 'tsconfig.json');
  fs.writeFileSync(destPath, JSON.stringify(tsConfig, null, 2), 'utf-8');
  console.log('✅ Creado: tsconfig.json');
}

function createGitignore(targetRoot) {
  const content = `node_modules/
dist/
*.log
.DS_Store
`;
  
  const destPath = path.resolve(targetRoot, '.gitignore');
  fs.writeFileSync(destPath, content, 'utf-8');
  console.log('✅ Creado: .gitignore');
}

// ============================================================================
// FUNCIÓN PRINCIPAL
// ============================================================================

function migrate(targetPath, options = {}) {
  console.log('🚀 Iniciando migración del Battleship Engine...\n');
  
  const targetRoot = path.resolve(targetPath);
  
  // Verificar/crear directorio destino
  if (!fs.existsSync(targetRoot)) {
    fs.mkdirSync(targetRoot, { recursive: true });
    console.log(`📁 Creado directorio: ${targetRoot}\n`);
  }
  
  // Copiar y transformar archivos
  console.log('📋 Copiando archivos...');
  let successCount = 0;
  for (const file of FILES_TO_COPY) {
    if (copyAndTransformFile(file.src, file.dest, targetRoot)) {
      successCount++;
    }
  }
  console.log(`\n✅ ${successCount}/${FILES_TO_COPY.length} archivos copiados\n`);
  
  // Crear archivo de constantes
  console.log('🔧 Creando archivos adicionales...');
  createConstantsFile(targetRoot);
  
  // Crear configuración del proyecto
  if (options.npm) {
    createPackageJson(targetRoot, true);
    createTsConfig(targetRoot);
    createGitignore(targetRoot);
    console.log('\n📦 Proyecto npm configurado');
    console.log('   Ejecuta: cd', targetRoot, '&& npm install');
  } else {
    createPackageJson(targetRoot, false);
    createTsConfig(targetRoot);
    createGitignore(targetRoot);
    console.log('\n📦 Proyecto TypeScript configurado');
  }
  
  console.log('\n✨ ¡Migración completada exitosamente!');
  console.log('\n📚 Próximos pasos:');
  console.log('   1. cd', targetRoot);
  console.log('   2. npm install');
  console.log('   3. npm run build  (para npm) o npm run dev');
  console.log('   4. Revisa README.md para documentación completa');
  console.log('\n🎮 ¡Listo para usar!');
}

// ============================================================================
// CLI
// ============================================================================

function printUsage() {
  console.log(`
Uso: node migrate-engine.js <target-directory> [opciones]

Opciones:
  --npm       Configurar como paquete npm publicable
  --help      Mostrar esta ayuda

Ejemplos:
  node migrate-engine.js ./my-new-project
  node migrate-engine.js /path/to/project --npm
  `);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(0);
  }
  
  if (args.length === 0) {
    console.error('❌ Error: Debes especificar un directorio destino\n');
    printUsage();
    process.exit(1);
  }
  
  const targetPath = args[0];
  const options = {
    npm: args.includes('--npm'),
  };
  
  try {
    migrate(targetPath, options);
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es el script principal
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { migrate };
