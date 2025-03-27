import { prisma } from '@/lib/db';

export function resetMocks() {
  jest.clearAllMocks();
  Object.values(prisma).forEach((model) => {
    if (typeof model === 'object' && model !== null) {
      Object.values(model).forEach((method) => {
        if (typeof method === 'function') {
          jest.resetAllMocks();
        }
      });
    }
  });
}

export function createTestResponse<T>(data: T) {
  return {
    data,
    status: 200,
    ok: true,
    headers: new Headers(),
    statusText: 'OK',
    type: 'basic' as const,
    url: '',
    redirected: false,
    bodyUsed: false,
    body: null,
    clone: () => createTestResponse(data),
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  };
} 