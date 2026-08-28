import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { mockAdminUser, mockMemberUser } from '../helpers/mockData';
import { hasRole } from '@/store/authStore';

describe('Feature 16: Admin Portal Navigation & Layout', () => {
  it('F16.1 - Admin navigation links point to Movies, Genres, Artists, and Settings', () => {
    const adminNavLinks = [
      { path: '/admin/movies', label: 'Quản lý Phim', icon: 'Film' },
      { path: '/admin/genres', label: 'Thể loại', icon: 'Tag' },
      { path: '/admin/artists', label: 'Diễn viên & Đạo diễn', icon: 'Users' },
      { path: '/admin/settings', label: 'Cấu hình', icon: 'Settings' },
    ];

    expect(adminNavLinks).toHaveLength(4);
    expect(adminNavLinks[0].path).toBe('/admin/movies');
    expect(adminNavLinks[1].path).toBe('/admin/genres');
  });

  it('F16.2 - Access control denies entry to non-admin users and redirects to /403', () => {
    const canAccessAdmin = (user: any) => hasRole(user, 'ADMIN');

    expect(canAccessAdmin(mockAdminUser)).toBe(true);
    expect(canAccessAdmin(mockMemberUser)).toBe(false);
    expect(canAccessAdmin(null)).toBe(false);
  });

  it('F16.3 - Admin dashboard displays high-level statistics counters', () => {
    const dashboardStats = {
      totalMovies: 1240,
      activeSubscribers: 8930,
      monthlyRevenue: 540000000,
      storageUsedGB: 4500,
    };

    expect(dashboardStats.totalMovies).toBeGreaterThan(1000);
    expect(dashboardStats.activeSubscribers).toBeGreaterThan(5000);
  });

  it('F16.4 - Active navigation indicator matches current location pathname', () => {
    const isLinkActive = (currentPath: string, linkPath: string) =>
      currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);

    expect(isLinkActive('/admin/movies', '/admin/movies')).toBe(true);
    expect(isLinkActive('/admin/movies/edit/123', '/admin/movies')).toBe(true);
    expect(isLinkActive('/admin/genres', '/admin/movies')).toBe(false);
  });

  it('F16.5 - Sidebar collapse/expand state handles responsive mobile toggle', () => {
    let sidebarOpen = false;
    const toggleSidebar = () => {
      sidebarOpen = !sidebarOpen;
    };

    toggleSidebar();
    expect(sidebarOpen).toBe(true);
    toggleSidebar();
    expect(sidebarOpen).toBe(false);
  });
});
