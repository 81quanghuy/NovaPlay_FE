export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterUrl: string;
  backdropUrl: string;
  year: number;
  rating: number;
  genres: string[];
  duration: number;
  quality: '4K' | 'FHD' | 'HD';
  type: 'movie' | 'series';
  episodes?: { current: number; total: number };
  country: string;
}

export const NP_MOVIES: Movie[] = [
  { id: 1,  title: 'Wonka', overview: 'Câu chuyện kỳ diệu về hành trình của Willy Wonka trở thành người thợ làm chocolate vĩ đại nhất thế giới.', posterUrl: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/yOm993lsJyPmBodlYjgpPwBjXP9.jpg', year: 2023, rating: 7.2, genres: ['Phiêu Lưu','Hài','Gia Đình'], duration: 116, quality: 'FHD', type: 'movie', country: 'Mỹ' },
  { id: 2,  title: 'Aquaman và Vương Quốc Thất Lạc', overview: 'Sau các sự kiện của phần phim đầu tiên, Arthur Curry/Aquaman đã trở thành Vua của Atlantis. Giờ đây, anh phải bảo vệ cả người dân trên mặt đất và dưới đại dương.', posterUrl: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/jXJxMcVoEVMFvMBn0c9wbDdCYoJ.jpg', year: 2023, rating: 6.9, genres: ['Hành Động','Phiêu Lưu','Viễn Tưởng'], duration: 124, quality: '4K', type: 'movie', country: 'Mỹ' },
  { id: 3,  title: 'Người Nhện: Du Hành Vũ Trụ Nhện', overview: 'Miles Morales tái xuất trong phần tiếp theo của saga Spider-Verse đoạt giải Oscar, một cuộc phiêu lưu hoành tráng đưa Người Nhện thân thiện với khu phố Brooklyn toàn thời gian băng qua đa vũ trụ.', posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/gkseI3CUfQtMKX41XD4AxDzhQb7.jpg', year: 2023, rating: 8.4, genres: ['Hoạt Hình','Hành Động','Phiêu Lưu'], duration: 140, quality: '4K', type: 'movie', country: 'Mỹ' },
  { id: 4,  title: 'Oppenheimer', overview: 'Câu chuyện về nhà vật lý lý thuyết J. Robert Oppenheimer và vai trò của ông trong việc phát triển bom nguyên tử.', posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', year: 2023, rating: 8.2, genres: ['Lịch Sử','Chính Kịch'], duration: 180, quality: 'FHD', type: 'movie', country: 'Mỹ' },
  { id: 5,  title: 'Loki', overview: 'Sau khi đánh cắp Tesseract trong Avengers: Endgame, một phiên bản thay thế của Loki được đưa đến Time Variance Authority.', posterUrl: 'https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/q3jHCb4dMfYF6ojikKuHd6LscxC.jpg', year: 2023, rating: 8.1, genres: ['Viễn Tưởng','Hành Động'], duration: 45, quality: 'FHD', type: 'series', episodes: { current: 1, total: 60 }, country: 'Mỹ' },
  { id: 6,  title: 'Barbie', overview: 'Barbie và Ken bước vào thế giới thực và khám phá ý nghĩa thực sự của hạnh phúc.', posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/ctMserH8g2SeOAnCw5gFjdQF8mo.jpg', year: 2023, rating: 7.0, genres: ['Hài','Phiêu Lưu'], duration: 114, quality: 'FHD', type: 'movie', country: 'Mỹ' },
  { id: 7,  title: 'Fast X', overview: 'Dom Toretto và gia đình đối mặt với kẻ thù nguy hiểm nhất từ trước đến nay.', posterUrl: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/4XM8DUTQb3lhLemJC51Jx4a2EuA.jpg', year: 2023, rating: 6.2, genres: ['Hành Động','Tội Phạm'], duration: 141, quality: 'FHD', type: 'movie', country: 'Mỹ' },
  { id: 9,  title: 'John Wick 4', overview: 'John Wick đối đầu với Hội đồng Tối cao trong trận chiến cuối cùng.', posterUrl: 'https://image.tmdb.org/t/p/w500/gh2bmprLtUQ8oXCSluzfqaicyrm.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/1inZm0xxXrpRfN0LxwE2TXzyLN6.jpg', year: 2023, rating: 8.0, genres: ['Hành Động','Kịch Tính'], duration: 169, quality: '4K', type: 'movie', country: 'Mỹ' },
  { id: 10, title: 'Mission: Impossible - Dead Reckoning', overview: 'Ethan Hunt và đội IMF đối mặt với mối đe dọa toàn cầu mới.', posterUrl: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/5YZbUmjbMa3ClvSW1Wj3D6XGolb.jpg', year: 2023, rating: 7.8, genres: ['Hành Động','Phiêu Lưu'], duration: 163, quality: '4K', type: 'movie', country: 'Mỹ' },
  { id: 12, title: 'Spider-Man: No Way Home', overview: 'Peter Parker nhờ Doctor Strange giúp đỡ để bảo vệ bí mật thân phận.', posterUrl: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg', year: 2021, rating: 8.3, genres: ['Hành Động','Phiêu Lưu','Viễn Tưởng'], duration: 148, quality: 'FHD', type: 'movie', country: 'Mỹ' },
  { id: 13, title: 'Avatar: The Way of Water', overview: 'Jake Sully và Neytiri bảo vệ gia đình trước mối đe dọa mới trên Pandora.', posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/ovM06PdF3M8wvKb06i4sjW3xoww.jpg', year: 2022, rating: 7.7, genres: ['Hành Động','Phiêu Lưu','Viễn Tưởng'], duration: 192, quality: '4K', type: 'movie', country: 'Mỹ' },
  { id: 19, title: 'Dune: Part Two', overview: 'Paul Atreides liên minh với Chani và Fremen để trả thù những kẻ đã phá hủy gia đình mình.', posterUrl: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', backdropUrl: 'https://image.tmdb.org/t/p/original/2vFuG6bWGyQUzYS9d69E5l85nIz.jpg', year: 2024, rating: 8.5, genres: ['Khoa Học','Phiêu Lưu'], duration: 155, quality: '4K', type: 'movie', country: 'Mỹ' },
];

export const NP_HERO    = NP_MOVIES.slice(0, 5);
export const NP_NEW     = NP_MOVIES.slice(2, 10);
export const NP_UPCOMING = NP_MOVIES.slice(4, 12);
export const NP_TRENDING = NP_MOVIES.slice(0, 10);
