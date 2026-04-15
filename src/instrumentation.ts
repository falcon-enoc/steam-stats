// Polyfill for Node.js 24+ where localStorage exists as a global
// but its methods are undefined without --localstorage-file flag.
// This causes crashes during SSR when client code checks for localStorage.
export async function register() {
  if (typeof globalThis.localStorage !== 'undefined' &&
      typeof globalThis.localStorage.getItem !== 'function') {
    const storage = new Map<string, string>();
    globalThis.localStorage = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, String(value)),
      removeItem: (key: string) => storage.delete(key),
      clear: () => storage.clear(),
      get length() { return storage.size; },
      key: (index: number) => [...storage.keys()][index] ?? null,
    };
  }
}
