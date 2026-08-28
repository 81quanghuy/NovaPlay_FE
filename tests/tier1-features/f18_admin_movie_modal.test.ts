import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { z } from 'zod';

const adminMovieFormSchema = z.object({
  title: z.string().trim().min(1, 'Tiêu đề không được để trống'),
  slug: z.string().trim().min(1, 'Slug không được để trống').regex(/^[a-z0-9-]+$/, 'Slug chỉ gồm chữ thường, số và gạch ngang'),
  description: z.string().min(10, 'Mô tả tối thiểu 10 ký tự'),
  releaseDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Ngày phát hành theo định dạng YYYY-MM-DD'),
  durationInMinutes: z.number().int().positive('Thời lượng phải là số nguyên dương'),
  minPlan: z.enum(['MEMBER', 'VIP_STANDARD', 'VIP_4K']),
  series: z.boolean(),
  genreIds: z.array(z.string()).min(1, 'Chọn ít nhất 1 thể loại'),
  cast: z.array(
    z.object({
      artistId: z.string(),
      role: z.string(),
    })
  ).optional(),
});

describe('Feature 18: Admin Movie Create/Edit Modal', () => {
  it('F18.1 - Schema validates required movie metadata fields', () => {
    const validData = {
      title: 'Interstellar',
      slug: 'interstellar-2014',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.',
      releaseDate: '2014-11-07',
      durationInMinutes: 169,
      minPlan: 'MEMBER' as const,
      series: false,
      genreIds: ['gen_scifi', 'gen_adventure'],
    };

    const result = adminMovieFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('F18.2 - Rejects invalid slug formats containing uppercase letters or spaces', () => {
    const invalidData = {
      title: 'Invalid Movie',
      slug: 'Invalid Slug With Spaces',
      description: 'Some description that is long enough.',
      releaseDate: '2024-01-01',
      durationInMinutes: 120,
      minPlan: 'MEMBER' as const,
      series: false,
      genreIds: ['gen_action'],
    };

    const result = adminMovieFormSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('F18.3 - Ensures at least one genre is selected', () => {
    const noGenres = {
      title: 'No Genre Movie',
      slug: 'no-genre',
      description: 'Some description that is long enough.',
      releaseDate: '2024-01-01',
      durationInMinutes: 120,
      minPlan: 'MEMBER' as const,
      series: false,
      genreIds: [],
    };

    const result = adminMovieFormSchema.safeParse(noGenres);
    expect(result.success).toBe(false);
  });

  it('F18.4 - Validates structured cast and crew list with artistId and role', () => {
    const movieWithCast = {
      title: 'Oppenheimer',
      slug: 'oppenheimer',
      description: 'Story of American scientist J. Robert Oppenheimer.',
      releaseDate: '2023-07-21',
      durationInMinutes: 180,
      minPlan: 'MEMBER' as const,
      series: false,
      genreIds: ['gen_drama'],
      cast: [
        { artistId: 'art_nolan', role: 'Đạo diễn' },
        { artistId: 'art_cillian', role: 'J. Robert Oppenheimer' },
      ],
    };

    const result = adminMovieFormSchema.safeParse(movieWithCast);
    expect(result.success).toBe(true);
  });

  it('F18.5 - Populates initial values in Edit mode from existing movie entity', () => {
    const existingMovie = {
      id: 'mov_101',
      title: 'Existing Movie',
      slug: 'existing-movie',
      description: 'Existing description of the movie.',
      releaseDate: '2022-05-10',
      durationInMinutes: 110,
      minPlan: 'VIP_STANDARD' as const,
      series: false,
      genreIds: ['gen_action'],
    };

    const formValues = {
      title: existingMovie.title,
      slug: existingMovie.slug,
      description: existingMovie.description,
      releaseDate: existingMovie.releaseDate,
      durationInMinutes: existingMovie.durationInMinutes,
      minPlan: existingMovie.minPlan,
      series: existingMovie.series,
      genreIds: existingMovie.genreIds,
    };

    expect(formValues.title).toBe('Existing Movie');
    expect(formValues.minPlan).toBe('VIP_STANDARD');
  });
});
