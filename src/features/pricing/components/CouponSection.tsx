import { useState, type FormEvent } from 'react';
import { CheckCircle2, Loader2, Sparkles, Tag, X } from 'lucide-react';
import { Alert, Button } from '@/components/ui';
import type { CouponValidationResult } from '../types';
import { pricingService, formatCurrency } from '../services/pricingService';

export interface CouponSectionProps {
  planId: string;
  amount: number;
  appliedCoupon: CouponValidationResult | null;
  onApplyCoupon: (result: CouponValidationResult | null) => void;
  className?: string;
}

const SAMPLE_COUPONS = [
  { code: 'NOVAVIP50', label: 'Giảm 50% toàn bộ gói' },
  { code: 'SAVE30K', label: 'Giảm ngay 30.000đ' },
  { code: 'CAP40K', label: 'Giảm 50% tối đa 40k' },
];

export function CouponSection({
  planId,
  amount,
  appliedCoupon,
  onApplyCoupon,
  className = '',
}: CouponSectionProps) {
  const [inputCode, setInputCode] = useState(appliedCoupon ? appliedCoupon.code : '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleValidate = async (codeToValidate: string) => {
    const cleanCode = codeToValidate.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage('Vui lòng nhập mã ưu đãi hợp lệ');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await pricingService.validateCoupon(cleanCode, planId, amount);
      if (result.valid) {
        onApplyCoupon(result);
        setInputCode(cleanCode);
        setErrorMessage(null);
      } else {
        onApplyCoupon(null);
        setErrorMessage(result.message || 'Mã giảm giá không hợp lệ hoặc đã hết hạn');
      }
    } catch {
      onApplyCoupon(null);
      setErrorMessage('Không thể kiểm tra mã khuyến mãi vào lúc này');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleValidate(inputCode);
  };

  const handleClear = () => {
    setInputCode('');
    setErrorMessage(null);
    onApplyCoupon(null);
  };

  const handleQuickApply = (code: string) => {
    setInputCode(code);
    handleValidate(code);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Input Header & Form */}
      <div>
        <label
          htmlFor="promo-code-input"
          className="block text-xs font-bold uppercase tracking-wider text-fg-2 mb-2"
        >
          Mã Giảm Giá / Phiếu Ưu Đãi
        </label>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="w-4 h-4 text-fg-3 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="promo-code-input"
              type="text"
              value={inputCode}
              onChange={(e) => {
                setInputCode(e.target.value.toUpperCase());
                if (errorMessage) setErrorMessage(null);
              }}
              placeholder="Nhập mã ưu đãi (VD: NOVAVIP50)..."
              disabled={loading}
              className="w-full h-11 pl-10 pr-10 rounded-xl bg-surface-3/70 border border-border text-fg font-mono uppercase text-sm placeholder:normal-case placeholder:font-body placeholder:text-fg-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
            />
            {inputCode && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Xóa mã"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-pill bg-white/5 hover:bg-white/10 text-fg-2 hover:text-fg grid place-items-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            disabled={loading || !inputCode.trim()}
          >
            Áp Dụng
          </Button>
        </form>
      </div>

      {/* Suggested Quick Coupons */}
      {!appliedCoupon && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-xs text-fg-3 flex items-center gap-1 mr-1">
            <Sparkles className="w-3 h-3 text-gold" /> Gợi ý:
          </span>
          {SAMPLE_COUPONS.map((coupon) => (
            <button
              key={coupon.code}
              type="button"
              onClick={() => handleQuickApply(coupon.code)}
              className="px-2.5 py-1 rounded-lg bg-surface-3/50 hover:bg-surface-3 border border-border/80 hover:border-primary/50 text-xs font-mono text-fg-2 hover:text-primary transition-all flex items-center gap-1"
            >
              <span>{coupon.code}</span>
            </button>
          ))}
        </div>
      )}

      {/* Feedback Alert: Error */}
      {errorMessage && (
        <Alert tone="danger" title="Mã ưu đãi không hợp lệ">
          {errorMessage}
        </Alert>
      )}

      {/* Feedback Alert & Calculation: Success */}
      {appliedCoupon && appliedCoupon.valid && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-success/10 border border-success/30 flex items-start justify-between gap-3 text-xs sm:text-sm text-success">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  Đã áp dụng mã <span className="font-mono">{appliedCoupon.code}</span>
                </p>
                <p className="text-success/90 mt-0.5">{appliedCoupon.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-success/80 hover:text-success underline font-semibold flex-shrink-0"
            >
              Bỏ áp dụng
            </button>
          </div>

          {/* Discount Calculation Breakdown */}
          <div className="p-4 rounded-xl bg-surface-3/40 border border-border text-xs sm:text-sm space-y-2">
            <div className="flex justify-between text-fg-2">
              <span>Giá gốc:</span>
              <span className="font-mono">{formatCurrency(appliedCoupon.originalAmount)}</span>
            </div>
            <div className="flex justify-between text-success font-semibold">
              <span>Giảm giá khuyến mãi:</span>
              <span className="font-mono">
                -{formatCurrency(appliedCoupon.discountAmount)}
              </span>
            </div>
            <div className="pt-2 border-t border-border flex justify-between items-baseline">
              <span className="font-bold text-fg">Số tiền thanh toán:</span>
              <span className="font-display font-extrabold text-base sm:text-lg text-fg">
                {formatCurrency(appliedCoupon.finalAmount)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
