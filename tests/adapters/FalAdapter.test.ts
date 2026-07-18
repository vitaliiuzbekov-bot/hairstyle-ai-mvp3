import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { FalAdapter } from '../../src/server/adapters/FalAdapter';

vi.mock('axios');
vi.mock('../../src/server/utils/queues', () => ({
  imageGenQueue: {
    add: vi.fn(async (fn) => fn())
  }
}));

describe('FalAdapter Integration', () => {
  let adapter: FalAdapter;

  beforeEach(() => {
    process.env.FAL_KEY = 'test-fal-key';
    adapter = new FalAdapter();
    vi.clearAllMocks();
  });

  it('should use correct endpoint and payload for face swap', async () => {
    // Mock the initial POST request to return a status_url
    vi.mocked(axios.post).mockResolvedValueOnce({
      data: {
        request_id: 'req_123',
        status_url: 'https://queue.fal.run/fal-ai/face-swap/requests/req_123/status',
      },
    } as any);

    // Mock the GET request polling the status
    vi.mocked(axios.get).mockResolvedValueOnce({
      data: {
        status: 'COMPLETED',
        payload: {
          image: {
            url: 'https://result.fal.ai/swapped.jpg',
          },
        },
      },
    } as any);

    const result = await adapter.swapFace({
      baseImageUrl: 'https://example.com/base.jpg',
      swapImageUrl: 'https://example.com/swap.jpg',
    });

    // Verify axios.post was called with correct URL and payload
    expect(axios.post).toHaveBeenCalledWith(
      'https://queue.fal.run/fal-ai/face-swap',
      {
        base_image_url: 'https://example.com/base.jpg',
        swap_image_url: 'https://example.com/swap.jpg',
      },
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Key test-fal-key',
        }),
      })
    );

    // Verify axios.get was called to poll status
    expect(axios.get).toHaveBeenCalledWith(
      'https://queue.fal.run/fal-ai/face-swap/requests/req_123/status',
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': 'Key test-fal-key',
        }),
      })
    );

    expect(result).toBe('https://result.fal.ai/swapped.jpg');
  });
});
