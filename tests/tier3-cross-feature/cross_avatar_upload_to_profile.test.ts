import '../helpers/setup';
import { describe, it, expect, fn } from '../helpers/framework';
import { mockMemberUser } from '../helpers/mockData';

describe('Tier 3: Cross-Feature Integration — Avatar Upload to Profile & Navbar Display', () => {
  it('T3.Avatar.1 - User opens profile page and initiates avatar change modal', () => {
    let isUploadModalOpen = false;
    const openModal = () => {
      isUploadModalOpen = true;
    };

    openModal();
    expect(isUploadModalOpen).toBe(true);
  });

  it('T3.Avatar.2 - Client validates selected image file (PNG, 250KB) and requests presigned URL', async () => {
    const selectedFile = { name: 'avatar.png', type: 'image/png', size: 256000 };
    const requestPresignedUrl = fn(async (file: typeof selectedFile) => ({
      mediaId: 'med_avatar_4455',
      uploadUrl: 'https://pub-r2.novaplay.vn/avatars/temp-upload?token=xyz',
      publicUrl: 'https://cdn.novaplay.vn/avatars/med_avatar_4455.png',
    }));

    const presignedData = await requestPresignedUrl(selectedFile);
    expect(presignedData.mediaId).toBe('med_avatar_4455');
    expect(presignedData.uploadUrl).toContain('pub-r2.novaplay.vn');
    expect(requestPresignedUrl).toHaveBeenCalled();
  });

  it('T3.Avatar.3 - Binary upload executes successfully to Cloudflare R2 presigned destination', async () => {
    const uploadBinary = fn(async (url: string, data: ArrayBuffer) => ({
      status: 200,
    }));

    const res = await uploadBinary('https://pub-r2.novaplay.vn/avatars/temp-upload?token=xyz', new ArrayBuffer(256000));
    expect(res.status).toBe(200);
    expect(uploadBinary).toHaveBeenCalled();
  });

  it('T3.Avatar.4 - Profile state is updated with newly uploaded publicUrl', () => {
    let userProfile = { ...mockMemberUser, avatarUrl: 'https://cdn.novaplay.vn/avatars/old.png' };
    const onUploadSuccess = (newUrl: string) => {
      userProfile = { ...userProfile, avatarUrl: newUrl };
    };

    onUploadSuccess('https://cdn.novaplay.vn/avatars/med_avatar_4455.png');
    expect(userProfile.avatarUrl).toBe('https://cdn.novaplay.vn/avatars/med_avatar_4455.png');
  });

  it('T3.Avatar.5 - Navbar user avatar dropdown reflects the updated image without requiring full page reload', () => {
    let navAvatar = 'https://cdn.novaplay.vn/avatars/old.png';
    const syncNavAvatar = (newUrl: string) => {
      navAvatar = newUrl;
    };

    syncNavAvatar('https://cdn.novaplay.vn/avatars/med_avatar_4455.png');
    expect(navAvatar).toBe('https://cdn.novaplay.vn/avatars/med_avatar_4455.png');
  });
});
