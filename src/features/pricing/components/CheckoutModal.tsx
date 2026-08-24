import { useState, useEffect, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Crown,
  CreditCard,
  QrCode,
  ShieldCheck,
  Sparkles,
  Smartphone,
  Calendar,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { Alert, Badge, Button, Modal } from '@/components/ui';
import { useAuthStore } from '@/store/authStore';
import { PATHS } from '@/routes/paths';
import type {
  PlanDTO,
  BillingCycle,
  CouponValidationResult,
  PaymentMethodId,
  RedemptionResult,
} from '../types';
import {
  pricingService,
  PAYMENT_METHODS,
  formatCurrency,
} from '../services/pricingService';
import { CouponSection } from './CouponSection';

export interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanDTO | null;
  billingCycle: BillingCycle;
  initialCoupon?: CouponValidationResult | null;
  onSuccess?: (result: RedemptionResult) => void;
}

function generateIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `idem_${crypto.randomUUID()}`;
  }
  return `idem_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function CheckoutModal({
  isOpen,
  onClose,
  selectedPlan,
  billingCycle,
  initialCoupon = null,
  onSuccess,
}: CheckoutModalProps) {
  const navigate = useNavigate();
  const rawBaseAmount = selectedPlan
    ? billingCycle === 'yearly'
      ? selectedPlan.priceYearly
      : selectedPlan.priceMonthly
    : 0;

  const [appliedCoupon, setAppliedCoupon] = useState<CouponValidationResult | null>(initialCoupon);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodId>('VIETQR');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<RedemptionResult | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');

  // Reset modal state whenever opened
  useEffect(() => {
    if (isOpen && selectedPlan) {
      setAppliedCoupon(initialCoupon);
      setSelectedPaymentMethod('VIETQR');
      setIsSubmitting(false);
      setErrorMessage(null);
      setSuccessResult(null);
      setIdempotencyKey(generateIdempotencyKey());
    }
  }, [isOpen, selectedPlan, initialCoupon]);

  if (!selectedPlan) return null;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalAmount = appliedCoupon ? appliedCoupon.finalAmount : rawBaseAmount;
  const isVip4k = selectedPlan.id === 'VIP_4K';
  const isVipStandard = selectedPlan.id === 'VIP_STANDARD';

  const handleCheckoutSubmit = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload = {
      planId: selectedPlan.id,
      billingCycle,
      amount: finalAmount,
      couponCode: appliedCoupon?.code,
      paymentMethod: selectedPaymentMethod,
      idempotencyKey: idempotencyKey || generateIdempotencyKey(),
    };

    try {
      const result = await pricingService.redeemCoupon(appliedCoupon?.code || '', payload);

      if (result.status === 'SUCCESS' || result.orderId) {
        // Update user state in authStore
        const currentUser = useAuthStore.getState().user;
        if (currentUser) {
          const filteredRoles = currentUser.roles.filter(
            (r) => r.roleName !== 'VIP' && r.roleName !== 'VIP_STANDARD' && r.roleName !== 'VIP_4K',
          );
          const roleDescription =
            result.newPlan === 'VIP_4K'
              ? 'VIP 4K Ultra Member'
              : result.newPlan === 'VIP_STANDARD'
                ? 'VIP Standard FHD Member'
                : 'Standard Free Member';

          filteredRoles.push({
            roleName: String(result.newPlan),
            description: roleDescription,
          });

          useAuthStore.getState().setUser({
            ...currentUser,
            roles: filteredRoles,
          });
        }

        setSuccessResult(result);
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        setErrorMessage(result.message || 'Thanh toán không thành công, vui lòng thử lại.');
      }
    } catch {
      setErrorMessage('Đã xảy ra lỗi trong quá trình xử lý đơn hàng. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartWatching = () => {
    onClose();
    navigate(PATHS.MOVIES);
  };

  const modalTitle = successResult ? (
    <span className="flex items-center gap-2 text-success">
      <CheckCircle2 className="w-5 h-5 text-success" />
      <span>Kích Hoạt Gói Cước Thành Công</span>
    </span>
  ) : (
    <span className="flex items-center gap-2">
      {isVip4k ? (
        <Crown className="w-5 h-5 text-gold" />
      ) : (
        <Sparkles className="w-5 h-5 text-cyan" />
      )}
      <span>Xác Nhận Đăng Ký Gói Cước</span>
    </span>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="xl"
      closeOnBackdropClick={!isSubmitting}
      closeOnEsc={!isSubmitting}
    >
      {successResult ? (
        /* Step 2: Success Confirmation View */
        <div className="py-2 text-center space-y-6">
          <div className="w-16 h-16 rounded-pill bg-success/15 border border-success/30 mx-auto flex items-center justify-center shadow-[0_0_30px_rgb(var(--np-success-rgb)/0.25)]">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-extrabold text-2xl text-fg">
              Chào mừng bạn đến với {selectedPlan.name}!
            </h4>
            <p className="text-xs sm:text-sm text-fg-2 max-w-md mx-auto">
              Đặc quyền xem phim không quảng cáo chất lượng cao của bạn đã được kích hoạt ngay tức thì.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-surface-2 border border-border text-left space-y-3 max-w-lg mx-auto text-xs sm:text-sm">
            <div className="flex justify-between items-center text-fg-2">
              <span>Mã đơn hàng:</span>
              <span className="font-mono font-bold text-fg">{successResult.orderId}</span>
            </div>
            <div className="flex justify-between items-center text-fg-2">
              <span>Gói cước kích hoạt:</span>
              <span className="font-bold text-fg">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between items-center text-fg-2">
              <span>Chu kỳ thanh toán:</span>
              <span className="text-fg">
                {billingCycle === 'yearly' ? 'Hàng năm (12 tháng)' : 'Hàng tháng'}
              </span>
            </div>
            <div className="flex justify-between items-center text-fg-2">
              <span>Ngày hết hạn:</span>
              <span className="font-medium text-fg">
                {new Date(successResult.expiryDate).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-baseline">
              <span className="font-bold text-fg">Số tiền đã thanh toán:</span>
              <span className="font-display font-extrabold text-base sm:text-lg text-success">
                {formatCurrency(successResult.amountPaid)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button
              variant={isVip4k ? 'gold' : 'primary'}
              size="lg"
              fullWidth
              onClick={handleStartWatching}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Bắt Đầu Xem Phim Ngay
            </Button>
          </div>
        </div>
      ) : (
        /* Step 1: Checkout Form */
        <div className="space-y-6">
          {/* Selected Plan Summary Banner */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isVip4k
                ? 'bg-gold/5 border-gold/30'
                : isVipStandard
                  ? 'bg-cyan/5 border-cyan/30'
                  : 'bg-surface-2 border-border'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg sm:text-xl text-fg">
                  {selectedPlan.name}
                </span>
                <Badge variant={isVip4k ? 'gold' : isVipStandard ? 'cyan' : 'surface'} size="sm">
                  {billingCycle === 'yearly' ? 'Gói 12 tháng' : 'Gói 1 tháng'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-fg-2">
                <span className="flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-fg-3" />
                  {selectedPlan.maxResolution}
                </span>
                <span>•</span>
                <span>{selectedPlan.maxScreens} màn hình xem cùng lúc</span>
                <span>•</span>
                <span>{selectedPlan.audioQuality}</span>
              </div>
            </div>

            <div className="text-right sm:flex-shrink-0">
              <div className="text-xs text-fg-3">Đơn giá:</div>
              <div className="font-display font-bold text-lg sm:text-xl text-fg">
                {formatCurrency(rawBaseAmount)}
              </div>
            </div>
          </div>

          {/* Promo Code Section */}
          <CouponSection
            planId={selectedPlan.id}
            amount={rawBaseAmount}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={setAppliedCoupon}
          />

          {/* Payment Method Choice */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-fg-2">
              Chọn Phương Thức Thanh Toán
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((method) => {
                const isSelected = selectedPaymentMethod === method.id;
                let IconComponent = QrCode;
                if (method.id === 'MOMO') IconComponent = Smartphone;
                if (method.id === 'VNPAY') IconComponent = CreditCard;

                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all duration-fast flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-glow ring-1 ring-primary'
                        : 'border-border bg-surface-2 hover:bg-surface-3/70 hover:border-border-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-2">
                      <IconComponent
                        className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-fg-3'}`}
                      />
                      {method.badge && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-fg-2">
                          {method.badge}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-fg">{method.name}</div>
                      <div className="text-[11px] text-fg-3 mt-0.5 leading-snug">
                        {method.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <Alert tone="danger" title="Không thể hoàn tất thanh toán">
              {errorMessage}
            </Alert>
          )}

          {/* Order Summary & Final Amount */}
          <div className="p-4 rounded-xl bg-surface-2 border border-border space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-fg-2">
              <span>Tạm tính ({selectedPlan.name}):</span>
              <span>{formatCurrency(rawBaseAmount)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-success font-medium">
                <span>Ưu đãi voucher ({appliedCoupon?.code}):</span>
                <span>-{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-border flex justify-between items-baseline">
              <span className="font-bold text-fg">Tổng tiền thanh toán:</span>
              <span className="font-display font-extrabold text-xl sm:text-2xl text-primary">
                {formatCurrency(finalAmount)}
              </span>
            </div>
          </div>

          {/* Trust Guarantee Note */}
          <div className="flex items-center gap-2 text-xs text-fg-3">
            <ShieldCheck className="w-4 h-4 text-success flex-shrink-0" />
            <span>Thanh toán được bảo mật chuẩn mã hóa SSL 256-bit. Kích hoạt dịch vụ tự động ngay.</span>
          </div>

          {/* Submit Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button
              type="button"
              variant={isVip4k ? 'gold' : 'primary'}
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleCheckoutSubmit}
            >
              Xác Nhận Thanh Toán ({formatCurrency(finalAmount)})
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
