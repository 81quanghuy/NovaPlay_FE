import type { Movie, Genre, Country } from '../types';
export type { Movie, Genre, Country };
export { GENRES, COUNTRIES } from '../types';

const TMDB = 'https://image.tmdb.org/t/p';
const poster = (path: string) => `${TMDB}/w500${path}`;
const backdrop = (path: string) => `${TMDB}/original${path}`;

export const MOVIES: Movie[] = [
  {
    id: 'inception',
    title: 'Kẻ Trộm Giấc Mơ',
    originalTitle: 'Inception',
    description:
      'Một tên trộm thiên tài chuyên đánh cắp bí mật từ sâu trong tiềm thức con người nhận nhiệm vụ bất khả thi: gieo một ý tưởng vào tâm trí nạn nhân.',
    releaseYear: 2010,
    duration: 148,
    rating: 8.8,
    genres: ['Khoa Học Viễn Tưởng', 'Hành Động', 'Giật Gân'],
    poster: poster('/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg'),
    backdrop: backdrop('/s3TBrRGB1iav7gFOCNx3H31MoES.jpg'),
    youtubeKey: 'YoHD9XEInc0',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 142500,
    trending: true,
    topRated: true,
  },
  {
    id: 'dark-knight',
    title: 'Kỵ Sĩ Bóng Đêm',
    originalTitle: 'The Dark Knight',
    description:
      'Batman đối đầu với tên tội phạm điên loạn Joker — kẻ muốn nhấn chìm Gotham trong hỗn loạn và tuyệt vọng.',
    releaseYear: 2008,
    duration: 152,
    rating: 9.0,
    genres: ['Hành Động', 'Tội Phạm', 'Tâm Lý'],
    poster: poster('/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
    backdrop: backdrop('/hqkIcbrOHL86UncnHIsHVcVmzue.jpg'),
    youtubeKey: 'EXeTwQWrcwY',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Thuyết Minh',
    type: 'movie',
    viewCount: 298000,
    trending: true,
    topRated: true,
  },
  {
    id: 'interstellar',
    title: 'Hố Đen Tử Thần',
    originalTitle: 'Interstellar',
    description:
      'Một nhóm phi hành gia bước qua hố gián đoạn không-thời gian để tìm hành tinh mới cho nhân loại đang tuyệt vọng.',
    releaseYear: 2014,
    duration: 169,
    rating: 8.6,
    genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Tâm Lý'],
    poster: poster('/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'),
    backdrop: backdrop('/pbrkL804c8yAv3zBZR4QPEafpAR.jpg'),
    youtubeKey: 'zSWdZVtXT7E',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 215000,
    trending: true,
    topRated: true,
  },
  {
    id: 'parasite',
    title: 'Ký Sinh Trùng',
    originalTitle: 'Gisaengchung',
    description:
      'Cả gia đình nghèo tìm cách thâm nhập vào cuộc sống của một gia đình siêu giàu bằng những trò lừa đảo tinh vi.',
    releaseYear: 2019,
    duration: 132,
    rating: 8.5,
    genres: ['Tâm Lý', 'Hài', 'Giật Gân'],
    poster: poster('/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
    backdrop: backdrop('/hiKmpZMGZsrkA3cdFi06PsmTG08.jpg'),
    youtubeKey: '5xH0hhJku5Y',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    country: 'Hàn Quốc',
    quality: 'FHD',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 189000,
    topRated: true,
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    description:
      'Câu chuyện về nhà vật lý J. Robert Oppenheimer và vai trò then chốt của ông trong dự án Manhattan phát triển bom nguyên tử.',
    releaseYear: 2023,
    duration: 180,
    rating: 8.9,
    genres: ['Tâm Lý', 'Chiến Tranh'],
    poster: poster('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
    backdrop: backdrop('/fm6Bg9Azv739G9otgXMIRFq1YmB.jpg'),
    youtubeKey: 'uYPbbksJxIg',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 310000,
    trending: true,
    newRelease: true,
    topRated: true,
  },
  {
    id: 'dune-2',
    title: 'Dune: Hành Tinh Cát — Phần 2',
    originalTitle: 'Dune: Part Two',
    description:
      'Paul Atreides hợp lực cùng Chani và tộc Fremen để trả thù những kẻ đã tàn phá gia đình mình.',
    releaseYear: 2024,
    duration: 166,
    rating: 8.7,
    genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Hành Động'],
    poster: poster('/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg'),
    backdrop: backdrop('/xOMo8BRK7PfcJv9JCnx7s520Wio.jpg'),
    youtubeKey: 'Way9Dexny3w',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Austin Butler'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 420000,
    trending: true,
    newRelease: true,
    topRated: true,
  },
  {
    id: 'spider-verse-2',
    title: 'Người Nhện: Du Hành Vũ Trụ Nhện',
    originalTitle: 'Spider-Man: Across the Spider-Verse',
    description:
      'Miles Morales xuyên qua đa vũ trụ, đối đầu với một biệt đội Người Nhện mang trách nhiệm bảo vệ thực tại.',
    releaseYear: 2023,
    duration: 140,
    rating: 8.7,
    genres: ['Hoạt Hình', 'Hành Động', 'Khoa Học Viễn Tưởng'],
    poster: poster('/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'),
    backdrop: backdrop('/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg'),
    youtubeKey: 'cqGjhVJWtEg',
    director: 'Joaquim Dos Santos, Kemp Powers',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Thuyết Minh',
    type: 'movie',
    viewCount: 265000,
    trending: true,
    topRated: true,
  },
  {
    id: 'squid-game',
    title: 'Trò Chơi Con Mực — Mùa 2',
    originalTitle: 'Squid Game Season 2',
    description:
      '456 người chơi tuyệt vọng chấp nhận lời mời kỳ lạ để tham gia vào loạt trò chơi sinh tồn bí ẩn với phần thưởng 45,6 tỷ won.',
    releaseYear: 2024,
    duration: 55,
    rating: 8.6,
    genres: ['Giật Gân', 'Tâm Lý', 'Hành Động'],
    poster: poster('/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg'),
    backdrop: backdrop('/2meX1nMdScFOoV4370rqHWxL0a6.jpg'),
    youtubeKey: 'lQBmZBJTN4g',
    director: 'Hwang Dong-hyuk',
    cast: ['Lee Jung-jae', 'Park Hae-soo', 'Wi Ha-joon'],
    country: 'Hàn Quốc',
    quality: '4K',
    subtitleType: 'Vietsub',
    type: 'series',
    episodes: { total: 9, seasons: 2, current: 9 },
    viewCount: 680000,
    trending: true,
    newRelease: true,
  },
  {
    id: 'stranger-things',
    title: 'Cậu Bé Mất Tích — Mùa 4',
    originalTitle: 'Stranger Things',
    description:
      'Một nhóm bạn trẻ khám phá ra thế giới đảo ngược đầy quái vật và bí mật chính phủ đen tối tại thị trấn Hawkins.',
    releaseYear: 2022,
    duration: 65,
    rating: 8.7,
    genres: ['Khoa Học Viễn Tưởng', 'Kinh Dị', 'Tâm Lý'],
    poster: poster('/49WJfeN0moxb9IPfGn8AIqMGskD.jpg'),
    backdrop: backdrop('/56v2KjBlU4XaOv9rVYEQypROD7P.jpg'),
    youtubeKey: 'b9EkMc79ZSU',
    director: 'The Duffer Brothers',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Thuyết Minh',
    type: 'series',
    episodes: { total: 34, seasons: 4, current: 34 },
    viewCount: 520000,
    trending: true,
    topRated: true,
  },
  {
    id: 'avengers-endgame',
    title: 'Avengers: Hồi Kết',
    originalTitle: 'Avengers: Endgame',
    description:
      'Sau khi Thanos quét sạch một nửa sự sống vũ trụ, nhóm Avengers còn lại phải hợp lực thực hiện chuyến du hành thời gian.',
    releaseYear: 2019,
    duration: 181,
    rating: 8.4,
    genres: ['Hành Động', 'Khoa Học Viễn Tưởng', 'Phiêu Lưu'],
    poster: poster('/or06FN3Dka5tukK1e9sl16pB3iy.jpg'),
    backdrop: backdrop('/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg'),
    youtubeKey: 'TcMBFSGVi1c',
    director: 'Anthony Russo, Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Mark Ruffalo', 'Chris Hemsworth'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Thuyết Minh',
    type: 'movie',
    viewCount: 490000,
    topRated: true,
  },
  {
    id: 'your-name',
    title: 'Tên Cậu Là Gì? — Your Name',
    originalTitle: 'Kimi no Na wa.',
    description:
      'Hai người trẻ xa lạ bỗng hoán đổi thân xác cho nhau trong giấc mơ và bắt đầu tìm kiếm nhau vượt thời gian và khoảng cách.',
    releaseYear: 2016,
    duration: 106,
    rating: 8.4,
    genres: ['Hoạt Hình', 'Lãng Mạn', 'Tâm Lý'],
    poster: poster('/q719jXXEzOoYaps6qFsPwaMis1E.jpg'),
    backdrop: backdrop('/dIWwZWnnTo2LDInsight9nGBV7g.jpg'),
    youtubeKey: 's0wTdCQoc2k',
    director: 'Makoto Shinkai',
    cast: ['Ryunosuke Kamiki', 'Mone Kamishiraishi'],
    country: 'Nhật Bản',
    quality: 'FHD',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 175000,
    topRated: true,
  },
  {
    id: 'exhuma',
    title: 'Quật Mộ Trùng Tang',
    originalTitle: 'Exhuma',
    description:
      'Một pháp sư, một thầy phong thủy và một chuyên gia mai táng khai quật một ngôi mộ bí ẩn với cái giá kinh hoàng.',
    releaseYear: 2024,
    duration: 134,
    rating: 7.9,
    genres: ['Kinh Dị', 'Bí Ẩn', 'Giật Gân'],
    poster: poster('/gPbw0r3vHl1VfDk0T69g4fQ7t8b.jpg'),
    backdrop: backdrop('/7BP5Uu51s10LqgP2G11L8l9X5qM.jpg'),
    youtubeKey: 'eLq_B_8L67E',
    director: 'Jang Jae-hyun',
    cast: ['Choi Min-sik', 'Kim Go-eun', 'Yoo Hae-jin', 'Lee Do-hyun'],
    country: 'Hàn Quốc',
    quality: 'FHD',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 230000,
    newRelease: true,
  },
  {
    id: 'mai',
    title: 'Mai',
    originalTitle: 'Mai',
    description:
      'Mai — một người phụ nữ làm nghề massage trị liệu với quá khứ nhiều tổn thương, bắt đầu mở lòng với chàng trai trẻ hàng xóm.',
    releaseYear: 2024,
    duration: 131,
    rating: 7.8,
    genres: ['Tâm Lý', 'Lãng Mạn', 'Hài'],
    poster: poster('/kY0zY809fN2hW70659N4D3P4f1.jpg'),
    backdrop: backdrop('/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg'),
    youtubeKey: '8l4kZ7v9k8c',
    director: 'Trấn Thành',
    cast: ['Phương Anh Đào', 'Tuấn Trần', 'Hồng Đào'],
    country: 'Việt Nam',
    quality: 'FHD',
    subtitleType: 'Vietsub',
    type: 'movie',
    viewCount: 510000,
    newRelease: true,
    trending: true,
  },
  {
    id: 'coco',
    title: 'Hội Ngộ Diệu Kỳ — Coco',
    originalTitle: 'Coco',
    description:
      'Bé Miguel yêu âm nhạc bước chân vào Thế giới Người Quá Cố để tìm lại cội nguồn gia đình và bài hát bị lãng quên.',
    releaseYear: 2017,
    duration: 105,
    rating: 8.4,
    genres: ['Hoạt Hình', 'Phiêu Lưu', 'Âm Nhạc'],
    poster: poster('/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg'),
    backdrop: backdrop('/askg3SMvhqEl4OL52YuvdtY40Yb.jpg'),
    youtubeKey: 'Rvr68u6k5sI',
    director: 'Lee Unkrich, Adrian Molina',
    cast: ['Anthony Gonzalez', 'Gael García Bernal', 'Benjamin Bratt'],
    country: 'Âu Mỹ',
    quality: '4K',
    subtitleType: 'Thuyết Minh',
    type: 'movie',
    viewCount: 160000,
  },
];

export function getMovie(id: string): Movie | undefined {
  return MOVIES.find((m) => m.id === id);
}

export function getTrending(): Movie[] {
  return MOVIES.filter((m) => m.trending);
}

export function getTopRated(): Movie[] {
  return [...MOVIES.filter((m) => m.topRated)].sort((a, b) => b.rating - a.rating);
}

export function getNewReleases(): Movie[] {
  return MOVIES.filter((m) => m.newRelease);
}

export function getSeries(): Movie[] {
  return MOVIES.filter((m) => m.type === 'series');
}

export function getByGenre(genre: string): Movie[] {
  return MOVIES.filter((m) => m.genres.includes(genre));
}

export function searchMovies(query: string): Movie[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return MOVIES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      (m.originalTitle?.toLowerCase().includes(q) ?? false) ||
      m.genres.some((g) => g.toLowerCase().includes(q)) ||
      (m.country?.toLowerCase().includes(q) ?? false) ||
      (m.director?.toLowerCase().includes(q) ?? false),
  );
}
