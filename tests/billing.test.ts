import { describe, it, expect, vi } from 'vitest';
import { checkAndDeductGeneration } from '../src/server/utils/billing';

vi.mock('../src/server/firebase', () => {
  return {
    adminDb: {
      collection: vi.fn().mockReturnThis(),
      doc: vi.fn().mockReturnThis(),
      runTransaction: vi.fn(async (callback) => {
        return true;
      })
    }
  };
});

describe('Billing Idempotency Logic', () => {
  it('should allow bypassing for developer', async () => {
    const result = await checkAndDeductGeneration('dev-user', undefined, undefined, undefined, true);
    expect(result.ok).toBe(true);
  });
});
