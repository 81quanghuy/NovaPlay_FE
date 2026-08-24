import { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Camera,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import { Alert, Button, Modal } from '@/components/ui';
import { userService } from '../services/userService';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatarUrl?: string;
  onUploadSuccess: (newAvatarUrl: string) => void;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export function AvatarUploadModal({
  isOpen,
  onClose,
  currentAvatarUrl,
  onUploadSuccess,
}: AvatarUploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [uploadPercent, setUploadPercent] = useState<number>(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs to prevent memory leaks
  const cleanPreview = useCallback(() => {
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      cleanPreview();
    };
  }, [cleanPreview]);

  // Reset modal state on close/open
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setIsUploading(false);
      setUploadComplete(false);
      setUploadPercent(0);
      setUploadStep('');
    } else {
      cleanPreview();
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [isOpen, cleanPreview]);

  const validateAndSetFile = (file: File) => {
    setError(null);

    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      setError('Định dạng tệp không được hỗ trợ. Vui lòng chọn ảnh định dạng JPG, PNG hoặc WebP.');
      return false;
    }

    // 2. Validate file size (<= 5MB and > 0)
    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`Dung lượng ảnh (${sizeMB}MB) vượt quá giới hạn cho phép (tối đa 5.0MB).`);
      return false;
    }

    cleanPreview();
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);
    setUploadPercent(15);
    setUploadStep('Đang khởi tạo yêu cầu tải lên bảo mật...');

    try {
      // Step 1: Request presigned upload URL from backend
      setUploadPercent(35);
      setUploadStep('Đang nhận Presigned URL từ Cloudflare R2...');
      const presigned = await userService.requestAvatarUpload(
        selectedFile.name,
        selectedFile.type,
        selectedFile.size,
      );

      // Step 2: Binary PUT directly to Cloudflare R2 presigned upload URL
      setUploadPercent(70);
      setUploadStep('Đang truyền dữ liệu nhị phân trực tiếp lên Cloudflare R2...');
      await userService.uploadAvatarBinary(presigned.uploadUrl, selectedFile);

      // Step 3: Update profile with newly generated public avatar URL
      setUploadPercent(90);
      setUploadStep('Đang đồng bộ ảnh đại diện mới vào hồ sơ cá nhân...');
      const profile = await userService.getProfile();
      await userService.updateProfile({
        fullName: profile.fullName || 'Thành viên',
        avatarUrl: presigned.publicUrl,
      });

      setUploadPercent(100);
      setUploadStep('Tải lên ảnh đại diện thành công!');
      setUploadComplete(true);

      // Notify parent callback and close modal after brief delay
      onUploadSuccess(presigned.publicUrl);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Có lỗi xảy ra trong quá trình tải lên ảnh đại diện. Vui lòng thử lại.';
      setError(msg);
      setIsUploading(false);
      setUploadPercent(0);
      setUploadStep('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isUploading ? () => {} : onClose}
      size="md"
      title={
        <div className="flex items-center gap-2.5">
          <Camera className="w-5 h-5 text-primary" />
          <span>Cập Nhật Ảnh Đại Diện</span>
        </div>
      }
      description="Tải lên ảnh chân dung sắc nét để hiển thị trên hồ sơ và thanh điều hướng."
    >
      <div className="space-y-5">
        {/* Error Alert */}
        {error && (
          <Alert tone="danger" title="Không thể tải ảnh" className="animate-fade-in">
            {error}
          </Alert>
        )}

        {/* Upload & Drop Zone or Preview Box */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-base flex flex-col items-center justify-center gap-3 select-none ${
              isDragging
                ? 'border-primary bg-primary/10 shadow-glow scale-[0.99]'
                : 'border-border/80 bg-surface-2/60 hover:border-primary/50 hover:bg-surface-2'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/25 grid place-items-center text-primary shadow-glow">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="font-display font-bold text-sm text-fg">
                Kéo và thả ảnh vào đây, hoặc{' '}
                <span className="text-primary hover:underline">chọn tệp từ máy</span>
              </p>
              <p className="text-xs text-fg-3 mt-1">
                Hỗ trợ định dạng: <strong>JPG, PNG, WebP</strong> (Dung lượng tối đa 5MB)
              </p>
            </div>
          </div>
        ) : (
          /* Preview and confirmation state */
          <div className="flex flex-col items-center bg-surface-2/70 border border-border rounded-2xl p-5 space-y-4">
            {/* Avatar Circle Preview */}
            <div className="relative">
              <div className="w-32 h-32 rounded-pill overflow-hidden border-2 border-primary shadow-[0_0_30px_rgb(var(--np-primary-rgb)/0.4)] bg-surface-3">
                <img
                  src={previewUrl || currentAvatarUrl}
                  alt="Ảnh xem trước"
                  className="w-full h-full object-cover"
                />
              </div>

              {!isUploading && (
                <button
                  type="button"
                  onClick={() => {
                    cleanPreview();
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute -top-1 -right-1 w-7 h-7 rounded-pill bg-danger text-white grid place-items-center shadow-md hover:scale-110 transition-transform"
                  title="Hủy chọn ảnh"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* File Info */}
            <div className="text-center">
              <p className="font-semibold text-xs text-fg truncate max-w-[220px]">
                {selectedFile.name}
              </p>
              <p className="text-[11px] text-fg-3">
                {(selectedFile.size / 1024).toFixed(0)} KB · {selectedFile.type.replace('image/', '').toUpperCase()}
              </p>
            </div>

            {/* Upload Progress Indicator */}
            {isUploading && (
              <div className="w-full space-y-2 pt-2 border-t border-border/60">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-fg-2 flex items-center gap-1.5">
                    {uploadComplete ? (
                      <CheckCircle2 className="w-4 h-4 text-success" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    )}
                    {uploadStep}
                  </span>
                  <span className="text-primary font-bold">{uploadPercent}%</span>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full h-2 bg-white/10 rounded-pill overflow-hidden">
                  <div
                    ref={(el) => {
                      if (el) el.style.width = `${uploadPercent}%`;
                    }}
                    className={`h-full rounded-pill transition-all duration-300 ${
                      uploadComplete
                        ? 'bg-success shadow-[0_0_12px_rgb(var(--np-success-rgb)/0.5)]'
                        : 'bg-primary shadow-glow'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            {!isUploading && (
              <div className="flex items-center justify-center gap-3 w-full pt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                >
                  Đổi ảnh khác
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleStartUpload}
                  leftIcon={<UploadCloud className="w-4 h-4" />}
                  className="min-w-[130px]"
                >
                  Bắt đầu tải lên
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Footer Guidance */}
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-fg-3">
          <ImageIcon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Ảnh tải lên sẽ được mã hóa và lưu trữ an toàn trên mạng phân phối nội dung Cloudflare R2, đảm bảo tải siêu tốc và bảo mật danh tính.
          </p>
        </div>
      </div>
    </Modal>
  );
}
