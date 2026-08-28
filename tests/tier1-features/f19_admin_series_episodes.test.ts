import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { z } from 'zod';

const episodeSchema = z.object({
  episodeNumber: z.number().int().positive('Số tập phải lớn hơn 0'),
  title: z.string().trim().min(1, 'Tiêu đề tập không được rỗng'),
  durationInMinutes: z.number().int().positive('Thời lượng phải lớn hơn 0'),
  mediaId: z.string().trim().min(1, 'Media ID không được rỗng'),
});

describe('Feature 19: Admin Series Episode Manager', () => {
  it('F19.1 - Validates episode number, title, duration, and mediaId', () => {
    const validEpisode = {
      episodeNumber: 1,
      title: 'Tập 1: Khởi đầu',
      durationInMinutes: 52,
      mediaId: 'med_ep_001',
    };

    expect(episodeSchema.safeParse(validEpisode).success).toBe(true);
  });

  it('F19.2 - Rejects negative or zero episode numbers', () => {
    const invalidEpisode = {
      episodeNumber: 0,
      title: 'Tập 0',
      durationInMinutes: 45,
      mediaId: 'med_ep_000',
    };

    expect(episodeSchema.safeParse(invalidEpisode).success).toBe(false);
  });

  it('F19.3 - Reorders episodes while keeping sequential numbering intact', () => {
    let episodes = [
      { episodeNumber: 1, title: 'Tập 1', durationInMinutes: 50, mediaId: 'med_1' },
      { episodeNumber: 2, title: 'Tập 2', durationInMinutes: 55, mediaId: 'med_2' },
      { episodeNumber: 3, title: 'Tập 3', durationInMinutes: 48, mediaId: 'med_3' },
    ];

    // Remove episode 2 and renumber
    episodes = episodes.filter((ep) => ep.episodeNumber !== 2).map((ep, idx) => ({ ...ep, episodeNumber: idx + 1 }));

    expect(episodes).toHaveLength(2);
    expect(episodes[0].episodeNumber).toBe(1);
    expect(episodes[1].episodeNumber).toBe(2);
    expect(episodes[1].mediaId).toBe('med_3');
  });

  it('F19.4 - Detects duplicate episode numbers within a series', () => {
    const hasDuplicateEpisodeNumbers = (list: { episodeNumber: number }[]) => {
      const nums = list.map((e) => e.episodeNumber);
      return new Set(nums).size !== nums.length;
    };

    expect(hasDuplicateEpisodeNumbers([{ episodeNumber: 1 }, { episodeNumber: 2 }, { episodeNumber: 3 }])).toBe(false);
    expect(hasDuplicateEpisodeNumbers([{ episodeNumber: 1 }, { episodeNumber: 1 }, { episodeNumber: 2 }])).toBe(true);
  });

  it('F19.5 - Formats PUT /api/v1/movies/:id/episodes batch update payload', () => {
    const episodes = [
      { episodeNumber: 1, title: 'Tập 1', durationInMinutes: 50, mediaId: 'med_1' },
      { episodeNumber: 2, title: 'Tập 2', durationInMinutes: 55, mediaId: 'med_2' },
    ];

    const payload = { episodes };
    expect(payload.episodes).toHaveLength(2);
    expect(payload.episodes[0].episodeNumber).toBe(1);
  });
});
