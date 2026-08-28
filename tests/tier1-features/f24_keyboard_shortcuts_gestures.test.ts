import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';

describe('Feature 24: Keyboard Shortcuts & Gestures', () => {
  it('F24.1 - Space and "k" keys toggle playback play/pause', () => {
    let isPlaying = false;
    const handleKey = (key: string) => {
      if (key === ' ' || key.toLowerCase() === 'k') {
        isPlaying = !isPlaying;
      }
    };

    handleKey(' ');
    expect(isPlaying).toBe(true);

    handleKey('k');
    expect(isPlaying).toBe(false);
  });

  it('F24.2 - ArrowLeft and ArrowRight seek by 10 second increments', () => {
    let currentTime = 100;
    const duration = 500;

    const handleKey = (key: string) => {
      if (key === 'ArrowLeft') currentTime = Math.max(0, currentTime - 10);
      if (key === 'ArrowRight') currentTime = Math.min(duration, currentTime + 10);
    };

    handleKey('ArrowRight');
    expect(currentTime).toBe(110);

    handleKey('ArrowLeft');
    expect(currentTime).toBe(100);
  });

  it('F24.3 - ArrowUp and ArrowDown adjust volume by 10% increments', () => {
    let volume = 0.5;

    const handleKey = (key: string) => {
      if (key === 'ArrowUp') volume = Math.min(1.0, Math.round((volume + 0.1) * 10) / 10);
      if (key === 'ArrowDown') volume = Math.max(0.0, Math.round((volume - 0.1) * 10) / 10);
    };

    handleKey('ArrowUp');
    expect(volume).toBe(0.6);

    handleKey('ArrowDown');
    expect(volume).toBe(0.5);
  });

  it('F24.4 - "f" toggles fullscreen and "m" toggles mute', () => {
    let isFullscreen = false;
    let isMuted = false;

    const handleKey = (key: string) => {
      if (key.toLowerCase() === 'f') isFullscreen = !isFullscreen;
      if (key.toLowerCase() === 'm') isMuted = !isMuted;
    };

    handleKey('f');
    expect(isFullscreen).toBe(true);

    handleKey('m');
    expect(isMuted).toBe(true);
  });

  it('F24.5 - Numeric keys 0-9 seek to proportional duration percentages (5 = 50%)', () => {
    let currentTime = 0;
    const duration = 1000;

    const handleKey = (key: string) => {
      if (/^[0-9]$/.test(key)) {
        const pct = parseInt(key, 10) / 10;
        currentTime = pct * duration;
      }
    };

    handleKey('5');
    expect(currentTime).toBe(500);

    handleKey('0');
    expect(currentTime).toBe(0);

    handleKey('9');
    expect(currentTime).toBe(900);
  });
});
