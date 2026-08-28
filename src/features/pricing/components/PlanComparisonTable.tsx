import { Check, Crown, HelpCircle, Minus, Sparkles } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import type { PlanDTO } from '../types';
import { PRICING_PLANS, formatCurrency } from '../services/pricingService';

export interface PlanComparisonTableProps {
  plans?: PlanDTO[];
  currentPlanId?: string;
  onSelectPlan?: (plan: PlanDTO) => void;
  className?: string;
}

interface MatrixRow {
  name: string;
  description?: string;
  free: string | boolean;
  vipStandard: string | boolean;
  vip4k: string | boolean;
}

const COMPARISON_ROWS: MatrixRow[] = [
  {
    name: 'Giá cước hàng tháng',
    description: 'Thanh toán linh hoạt từng tháng',
    free: formatCurrency(0),
    vipStandard: formatCurrency(79000),
    vip4k: formatCurrency(129000),
  },
  {
    name: 'Độ phân giải tối đa',
    description: 'Chất lượng hình ảnh xuất ra thiết bị',
    free: '480p SD',
    vipStandard: '1080p FHD',
    vip4k: '4K Ultra HD + HDR',
  },
  {
    name: 'Màn hình xem cùng lúc',
    description: 'Số thiết bị stream độc lập cùng một thời điểm',
    free: '1 thiết bị',
    vipStandard: '2 thiết bị',
    vip4k: '4 thiết bị',
  },
  {
    name: 'Công nghệ âm thanh',
    description: 'Hỗ trợ định dạng âm thanh vòm chuẩn rạp',
    free: 'Stereo 2.0',
    vipStandard: 'Dolby Digital 5.1',
    vip4k: 'Dolby Atmos đỉnh cao',
  },
  {
    name: 'Trải nghiệm không quảng cáo',
    description: 'Không bao giờ bị gián đoạn khi đang xem phim',
    free: false,
    vipStandard: true,
    vip4k: true,
  },
  {
    name: 'Tải phim xem Offline',
    description: 'Lưu phim về thiết bị để xem khi không có mạng',
    free: false,
    vipStandard: 'Tối đa 10 phim',
    vip4k: 'Không giới hạn',
  },
  {
    name: 'Kho phim VIP & Chiếu Rạp độc quyền',
    description: 'Truy cập đầy đủ kho bom tấn bản quyền chất lượng cao',
    free: 'Phim cơ bản',
    vipStandard: 'Toàn bộ kho FHD',
    vip4k: 'Toàn bộ kho 4K + Early Access',
  },
  {
    name: 'Hỗ trợ đa nền tảng',
    description: 'Web, Smart TV (Samsung, LG, Android TV), iOS, Android',
    free: true,
    vipStandard: true,
    vip4k: true,
  },
  {
    name: 'Ưu tiên kết nối CDN VIP',
    description: 'Máy chủ băng thông cao chống giật lag giờ cao điểm',
    free: false,
    vipStandard: true,
    vip4k: true,
  },
];

