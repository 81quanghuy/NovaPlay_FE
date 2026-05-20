export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  releaseYear: number;
  duration: number;
  rating: number;
  genres: string[];
  poster: string;
  backdrop: string;
  youtubeKey: string;
  director?: string;
  cast?: string[];
  trending?: boolean;
  topRated?: boolean;
  newRelease?: boolean;
}

export const GENRES = [
  'Hành Động',
  'Phiêu Lưu',
  'Hài',
  'Tâm Lý',
  'Khoa Học Viễn Tưởng',
  'Kinh Dị',
  'Lãng Mạn',
  'Hoạt Hình',
  'Tội Phạm',
  'Giật Gân',
  'Chiến Tranh',
  'Âm Nhạc',
] as const;

export type Genre = (typeof GENRES)[number];

const TMDB = 'https://image.tmdb.org/t/p';
const poster = (path: string) => `${TMDB}/w500${path}`;
const backdrop = (path: string) => `${TMDB}/original${path}`;

export const MOVIES: Movie[] = [
  {
    id: 'inception',
    title: 'Inception',
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
    trending: true,
    topRated: true,
  },
  {
    id: 'dark-knight',
    title: 'Kỵ Si Bóng Đêm',
    originalTitle: 'The Dark Knight',
    description:
      'Batman đối đầu với tên tội phạm điên loạn Joker — kẻ muốn nhấn chìm Gotham trong hỗn loạn và thiểu tún.',
    releaseYear: 2008,
    duration: 152,
    rating: 9.0,
    genres: ['Hành Động', 'Tội Phạm', 'Tâm Lý'],
    poster: poster('/qJ2tW6WMUDux911r6m7haRef0WH.jpg'),
    backdrop: backdrop('/hqkIcbrOHL86UncnHIsHVcVmzue.jpg'),
    youtubeKey: 'EXeTwQWrcwY',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
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
    trending: true,
    topRated: true,
  },
  {
    id: 'avatar',
    title: 'Avatar',
    description:
      'Một lính thủy đánh bộ tàn tật nhập vào cơ thể ngoài hành tinh để khám phá Pandora, rồi bị cuốn vào cuộc chiến bảo vệ vùng đất huyền bí này.',
    releaseYear: 2009,
    duration: 162,
    rating: 7.9,
    genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu', 'Hành Động'],
    poster: poster('/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg'),
    backdrop: backdrop('/Yc9q6QuWrMp9nu5IqLEv4d8XlAZ.jpg'),
    youtubeKey: '5PSNL1qE6VY',
    director: 'James Cameron',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
    trending: true,
  },
  {
    id: 'matrix',
    title: 'Ma Trận',
    originalTitle: 'The Matrix',
    description:
      'Một hacker phát hiện thế giới anh đang sống chỉ là mô phỏng — và cuộc khởi nghĩa chống lại những cỗ máy đại diện cho tự do của nhân loại.',
    releaseYear: 1999,
    duration: 136,
    rating: 8.7,
    genres: ['Khoa Học Viễn Tưởng', 'Hành Động'],
    poster: poster('/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg'),
    backdrop: backdrop('/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg'),
    youtubeKey: 'vKQi3bBA1y8',
    director: 'Lana & Lilly Wachowski',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'],
    topRated: true,
  },
  {
    id: 'spider-verse',
    title: 'Người Nhện: Vũ Trụ Mới',
    originalTitle: 'Spider-Man: Into the Spider-Verse',
    description:
      'Miền Morales cộng tác với những phiên bản Spider-Man từ đa vũ trụ để ngăn chặn một hiểm họa không tưởng.',
    releaseYear: 2018,
    duration: 117,
    rating: 8.4,
    genres: ['Hoạt Hình', 'Hành Động', 'Phiêu Lưu'],
    poster: poster('/iiZZdoQBEYBv6id8su7ImL0oCbD.jpg'),
    backdrop: backdrop('/7d6EY00g1c39SGZOoCJ5Py9nNth.jpg'),
    youtubeKey: 'g4Hbz2jLxvQ',
    director: 'Bob Persichetti, Peter Ramsey, Rodney Rothman',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Jake Johnson'],
    topRated: true,
  },
  {
    id: 'shawshank',
    title: 'Nhà Tù Shawshank',
    originalTitle: 'The Shawshank Redemption',
    description:
      'Hai tù nhân gắn bó với nhau qua nhiều năm, tìm thấy nguồn an ủi và niềm hy vọng cuối cùng bằng những hành động vị tha bình dị.',
    releaseYear: 1994,
    duration: 142,
    rating: 9.3,
    genres: ['Tâm Lý', 'Tội Phạm'],
    poster: poster('/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg'),
    backdrop: backdrop('/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg'),
    youtubeKey: '6hB3S9bIaco',
    director: 'Frank Darabont',
    cast: ['Tim Robbins', 'Morgan Freeman'],
    topRated: true,
  },
  {
    id: 'pulp-fiction',
    title: 'Chuyện Tình Pulp',
    originalTitle: 'Pulp Fiction',
    description:
      'Những cuộc đời của hai tên sát thủ, một võ sĩ quyền Anh và một cặp đôi cướp giật đan xén trong bốn câu chuyện về bạo lực và cứu rỗi.',
    releaseYear: 1994,
    duration: 154,
    rating: 8.9,
    genres: ['Tội Phạm', 'Tâm Lý'],
    poster: poster('/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg'),
    backdrop: backdrop('/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg'),
    youtubeKey: 's7EdQ4FqbhY',
    director: 'Quentin Tarantino',
    cast: ['John Travolta', 'Uma Thurman', 'Samuel L. Jackson'],
    topRated: true,
  },
  {
    id: 'godfather',
    title: 'Bố Già',
    originalTitle: 'The Godfather',
    description:
      'Thủ lĩnh già của một đại gia đình tội phạm New York chuyển giao đế chế bí mật của mình cho cậu con trai ít muốn dính dáng nhất.',
    releaseYear: 1972,
    duration: 175,
    rating: 9.2,
    genres: ['Tội Phạm', 'Tâm Lý'],
    poster: poster('/3bhkrj58Vtu7enYsRolD1fZdja1.jpg'),
    backdrop: backdrop('/tmU7GeKVybMWFButWEGl2M4GeiP.jpg'),
    youtubeKey: 'sY1S34973zA',
    director: 'Francis Ford Coppola',
    cast: ['Marlon Brando', 'Al Pacino', 'James Caan'],
    topRated: true,
  },
  {
    id: 'joker',
    title: 'Joker',
    description:
      'Arthur Fleck — một diễn viên hài thất bại — dần bị cống rãnh Gotham và cơn giadict của xã hội đẩy vào tay mạng và điên loạn.',
    releaseYear: 2019,
    duration: 122,
    rating: 8.4,
    genres: ['Tội Phạm', 'Tâm Lý', 'Giật Gân'],
    poster: poster('/6CoRTJTmijhBLJTUNoVSUNxZMEI.jpg'),
    backdrop: backdrop('/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg'),
    youtubeKey: 'zAGVQLHvwOY',
    director: 'Todd Phillips',
    cast: ['Joaquin Phoenix', 'Robert De Niro'],
    trending: true,
  },
  {
    id: 'endgame',
    title: 'Avengers: Hồi Kết',
    originalTitle: 'Avengers: Endgame',
    description:
      'Sau cú búng tay của Thanos, các siêu anh hùng còn lại dồn mọi nỗ lực để đảo ngược hậu quả và cứu vũ trụ.',
    releaseYear: 2019,
    duration: 181,
    rating: 8.3,
    genres: ['Hành Động', 'Phiêu Lưu', 'Khoa Học Viễn Tưởng'],
    poster: poster('/or06FN3Dka5tukK1e9sl16pB3iy.jpg'),
    backdrop: backdrop('/orjiB3oUIsyz60hoEqkiGpy5CeO.jpg'),
    youtubeKey: 'TcMBFSGVi1c',
    director: 'Anthony & Joe Russo',
    cast: ['Robert Downey Jr.', 'Chris Evans', 'Scarlett Johansson'],
    trending: true,
  },
  {
    id: 'parasite',
    title: 'Ký Sinh Trùng',
    originalTitle: 'Parasite',
    description:
      'Gia đình Kim nghèo nàn dần chân viên vào cuộc sống của một gia đình giàu có — cho đến khi bí mật lộ ra và mọi thứ vỡ ồ bạo lực.',
    releaseYear: 2019,
    duration: 132,
    rating: 8.5,
    genres: ['Giật Gân', 'Tâm Lý', 'Hài'],
    poster: poster('/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg'),
    backdrop: backdrop('/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg'),
    youtubeKey: '5xH0HfJHsaY',
    director: 'Bong Joon-ho',
    cast: ['Song Kang-ho', 'Lee Sun-kyun', 'Cho Yeo-jeong'],
    topRated: true,
  },
  {
    id: 'dune',
    title: 'Dune: Hành Tinh Cát',
    originalTitle: 'Dune',
    description:
      'Paul Atreides — người thừa kế một gia tộc quý tộc — bước vào cuộc chiến giành kiểm soát hành tinh sa mạc Arrakis.',
    releaseYear: 2021,
    duration: 155,
    rating: 8.0,
    genres: ['Khoa Học Viễn Tưởng', 'Phiêu Lưu'],
    poster: poster('/d5NXSklXo0qyIYkgV94XAgMIckC.jpg'),
    backdrop: backdrop('/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg'),
    youtubeKey: 'n9xhJrPXop4',
    director: 'Denis Villeneuve',
    cast: ['Timothée Chalamet', 'Rebecca Ferguson', 'Zendaya'],
    newRelease: true,
  },
  {
    id: 'top-gun-maverick',
    title: 'Phi Công Siêu Đẳng Maverick',
    originalTitle: 'Top Gun: Maverick',
    description:
      'Sau hơn ba thập kỷ phục vụ, Maverick trở về huấn luyện thế hệ phi công trẻ cho một nhiệm vụ mà chưa ai từng sống sót.',
    releaseYear: 2022,
    duration: 130,
    rating: 8.3,
    genres: ['Hành Động', 'Tâm Lý'],
    poster: poster('/62HCnUTziyWcpDaBO2i1DX17ljH.jpg'),
    backdrop: backdrop('/odJ4hx6g6vBt4lBWKFD1tI8WS4x.jpg'),
    youtubeKey: 'giXco2jaZ_4',
    director: 'Joseph Kosinski',
    cast: ['Tom Cruise', 'Miles Teller', 'Jennifer Connelly'],
    newRelease: true,
    trending: true,
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    description:
      'Chân dung J. Robert Oppenheimer — cha đẻ của bom nguyên tử — và cuộc đấu tranh đạo đức xung quanh phát minh đã đổi luật chơi thế giới.',
    releaseYear: 2023,
    duration: 180,
    rating: 8.4,
    genres: ['Tâm Lý', 'Chiến Tranh'],
    poster: poster('/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'),
    backdrop: backdrop('/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg'),
    youtubeKey: 'bK6ldnjE3Y0',
    director: 'Christopher Nolan',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'],
    newRelease: true,
  },
  {
    id: 'forrest-gump',
    title: 'Forrest Gump',
    description:
      'Cuộc đời phi thường của Forrest Gump — một người đàn ông đơn thuần nhưng vô tình chứng kiến những khoảnh khắc lịch sử Mỹ.',
    releaseYear: 1994,
    duration: 142,
    rating: 8.8,
    genres: ['Tâm Lý', 'Lãng Mạn'],
    poster: poster('/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg'),
    backdrop: backdrop('/yE5d3BUhE8hCnkMUJOo1QDoOGNz.jpg'),
    youtubeKey: 'bLvqoHBptjg',
    director: 'Robert Zemeckis',
    cast: ['Tom Hanks', 'Robin Wright', 'Gary Sinise'],
    topRated: true,
  },
  {
    id: 'gladiator',
    title: 'Võ Sĩ Giác Đấu',
    originalTitle: 'Gladiator',
    description:
      'Một tướng La Mã bị phản bội, mất vợ con, bị đẩy vào đấu trường — và anh trở lại để báo thù.',
    releaseYear: 2000,
    duration: 155,
    rating: 8.5,
    genres: ['Hành Động', 'Phiêu Lưu', 'Tâm Lý'],
    poster: poster('/ehGpN04mLJIrSnxcZBMvHeG0eDc.jpg'),
    backdrop: backdrop('/3RXOhqkLNa9aw6JL4FXNUmmZQRn.jpg'),
    youtubeKey: 'owK1qxDselE',
    director: 'Ridley Scott',
    cast: ['Russell Crowe', 'Joaquin Phoenix', 'Connie Nielsen'],
  },
  {
    id: 'lotr-fellowship',
    title: 'Chúa Nhẫn: Hội Nhẫn',
    originalTitle: 'The Lord of the Rings: The Fellowship of the Ring',
    description:
      'Hobbit Frodo Baggins khởi đầu hành trình để tiêu huỷ Chiếc Nhẫn Quyền Lực và cứu Trung Thổ khỏi Chúa Tể Hắc Ám Sauron.',
    releaseYear: 2001,
    duration: 178,
    rating: 8.9,
    genres: ['Phiêu Lưu', 'Hành Động'],
    poster: poster('/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg'),
    backdrop: backdrop('/vRQnzOn4HjIMX4LBq9nHhFXbsSu.jpg'),
    youtubeKey: 'V75dMMIW2B4',
    director: 'Peter Jackson',
    cast: ['Elijah Wood', 'Ian McKellen', 'Viggo Mortensen'],
    topRated: true,
  },
  {
    id: 'titanic',
    title: 'Titanic',
    description:
      'Hai con người trẻ từ hai tầng lớp đối lập phải lòng nhau trên chuyến tàu khách nổi tiếng nhất lịch sử.',
    releaseYear: 1997,
    duration: 195,
    rating: 7.9,
    genres: ['Lãng Mạn', 'Tâm Lý'],
    poster: poster('/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg'),
    backdrop: backdrop('/yDI6D5ZQh67YU4r2ms8qcSbAviZ.jpg'),
    youtubeKey: 'kVrqfYjkTdQ',
    director: 'James Cameron',
    cast: ['Leonardo DiCaprio', 'Kate Winslet'],
  },
  {
    id: 'lion-king',
    title: 'Vua Sư Tử',
    originalTitle: 'The Lion King',
    description:
      'Chú sư tử Simba chạy trốn khỏi quê hương sau khi cha bị giết — nhưng số mệnh ngôi vị vẫn chờ cậu trở về.',
    releaseYear: 1994,
    duration: 88,
    rating: 8.5,
    genres: ['Hoạt Hình', 'Phiêu Lưu', 'Âm Nhạc'],
    poster: poster('/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg'),
    backdrop: backdrop('/wXsQvli6tWqja51pYxXNG1LFIGV.jpg'),
    youtubeKey: '4sj1MT05lAA',
    director: 'Roger Allers, Rob Minkoff',
    cast: ['Matthew Broderick', 'James Earl Jones', 'Jeremy Irons'],
  },
  {
    id: 'la-la-land',
    title: 'Lúc Mình Yêu Em',
    originalTitle: 'La La Land',
    description:
      'Một nhạc công jazz và một diễn viên phải lòng nhau giữa Los Angeles sáng lấp lánh — và đứng trước những ngã rẽ của ước mơ.',
    releaseYear: 2016,
    duration: 128,
    rating: 8.0,
    genres: ['Âm Nhạc', 'Lãng Mạn', 'Tâm Lý'],
    poster: poster('/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg'),
    backdrop: backdrop('/fp6X6yhgcxzxCpmM0EVC6V9B5qa.jpg'),
    youtubeKey: '0pdqf4P9MB8',
    director: 'Damien Chazelle',
    cast: ['Ryan Gosling', 'Emma Stone'],
  },
  {
    id: 'whiplash',
    title: 'Whiplash',
    description:
      'Một tay trống trẻ tài năng bị đẩy đến tận cùng bởi vị giảng viên nhạc jazz tàn nhẫn nhưng thiên tài.',
    releaseYear: 2014,
    duration: 106,
    rating: 8.5,
    genres: ['Tâm Lý', 'Âm Nhạc'],
    poster: poster('/oXM26GTKcvKxqxV1uvfVQyDvk5y.jpg'),
    backdrop: backdrop('/6bbZ6XyvgfjhQwbplnUh1LSj1ky.jpg'),
    youtubeKey: '7d_jQycdQGo',
    director: 'Damien Chazelle',
    cast: ['Miles Teller', 'J.K. Simmons'],
    topRated: true,
  },
  {
    id: 'inglourious-basterds',
    title: 'Inglourious Basterds',
    description:
      'Trong Thế chiến II, một đội biệt kích Do Thái được giao sứ mệnh gieo rắc kinh hoàng vào Thứ Ba Reich.',
    releaseYear: 2009,
    duration: 153,
    rating: 8.4,
    genres: ['Chiến Tranh', 'Tội Phạm', 'Tâm Lý'],
    poster: poster('/7sfbEnaARXDDhKm0CZ7D7uc2sbo.jpg'),
    backdrop: backdrop('/dsLLk0YyCfHbg9TGJVnpd2BIHX3.jpg'),
    youtubeKey: 'KnrRy6kSFF0',
    director: 'Quentin Tarantino',
    cast: ['Brad Pitt', 'Christoph Waltz', 'Mélanie Laurent'],
  },
  {
    id: 'coco',
    title: 'Hội Du Hành — Coco',
    originalTitle: 'Coco',
    description:
      'Bé Miguel yêu âm nhạc bước chân vào Thế giới Của Người Đã Khuất để tìm gia phả bị lãng quên của mình.',
    releaseYear: 2017,
    duration: 105,
    rating: 8.4,
    genres: ['Hoạt Hình', 'Phiêu Lưu', 'Âm Nhạc'],
    poster: poster('/gGEsBPAijhVUFoiNpgZXqRVWJt2.jpg'),
    backdrop: backdrop('/askg3SMvhqEl4OL52YuvdtY40Yb.jpg'),
    youtubeKey: 'Rvr68u6k5sI',
    director: 'Lee Unkrich, Adrian Molina',
    cast: ['Anthony Gonzalez', 'Gael García Bernal', 'Benjamin Bratt'],
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
      (m.director?.toLowerCase().includes(q) ?? false),
  );
}
