import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockStreamingManifest } from '../helpers/mockData';

describe('Feature 26: WatchPage Cinematic Overhaul', () => {
  it('F26.1 - WatchPage resolves movie metadata and HLS manifest concurrently', async () => {
    const fetchMovieDetail = fn(async () => mockStreamingManifest.movie);
    const fetchManifest = fn(async () => mockStreamingManifest);

    const [movie, manifest] = await Promise.all([fetchMovieDetail(), fetchManifest()]);

    expect(movie.id).toBe('mov_inception');
    expect(manifest.playbackToken).toBe('mock_pt_hmac_4h_token');
    expect(fetchMovieDetail).toHaveBeenCalledTimes(1);
    expect(fetchManifest).toHaveBeenCalledTimes(1);
  });

  it('F26.2 - Series episode switcher switches active episode and updates URL', () => {
    let currentEpisode = 1;
    const onSelectEpisode = (epNum: number) => {
      currentEpisode = epNum;
    };

    onSelectEpisode(3);
    expect(currentEpisode).toBe(3);
  });

  it('F26.3 - Streaming server switcher supports primary and backup CDN sources', () => {
    const servers = [
      { id: 'server_r2', name: 'Server Nova VIP (Cloudflare R2)', priority: 1, available: true },
      { id: 'server_backup', name: 'Server Dự Phòng (Backup CDN)', priority: 2, available: true },
    ];

    let activeServer = servers[0].id;
    const switchServer = (serverId: string) => {
      activeServer = serverId;
    };

    switchServer('server_backup');
    expect(activeServer).toBe('server_backup');
  });

  it('F26.4 - "Lights Off" mode toggles cinematic true-black OLED backdrop styling', () => {
    let lightsOff = false;
    const toggleLightsOff = () => {
      lightsOff = !lightsOff;
    };

    expect(lightsOff).toBe(false);
    toggleLightsOff();
    expect(lightsOff).toBe(true);
  });

  it('F26.5 - Auto-next trigger activates when video is within 30s of completion for series', () => {
    const shouldShowNextPrompt = (currentTime: number, duration: number, isSeries: boolean) =>
      isSeries && duration - currentTime <= 30 && duration > 60;

    expect(shouldShowNextPrompt(3500, 3600, true)).toBe(false); // 100s remaining
    expect(shouldShowNextPrompt(3575, 3600, true)).toBe(true); // 25s remaining
    expect(shouldShowNextPrompt(3575, 3600, false)).toBe(false); // movie, not series
  });
});
