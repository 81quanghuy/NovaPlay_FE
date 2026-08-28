import { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronDown,
  Crown,
  HelpCircle,
  Percent,
  ShieldCheck,
  Tag,
  X,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { pricingService } from '../services/pricingService';

interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceYearly: number;
  description: string;
  features: string[];
  notIncluded?: string[];
  isPopular?: boolean;
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    name: 'MEMBER (Miễn Phí)',
    priceMonthly: 0,
    priceYearly: 0,
    description: 'Thưởng thức các tựa phim kinh điển cơ bản với chất lượng Full HD tiêu chuẩn.',
    features: [
      'Xem phim chất lượng HD 720p & FHD 1080p',
      'Kho phim chọn lọc cơ bản',
      'Đồng bộ danh sách yêu thích',
      'Có quảng cáo ngắn đầu phim',
    ],
    notIncluded: [
      'Phát trực tuyến 4K Ultra HD & HDR',
      'Âm thanh vòm Dolby Atmos / 5.1',
      'Xem đồng thời trên 4 thiết bị',
      'Ưu tiên tốc độ máy chủ VIP',
    ],
  },
  {
    id: 'vip_standard',
    name: 'VIP STANDARD',
    badge: 'Phổ Biến Nhất',
    priceMonthly: 69000,
    priceYearly: 690000,
    isPopular: true,
    description: 'Trải nghiệm mượt mà không quảng cáo, âm thanh sống động và toàn bộ kho phim.',
    features: [
      'Xem phim không quảng cáo 100%',
      'Chất lượng Full HD 1080p 60fps',
      'Toàn bộ kho phim lẻ & phim bộ',
      'Tốc độ máy chủ Server VIP #1',
      'Xem đồng thời trên 2 thiết bị',
      'Hỗ trợ phụ đề Vietsub & Thuyết minh',
    ],
    notIncluded: [
      'Chất lượng IMAX 4K UHD 2160p',
      'Âm thanh Dolby Atmos chuyên sâu',
    ],
  },
  {
    id: 'vip_4k',
    name: 'VIP 4K ULTRA HD',
    badge: 'Trải Nghiệm Đỉnh Cao',
    priceMonthly: 119000,
    priceYearly: 1190000,
    description: 'Chuẩn rạp chiếu phim tại gia với hình ảnh 4K HDR và âm thanh vòm Dolby Atmos đa chiều.',
    features: [
      'Chất lượng siêu nét 4K Ultra HD & HDR',
      'Âm thanh vòm rạp chiếu 5.1 Dolby Atmos',
      'Toàn bộ kho phim bom tấn & Độc quyền',
      'Tốc độ cao nhất, không giật lag',
      'Xem đồng thời trên 4 thiết bị',
      'Huy hiệu Thành Viên VIP Vàng trên hồ sơ',
      'Hỗ trợ khách hàng ưu tiên 24/7',
    ],
  },
];

const FAQ_ITEMS = [
  {
    question: 'Tôi có thể hủy hoặc đổi gói cước bất cứ lúc nào không?',
    answer:
      'Có. Bạn hoàn toàn có thể nâng cấp, hạ cấp hoặc hủy gói bất kỳ lúc nào trong trang Hồ Sơ Cá Nhân mà không phát sinh thêm bất kỳ chi phí nào.',
  },
  {
    question: 'NovaPlay hỗ trợ những hình thức thanh toán nào?',
    answer:
      'Chúng tôi hỗ trợ chuyển khoản ngân hàng 24/7 qua VietQR, Ví điện tử MoMo, và thẻ quốc tế Visa/Mastercard. Giao dịch được xử lý hoàn toàn tự động trong 5 giây.',
  },
  {
    question: 'Làm thế nào để sử dụng mã giảm giá (Promo Code)?',
    answer:
      'Khi chọn gói cước và mở cửa sổ nâng cấp, bạn chỉ cần nhập mã khuyến mãi (như NOVAVIP50, SUPERVIP) vào ô mã ưu đãi, hệ thống sẽ tự động tính toán lại số tiền giảm.',
  },
  {
    question: 'Tôi có thể xem trên bao nhiêu thiết bị cùng lúc?',
    answer:
      'Gói Free cho phép 1 thiết bị, gói VIP Standard FHD cho phép 2 thiết bị và gói VIP 4K Ultra HD hỗ trợ tới 4 thiết bị đồng thời trên các nền tảng Smart TV, Web và Di động.',
  },
];

