import { jest } from '@jest/globals';

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = class TextEncoder {
    encode(input?: string): Uint8Array {
      return new Uint8Array(Buffer.from(input || '', 'utf8'));
    }
  } as typeof TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = class TextDecoder {
    decode(input?: Uint8Array): string {
      return Buffer.from(input || new Uint8Array()).toString('utf8');
    }
  } as typeof TextDecoder;
}

Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: {
        VITE_FIREBASE_API_KEY: 'test-api-key',
        VITE_FIREBASE_AUTH_DOMAIN: 'test-project.firebaseapp.com',
        VITE_FIREBASE_PROJECT_ID: 'test-project-id',
        VITE_FIREBASE_STORAGE_BUCKET: 'test-project.appspot.com',
        VITE_FIREBASE_MESSAGING_SENDER_ID: '123456789',
        VITE_FIREBASE_APP_ID: '1:123456789:web:abcdef123456'
      }
    }
  },
  writable: true,
  configurable: true
});

jest.mock('@/config/database/firebase', () => ({
  app: {},
  auth: {}
}));

jest.mock('@/config/database/firestore', () => ({
  db: {}
}));

jest.mock('firebase/auth', () => ({
  signInAnonymously: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn(),
  getAuth: jest.fn()
}));

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn()
}));

jest.mock('firebase/firestore', () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  limit: jest.fn(),
  getDocs: jest.fn(),
  serverTimestamp: jest.fn(() => ({ toDate: () => new Date() }))
}));

jest.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/test' }),
  useNavigate: () => jest.fn(),
  BrowserRouter: ({ children }: { children: React.ReactNode }) => children,
  Routes: ({ children }: { children: React.ReactNode }) => children,
  Route: ({ children }: { children: React.ReactNode }) => children
})); 