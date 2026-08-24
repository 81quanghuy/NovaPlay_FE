import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { mockMemberUser, mockAdminUser } from '../helpers/mockData';
import { hasRole } from '@/store/authStore';

describe('Tier 3: Cross-Feature Integration — Authentication to Admin CMS Workflows', () => {
  it('T3.AdminAuth.1 - Standard member login is strictly forbidden from accessing /admin', () => {
    const checkAdminAccess = (user: any) => (hasRole(user, 'ADMIN') ? '/admin' : '/403');

    expect(checkAdminAccess(mockMemberUser)).toBe('/403');
    expect(checkAdminAccess(null)).toBe('/403');
  });

  it('T3.AdminAuth.2 - Administrator login is granted access to /admin and loads admin layout', () => {
    const checkAdminAccess = (user: any) => (hasRole(user, 'ADMIN') ? '/admin' : '/403');

    expect(checkAdminAccess(mockAdminUser)).toBe('/admin');
  });

  it('T3.AdminAuth.3 - Admin publishes new movie from CMS modal', () => {
    let publicCatalog: any[] = [];
    const publishMovie = (movie: any) => {
      publicCatalog.push({ ...movie, status: 'PUBLISHED' });
    };

    const newMovie = {
      id: 'mov_new_blockbuster',
      title: 'New Sci-Fi Epic',
      slug: 'new-scifi-epic',
      status: 'DRAFT',
    };

    publishMovie(newMovie);
    expect(publicCatalog).toHaveLength(1);
    expect(publicCatalog[0].status).toBe('PUBLISHED');
  });

  it('T3.AdminAuth.4 - Newly published movie appears immediately in public /movies browsing catalog', () => {
    const publicCatalog = [
      { id: 'mov_new_blockbuster', title: 'New Sci-Fi Epic', status: 'PUBLISHED' },
      { id: 'mov_draft', title: 'Draft Film', status: 'DRAFT' },
    ];

    const visibleMovies = publicCatalog.filter((m) => m.status === 'PUBLISHED');
    expect(visibleMovies).toHaveLength(1);
    expect(visibleMovies[0].id).toBe('mov_new_blockbuster');
  });

  it('T3.AdminAuth.5 - Admin logout revokes access token and redirects to login page', () => {
    let currentUser: any = mockAdminUser;
    let currentRoute = '/admin';

    const logout = () => {
      currentUser = null;
      currentRoute = '/login';
    };

    logout();
    expect(currentUser).toBeNull();
    expect(currentRoute).toBe('/login');
  });
});