export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [couponError, setCouponError] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  function handleOpenCheckout(plan: PricingPlan) {
    if (plan.priceMonthly === 0) return;
    setSelectedPlan(plan);
    setCouponCode('');
    setAppliedDiscount(null);
    setCouponError('');
    setCheckoutSuccess(false);
  }

  async function handleApplyCoupon() {
    const code = couponCode.trim();
    if (!code) return;

    const res = await pricingService.validateCoupon(code);
    if (res.valid) {
      setAppliedDiscount(res.discountValue ?? res.discountPercent ?? 50);
      setCouponError('');
    } else {
      setAppliedDiscount(null);
      setCouponError(res.message || 'Mã ưu đãi không hợp lệ hoặc đã hết lượt.');
    }
  }

  function handleConfirmUpgrade() {
    setCheckoutSuccess(true);
  }

  return (
    <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 py-12 select-none">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-pill bg-gold/15 border border-gold/40 text-gold text-xs font-black mb-4 shadow-sm">
          <Crown className="w-4 h-4 fill-gold" /> GÓI THUÊ BAO VIP NOVAPLAY
        </div>

        <h1 className="font-display font-black text-3xl sm:text-5xl text-fg tracking-tight mb-4">
          Nâng Tầm Trải Nghiệm Điện Ảnh 4K
        </h1>
        <p className="text-sm sm:text-lg text-fg-2 max-w-2xl mx-auto leading-relaxed">
          Thưởng thức toàn bộ kiệt tác điện ảnh không quảng cáo, hình ảnh 4K HDR siêu sắc nét và âm thanh Dolby Atmos như tại rạp chiếu.
        </p>

        {/* Billing Cycle Switcher */}
        <div className="inline-flex items-center p-1 rounded-2xl bg-surface-2 border border-white/10 mt-8 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle('monthly')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all ${
              billingCycle === 'monthly'
                ? 'bg-primary text-white shadow-glow'
                : 'text-fg-3 hover:text-fg'
            }`}
          >
            Thanh Toán Hàng Tháng
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle('yearly')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 ${
              billingCycle === 'yearly'
                ? 'bg-primary text-white shadow-glow'
                : 'text-fg-3 hover:text-fg'
            }`}
          >
            <span>Thanh Toán Hàng Năm</span>
            <span className="px-1.5 py-0.5 rounded-md bg-gold text-black text-[10px] font-black">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch max-w-6xl mx-auto mb-16">
        {PRICING_PLANS.map((plan) => {
          const price =
            billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;
          const isFree = plan.priceMonthly === 0;

          return (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                plan.isPopular
                  ? 'bg-surface border-2 border-primary shadow-[0_0_50px_rgba(6,182,212,0.25)] ring-1 ring-primary/40 -translate-y-2'
                  : 'bg-surface-2 border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-pill bg-grad-brand text-white text-xs font-black shadow-glow">
                  {plan.badge}
                </div>
              )}

              <div>
                <h3 className="font-display font-black text-lg sm:text-xl text-fg mb-2">
                  {plan.name}
                </h3>
                <p className="text-xs text-fg-3 min-h-[36px] mb-6 leading-relaxed">
                  {plan.description}
                </p>

                {/* Price Display */}
                <div className="flex items-baseline gap-1 mb-6 pb-6 border-b border-white/10">
                  {isFree ? (
                    <span className="font-display font-black text-4xl text-fg">0đ</span>
                  ) : (
                    <>
                      <span className="font-display font-black text-3xl sm:text-4xl text-fg">
                        {price.toLocaleString('vi-VN')}đ
                      </span>
                      <span className="text-xs text-fg-3 font-semibold">
                        /{billingCycle === 'yearly' ? 'năm' : 'tháng'}
                      </span>
                    </>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-fg-3 block mb-3">
                    Quyền Lợi Bao Gồm:
                  </span>
                  {plan.features.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-fg-1">
                      <span className="w-5 h-5 rounded-pill bg-primary/20 text-primary grid place-items-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}

                  {plan.notIncluded?.map((feat) => (
                    <div key={feat} className="flex items-start gap-2.5 text-xs sm:text-sm text-fg-3 line-through opacity-50">
                      <span className="w-5 h-5 rounded-pill bg-white/5 text-fg-3 grid place-items-center flex-shrink-0 mt-0.5">
                        <X className="w-3 h-3" />
                      </span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div>
                {isFree ? (
                  <button
                    type="button"
                    disabled
                    className="w-full h-12 rounded-xl bg-white/5 border border-white/10 text-fg-3 text-sm font-extrabold cursor-default"
                  >
                    Gói Mặc Định
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleOpenCheckout(plan)}
                    className={`w-full h-12 rounded-xl font-display font-black text-sm transition-all shadow-glow flex items-center justify-center gap-2 active:scale-95 ${
                      plan.isPopular
                        ? 'bg-grad-brand text-white hover:brightness-110'
                        : 'bg-primary/20 hover:bg-primary text-primary hover:text-white border border-primary/40'
                    }`}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Nâng Cấp Ngay
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Promo Code Highlight Banner */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-surface-2 border border-white/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mb-16">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gold/20 border border-gold/40 text-gold grid place-items-center flex-shrink-0 shadow-sm">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-fg">
              Có Mã Ưu Đãi Giảm Giá?
            </h3>
            <p className="text-xs sm:text-sm text-fg-3 mt-0.5">
              Dùng mã <strong className="text-gold font-mono">NOVAVIP50</strong> để giảm ngay 50% cho thành viên mới!
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleOpenCheckout(PRICING_PLANS[1])}
          className="px-5 py-2.5 rounded-xl bg-gold text-black text-xs sm:text-sm font-black shadow-sm hover:brightness-110 transition-all flex-shrink-0"
        >
          Áp Dụng Mã Ngay
        </button>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mb-12">
        <div className="text-center mb-8">
          <Badge variant="surface" size="md" className="mb-2">
            <HelpCircle className="w-3.5 h-3.5 mr-1 text-primary" /> TRỢ GIÚP & HỎI ĐÁP
          </Badge>
          <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg">
            Câu Hỏi Thường Gặp
          </h3>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-border bg-surface-2/60 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-display font-bold text-sm sm:text-base text-fg hover:text-primary transition-colors select-none"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-fg-3 transition-transform duration-base ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-fg-2 leading-relaxed border-t border-border/40 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Checkout & Coupon Modal ────────────────────────────────────── */}
      {selectedPlan && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Thanh toán nâng cấp VIP"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none animate-fade-in"
        >
          <button
            type="button"
            aria-label="Đóng"
            onClick={() => setSelectedPlan(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-2xl cursor-default"
          />

          <div className="relative z-10 w-full max-w-md bg-surface border border-white/15 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] p-6 sm:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-9 h-9 rounded-xl bg-primary/20 text-primary grid place-items-center shadow-glow">
                  <Crown className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-display font-extrabold text-base text-fg">
                    Nâng Cấp Gói VIP
                  </h3>
                  <p className="text-xs text-fg-3">{selectedPlan.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                aria-label="Đóng"
                className="w-8 h-8 rounded-pill bg-white/10 hover:bg-white/20 text-fg grid place-items-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {checkoutSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-pill bg-success/20 text-success border border-success/40 grid place-items-center mx-auto mb-4 shadow-glow">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display font-black text-xl text-fg mb-2">
                  Nâng Cấp Thành Công!
                </h4>
                <p className="text-xs sm:text-sm text-fg-3 mb-6">
                  Tài khoản của bạn đã được kích hoạt gói <strong>{selectedPlan.name}</strong>. Hãy bắt đầu thưởng thức phim 4K ngay!
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="w-full h-11 rounded-xl bg-grad-brand text-white font-extrabold text-sm shadow-glow"
                >
                  Bắt Đầu Xem Phim
                </button>
              </div>
            ) : (
              <div>
                {/* Plan Summary */}
                <div className="p-4 rounded-2xl bg-surface-2 border border-white/10 mb-5">
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <span className="text-fg-3">Gói lựa chọn:</span>
                    <span className="font-bold text-fg">{selectedPlan.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-2">
                    <span className="text-fg-3">Chu kỳ:</span>
                    <span className="font-bold text-fg">
                      {billingCycle === 'yearly' ? '1 Năm' : '1 Tháng'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs sm:text-sm pt-2 border-t border-white/5">
                    <span className="text-fg-3">Giá gốc:</span>
                    <span className="font-extrabold text-fg">
                      {(billingCycle === 'yearly'
                        ? selectedPlan.priceYearly
                        : selectedPlan.priceMonthly
                      ).toLocaleString('vi-VN')}
                      đ
                    </span>
                  </div>

                  {appliedDiscount && (
                    <div className="flex items-center justify-between text-xs sm:text-sm pt-2 text-gold">
                      <span>Mã giảm giá ({appliedDiscount}%):</span>
                      <span className="font-extrabold">
                        -
                        {(
                          ((billingCycle === 'yearly'
                            ? selectedPlan.priceYearly
                            : selectedPlan.priceMonthly) *
                            appliedDiscount) /
                          100
                        ).toLocaleString('vi-VN')}
                        đ
                      </span>
                    </div>
                  )}
                </div>

                {/* Coupon Box */}
                <div className="mb-5">
                  <label htmlFor="coupon-code-input" className="block text-xs font-extrabold text-fg-3 mb-2 uppercase tracking-wider">
                    Mã Ưu Đãi / Khuyến Mãi
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-fg-3 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="coupon-code-input"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="VD: NOVAVIP50"
                        className="w-full bg-surface-2 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs sm:text-sm font-mono text-fg uppercase placeholder:text-fg-3 outline-none focus:border-primary"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-fg border border-white/10 transition-colors"
                    >
                      Áp Dụng
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-danger mt-1.5">{couponError}</p>
                  )}
                  {appliedDiscount && (
                    <p className="text-xs text-success mt-1.5 font-bold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Đã áp dụng giảm giá {appliedDiscount}% thành công!
                    </p>
                  )}
                </div>

                {/* Total & Checkout button */}
                <div className="flex items-baseline justify-between mb-5 pt-3 border-t border-white/10">
                  <span className="text-sm font-bold text-fg-3">Tổng thanh toán:</span>
                  <span className="font-display font-black text-2xl text-primary drop-shadow-sm">
                    {(
                      (billingCycle === 'yearly'
                        ? selectedPlan.priceYearly
                        : selectedPlan.priceMonthly) *
                      (1 - (appliedDiscount || 0) / 100)
                    ).toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleConfirmUpgrade}
                  className="w-full h-12 rounded-xl bg-grad-brand text-white font-display font-black text-sm flex items-center justify-center gap-2 shadow-glow hover:brightness-110 active:scale-95 transition-all"
                >
                  <ShieldCheck className="w-4 h-4" /> Xác Nhận Nâng Cấp
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
