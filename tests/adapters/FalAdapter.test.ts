import { describe, it, expect, vi, beforeEach } from 'vitest';
import { FalAdapter } from '../../src/server/adapters/FalAdapter';
import * as fal from '@fal-ai/serverless-client';

// Мокаем официальный клиент
vi.mock('@fal-ai/serverless-client', () => ({
  subscribe: vi.fn()
}));

vi.mock('../../src/server/utils/queues', () => ({
  imageGenQueue: {
    add: vi.fn(async (fn) => fn())
  }
}));

// Mock global fetch for downloading the image
global.fetch = vi.fn();

describe('FalAdapter SDK Regression Test Suite', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.FAL_KEY = 'mock_sdk_key_123';
  });

  it('должен успешно вызывать fal.subscribe с валидными параметрами контракта face-swap', async () => {
    const adapter = new FalAdapter();
    
    // Программируем поведение замоканного SDK
    vi.mocked(fal.subscribe).mockResolvedValue({
      data: { image: { url: 'https://cdn.fal.media/output.jpg' } },
      requestId: 'req_123'
    } as any);

    // Mock the image download fetch
    const mockArrayBuffer = new ArrayBuffer(8);
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      arrayBuffer: async () => mockArrayBuffer
    } as any);

    const result = await adapter.swapFace({
      baseImageUrl: 'https://test.com/base.jpg',
      swapImageUrl: 'https://test.com/ref.jpg'
    });

    expect(fal.subscribe).toHaveBeenCalledWith(
      'fal-ai/face-swap',
      expect.objectContaining({
        input: {
          base_image_url: 'https://test.com/base.jpg',
          swap_image_url: 'https://test.com/ref.jpg'
        },
        mode: 'streaming'
      })
    );
    
    expect(fetch).toHaveBeenCalledWith('https://cdn.fal.media/output.jpg');
    
    // Мы возвращаем Buffer, чтобы соблюсти новый контракт интерфейса
    expect(result).toBeInstanceOf(Buffer);
    expect(result.length).toBe(8);
  });
});
