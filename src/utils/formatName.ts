/**
 * Hàm xử lý cắt chuỗi name - chỉ hiển thị phần trước dấu @
 * @param name - Tên người dùng có thể chứa email
 * @returns Tên đã được format (chỉ phần trước dấu @)
 */
export const formatDisplayName = (name: string | undefined): string => {
  if (!name) return '';
  
  // Nếu name chứa @ thì cắt từ đầu đến trước dấu @
  const atIndex = name.indexOf('@');
  return atIndex > 0 ? name.substring(0, atIndex) : name;
};

/**
 * Hàm lấy ký tự đầu tiên của tên để hiển thị avatar
 * @param name - Tên người dùng
 * @param fallback - Tên fallback nếu không có name
 * @returns Ký tự đầu tiên đã được viết hoa
 */
export const getInitials = (name: string | undefined, fallback: string = ''): string => {
  const displayName = formatDisplayName(name);
  const fallbackName = formatDisplayName(fallback);
  
  return (displayName || fallbackName).charAt(0).toUpperCase();
};
