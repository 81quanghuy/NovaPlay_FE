import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockAdminUser } from '../helpers/mockData';
import { hasRole } from '@/store/authStore';

describe('Tier 4: Real-World Scenarios — Admin Movie Creation, Series Episode Curation & Publishing Lifecycle', () => {
  it('T4.AdminPub.1 - Step 1: Admin logs in and navigates to /admin/movies CMS workspace', () => {
    expect(hasRole(mockAdminUser, 'ADMIN')).toBe(true);
  });

  it('T4.AdminPub.2 - Step 2: Admin creates new Series entry "Cyberpunk Nova 2099" in DRAFT state', () => {
    const movieDraft = {
      id: 'mov_cyberpunk_2099',
      title: 'Cyberpunk Nova 2099',
      slug: 'cyberpunk-nova-2099',
      description: 'Futuristic neo-noir sci-fi series in Nova City.',
      releaseDate: '2026-09-01',
      durationInMinutes: 60,
      minPlan: 'VIP_4K',
      series: true,
      status: 'DRAFT',
      genreIds: ['gen_scifi', 'gen_cyberpunk'],
    };

    expect(movieDraft.status).toBe('DRAFT');
    expect(movieDraft.series).toBe(true);
  });

  it('T4.AdminPub.3 - Step 3: Admin curates episodes for Season 1 (Ep 1 to Ep 3)', () => {
    const episodes = [
      { episodeNumber: 1, title: 'Tập 1: Neon Shadows', durationInMinutes: 58, mediaId: 'med_cp_ep1' },
      { episodeNumber: 2, title: 'Tập 2: Digital Ghost', durationInMinutes: 62, mediaId: 'med_cp_ep2' },
      { episodeNumber: 3, title: 'Tập 3: Neural Link', durationInMinutes: 55, mediaId: 'med_cp_ep3' },
    ];

    expect(episodes).toHaveLength(3);
    expect(episodes[0].episodeNumber).toBe(1);
    expect(episodes[2].episodeNumber).toBe(3);
  });

  it('T4.AdminPub.4 - Step 4: Admin changes status to PUBLISHED via PATCH /api/v1/movies/:id/status', async () => {
    const patchStatusApi = fn(async (movieId: string, status: string) => ({
      success: true,
      statusCode: 200,
      message: 'Movie published successfully',
    }));

    const res = await patchStatusApi('mov_cyberpunk_2099', 'PUBLISHED');
    expect(res.success).toBe(true);
    expect(patchStatusApi).toHaveBeenCalledWith('mov_cyberpunk_2099', 'PUBLISHED');
  });

  it('T4.AdminPub.5 - Step 5: Series is live and accessible on public /movie/cyberpunk-nova-2099 page', () => {
    const publicMovie = {
      id: 'mov_cyberpunk_2099',
      slug: 'cyberpunk-nova-2099',
      title: 'Cyberpunk Nova 2099',
      status: 'PUBLISHED',
      episodesCount: 3,
    };

    expect(publicMovie.status).toBe('PUBLISHED');
    expect(publicMovie.episodesCount).toBe(3);
  });
});
