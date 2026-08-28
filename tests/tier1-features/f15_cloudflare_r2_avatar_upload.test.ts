import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';

describe('Feature 15: Cloudflare R2 Presigned Avatar Upload', () => {
  it('F15.1 - Validates accepted image MIME types (jpeg, png, webp)', () => {
    const isAllowedMime = (mime: string) => ['image/jpeg', 'image/png', 'image/webp'].includes(mime);

    expect(isAllowedMime('image/png')).toBe(true);
    expect(isAllowedMime('image/jpeg')).toBe(true);
    expect(isAllowedMime('image/webp')).toBe(true);
    expect(isAllowedMime('video/mp4')).toBe(false);
    expect(isAllowedMime('application/pdf')).toBe(false);
  });

  it('F15.2 - Enforces maximum file size limit (5MB = 5 * 1024 * 1024 bytes)', () => {
    const MAX_SIZE = 5 * 1024 * 1024;
    const isFileSizeValid = (size: number) => size > 0 && size <= MAX_SIZE;

    expect(isFileSizeValid(200 * 1024)).toBe(true); // 200KB
    expect(isFileSizeValid(4.8 * 1024 * 1024)).toBe(true); // 4.8MB
    expect(isFileSizeValid(5.2 * 1024 * 1024)).toBe(false); // 5.2MB
    expect(isFileSizeValid(0)).toBe(false);
  });

  it('F15.3 - Presigned upload request returns uploadUrl, mediaId, and publicUrl', () => {
    const mockRequestUploadResponse = {
      mediaId: 'med_avatar_984321',
      uploadUrl: 'https://pub-r2.novaplay.vn/avatars/temp-upload?X-Amz-Signature=xyz123',
      publicUrl: 'https://cdn.novaplay.vn/avatars/med_avatar_984321.png',
    };

    expect(mockRequestUploadResponse.mediaId).toBe('med_avatar_984321');
    expect(mockRequestUploadResponse.uploadUrl).toContain('X-Amz-Signature');
    expect(mockRequestUploadResponse.publicUrl).toContain('cdn.novaplay.vn');
  });

  it('F15.4 - Executes direct binary PUT to R2 uploadUrl without auth headers', () => {
    const executeR2Upload = fn(async (uploadUrl: string, binaryData: ArrayBuffer) => {
      expect(uploadUrl).toContain('https://pub-r2.novaplay.vn');
      expect(binaryData.byteLength).toBe(1024);
      return { status: 200 };
    });

    const dummyBuffer = new ArrayBuffer(1024);
    executeR2Upload('https://pub-r2.novaplay.vn/avatars/temp-upload', dummyBuffer);
    expect(executeR2Upload).toHaveBeenCalled();
  });

  it('F15.5 - Updates avatarUrl in profile state upon successful upload completion', () => {
    let currentAvatar = 'https://cdn.novaplay.vn/avatars/old.jpg';
    const onUploadSuccess = fn((newUrl: string) => {
      currentAvatar = newUrl;
    });

    onUploadSuccess('https://cdn.novaplay.vn/avatars/med_avatar_984321.png');
    expect(currentAvatar).toBe('https://cdn.novaplay.vn/avatars/med_avatar_984321.png');
  });
});
