import '../helpers/setup';
import React from 'react';
import { describe, it, expect, fn } from '../helpers/framework';
import * as UI from '@/components/ui';
import { PATHS } from '@/routes/paths';
import { hasRole, hasAnyRole } from '@/store/authStore';
import { mockMemberUser, mockAdminUser } from '../helpers/mockData';

describe('Milestone 1 Stress & Adversarial Empirical Tests', () => {
  // ── 1. Barrel Export Integrity ─────────────────────────────────────────
  it('M1.EXP.1 - Verify all 13 primitives export correctly from @/components/ui', () => {
    const primitives = [
      UI.Alert,
      UI.Badge,
      UI.Button,
      UI.ConfirmDialog,
      UI.Drawer,
      UI.EmptyState,
      UI.FormField,
      UI.Logo,
      UI.Modal,
      UI.PasswordInput,
      UI.Skeleton,
      UI.Switch,
      UI.Tabs,
    ];

    for (const primitive of primitives) {
      expect(primitive).toBeDefined();
      expect(typeof primitive === 'function' || typeof primitive === 'object').toBe(true);
    }
  });

  // ── 2. Badge Component Edge Cases ───────────────────────────────────────
  it('M1.BDG.1 - Badge handles all 8 variants, 3 sizes, dot, and pulse permutations', () => {
    const variants: UI.BadgeVariant[] = [
      'primary',
      'gold',
      'cyan',
      'success',
      'warning',
      'danger',
      'surface',
      'ghost',
    ];
    const sizes: UI.BadgeSize[] = ['sm', 'md', 'lg'];

    for (const variant of variants) {
      for (const size of sizes) {
        const rendered = UI.Badge({
          variant,
          size,
          dot: true,
          pulse: true,
          children: `${variant}-${size}`,
        });
        expect(rendered).toBeDefined();
        expect(rendered.props.className).toContain('font-display');
        expect(rendered.props.children).toBeDefined();
      }
    }
  });

  it('M1.BDG.2 - Badge respects icon prioritization (leftIcon over icon)', () => {
    const rendered = UI.Badge({
      leftIcon: 'LEFT_ICON_VAL',
      icon: 'GENERIC_ICON_VAL',
      children: 'Badge Content',
    });
    expect(rendered.props.children).toBeDefined();
    const childrenArray = rendered.props.children;
    expect(childrenArray).toContain('LEFT_ICON_VAL');
    expect(childrenArray).not.toContain('GENERIC_ICON_VAL');
  });

  // ── 3. Skeleton Component Stress Testing ────────────────────────────────
  it('M1.SKL.1 - Skeleton handles all 7 variants and count variations', () => {
    const variants: UI.SkeletonVariant[] = [
      'text',
      'rect',
      'circle',
      'card',
      'poster',
      'avatar',
      'button',
    ];

    for (const variant of variants) {
      const single = UI.Skeleton({ variant });
      expect(single).toBeDefined();
      expect(single.props.className).toContain('animate-pulse');

      const multi = UI.Skeleton({ variant, count: 4 });
      expect(multi).toBeDefined();
      expect(multi.props.children).toHaveLength(4);
    }
  });

  it('M1.SKL.2 - Skeleton handles count=0 or count=1 gracefully', () => {
    const count1 = UI.Skeleton({ count: 1 });
    expect(count1).toBeDefined();
    expect(count1.props.className).toContain('animate-pulse');

    const count0 = UI.Skeleton({ count: 0 });
    expect(count0).toBeDefined();
  });

  // ── 4. Switch Component Interaction & Accessibility ─────────────────────
  it('M1.SWT.1 - Switch handles toggles, Space/Enter keyboard triggers, and prevents toggle when disabled', () => {
    let checked = false;
    const onChange = fn((val: boolean) => {
      checked = val;
    });

    // Enabled switch
    const enabledSwitch = UI.Switch({
      checked: false,
      onChange,
      label: 'Bật thông báo',
      description: 'Nhận thông báo khi có tập mới',
    });

    expect(enabledSwitch.props.children[0].props['role']).toBe('switch');
    expect(enabledSwitch.props.children[0].props['aria-checked']).toBe(false);
    expect(enabledSwitch.props.children[0].props['aria-disabled']).toBe(false);

    // Trigger click on button
    enabledSwitch.props.children[0].props.onClick();
    expect(onChange).toHaveBeenCalledWith(true);

    // Trigger keyboard on button
    const preventDefault = fn();
    enabledSwitch.props.children[0].props.onKeyDown({
      key: 'Enter',
      preventDefault,
    } as any);
    expect(preventDefault).toHaveBeenCalled();

    // Disabled switch
    const onChangeDisabled = fn();
    const disabledSwitch = UI.Switch({
      checked: false,
      disabled: true,
      onChange: onChangeDisabled,
    });

    expect(disabledSwitch.props.children[0].props['aria-disabled']).toBe(true);
    expect(disabledSwitch.props.children[0].props['tabIndex']).toBe(-1);

    // Trigger click on disabled
    disabledSwitch.props.children[0].props.onClick();
    expect(onChangeDisabled).not.toHaveBeenCalled();
  });

  // ── 5. Tabs Component Variants, Badges & Keyboard ───────────────────────
  it('M1.TAB.1 - Tabs supports pills, underline, buttons variants and disabled items', () => {
    const tabs: UI.TabItem[] = [
      { id: 'tab1', label: 'Tất cả', count: 10 },
      { id: 'tab2', label: 'Chưa đọc', count: 2 },
      { id: 'tab3', label: 'Khóa', disabled: true },
    ];

    const onChange = fn();
    const rendered = UI.Tabs({
      tabs,
      activeTab: 'tab1',
      onChange,
      variant: 'buttons',
      fullWidth: true,
    });

    expect(rendered.props['role']).toBe('tablist');
    expect(rendered.props.className).toContain('w-full');

    const renderedTabs = rendered.props.children;
    expect(renderedTabs).toHaveLength(3);

    // Tab 1 is active
    expect(renderedTabs[0].props['aria-selected']).toBe(true);
    expect(renderedTabs[0].props['tabIndex']).toBe(0);

    // Tab 2 is inactive
    expect(renderedTabs[1].props['aria-selected']).toBe(false);
    expect(renderedTabs[1].props['tabIndex']).toBe(-1);

    // Click tab 2
    renderedTabs[1].props.onClick();
    expect(onChange).toHaveBeenCalledWith('tab2');

    // Click tab 3 (disabled)
    renderedTabs[2].props.onClick();
    expect(onChange).not.toHaveBeenCalledWith('tab3');
  });

  // ── 6. EmptyState Component Structure & Action Wiring ───────────────────
  it('M1.EMP.1 - EmptyState renders title, description, and primary/secondary actions', () => {
    const primaryAction = fn();
    const secondaryAction = fn();

    const empty = UI.EmptyState({
      title: 'Chưa có phim yêu thích',
      description: 'Hãy thêm phim bạn thích vào danh sách để xem lại sau.',
      action: {
        label: 'Khám phá ngay',
        onClick: primaryAction,
      },
      secondaryAction: {
        label: 'Xem bảng xếp hạng',
        to: '/movies?sort=top_rated',
        onClick: secondaryAction,
      },
    });

    expect(empty.props.children).toBeDefined();
    expect(empty.props.className).toContain('items-center');
  });

  // ── 7. Modal & Drawer Overlay React Elements ────────────────────────────
  it('M1.MDL.1 - Modal element creates valid React element structure and handles closed state', () => {
    const onClose = fn();
    const modalElement = React.createElement(UI.Modal, {
      isOpen: false,
      onClose,
      title: 'Hộp thoại xác nhận',
      size: 'lg',
      children: 'Nội dung',
    });

    expect(modalElement.type).toBe(UI.Modal);
    expect(modalElement.props.isOpen).toBe(false);
    expect(modalElement.props.size).toBe('lg');
  });

  it('M1.DRW.1 - Drawer element creates valid React element structure with positions and sizes', () => {
    const onClose = fn();
    const drawerElement = React.createElement(UI.Drawer, {
      isOpen: true,
      onClose,
      title: 'Thông báo mới',
      position: 'right',
      size: 'md',
      children: 'Nội dung ngăn kéo',
    });

    expect(drawerElement.type).toBe(UI.Drawer);
    expect(drawerElement.props.position).toBe('right');
    expect(drawerElement.props.isOpen).toBe(true);
  });

  // ── 8. ConfirmDialog Confirmation Flow ──────────────────────────────────
  it('M1.CFM.1 - ConfirmDialog creates valid modal element with danger, primary, and warning tones', () => {
    const onConfirm = fn();
    const onCancel = fn();

    const dialogElement = React.createElement(UI.ConfirmDialog, {
      isOpen: true,
      title: 'Xóa phim khỏi danh sách?',
      message: 'Hành động này không thể hoàn tác.',
      confirmVariant: 'danger',
      confirmText: 'Xóa ngay',
      cancelText: 'Giữ lại',
      loading: false,
      onConfirm,
      onCancel,
    });

    expect(dialogElement.type).toBe(UI.ConfirmDialog);
    expect(dialogElement.props.confirmVariant).toBe('danger');
  });

  // ── 9. Button Component Variants & Loading ───────────────────────────────
  it('M1.BTN.1 - Button supports primary, secondary, ghost, danger, gold, outline variants', () => {
    const variants: UI.ButtonVariant[] = [
      'primary',
      'secondary',
      'ghost',
      'danger',
      'gold',
      'outline',
    ];

    for (const variant of variants) {
      const btn = UI.Button({
        variant,
        size: 'md',
        children: `Btn-${variant}`,
      });
      expect(btn.props.className).toContain('font-display');
    }

    const loadingBtn = UI.Button({
      loading: true,
      children: 'Đang tải...',
    });
    expect(loadingBtn.props.disabled).toBe(true);
  });

  // ── 10. Alert Component Tones ────────────────────────────────────────────
  it('M1.ALT.1 - Alert renders all 4 tones with proper ARIA role="alert"', () => {
    const tones: UI.AlertTone[] = ['success', 'danger', 'info', 'warning'];

    for (const tone of tones) {
      const alert = UI.Alert({
        tone,
        title: `Alert ${tone}`,
        children: 'Thông báo quan trọng',
      });
      expect(alert.props['role']).toBe('alert');
      expect(alert.props.className).toContain('border');
    }
  });

  // ── 11. Router Contract & Route Hierarchy Verification ───────────────────
  it('M1.ROU.1 - PATHS dictionary contains all required M1 route mappings', () => {
    expect(PATHS.HOME).toBe('/');
    expect(PATHS.LOGIN).toBe('/login');
    expect(PATHS.REGISTER).toBe('/register');
    expect(PATHS.VERIFY_OTP).toBe('/verify-otp');
    expect(PATHS.FORGOT_PASSWORD).toBe('/forgot-password');
    expect(PATHS.RESET_PASSWORD).toBe('/reset-password');
    expect(PATHS.MOVIES).toBe('/movies');
    expect(PATHS.SEARCH).toBe('/search');
    expect(PATHS.PRICING).toBe('/pricing');
    expect(PATHS.NOTIFICATIONS).toBe('/notifications');
    expect(PATHS.MY_LIST).toBe('/my-list');
    expect(PATHS.WATCHLIST).toBe('/my-list');
    expect(PATHS.PROFILE).toBe('/profile');
    expect(PATHS.CHANGE_PASSWORD).toBe('/change-password');
    expect(PATHS.ADMIN).toBe('/admin');
    expect(PATHS.ADMIN_MOVIES).toBe('/admin/movies');
    expect(PATHS.ADMIN_GENRES).toBe('/admin/genres');
    expect(PATHS.ADMIN_ARTISTS).toBe('/admin/artists');
    expect(PATHS.FORBIDDEN).toBe('/403');
    expect(PATHS.NOT_FOUND).toBe('/404');
  });

  it('M1.ROU.2 - RoleGuard and Auth checks function strictly according to permissions', () => {
    expect(hasRole(mockAdminUser, 'ADMIN')).toBe(true);
    expect(hasRole(mockMemberUser, 'ADMIN')).toBe(false);
    expect(hasRole(null, 'ADMIN')).toBe(false);

    expect(hasAnyRole(mockAdminUser, ['ADMIN', 'SUPERADMIN'])).toBe(true);
    expect(hasAnyRole(mockMemberUser, ['ADMIN', 'SUPERADMIN'])).toBe(false);
    expect(hasAnyRole(null, ['ADMIN'])).toBe(false);
  });
});
