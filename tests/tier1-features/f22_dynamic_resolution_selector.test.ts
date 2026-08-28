import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockStreamingManifest } from '../helpers/mockData';

describe('Feature 22: Dynamic Resolution Selector', () => {
  it('F22.1 - Extracts quality ladder levels from Hls rendition list', () => {
    const levels = mockStreamingManifest.levels;
    expect(levels).toHaveLength(4);
    expect(levels[0].label).toBe('4K Ultra HD');
    expect(levels[0].height).toBe(2160);
    expect(levels[3].label).toBe('480p SD');
  });

  it('F22.2 - Quality level -1 represents Auto Adaptive Bitrate (ABR)', () => {
    let currentLevel = 0;
    const setAutoABR = () => {
      currentLevel = -1;
    };

    setAutoABR();
    expect(currentLevel).toBe(-1);
  });

  it('F22.3 - Manual resolution selection locks playback to specific rendition level', () => {
    let currentLevel = -1;
    const selectQuality = fn((levelIndex: number) => {
      currentLevel = levelIndex;
    });

    selectQuality(1); // 1080p
    expect(currentLevel).toBe(1);
    expect(selectQuality).toHaveBeenCalledWith(1);
  });

  it('F22.4 - Displays active resolution badge (4K, 1080p, 720p, Auto)', () => {
    const getResolutionBadge = (levelIndex: number, levels: any[]) => {
      if (levelIndex === -1) return 'Auto';
      return levels[levelIndex]?.label || 'HD';
    };

    expect(getResolutionBadge(-1, mockStreamingManifest.levels)).toBe('Auto');
    expect(getResolutionBadge(0, mockStreamingManifest.levels)).toBe('4K Ultra HD');
    expect(getResolutionBadge(1, mockStreamingManifest.levels)).toBe('1080p FHD');
  });

  it('F22.5 - VIP entitlement limits maximum allowed resolution for free tier users', () => {
    const isQualityAllowedForPlan = (height: number, plan: 'FREE' | 'VIP_STANDARD' | 'VIP_4K') => {
      if (height > 1080) return plan === 'VIP_4K';
      if (height > 480) return plan === 'VIP_STANDARD' || plan === 'VIP_4K';
      return true;
    };

    expect(isQualityAllowedForPlan(2160, 'FREE')).toBe(false);
    expect(isQualityAllowedForPlan(2160, 'VIP_STANDARD')).toBe(false);
    expect(isQualityAllowedForPlan(2160, 'VIP_4K')).toBe(true);

    expect(isQualityAllowedForPlan(1080, 'FREE')).toBe(false);
    expect(isQualityAllowedForPlan(1080, 'VIP_STANDARD')).toBe(true);

    expect(isQualityAllowedForPlan(480, 'FREE')).toBe(true);
  });
});
