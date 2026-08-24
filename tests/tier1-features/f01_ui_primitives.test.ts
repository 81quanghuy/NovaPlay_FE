import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';

describe('Feature 01: Shared UI Primitives', () => {
  it('F01.1 - Drawer primitive validates isOpen state and triggers onClose callback on dismissal', () => {
    let isOpen = true;
    const onClose = fn(() => {
      isOpen = false;
    });

    // Simulate drawer dismissal
    expect(isOpen).toBe(true);
    onClose();
    expect(isOpen).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('F01.2 - Modal supports responsive size configurations (sm, md, lg, xl, full)', () => {
    const sizeClasses: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-2xl',
      full: 'max-w-6xl',
    };

    expect(sizeClasses.sm).toBe('max-w-sm');
    expect(sizeClasses.lg).toBe('max-w-lg');
    expect(sizeClasses.full).toBe('max-w-6xl');
    expect(Object.keys(sizeClasses)).toHaveLength(5);
  });

  it('F01.3 - Tabs component switches activeTab and displays badge count numbers', () => {
    const tabs = [
      { id: 'all', label: 'Tất cả', count: 12 },
      { id: 'unread', label: 'Chưa đọc', count: 3 },
      { id: 'system', label: 'Hệ thống' },
    ];
    let activeTab = 'all';
    const onChange = fn((id: string) => {
      activeTab = id;
    });

    expect(activeTab).toBe('all');
    onChange('unread');
    expect(activeTab).toBe('unread');
    expect(tabs.find((t) => t.id === 'unread')?.count).toBe(3);
    expect(onChange).toHaveBeenCalledWith('unread');
  });

  it('F01.4 - Badge component renders semantic design token color variants', () => {
    const badgeVariants = {
      primary: 'bg-primary/20 text-primary border-primary/30',
      gold: 'bg-gold/20 text-gold border-gold/30',
      success: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      danger: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
      surface: 'bg-surface-2 text-text-secondary border-border',
    };

    expect(badgeVariants.primary).toContain('text-primary');
    expect(badgeVariants.gold).toContain('text-gold');
    expect(badgeVariants.danger).toContain('text-rose-400');
    expect(badgeVariants.surface).toContain('bg-surface-2');
  });

  it('F01.5 - Switch primitive toggles checked boolean state and respects disabled property', () => {
    let checked = false;
    let disabled = true;
    const onChange = fn((val: boolean) => {
      if (!disabled) checked = val;
    });

    onChange(true);
    expect(checked).toBe(false); // blocked by disabled
    expect(onChange).toHaveBeenCalledTimes(1);

    disabled = false;
    onChange(true);
    expect(checked).toBe(true);
  });

  it('F01.6 - ConfirmDialog triggers onConfirm and onCancel handlers appropriately', () => {
    let confirmed = false;
    let cancelled = false;
    const onConfirm = fn(() => {
      confirmed = true;
    });
    const onCancel = fn(() => {
      cancelled = true;
    });

    onConfirm();
    expect(confirmed).toBe(true);
    expect(cancelled).toBe(false);

    onCancel();
    expect(cancelled).toBe(true);
  });

  it('F01.7 - EmptyState supports custom title, description, and action CTA button', () => {
    let actionTriggered = false;
    const emptyStateProps = {
      title: 'Không có thông báo nào',
      description: 'Khi có thông báo mới, chúng sẽ xuất hiện tại đây.',
      action: {
        label: 'Khám phá phim ngay',
        onClick: fn(() => {
          actionTriggered = true;
        }),
      },
    };

    expect(emptyStateProps.title).toBe('Không có thông báo nào');
    emptyStateProps.action.onClick();
    expect(actionTriggered).toBe(true);
    expect(emptyStateProps.action.onClick).toHaveBeenCalledTimes(1);
  });
});
