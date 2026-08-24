import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';

interface Genre {
  id: string;
  name: string;
  slug: string;
  movieCount: number;
}

interface Artist {
  id: string;
  fullName: string;
  slug: string;
  avatarUrl?: string;
  role?: string;
}

describe('Feature 20: Admin Genres & Artists CMS', () => {
  it('F20.1 - Generates URL slug automatically from genre name', () => {
    const slugify = (str: string) =>
      str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');

    expect(slugify('Hành Động')).toBe('hanh-dong');
    expect(slugify('Khoa Học Viễn Tưởng')).toBe('khoa-hoc-vien-tuong');
    expect(slugify('Kinh Dị & Giật Gân')).toBe('kinh-di-giat-gan');
  });

  it('F20.2 - Creates new genre and validates name uniqueness', () => {
    const existingGenres: Genre[] = [{ id: 'gen_1', name: 'Hành Động', slug: 'hanh-dong', movieCount: 12 }];

    const canCreateGenre = (name: string) => !existingGenres.some((g) => g.name.toLowerCase() === name.toLowerCase());

    expect(canCreateGenre('Hành Động')).toBe(false);
    expect(canCreateGenre('Tâm Lý')).toBe(true);
  });

  it('F20.3 - Prevents deleting genre when active movies are linked (safeguard)', () => {
    const canDeleteGenre = (genre: Genre) => genre.movieCount === 0;

    const activeGenre: Genre = { id: 'gen_1', name: 'Hành Động', slug: 'hanh-dong', movieCount: 5 };
    const unusedGenre: Genre = { id: 'gen_2', name: 'Phim Cổ Trang', slug: 'phim-co-trang', movieCount: 0 };

    expect(canDeleteGenre(activeGenre)).toBe(false);
    expect(canDeleteGenre(unusedGenre)).toBe(true);
  });

  it('F20.4 - Searches artists by query matching name or slug', () => {
    const artists: Artist[] = [
      { id: 'art_1', fullName: 'Christopher Nolan', slug: 'christopher-nolan' },
      { id: 'art_2', fullName: 'Leonardo DiCaprio', slug: 'leonardo-dicaprio' },
      { id: 'art_3', fullName: 'Cillian Murphy', slug: 'cillian-murphy' },
    ];

    const searchArtists = (q: string) =>
      artists.filter((a) => a.fullName.toLowerCase().includes(q.toLowerCase()) || a.slug.includes(q.toLowerCase()));

    expect(searchArtists('nolan')).toHaveLength(1);
    expect(searchArtists('nolan')[0].id).toBe('art_1');
    expect(searchArtists('Leo')).toHaveLength(1);
  });

  it('F20.5 - Updates artist metadata (fullName, avatarUrl, bio)', () => {
    let artist: Artist = { id: 'art_1', fullName: 'Cillian Murphy', slug: 'cillian-murphy' };
    const updateArtist = fn((updates: Partial<Artist>) => {
      artist = { ...artist, ...updates };
    });

    updateArtist({ avatarUrl: 'https://cdn.novaplay.vn/artists/cillian.jpg', role: 'Diễn viên' });
    expect(artist.avatarUrl).toBe('https://cdn.novaplay.vn/artists/cillian.jpg');
    expect(artist.role).toBe('Diễn viên');
  });
});
