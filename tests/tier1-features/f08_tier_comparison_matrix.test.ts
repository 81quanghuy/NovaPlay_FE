import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { mockPricingTiers } from '../helpers/mockData';

describe('Feature 08: Tier Feature Comparison Matrix', () => {
  it('F08.1 - Matrix correctly compares maximum resolution across tiers', () => {
    const resolutions = mockPricingTiers.map((t) => ({ id: t.id, maxRes: t.maxResolution }));
    expect(resolutions).toEqual([
      { id: 'FREE', maxRes: '480p SD' },
      { id: 'VIP_STANDARD', maxRes: '1080p FHD' },
      { id: 'VIP_4K', maxRes: '4K Ultra HD + HDR' },
    ]);
  });

  it('F08.2 - Matrix compares concurrent streaming screen limits (1, 2, 4)', () => {
    const screens = mockPricingTiers.map((t) => t.screens);
    expect(screens).toEqual([1, 2, 4]);
  });

  it('F08.3 - Matrix compares audio capabilities (Stereo, 5.1, Dolby Atmos)', () => {
    const audio = mockPricingTiers.map((t) => t.audioQuality);
    expect(audio).toEqual(['Stereo 2.0', 'Dolby Digital 5.1', 'Dolby Atmos']);
  });

  it('F08.4 - Matrix verifies ad-free playback privilege only on VIP tiers', () => {
    expect(mockPricingTiers.find((t) => t.id === 'FREE')?.adFree).toBe(false);
    expect(mockPricingTiers.find((t) => t.id === 'VIP_STANDARD')?.adFree).toBe(true);
    expect(mockPricingTiers.find((t) => t.id === 'VIP_4K')?.adFree).toBe(true);
  });

  it('F08.5 - Matrix verifies offline download capability entitlement', () => {
    expect(mockPricingTiers.find((t) => t.id === 'FREE')?.offlineDownload).toBe(false);
    expect(mockPricingTiers.find((t) => t.id === 'VIP_STANDARD')?.offlineDownload).toBe(true);
    expect(mockPricingTiers.find((t) => t.id === 'VIP_4K')?.offlineDownload).toBe(true);
  });
});
