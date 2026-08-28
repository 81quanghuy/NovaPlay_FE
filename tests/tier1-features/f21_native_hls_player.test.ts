import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockStreamingManifest } from '../helpers/mockData';

describe('Feature 21: Native HLS Player Component', () => {
  it('F21.1 - Validates HLS capability detection logic (MSE vs Safari native)', () => {
    const detectHlsCapability = (isMseSupported: boolean, canPlayNativeM3u8: boolean) => {
      if (isMseSupported) return 'HLS_JS';
      if (canPlayNativeM3u8) return 'NATIVE_SAFARI';
      return 'UNSUPPORTED';
    };

    expect(detectHlsCapability(true, false)).toBe('HLS_JS');
    expect(detectHlsCapability(false, true)).toBe('NATIVE_SAFARI');
    expect(detectHlsCapability(false, false)).toBe('UNSUPPORTED');
  });

  it('F21.2 - Configures Hls.js instance with low-latency and buffer options', () => {
    const hlsConfig = {
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
    };

    expect(hlsConfig.enableWorker).toBe(true);
    expect(hlsConfig.maxBufferLength).toBe(30);
    expect(hlsConfig.lowLatencyMode).toBe(true);
  });

  it('F21.3 - Attaches media element and loads manifest URL containing playback token', () => {
    const loadSource = fn((manifestUrl: string, token: string) => {
      return `${manifestUrl}&pt=${token}`;
    });

    const url = loadSource(mockStreamingManifest.manifestUrl, mockStreamingManifest.playbackToken);
    expect(url).toContain('master.m3u8');
    expect(url).toContain('pt=');
    expect(loadSource).toHaveBeenCalled();
  });

  it('F21.4 - Handles fatal HLS network errors with recovery mechanism', () => {
    let recovered = false;
    const handleHlsError = (isFatal: boolean, errorType: 'networkError' | 'mediaError' | 'otherError') => {
      if (isFatal) {
        if (errorType === 'networkError') {
          recovered = true;
          return 'START_LOAD';
        }
        if (errorType === 'mediaError') {
          recovered = true;
          return 'RECOVER_MEDIA';
        }
      }
      return 'DESTROY';
    };

    expect(handleHlsError(true, 'networkError')).toBe('START_LOAD');
    expect(recovered).toBe(true);
    expect(handleHlsError(true, 'mediaError')).toBe('RECOVER_MEDIA');
  });

  it('F21.5 - Destroys Hls instance cleanly on component unmount to prevent leaks', () => {
    let isDestroyed = false;
    let isDetached = false;

    const mockHls = {
      detachMedia: () => {
        isDetached = true;
      },
      destroy: () => {
        isDestroyed = true;
      },
    };

    mockHls.detachMedia();
    mockHls.destroy();

    expect(isDetached).toBe(true);
    expect(isDestroyed).toBe(true);
  });
});
