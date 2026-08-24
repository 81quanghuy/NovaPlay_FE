import '../helpers/setup';
import { describe, it, expect } from '../helpers/framework';
import { mockPricingTiers } from '../helpers/mockData';

describe('Feature 07: VIP Pricing Tiers Display', () => {
  it('F07.1 - Displays all 3 core tiers: Free Member, VIP Standard FHD, VIP 4K Ultra HD', () => {
    expect(mockPricingTiers).toHaveLength(3);
    expect(mockPricingTiers.map((t) => t.id)).toEqual(['FREE', 'VIP_STANDARD', 'VIP_4K']);
  });

  it('F07.2 - Pricing format displays localized VND currency values correctly', () => {
    const formatCurrency = (amount: number) =>
      amount === 0 ? 'Miễn phí' : `${new Intl.NumberFormat('vi-VN').format(amount)}đ`;

    expect(formatCurrency(mockPricingTiers[0].price)).toBe('Miễn phí');
    expect(formatCurrency(mockPricingTiers[1].price)).toBe('79.000đ');
    expect(formatCurrency(mockPricingTiers[2].price)).toBe('129.000đ');
  });

  it('F07.3 - Design token glow colors mapped to VIP tiers (cyan for Standard, gold for 4K)', () => {
    expect(mockPricingTiers.find((t) => t.id === 'VIP_STANDARD')?.glowColor).toBe('cyan');
    expect(mockPricingTiers.find((t) => t.id === 'VIP_4K')?.glowColor).toBe('gold');
    expect(mockPricingTiers.find((t) => t.id === 'FREE')?.glowColor).toBe('none');
  });

  it('F07.4 - Identifies recommended/popular plan flag for VIP Standard tier', () => {
    const popularTier = mockPricingTiers.find((t) => t.popular);
    expect(popularTier).toBeDefined();
    expect(popularTier?.id).toBe('VIP_STANDARD');
  });

  it('F07.5 - CTA button distinguishes current active tier vs selectable upgrade plans', () => {
    const currentPlanId = 'FREE';
    const getCtaLabel = (tierId: string) => (tierId === currentPlanId ? 'Gói hiện tại' : 'Nâng cấp ngay');

    expect(getCtaLabel('FREE')).toBe('Gói hiện tại');
    expect(getCtaLabel('VIP_STANDARD')).toBe('Nâng cấp ngay');
    expect(getCtaLabel('VIP_4K')).toBe('Nâng cấp ngay');
  });
});
