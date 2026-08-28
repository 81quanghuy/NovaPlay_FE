/**
 * Test Environment Polyfills & Global Setup
 * Provides comprehensive in-memory DOM, Web API, and storage mocks.
 */

class MemoryStorage implements Storage {
  private store: Map<string, string> = new Map();

  get length(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }

  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

export function setupTestEnvironment() {
  const localStorageMock = new MemoryStorage();
  const sessionStorageMock = new MemoryStorage();

  // Polyfill global window & document if in pure Node environment
  if (typeof globalThis.localStorage === 'undefined') {
    Object.defineProperty(globalThis, 'localStorage', {
      value: localStorageMock,
      writable: true,
      configurable: true,
    });
  }

  if (typeof globalThis.sessionStorage === 'undefined') {
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
      configurable: true,
    });
  }

  if (typeof globalThis.window === 'undefined') {
    const windowMock: any = {
      localStorage: localStorageMock,
      sessionStorage: sessionStorageMock,
      location: {
        href: 'http://localhost:3000/',
        pathname: '/',
        search: '',
        hash: '',
        assign: () => {},
        replace: () => {},
        reload: () => {},
      },
      matchMedia: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => true,
      }),
      scrollTo: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    };

    Object.defineProperty(globalThis, 'window', {
      value: windowMock,
      writable: true,
      configurable: true,
    });
  }

  if (typeof globalThis.document === 'undefined') {
    const documentMock: any = {
      createElement: (tag: string) => {
        const el: any = {
          tagName: tag.toUpperCase(),
          style: {},
          classList: {
            add: () => {},
            remove: () => {},
            contains: () => false,
            toggle: () => {},
          },
          setAttribute: (k: string, v: string) => {
            el[k] = v;
          },
          getAttribute: (k: string) => el[k] || null,
          removeAttribute: (k: string) => {
            delete el[k];
          },
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => true,
          focus: () => {},
          blur: () => {},
          play: () => Promise.resolve(),
          pause: () => {},
          load: () => {},
          canPlayType: (type: string) => (type.includes('apple') ? 'maybe' : ''),
          currentTime: 0,
          duration: 120,
          volume: 1,
          muted: false,
          paused: true,
        };
        return el;
      },
      getElementById: () => null,
      querySelector: () => null,
      querySelectorAll: () => [],
      body: {
        appendChild: () => {},
        removeChild: () => {},
        style: {},
      },
      documentElement: {
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
        },
      },
      fullscreenElement: null,
      exitFullscreen: () => Promise.resolve(),
    };

    Object.defineProperty(globalThis, 'document', {
      value: documentMock,
      writable: true,
      configurable: true,
    });
  }

  // Polyfill ResizeObserver
  if (typeof globalThis.ResizeObserver === 'undefined') {
    (globalThis as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // Polyfill CustomEvent
  if (typeof globalThis.CustomEvent === 'undefined') {
    (globalThis as any).CustomEvent = class CustomEvent {
      type: string;
      detail: any;
      constructor(type: string, params?: { detail?: any }) {
        this.type = type;
        this.detail = params?.detail;
      }
    };
  }
}

// Automatically initialize when imported
setupTestEnvironment();