function renderCellContent(value: string | boolean, isGold = false, isCyan = false) {
  if (typeof value === 'boolean') {
    if (value) {
      const color = isGold ? 'text-gold' : isCyan ? 'text-cyan' : 'text-success';
      return (
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-pill bg-white/5 ${color}`}>
          <Check className="w-4 h-4" />
        </span>
      );
    }
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-pill bg-white/5 text-fg-3">
        <Minus className="w-4 h-4" />
      </span>
    );
  }

  return (
    <span
      className={`font-semibold ${
        isGold ? 'text-gold' : isCyan ? 'text-cyan' : 'text-fg-1'
      }`}
    >
      {value}
    </span>
  );
}

export function PlanComparisonTable({
  plans = PRICING_PLANS,
  currentPlanId = 'FREE',
  onSelectPlan,
  className = '',
}: PlanComparisonTableProps) {
  const freePlan = plans.find((p) => p.id === 'FREE') || plans[0];
  const standardPlan = plans.find((p) => p.id === 'VIP_STANDARD') || plans[1];
  const vip4kPlan = plans.find((p) => p.id === 'VIP_4K') || plans[2];

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-border bg-surface-2/60 backdrop-blur-md ${className}`}>
      <div className="p-6 sm:p-8 border-b border-border text-center">
        <h3 className="font-display font-bold text-xl sm:text-2xl text-fg mb-2">
          Bảng So Sánh Chi Tiết Quyền Lợi Gói Cước
        </h3>
        <p className="text-xs sm:text-sm text-fg-2 max-w-xl mx-auto">
          Khám phá trọn vẹn đặc quyền giữa các gói dịch vụ để chọn trải nghiệm phù hợp nhất với bạn.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[680px]">
          <thead>
            <tr className="border-b border-border bg-surface-3/40">
              <th className="p-4 sm:p-5 w-2/5 text-sm font-bold text-fg-2 uppercase tracking-wider">
                Tính năng & Đặc quyền
              </th>
              <th className="p-4 sm:p-5 w-1/5 text-center">
                <div className="font-display font-bold text-base text-fg">Free Member</div>
                <div className="text-xs text-fg-3 mt-0.5">Miễn phí</div>
              </th>
              <th className="p-4 sm:p-5 w-1/5 text-center bg-cyan/5 border-x border-cyan/20">
                <div className="flex items-center justify-center gap-1 font-display font-bold text-base text-cyan">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>VIP Standard</span>
                </div>
                <div className="text-xs text-fg-2 mt-0.5">{formatCurrency(79000)}/tháng</div>
              </th>
              <th className="p-4 sm:p-5 w-1/5 text-center bg-gold/5">
                <div className="flex items-center justify-center gap-1 font-display font-extrabold text-base text-gold">
                  <Crown className="w-3.5 h-3.5 text-gold" />
                  <span>VIP 4K Ultra</span>
                </div>
                <div className="text-xs text-fg-2 mt-0.5">{formatCurrency(129000)}/tháng</div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {COMPARISON_ROWS.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-surface-3/30 transition-colors text-xs sm:text-sm"
              >
                <td className="p-4 sm:p-5">
                  <div className="font-semibold text-fg-1">{row.name}</div>
                  {row.description && (
                    <div className="text-[11px] text-fg-3 mt-0.5 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-fg-disabled inline" />
                      <span>{row.description}</span>
                    </div>
                  )}
                </td>
                <td className="p-4 sm:p-5 text-center text-fg-2">
                  {renderCellContent(row.free)}
                </td>
                <td className="p-4 sm:p-5 text-center bg-cyan/5 border-x border-cyan/20">
                  {renderCellContent(row.vipStandard, false, true)}
                </td>
                <td className="p-4 sm:p-5 text-center bg-gold/5">
                  {renderCellContent(row.vip4k, true, false)}
                </td>
              </tr>
            ))}
          </tbody>
          {onSelectPlan && (
            <tfoot>
              <tr className="border-t border-border bg-surface-3/30">
                <td className="p-4 sm:p-5 text-xs text-fg-3">
                  Tất cả các gói VIP đều được kích hoạt tức thì sau khi thanh toán.
                </td>
                <td className="p-4 sm:p-5 text-center">
                  {currentPlanId === 'FREE' ? (
                    <Badge variant="surface">Đang dùng</Badge>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectPlan(freePlan)}
                    >
                      Chọn
                    </Button>
                  )}
                </td>
                <td className="p-4 sm:p-5 text-center bg-cyan/5 border-x border-cyan/20">
                  {currentPlanId === 'VIP_STANDARD' ? (
                    <Badge variant="cyan">Đang dùng</Badge>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectPlan(standardPlan)}
                    >
                      Nâng Cấp
                    </Button>
                  )}
                </td>
                <td className="p-4 sm:p-5 text-center bg-gold/5">
                  {currentPlanId === 'VIP_4K' ? (
                    <Badge variant="gold">Đang dùng</Badge>
                  ) : (
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => onSelectPlan(vip4kPlan)}
                    >
                      Nâng Cấp 4K
                    </Button>
                  )}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
