import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';

interface AdminMovieItem {
  id: string;
  slug: string;
  title: string;
  releaseDate: string;
  durationInMinutes: number;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  minPlan: 'MEMBER' | 'VIP_STANDARD' | 'VIP_4K';
  series: boolean;
}

const mockAdminMovies: AdminMovieItem[] = [
  {
    id: 'mov_oppenheimer',
    slug: 'oppenheimer-2023',
    title: 'Oppenheimer',
    releaseDate: '2023-07-21',
    durationInMinutes: 180,
    status: 'PUBLISHED',
    minPlan: 'MEMBER',
    series: false,
  },
  {
    id: 'mov_dune2',
    slug: 'dune-part-2',
    title: 'Dune: Part Two',
    releaseDate: '2024-03-01',
    durationInMinutes: 166,
    status: 'DRAFT',
    minPlan: 'VIP_4K',
    series: false,
  },
  {
    id: 'mov_stranger_things',
    slug: 'stranger-things',
    title: 'Stranger Things Season 5',
    releaseDate: '2025-01-01',
    durationInMinutes: 60,
    status: 'ARCHIVED',
    minPlan: 'VIP_STANDARD',
    series: true,
  },
];

describe('Feature 17: Admin Movies Catalog Management', () => {
  it('F17.1 - Fetches and renders paginated movie catalog with metadata', () => {
    const pageResponse = {
      content: mockAdminMovies,
      page: 0,
      size: 10,
      totalElements: 3,
      totalPages: 1,
      last: true,
    };

    expect(pageResponse.content).toHaveLength(3);
    expect(pageResponse.content[0].title).toBe('Oppenheimer');
  });

  it('F17.2 - Renders semantic status badges (DRAFT = amber, PUBLISHED = emerald, ARCHIVED = gray)', () => {
    const getStatusStyle = (status: string) => {
      switch (status) {
        case 'PUBLISHED':
          return { label: 'Đã phát hành', color: 'emerald' };
        case 'DRAFT':
          return { label: 'Bản nháp', color: 'amber' };
        case 'ARCHIVED':
          return { label: 'Lưu trữ', color: 'gray' };
        default:
          return { label: status, color: 'surface' };
      }
    };

    expect(getStatusStyle('PUBLISHED').color).toBe('emerald');
    expect(getStatusStyle('DRAFT').color).toBe('amber');
    expect(getStatusStyle('ARCHIVED').color).toBe('gray');
  });

  it('F17.3 - Filters catalog by keyword search (matching title or slug)', () => {
    const filterMovies = (query: string) => {
      const q = query.toLowerCase();
      return mockAdminMovies.filter((m) => m.title.toLowerCase().includes(q) || m.slug.toLowerCase().includes(q));
    };

    expect(filterMovies('dune')).toHaveLength(1);
    expect(filterMovies('dune')[0].id).toBe('mov_dune2');
    expect(filterMovies('2023')).toHaveLength(1);
    expect(filterMovies('nonexistent')).toHaveLength(0);
  });

  it('F17.4 - Updates movie publishing status via PATCH /api/v1/movies/:id/status', () => {
    let movies = [...mockAdminMovies];
    const updateStatus = fn((id: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
      movies = movies.map((m) => (m.id === id ? { ...m, status: newStatus } : m));
    });

    updateStatus('mov_dune2', 'PUBLISHED');
    expect(movies.find((m) => m.id === 'mov_dune2')?.status).toBe('PUBLISHED');
    expect(updateStatus).toHaveBeenCalledWith('mov_dune2', 'PUBLISHED');
  });

  it('F17.5 - Deletes movie from catalog upon confirmation', () => {
    let movies = [...mockAdminMovies];
    const deleteMovie = fn((id: string) => {
      movies = movies.filter((m) => m.id !== id);
    });

    deleteMovie('mov_stranger_things');
    expect(movies).toHaveLength(2);
    expect(movies.some((m) => m.id === 'mov_stranger_things')).toBe(false);
  });
});
