import { useState, useEffect } from 'react';
import {
  ChevronDown,
  Crown,
  Headphones,
  HelpCircle,
  Lock,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Badge } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import type { PlanDTO, BillingCycle, FAQItem } from '../types';
import { PRICING_PLANS, pricingService } from '../services/pricingService';
import { PlanCard, BillingSwitch } from '../components/PlanCard';
import { PlanComparisonTable } from '../components/PlanComparisonTable';
import { CheckoutModal } from '../components/CheckoutModal';

const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Tôi có thể hủy hoặc đổi gói cước bất cứ lúc nào không?',
    answer:
      'Có. Bạn hoàn toàn có thể nâng cấp, hạ cấp hoặc hủy gói bất kỳ lúc nào trong trang Hồ Sơ Cá Nhân mà không phát sinh thêm bất kỳ khoản phí phụ nào.',
  },
  {
    question: 'NovaPlay hỗ trợ những hình thức thanh toán nào?',
    answer:
      'Chúng tôi hỗ trợ chuyển khoản ngân hàng 24/7 qua VietQR, Ví điện tử MoMo, và cổng VNPay (hỗ trợ thẻ ATM nội địa cùng thẻ quốc tế Visa/Mastercard). Giao dịch được xử lý hoàn toàn tự động trong 5 giây.',
  },
  {
    question: 'Làm thế nào để sử dụng mã giảm giá (Promo Code)?',
    answer:
      'Khi chọn gói cước và mở cửa sổ thanh toán (Checkout), bạn chỉ cần nhập mã khuyến mãi (như NOVAVIP50, SAVE30K) vào ô "Mã Giảm Giá", hệ thống sẽ tự động tính toán lại mức giảm và số tiền thanh toán cuối cùng.',
  },
  {
    question: 'Tôi có thể xem trên bao nhiêu thiết bị cùng một thời điểm?',
    answer:
      'Gói Free cho phép 1 thiết bị, gói VIP Standard FHD cho phép 2 thiết bị và gói VIP 4K Ultra HD hỗ trợ tới 4 thiết bị đồng thời trên các nền tảng Smart TV, Web, Điện thoại và Tablet.',
  },
  {
    question: 'Gói VIP 4K Ultra HD có những điểm vượt trội gì?',
    answer:
      'Gói VIP 4K mở khóa độ phân giải 4K Ultra HD + HDR sắc nét nhất, hệ thống âm thanh vòm Dolby Atmos chuẩn rạp chiếu phim, máy chủ CDN VIP băng thông cao và đặc quyền xem trước các phim chiếu rạp mới nhất (Early Access).',
  },
  {
    question: 'Chính sách bảo mật và hoàn tiền như thế nào?',
    answer:
      'Mọi giao dịch trên NovaPlay đều được mã hóa chuẩn SSL 256-bit cao cấp nhất. Nếu gặp sự cố kỹ thuật không thể kích hoạt dịch vụ, đội ngũ hỗ trợ 24/7 sẽ hỗ trợ hoàn tiền 100% trong vòng 24 giờ.',
  },
];

export function PricingPage() {
  const [plans, setPlans] = useState<PlanDTO[]>(PRICING_PLANS);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<PlanDTO | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    pricingService.getPlans().then((res) => {
      if (res && res.length > 0) {
        setPlans(res);
      }
    });
  }, []);

  const getCurrentPlanId = (): string => {
    if (!currentUser) return 'FREE';
    const isVip4k = currentUser.roles.some(
      (r) =>
        r.roleName === 'VIP_4K' ||
        (r.description && r.description.toLowerCase().includes('4k')),
    );
    if (isVip4k) return 'VIP_4K';

    const isVipStandard = currentUser.roles.some(
      (r) =>
        r.roleName === 'VIP_STANDARD' ||
        r.roleName === 'VIP' ||
        (r.description && r.description.toLowerCase().includes('vip')),
    );
    if (isVipStandard) return 'VIP_STANDARD';

    return 'FREE';
  };

  const currentPlanId = getCurrentPlanId();

  const handleSelectPlan = (plan: PlanDTO, cycle: BillingCycle = billingCycle) => {
    setBillingCycle(cycle);
    setSelectedPlan(plan);
    setIsCheckoutOpen(true);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-bg text-fg">
      {/* Background Cinematic Glows */}
      <div className="relative overflow-hidden pt-8 pb-16">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-pill blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 right-1/4 w-96 h-96 bg-gold/10 rounded-pill blur-3xl pointer-events-none -z-10" />

        <div className="max-w-container mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header Section */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="gold" size="md" pulse className="mb-2">
              <Crown className="w-4 h-4 mr-1 text-gold" /> GÓI CƯỚC VIP NOVAPLAY
            </Badge>
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-6xl text-fg tracking-tight leading-tight">
              Nâng Cấp Trải Nghiệm <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-cyan via-primary to-gold bg-clip-text text-transparent">
                Điện Ảnh Không Giới Hạn
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-fg-2 max-w-2xl mx-auto leading-relaxed">
              Thưởng thức kho phim 4K Ultra HD bản quyền, âm thanh vòm Dolby Atmos chuẩn rạp chiếu,
              hoàn toàn không có quảng cáo trên mọi thiết bị.
            </p>

            {/* Billing Switch */}
            <div className="pt-4">
              <BillingSwitch
                billingCycle={billingCycle}
                onChange={setBillingCycle}
              />
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                billingCycle={billingCycle}
                isCurrentPlan={plan.id === currentPlanId}
                onSelectPlan={handleSelectPlan}
              />
            ))}
          </div>

          {/* Guarantee Badges Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto py-6 border-y border-border">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/40 border border-border/60">
              <Sparkles className="w-5 h-5 text-cyan flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-fg">Chuẩn 4K HDR</div>
                <div className="text-[11px] text-fg-3">Hình ảnh chân thực</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/40 border border-border/60">
              <Zap className="w-5 h-5 text-gold flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-fg">Kích Hoạt Tức Thì</div>
                <div className="text-[11px] text-fg-3">Tự động trong 5 giây</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/40 border border-border/60">
              <Lock className="w-5 h-5 text-success flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-fg">Bảo Mật SSL 256-Bit</div>
                <div className="text-[11px] text-fg-3">An toàn tuyệt đối</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2/40 border border-border/60">
              <Headphones className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <div className="text-xs font-bold text-fg">Hỗ Trợ 24/7</div>
                <div className="text-[11px] text-fg-3">Tư vấn tận tâm</div>
              </div>
            </div>
          </div>

          {/* Feature Comparison Matrix Section */}
          <div className="max-w-6xl mx-auto">
            <PlanComparisonTable
              plans={plans}
              currentPlanId={currentPlanId}
              onSelectPlan={handleSelectPlan}
            />
          </div>

          {/* FAQ Accordion Section */}
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <Badge variant="surface" size="md">
                <HelpCircle className="w-3.5 h-3.5 mr-1 text-fg-2" /> TRỢ GIÚP & HỎI ĐÁP
              </Badge>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-fg">
                Câu Hỏi Thường Gặp
              </h3>
              <p className="text-xs sm:text-sm text-fg-2">
                Mọi thắc mắc của bạn về gói cước và dịch vụ đều có câu trả lời tại đây.
              </p>
            </div>

            <div className="space-y-3">
              {FAQ_ITEMS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-surface-2/60 overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
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
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        selectedPlan={selectedPlan}
        billingCycle={billingCycle}
      />
    </div>
  );
}
