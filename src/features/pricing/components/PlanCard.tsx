import { Check, Crown, Sparkles, Tv, Users, Volume2 } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { PlanDTO, BillingCycle } from '../types';
import { formatCurrency } from '../services/pricingService';

export interface BillingSwitchProps {
  billingCycle: BillingCycle;
  onChange: (cycle: BillingCycle) => void;
  className?: string;
}

export function BillingSwitch({ billingCycle, onChange, className = '' }: BillingSwitchProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className="inline-flex items-center p-1.5 bg-surface-2 border border-border rounded-pill shadow-inner">
        <button
          type="button"
          onClick={() => onChange('monthly')}
          className={`px-5 py-2 rounded-pill font-display text-sm font-semibold transition-all duration-base ${
            billingCycle === 'monthly'
              ? 'bg-primary text-white shadow-glow'
              : 'text-fg-2 hover:text-fg hover:bg-white/5'
          }`}
        >
          Thanh Toán Hàng Tháng
        </button>
        <button
          type="button"
          onClick={() => onChange('yearly')}
          className={`relative px-5 py-2 rounded-pill font-display text-sm font-semibold transition-all duration-base flex items-center gap-1.5 ${
            billingCycle === 'yearly'
              ? 'bg-gradient-to-r from-gold to-amber-500 text-black font-extrabold shadow-[0_0_20px_rgb(var(--np-gold-rgb)/0.4)]'
              : 'text-fg-2 hover:text-fg hover:bg-white/5'
          }`}
        >
          <span>Thanh Toán Hàng Năm</span>
          <Badge
            variant="gold"
            size="sm"
            className={`${
              billingCycle === 'yearly' ? 'bg-black/20 text-black border-black/30' : ''
            }`}
          >
            Tiết kiệm 20%
          </Badge>
        </button>
      </div>
      <p className="text-xs text-fg-3">
        {billingCycle === 'yearly'
          ? 'Tiết kiệm tới 2 tháng cước khi đăng ký gói 12 tháng trả trước'
          : 'Hủy hoặc thay đổi gói cước bất kỳ lúc nào mà không phát sinh phí'}
      </p>
    </div>
  );
}

export interface PlanCardProps {
  plan: PlanDTO;
  billingCycle: BillingCycle;
  isCurrentPlan: boolean;
  onSelectPlan: (plan: PlanDTO, billingCycle: BillingCycle) => void;
  className?: string;
}

