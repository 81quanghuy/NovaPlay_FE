import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 py-8 text-gray-300">
      <div className="mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Về NovaPLay</h3>
            <p className="text-sm">
              NovaPLay là website xem phim trực tuyến với kho phim đồ sộ, đa dạng thể loại và
              cập nhật nhanh chóng.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Liên Kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/phim-moi" className="hover:text-red-500">
                  Phim Mới
                </Link>
              </li>
              <li>
                <Link to="/phim-le" className="hover:text-red-500">
                  Phim Lẻ
                </Link>
              </li>
              <li>
                <Link to="/phim-bo" className="hover:text-red-500">
                  Phim Bộ
                </Link>
              </li>
              <li>
                <Link to="/phim-chieu-rap" className="hover:text-red-500">
                  Phim Chiếu Rạp
                </Link>
              </li>
            </ul>
          </div>

          {/* Thể Loại */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Thể Loại</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/the-loai/hanh-dong" className="hover:text-red-500">
                  Phim Hành Động
                </Link>
              </li>
              <li>
                <Link to="/the-loai/tinh-cam" className="hover:text-red-500">
                  Phim Tình Cảm
                </Link>
              </li>
              <li>
                <Link to="/the-loai/hai" className="hover:text-red-500">
                  Phim Hài
                </Link>
              </li>
              <li>
                <Link to="/the-loai/co-trang" className="hover:text-red-500">
                  Phim Cổ Trang
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-white">Liên Hệ</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: contact@NovaPLay.com</li>
              <li>Telegram: @NovaPLay</li>
              <li>Facebook: NovaPLay Official</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-sm">
          <p>&copy; 2024 NovaPLay. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 