export function PlanCard({
  plan,
  billingCycle,
  isCurrentPlan,
  onSelectPlan,
  className = '',
}: PlanCardProps) {
  const isVip4k = plan.id === 'VIP_4K';
  const isVipStandard = plan.id === 'VIP_STANDARD';
  const isFree = plan.id === 'FREE';

  const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
  const isPopular = Boolean(plan.popular || plan.popularBadge);

  // Card border and glow classes based on tier tokens
  let cardStyle = 'bg-surface-2/80 border-border hover:border-border-strong';
  let badgeHeader = null;

  if (isVip4k) {
    cardStyle =
      'bg-surface-2/90 border-gold/50 shadow-[0_0_30px_rgb(var(--np-gold-rgb)/0.18)] hover:shadow-[0_0_40px_rgb(var(--np-gold-rgb)/0.3)] hover:border-gold';
    badgeHeader = (
      <Badge variant="gold" size="md" pulse className="mb-2">
        <Crown className="w-3.5 h-3.5 mr-1 text-gold" /> GÓI CAO CẤP NHẤT
      </Badge>
    );
  } else if (isVipStandard) {
    cardStyle =
      'bg-surface-2/90 border-cyan/50 shadow-[0_0_24px_rgb(var(--np-cyan-rgb)/0.18)] hover:shadow-[0_0_36px_rgb(var(--np-cyan-rgb)/0.3)] hover:border-cyan';
    badgeHeader = (
      <Badge variant="cyan" size="md" className="mb-2">
        <Sparkles className="w-3.5 h-3.5 mr-1 text-cyan" /> ĐƯỢC ƯA CHUỘNG NHẤT
      </Badge>
    );
  }

  const handleCtaClick = () => {
    if (!isCurrentPlan) {
      onSelectPlan(plan, billingCycle);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between rounded-2xl border p-6 sm:p-7 transition-all duration-base ease-np-out ${cardStyle} ${className}`}
    >
      {/* Top section */}
      <div>
        {/* Popular / Premium Top Badge */}
        {badgeHeader}
        {!badgeHeader && isPopular && (
          <Badge variant="primary" size="md" className="mb-2">
            PHỔ BIẾN
          </Badge>
        )}

        {/* Plan Title & Description */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="font-display font-extrabold text-xl sm:text-2xl text-fg">{plan.name}</h3>
          {isVip4k && <Crown className="w-6 h-6 text-gold flex-shrink-0 animate-pulse" />}
        </div>
        <p className="text-xs sm:text-sm text-fg-3 mb-6 min-h-[36px]">{plan.description}</p>

        {/* Price Display */}
        <div className="mb-6 p-4 rounded-xl bg-surface-3/50 border border-border">
          <div className="flex items-baseline gap-1">
            <span className="font-display font-extrabold text-3xl sm:text-4xl text-fg">
              {formatCurrency(price)}
            </span>
            {!isFree && (
              <span className="text-xs sm:text-sm font-medium text-fg-2">
                / {billingCycle === 'yearly' ? 'năm' : 'tháng'}
              </span>
            )}
          </div>
          {!isFree && billingCycle === 'yearly' && (
            <p className="text-xs text-gold font-semibold mt-1">
              Tương đương {formatCurrency(Math.round(plan.priceYearly / 12))} / tháng
            </p>
          )}
        </div>

        {/* Key Spec Badges */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-center">
          <div className="p-2 rounded-lg bg-surface-3/30 border border-border/60">
            <Tv className="w-4 h-4 mx-auto mb-1 text-fg-2" />
            <div className="text-[11px] font-bold text-fg-1 truncate">{plan.maxResolution}</div>
          </div>
          <div className="p-2 rounded-lg bg-surface-3/30 border border-border/60">
            <Users className="w-4 h-4 mx-auto mb-1 text-fg-2" />
            <div className="text-[11px] font-bold text-fg-1 truncate">
              {plan.maxScreens} thiết bị
            </div>
          </div>
          <div className="p-2 rounded-lg bg-surface-3/30 border border-border/60">
            <Volume2 className="w-4 h-4 mx-auto mb-1 text-fg-2" />
            <div className="text-[11px] font-bold text-fg-1 truncate">{plan.audioQuality}</div>
          </div>
        </div>

        {/* Feature List */}
        <div className="space-y-3 mb-8">
          <p className="text-xs font-bold text-fg-2 uppercase tracking-wider">
            Đặc quyền bao gồm:
          </p>
          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-fg-1">
                <span
                  className={`w-4 h-4 rounded-pill flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    isVip4k
                      ? 'bg-gold/20 text-gold'
                      : isVipStandard
                        ? 'bg-cyan/20 text-cyan'
                        : 'bg-surface-3 text-fg-3'
                  }`}
                >
                  <Check className="w-3 h-3" />
                </span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-auto pt-4 border-t border-border/60">
        {isCurrentPlan ? (
          <Button variant="secondary" fullWidth disabled className="opacity-80">
            Gói Hiện Tại
          </Button>
        ) : isVip4k ? (
          <Button variant="gold" fullWidth onClick={handleCtaClick}>
            Nâng Cấp VIP 4K
          </Button>
        ) : isVipStandard ? (
          <Button variant="primary" fullWidth onClick={handleCtaClick}>
            Chọn VIP Standard
          </Button>
        ) : (
          <Button variant="outline" fullWidth onClick={handleCtaClick}>
            Sử Dụng Miễn Phí
          </Button>
        )}
      </div>
    </div>
  );
}
