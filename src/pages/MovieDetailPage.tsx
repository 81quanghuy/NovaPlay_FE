import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { mockMovies } from '../data/mockMovies';
import { Play, Heart, Send, ChevronUp, Plus, Share, MessageCircle, Star, Clock, MapPin, Users, Award, Info, Image, User, Sparkles, Copy, Check } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Toast from '@/components/Toast';

// Mock data cho user watch history
const mockUserWatchHistory = {
  // User ID -> Movie ID -> Watch progress (0-100)
  'ngoquanghuy0510': {
    1: { progress: 85, hasWatched: true }, // Watched 85% of movie 1
    2: { progress: 45, hasWatched: false }, // Watched 45% of movie 2
    3: { progress: 100, hasWatched: true }, // Watched 100% of movie 3
  },
  'movie_lover': {
    1: { progress: 100, hasWatched: true },
    2: { progress: 100, hasWatched: true },
    3: { progress: 60, hasWatched: false },
  },
  'cinema_fan': {
    1: { progress: 0, hasWatched: false },
    2: { progress: 100, hasWatched: true },
    3: { progress: 100, hasWatched: true },
  }
};

// Mock data cho comments và reviews
const mockComments = [
  {
    id: 1,
    user: { name: 'user123', avatar: 'U', avatarColor: 'from-green-400 to-blue-500' },
    content: 'Phim này thực sự rất hay! Hiệu ứng hình ảnh và âm thanh đều xuất sắc. Cốt truyện có nhiều điểm bất ngờ thú vị.',
    timestamp: '2 giờ trước',
    likes: 12,
    dislikes: 2
  },
  {
    id: 2,
    user: { name: 'movie_lover', avatar: 'M', avatarColor: 'from-pink-400 to-red-500' },
    content: 'Diễn viên chính diễn xuất rất tốt, đặc biệt là những cảnh kinh dị. Âm nhạc trong phim cũng rất phù hợp.',
    timestamp: '5 giờ trước',
    likes: 8,
    dislikes: 1
  },
  {
    id: 3,
    user: { name: 'cinema_fan', avatar: 'C', avatarColor: 'from-purple-400 to-indigo-500' },
    content: 'Phim có cốt truyện hấp dẫn và diễn xuất xuất sắc. Hiệu ứng đặc biệt rất ấn tượng. Đáng xem!',
    timestamp: '1 ngày trước',
    likes: 15,
    dislikes: 0
  },
  {
    id: 4,
    user: { name: 'film_critic', avatar: 'F', avatarColor: 'from-yellow-400 to-orange-500' },
    content: 'Một tác phẩm điện ảnh xuất sắc với kỹ thuật quay phim hiện đại. Âm nhạc và âm thanh tạo không khí rất tốt.',
    timestamp: '2 ngày trước',
    likes: 23,
    dislikes: 3
  },
  {
    id: 5,
    user: { name: 'movie_buff', avatar: 'B', avatarColor: 'from-cyan-400 to-blue-500' },
    content: 'Phim này vượt quá mong đợi của tôi. Cốt truyện phức tạp nhưng dễ hiểu, nhân vật có chiều sâu.',
    timestamp: '3 ngày trước',
    likes: 18,
    dislikes: 1
  },
  {
    id: 6,
    user: { name: 'cinema_enthusiast', avatar: 'E', avatarColor: 'from-emerald-400 to-green-500' },
    content: 'Hiệu ứng hình ảnh đẹp mắt, diễn xuất tự nhiên. Phim xứng đáng được xem nhiều lần.',
    timestamp: '4 ngày trước',
    likes: 11,
    dislikes: 2
  },
  {
    id: 7,
    user: { name: 'film_lover_2024', avatar: 'L', avatarColor: 'from-rose-400 to-pink-500' },
    content: 'Một trong những phim hay nhất năm nay. Kịch bản thông minh và đạo diễn xuất sắc.',
    timestamp: '5 ngày trước',
    likes: 27,
    dislikes: 1
  },
  {
    id: 8,
    user: { name: 'movie_reviewer', avatar: 'R', avatarColor: 'from-violet-400 to-purple-500' },
    content: 'Phim có nhịp độ tốt, không có cảnh nào thừa. Âm nhạc phù hợp với từng tình huống.',
    timestamp: '1 tuần trước',
    likes: 14,
    dislikes: 0
  },
  {
    id: 9,
    user: { name: 'cinema_expert', avatar: 'X', avatarColor: 'from-amber-400 to-yellow-500' },
    content: 'Tác phẩm điện ảnh đỉnh cao với kỹ thuật hiện đại. Diễn viên thể hiện xuất sắc vai diễn.',
    timestamp: '1 tuần trước',
    likes: 19,
    dislikes: 2
  },
  {
    id: 10,
    user: { name: 'film_analyst', avatar: 'A', avatarColor: 'from-teal-400 to-cyan-500' },
    content: 'Phim có chiều sâu về mặt nội dung và kỹ thuật. Đáng để xem và suy ngẫm.',
    timestamp: '1 tuần trước',
    likes: 16,
    dislikes: 1
  },
  {
    id: 11,
    user: { name: 'movie_goer', avatar: 'G', avatarColor: 'from-slate-400 to-gray-500' },
    content: 'Phim hay, đáng xem. Hiệu ứng đặc biệt ấn tượng và cốt truyện hấp dẫn.',
    timestamp: '2 tuần trước',
    likes: 9,
    dislikes: 0
  },
  {
    id: 12,
    user: { name: 'cinema_fanatic', avatar: 'F', avatarColor: 'from-orange-400 to-red-500' },
    content: 'Một tác phẩm xuất sắc với nhiều tầng ý nghĩa. Phim xứng đáng được đề cử giải thưởng.',
    timestamp: '2 tuần trước',
    likes: 22,
    dislikes: 1
  }
];

const mockReviews = [
  {
    id: 1,
    user: {
      name: 'user123',
      avatar: 'U',
      avatarColor: 'from-green-400 to-blue-500'
    },
    rating: 5,
    content: 'Phim này thực sự rất hay! Hiệu ứng hình ảnh và âm thanh đều xuất sắc. Cốt truyện có nhiều điểm bất ngờ thú vị. Diễn viên chính diễn xuất rất tốt.',
    timestamp: '2 giờ trước',
    likes: 12,
    dislikes: 2
  },
  {
    id: 2,
    user: {
      name: 'movie_lover',
      avatar: 'M',
      avatarColor: 'from-pink-400 to-red-500'
    },
    rating: 4,
    content: 'Diễn viên chính diễn xuất rất tốt, đặc biệt là những cảnh kinh dị. Âm nhạc trong phim cũng rất phù hợp với không khí. Tuy nhiên phần kết hơi vội.',
    timestamp: '5 giờ trước',
    likes: 8,
    dislikes: 1
  },
  {
    id: 3,
    user: {
      name: 'cinema_fan',
      avatar: 'C',
      avatarColor: 'from-purple-400 to-indigo-500'
    },
    rating: 5,
    content: 'Phim có cốt truyện hấp dẫn và diễn xuất xuất sắc. Hiệu ứng đặc biệt rất ấn tượng. Đáng xem!',
    timestamp: '1 ngày trước',
    likes: 15,
    dislikes: 0
  },
  {
    id: 4,
    user: {
      name: 'film_critic',
      avatar: 'F',
      avatarColor: 'from-yellow-400 to-orange-500'
    },
    rating: 5,
    content: 'Một tác phẩm điện ảnh xuất sắc với kỹ thuật quay phim hiện đại. Âm nhạc và âm thanh tạo không khí rất tốt.',
    timestamp: '2 ngày trước',
    likes: 23,
    dislikes: 3
  },
  {
    id: 5,
    user: {
      name: 'movie_buff',
      avatar: 'B',
      avatarColor: 'from-cyan-400 to-blue-500'
    },
    rating: 4,
    content: 'Phim này vượt quá mong đợi của tôi. Cốt truyện phức tạp nhưng dễ hiểu, nhân vật có chiều sâu.',
    timestamp: '3 ngày trước',
    likes: 18,
    dislikes: 1
  },
  {
    id: 6,
    user: {
      name: 'cinema_enthusiast',
      avatar: 'E',
      avatarColor: 'from-emerald-400 to-green-500'
    },
    rating: 4,
    content: 'Hiệu ứng hình ảnh đẹp mắt, diễn xuất tự nhiên. Phim xứng đáng được xem nhiều lần.',
    timestamp: '4 ngày trước',
    likes: 11,
    dislikes: 2
  },
  {
    id: 7,
    user: {
      name: 'ngoquanghuy0510',
      avatar: 'L',
      avatarColor: 'from-rose-400 to-pink-500'
    },
    rating: 5,
    content: 'Một trong những phim hay nhất năm nay. Kịch bản thông minh và đạo diễn xuất sắc.',
    timestamp: '5 ngày trước',
    likes: 27,
    dislikes: 1
  },
  {
    id: 8,
    user: {
      name: 'movie_reviewer',
      avatar: 'R',
      avatarColor: 'from-violet-400 to-purple-500'
    },
    rating: 4,
    content: 'Phim có nhịp độ tốt, không có cảnh nào thừa. Âm nhạc phù hợp với từng tình huống.',
    timestamp: '1 tuần trước',
    likes: 14,
    dislikes: 0
  },
  {
    id: 9,
    user: {
      name: 'cinema_expert',
      avatar: 'X',
      avatarColor: 'from-amber-400 to-yellow-500'
    },
    rating: 5,
    content: 'Tác phẩm điện ảnh đỉnh cao với kỹ thuật hiện đại. Diễn viên thể hiện xuất sắc vai diễn.',
    timestamp: '1 tuần trước',
    likes: 19,
    dislikes: 2
  },
  {
    id: 10,
    user: {
      name: 'film_analyst',
      avatar: 'A',
      avatarColor: 'from-teal-400 to-cyan-500'
    },
    rating: 4,
    content: 'Phim có chiều sâu về mặt nội dung và kỹ thuật. Đáng để xem và suy ngẫm.',
    timestamp: '1 tuần trước',
    likes: 16,
    dislikes: 1
  },
  {
    id: 11,
    user: {
      name: 'movie_goer',
      avatar: 'G',
      avatarColor: 'from-slate-400 to-gray-500'
    },
    rating: 4,
    content: 'Phim hay, đáng xem. Hiệu ứng đặc biệt ấn tượng và cốt truyện hấp dẫn.',
    timestamp: '2 tuần trước',
    likes: 9,
    dislikes: 0
  },
  {
    id: 12,
    user: {
      name: 'cinema_fanatic',
      avatar: 'F',
      avatarColor: 'from-orange-400 to-red-500'
    },
    rating: 5,
    content: 'Một tác phẩm xuất sắc với nhiều tầng ý nghĩa. Phim xứng đáng được đề cử giải thưởng.',
    timestamp: '2 tuần trước',
    likes: 22,
    dislikes: 1
  }
];

// Type definitions for mock data
interface GalleryItem {
  id: number;
  url: string;
  title: string;
}

interface Actor {
  id: number;
  name: string;
  role: string;
  image: string;
}

interface Suggestion {
  id: number;
  title: string;
  poster: string;
  rating: number;
}

// Mock data cho Gallery, Actors, và Suggestions theo ID phim
const mockGalleryData: { [key: number]: GalleryItem[] } = {
  1: [
    { id: 1, url: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg', title: 'Wonka Poster 1' },
    { id: 2, url: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', title: 'Wonka Scene 1' },
    { id: 3, url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', title: 'Wonka Scene 2' },
    { id: 4, url: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', title: 'Wonka Scene 3' },
    { id: 5, url: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', title: 'Wonka Scene 4' },
    { id: 6, url: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', title: 'Wonka Scene 5' },
    { id: 7, url: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', title: 'Wonka Scene 6' },
    { id: 8, url: 'https://image.tmdb.org/t/p/w500/ym1dxyOk4jFcSl4Q2zmRrA5BEEN.jpg', title: 'Wonka Scene 7' }
  ],
  2: [
    { id: 1, url: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg', title: 'Aquaman Poster 1' },
    { id: 2, url: 'https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg', title: 'Aquaman Scene 1' },
    { id: 3, url: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', title: 'Aquaman Scene 2' },
    { id: 4, url: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg', title: 'Aquaman Scene 3' },
    { id: 5, url: 'https://image.tmdb.org/t/p/w500/Ag3D9H6jEYk7JzEHkG9Q4m0nF2l.jpg', title: 'Aquaman Scene 4' },
    { id: 6, url: 'https://image.tmdb.org/t/p/w500/gh2bmprLtUQ8oXCSluzfqaicyrm.jpg', title: 'Aquaman Scene 5' }
  ],
  3: [
    { id: 1, url: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', title: 'Spider-Man Poster 1' },
    { id: 2, url: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', title: 'Spider-Man Scene 1' },
    { id: 3, url: 'https://image.tmdb.org/t/p/w500/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg', title: 'Spider-Man Scene 2' },
    { id: 4, url: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg', title: 'Spider-Man Scene 3' },
    { id: 5, url: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', title: 'Spider-Man Scene 4' }
  ]
};

const mockActorsData: { [key: number]: Actor[] } = {
  1: [
    { id: 1, name: 'Timothée Chalamet', role: 'Willy Wonka', image: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg' },
    { id: 2, name: 'Hugh Grant', role: 'Oompa-Loompa', image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
    { id: 3, name: 'Calah Lane', role: 'Noodle', image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' },
    { id: 4, name: 'Keegan-Michael Key', role: 'Chief of Police', image: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg' },
    { id: 5, name: 'Paterson Joseph', role: 'Arthur Slugworth', image: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg' },
    { id: 6, name: 'Matt Lucas', role: 'Prodnose', image: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg' }
  ],
  2: [
    { id: 1, name: 'Jason Momoa', role: 'Aquaman', image: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg' },
    { id: 2, name: 'Amber Heard', role: 'Mera', image: 'https://image.tmdb.org/t/p/w500/voHUmluYmKyleFkTu3lOXQG702u.jpg' },
    { id: 3, name: 'Patrick Wilson', role: 'Orm', image: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg' },
    { id: 4, name: 'Yahya Abdul-Mateen II', role: 'Black Manta', image: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg' },
    { id: 5, name: 'Nicole Kidman', role: 'Atlanna', image: 'https://image.tmdb.org/t/p/w500/Ag3D9H6jEYk7JzEHkG9Q4m0nF2l.jpg' }
  ],
  3: [
    { id: 1, name: 'Shameik Moore', role: 'Miles Morales', image: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg' },
    { id: 2, name: 'Hailee Steinfeld', role: 'Gwen Stacy', image: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg' },
    { id: 3, name: 'Jake Johnson', role: 'Peter B. Parker', image: 'https://image.tmdb.org/t/p/w500/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg' },
    { id: 4, name: 'Oscar Isaac', role: 'Miguel O\'Hara', image: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg' },
    { id: 5, name: 'Issa Rae', role: 'Jessica Drew', image: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg' }
  ]
};

const mockSuggestionsData: { [key: number]: Suggestion[] } = {
  1: [
    { id: 2, title: 'Aquaman và Vương Quốc Thất Lạc', poster: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg', rating: 6.9 },
    { id: 3, title: 'Người Nhện: Du Hành Vũ Trụ Nhện', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: 8.4 },
    { id: 6, title: 'Barbie', poster: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg', rating: 7.0 },
    { id: 11, title: 'Elemental', poster: 'https://image.tmdb.org/t/p/w500/4Y1WNkd88JXmGfhtWR7dmDAo1T2.jpg', rating: 7.1 },
    { id: 17, title: 'The Little Mermaid', poster: 'https://image.tmdb.org/t/p/w500/ym1dxyOk4jFcSl4Q2zmRrA5BEEN.jpg', rating: 7.2 },
    { id: 20, title: 'The Hunger Games: The Ballad of Songbirds & Snakes', poster: 'https://image.tmdb.org/t/p/w500/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg', rating: 7.4 }
  ],
  2: [
    { id: 1, title: 'Wonka', poster: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg', rating: 7.2 },
    { id: 3, title: 'Người Nhện: Du Hành Vũ Trụ Nhện', poster: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: 8.4 },
    { id: 7, title: 'Fast X', poster: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg', rating: 6.2 },
    { id: 9, title: 'John Wick 4', poster: 'https://image.tmdb.org/t/p/w500/gh2bmprLtUQ8oXCSluzfqaicyrm.jpg', rating: 8.0 },
    { id: 10, title: 'Mission: Impossible - Dead Reckoning', poster: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg', rating: 7.8 },
    { id: 16, title: 'Guardians of the Galaxy Vol. 3', poster: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg', rating: 8.1 }
  ],
  3: [
    { id: 1, title: 'Wonka', poster: 'https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg', rating: 7.2 },
    { id: 2, title: 'Aquaman và Vương Quốc Thất Lạc', poster: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg', rating: 6.9 },
    { id: 12, title: 'Spider-Man: No Way Home', poster: 'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg', rating: 8.3 },
    { id: 13, title: 'Avatar: The Way of Water', poster: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg', rating: 7.7 },
    { id: 14, title: 'The Flash', poster: 'https://image.tmdb.org/t/p/w500/rktDFPbfHfUbArZ6OOOKsXcv0Bm.jpg', rating: 6.8 },
    { id: 15, title: 'Transformers: Rise of the Beasts', poster: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', rating: 6.6 }
  ]
};

// Helper function để lấy mock data theo ID phim
function getMockData(movieId: number, dataType: 'gallery'): GalleryItem[];
function getMockData(movieId: number, dataType: 'actors'): Actor[];
function getMockData(movieId: number, dataType: 'suggestions'): Suggestion[];
function getMockData(movieId: number, dataType: 'gallery' | 'actors' | 'suggestions') {
  if (dataType === 'gallery') {
    return mockGalleryData[movieId] || mockGalleryData[1] || [];
  } else if (dataType === 'actors') {
    return mockActorsData[movieId] || mockActorsData[1] || [];
  } else if (dataType === 'suggestions') {
    return mockSuggestionsData[movieId] || mockSuggestionsData[1] || [];
  }
  return [];
}

const MovieDetailPage: React.FC = () => {

  const { user, login } = useAuth();
  const { id } = useParams();
  const movie = mockMovies.find((m) => m.id.toString() === id);
  const [activeTab, setActiveTab] = useState('episodes');
  const [comment, setComment] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [activeCommentTab, setActiveCommentTab] = useState('');
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [copied, setCopied] = useState(false);
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewContent, setReviewContent] = useState('');
  const [showWatchConfirmation, setShowWatchConfirmation] = useState(false);

  // Logic cho scroll button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollButton(scrollY > 300); // Hiện button khi scroll > 300px
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    setActiveTab('episodes');
  }, [id]);
  // Logic cho tab loading
  const handleTabChange = (tabName: string) => {
    if (tabName !== 'episodes') {
      setIsTabLoading(true);
      setTimeout(() => {
        setIsTabLoading(false);
      }, 1000);
    }
    setActiveTab(tabName);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleCopyLink = async () => {
    if (!movie) return;
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/movie/${movie.id}`);
      setCopied(true);
      setToast({ show: true, message: 'Đã copy link thành công!', type: 'success' });
      setTimeout(() => setCopied(false), 2000);
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } catch (err) {
      setToast({ show: true, message: 'Không thể copy link!', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    }
  };

  const closeToast = () => {
    setToast({ show: false, message: '', type: 'success' });
  };

  // Handler for comment button click
  const handleCommentClick = () => {
    if (!user) {
      setToast({ show: true, message: 'Bạn phải đăng nhập để sử dụng tính năng này!', type: 'error' });
      return;
    }

    if (activeCommentTab == "comments" && commentTextareaRef.current) {
      commentTextareaRef.current.focus();
    } else {
      setActiveCommentTab("comments");
    }

  };

  useEffect(() => {
    if (commentTextareaRef.current) {
      commentTextareaRef.current.focus();
    }
  }, [activeCommentTab]);


  // Handler for favorite button click
  const handleFavoriteClick = () => {
    if (!user) {
      setToast({ show: true, message: 'Bạn phải đăng nhập để sử dụng tính năng này!', type: 'error' });
      return;
    }
    // TODO: Implement favorite functionality
  };

  // Handler for add to list button click
  const handleAddToListClick = () => {
    if (!user) {
      setToast({ show: true, message: 'Bạn phải đăng nhập để sử dụng tính năng này!', type: 'error' });
      return;
    }
    // TODO: Implement add to list functionality
  };

  // Handler for reviews tab click
  const handleReviewsTabClick = () => {
    if (!user) {
      setToast({ show: true, message: 'Vui lòng đăng nhập để xem đánh giá!', type: 'error' });
      return;
    }
    setActiveCommentTab('reviews');
  };

  // Check if user can review the movie
  const canUserReview = () => {
    if (!user || !movie) return false;

    const userHistory = mockUserWatchHistory[user.name as keyof typeof mockUserWatchHistory];
    if (!userHistory) return false;

    const movieProgress = userHistory[movie.id as keyof typeof userHistory];
    if (!movieProgress) return false;

    return movieProgress.hasWatched && movieProgress.progress >= 67; // 2/3 = 67%
  };

  // Handler for review button click
  const handleReviewClick = () => {
    if (!user) {
      setToast({ show: true, message: 'Bạn phải đăng nhập để đánh giá phim!', type: 'error' });
      return;
    }

    if (!movie) return;

    const userHistory = mockUserWatchHistory[user.name as keyof typeof mockUserWatchHistory];
    if (!userHistory) {
      setShowWatchConfirmation(true);
      return;
    }

    const movieProgress = userHistory[movie.id as keyof typeof userHistory];
    if (!movieProgress) {
      setShowWatchConfirmation(true);
      return;
    }

    if (!movieProgress.hasWatched) {
      setShowWatchConfirmation(true);
      return;
    }

    if (movieProgress.progress < 67) {
      setToast({
        show: true,
        message: 'Bạn cần xem ít nhất 2/3 phim để đánh giá!',
        type: 'error'
      });
      return;
    }

    // User can review
    setShowReviewModal(true);
  };

  // Handler for watch confirmation
  const handleWatchConfirmation = () => {
    setShowWatchConfirmation(false);
    setShowReviewModal(true);
  };

  // Handler for submitting review
  const handleSubmitReview = () => {
    if (!reviewContent.trim()) {
      setToast({ show: true, message: 'Vui lòng nhập nội dung đánh giá!', type: 'error' });
      return;
    }

    // In a real app, you would submit the review to the server here
    setToast({ show: true, message: 'Đánh giá đã được gửi thành công!', type: 'success' });
    setShowReviewModal(false);
    setReviewContent('');
    setReviewRating(5);
  };

  if (!movie) return <div className="text-center text-red-500 py-20">Không tìm thấy phim!</div>;

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Get year from release date
  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  // Get age rating based on genres
  const getAgeRating = (genres: string[]) => {
    if (genres.some(g => g.includes('Kinh Dị'))) return 'T18';
    if (genres.some(g => g.includes('Hành Động') || g.includes('Tội Phạm'))) return 'T16';
    return 'T13';
  };

  // Render tab content
  const renderTabContent = () => {
    if (isTabLoading) {
      return (
        <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
            <span className="ml-3 text-white text-lg">Đang tải...</span>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'gallery':
        const galleryData = getMockData(movie.id, 'gallery');
        return (
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-yellow-400" />
              Gallery ({galleryData.length} ảnh)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {galleryData.map((item) => (
                <div key={item.id} className="group cursor-pointer">
                  <div className="relative aspect-video bg-gray-700 rounded-lg overflow-hidden">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                  </div>
                  <p className="mt-2 text-white text-sm text-center">{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'actors':
        const actorsData = getMockData(movie.id, 'actors');
        return (
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-yellow-400" />
              Diễn viên ({actorsData.length} người)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {actorsData.map((actor) => (
                <div key={actor.id} className="group cursor-pointer text-center">
                  <div className="w-24 h-24 mx-auto mb-3 bg-gray-700 rounded-full overflow-hidden">
                    <img
                      src={actor.image}
                      alt={actor.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-1">{actor.name}</h4>
                  <p className="text-gray-400 text-xs">{actor.role}</p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'suggestions':
        const suggestionsData = getMockData(movie.id, 'suggestions');
        return (
          <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <Sparkles className="w-5 h-5 mr-2 text-yellow-400" />
              Đề xuất ({suggestionsData.length} phim)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {suggestionsData.map((suggestion) => (
                <div key={suggestion.id} className="group cursor-pointer">
                  <div className="relative aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden">
                    <Link to={`/phim/${suggestion.id}`}>
                      <img
                        src={suggestion.poster}
                        alt={suggestion.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                      <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                        {suggestion.rating}
                      </div>
                    </Link>
                  </div>
                  <p className="mt-2 text-white text-sm text-center line-clamp-2">{suggestion.title}</p>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white">
      {/* Hero Section with Background Image */}
      <section className="relative h-screen">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={movie.backdropUrl}
            alt={`${movie.title} Background`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="flex items-end justify-between">
              <div className="flex-1">
                {/* Action Buttons */}
                <div className="flex items-center space-x-6 mb-8">
                  <Link to={`/xem-phim/${movie.id}`}>
                    <button className="flex items-center space-x-3 bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-lg transition-colors shadow-lg">
                      <Play size={24} />Xem phim
                    </button>
                  </Link>

                  <div className="flex items-center space-x-6">
                    <button
                      onClick={handleFavoriteClick}
                      className="flex flex-col items-center space-y-2 text-white hover:text-yellow-400 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Heart size={24} className="text-yellow-400" />
                      </div>
                      <span className="text-sm font-medium">Yêu thích</span>
                    </button>

                    <button
                      onClick={handleAddToListClick}
                      className="flex flex-col items-center space-y-2 text-white hover:text-yellow-400 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Plus size={24} />
                      </div>
                      <span className="text-sm font-medium">Thêm vào</span>
                    </button>

                    <button
                      onClick={() => setShowShareModal(true)}
                      className="flex flex-col items-center space-y-2 text-white hover:text-yellow-400 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <Share size={24} />
                      </div>
                      <span className="text-sm font-medium">Chia sẻ</span>
                    </button>

                    <button
                      onClick={handleCommentClick}
                      className="flex flex-col items-center space-y-2 text-white hover:text-yellow-400 transition-colors"
                    >
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                        <MessageCircle size={24} />
                      </div>
                      <span className="text-sm font-medium">Bình luận</span>
                    </button>

                    {/* Rating - Cân bằng với các button khác */}
                    <button className="flex flex-col items-center space-y-2 text-white hover:text-yellow-400 transition-colors">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                        <div className="text-center">
                          <div className="text-white font-bold text-sm leading-tight">{movie.rating.toFixed(1)}</div>
                        </div>
                      </div>
                      <span className="text-sm font-medium">Đánh giá</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advertisement Banner */}
      <section className="relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-black border-2 border-yellow-400 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl font-bold text-white">TX88</div>
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <div className="text-2xl font-bold text-yellow-400">HOÀN KHỦNG 1.6%</div>
                  <div className="text-white text-lg">CƯỢC NGAY +20TR</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative z-10 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Movie Details (1/3) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Movie Title and Basic Info */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                <h2 className="text-lg text-gray-300 mb-4">{movie.originalTitle || movie.title}</h2>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{getAgeRating(movie.genres)}</span>
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{getYear(movie.releaseDate)}</span>
                  <span className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{formatDuration(movie.duration)}</span>
                  <span className="bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">{movie.quality}</span>
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= Math.floor(movie.rating / 2) ? "text-yellow-400 fill-current" : "text-gray-600"}
                      />
                    ))}
                  </div>
                  <span className="text-yellow-400 font-semibold">{movie.rating.toFixed(1)}/10</span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTabChange('episodes')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'episodes'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                  >
                    {movie.type === 'series' ? 'Tập phim' : 'Chi tiết'}
                  </button>
                  <button
                    onClick={() => handleTabChange('gallery')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'gallery'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                  >
                    Gallery
                  </button>
                  <button
                    onClick={() => handleTabChange('actors')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'actors'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                  >
                    Diễn viên
                  </button>
                  <button
                    onClick={() => handleTabChange('suggestions')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === 'suggestions'
                      ? 'bg-red-500 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                      }`}
                  >
                    Đề xuất
                  </button>
                </div>
              </div>

              {/* Genre Tags */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-yellow-400" />
                  Thể loại
                </h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => {
                    const colors = [
                      'bg-gradient-to-r from-purple-500 to-pink-500',
                      'bg-gradient-to-r from-red-500 to-orange-500',
                      'bg-gradient-to-r from-blue-500 to-cyan-500',
                      'bg-gradient-to-r from-green-500 to-emerald-500',
                      'bg-gradient-to-r from-yellow-500 to-orange-500',
                      'bg-gradient-to-r from-indigo-500 to-purple-500'
                    ];
                    return (
                      <span
                        key={genre}
                        className={`${colors[index % colors.length]} text-white text-sm font-semibold px-3 py-2 rounded-lg`}
                      >
                        {genre}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Introduction */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-yellow-400" />
                  Giới thiệu
                </h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  {movie.overview}
                </p>
              </div>

              {/* Movie Details */}
              <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-yellow-400" />
                  Thông tin chi tiết
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">Thời lượng:</span>
                    <span className="text-white text-sm font-medium">{formatDuration(movie.duration)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">Năm phát hành:</span>
                    <span className="text-white text-sm font-medium">{getYear(movie.releaseDate)}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">Chất lượng:</span>
                    <span className="text-white text-sm font-medium">{movie.quality}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-400 text-sm">Loại:</span>
                    <span className="text-white text-sm font-medium">{movie.type === 'series' ? 'Phim bộ' : 'Phim lẻ'}</span>
                  </div>
                  {movie.episodes && (
                    <div className="flex items-center space-x-3">
                      <Play className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-400 text-sm">Tập:</span>
                      <span className="text-white text-sm font-medium">{movie.episodes.current}/{movie.episodes.total}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Comments (2/3) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tab Content */}
              {activeTab !== 'episodes' && renderTabContent()}

              {/* Conditional Content based on movie type */}
              {activeTab === 'episodes' && (movie.type === 'movie' ? (
                /* Available Versions for Movies */
                <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                    <Play className="w-5 h-5 mr-2 text-yellow-400" />
                    Các bản chiếu
                  </h3>
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={movie.backdropUrl}
                      alt={`${movie.title} Version`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                        <span className="text-white text-sm">Phụ đề</span>
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h4 className="text-white font-bold text-lg mb-2">{movie.title}</h4>
                      <Link to={`/watch/${movie.id}`}>
                        <button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg">
                          Xem bản này
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* All Episodes for Series */
                <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center">
                      <Play className="w-5 h-5 mr-2 text-yellow-400" />
                      Tất cả tập phim
                    </h3>
                    {movie.episodes && movie.episodes.total > 20 && (
                      <button
                        onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                        className="text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
                      >
                        {showAllEpisodes ? 'Thu gọn' : 'Xem tất cả'}
                      </button>
                    )}
                  </div>

                  {/* Episodes Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-10 gap-3">
                    {movie.episodes && Array.from({ length: showAllEpisodes ? movie.episodes.total : Math.min(movie.episodes.total, 20) }, (_, index) => (
                      <Link to={`/watch/series/${movie.id}/ep/${index}`}>
                        <div key={index} className="relative group cursor-pointer w-100 h-100">
                          <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden">
                            <img
                              src={movie.backdropUrl}
                              alt={`Tập ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-yellow-400 group-hover:text-black transition-all duration-200">
                                <Play size={16} />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <span className="text-white text-sm font-medium">Tập {index + 1}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Comments Section */}
              <div className=" rounded-2xl p-6 backdrop-blur-sm border border-none">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <MessageCircle className="w-6 h-6 mr-2 text-yellow-400" />
                    Bình luận & Đánh giá ({mockComments.length + mockReviews.length})
                  </h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveCommentTab('comments')}
                      className={`text-sm font-medium pb-1 px-2 transition-colors ${activeCommentTab === 'comments'
                        ? 'text-white border-b-2 border-red-500'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Bình luận ({mockComments.length})
                    </button>
                    <button
                      onClick={handleReviewsTabClick}
                      className={`text-sm font-medium pb-1 px-2 transition-colors ${activeCommentTab === 'reviews'
                        ? 'text-white border-b-2 border-red-500'
                        : 'text-gray-400 hover:text-white'
                        }`}
                    >
                      Đánh giá ({mockReviews.length})
                    </button>
                  </div>
                </div>

                {/* Comment Input - Only show when comments tab is active */}
                {activeCommentTab === 'comments' && user && (
                  <div className="bg-gray-700/50 rounded-xl p-6 mb-6 border border-gray-600/50">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-3">
                          Bình luận với tên <span className="text-white font-semibold">{user?.name || 'Khách'}</span>
                        </div>
                        <textarea
                          ref={commentTextareaRef}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Viết bình luận của bạn..."
                          className="w-full bg-gray-600/50 text-white placeholder-gray-400 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-500/50"
                          rows={4}
                        />
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4">
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm text-gray-400">{comment.length}/1000</span>
                            <button className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition-all duration-200 shadow-lg">
                              <Send size={16} />
                              <span>Gửi</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments/Reviews List */}
                <div className="space-y-4">
                  {activeCommentTab === 'comments' ? (
                    // Comments Tab
                    mockComments.map((comment) => (
                      <div key={comment.id} className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30">
                        <div className="flex items-start space-x-4">
                          <div className={`w-10 h-10 bg-gradient-to-br ${comment.user.avatarColor} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <span className="text-white text-sm font-bold">{comment.user.avatar}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className="text-white font-semibold">{comment.user.name}</span>
                              <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">
                              {comment.content}
                            </p>
                            <div className="flex items-center space-x-6 mt-3">
                              <button className="text-gray-400 hover:text-white text-sm transition-colors">👍 {comment.likes}</button>
                              <button className="text-gray-400 hover:text-white text-sm transition-colors">👎 {comment.dislikes}</button>
                              <button className="text-gray-400 hover:text-white text-sm transition-colors">Trả lời</button>
                              <button className="text-gray-400 hover:text-white text-sm transition-colors">Thêm</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    // Reviews Tab
                    !user ? (
                      <div className="bg-gray-700/30 rounded-xl p-8 border border-gray-600/30 text-center">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white mb-2">Cần đăng nhập để xem đánh giá</h3>
                            <p className="text-gray-400 text-sm mb-4">Đăng nhập để xem đánh giá chi tiết từ cộng đồng</p>
                            <button
                              onClick={() => login()}
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
                            >
                              Đăng nhập ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Review Button */}
                        <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/30 mb-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-white font-semibold text-lg mb-2">Đánh giá phim</h4>
                              <p className="text-gray-400 text-sm">
                                {canUserReview()
                                  ? 'Bạn đã xem phim này và có thể đánh giá'
                                  : 'Bạn cần xem ít nhất 2/3 phim để đánh giá'
                                }
                              </p>
                            </div>
                            <button
                              onClick={handleReviewClick}
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg flex items-center space-x-2"
                            >
                              <Star size={16} />
                              <span>Đánh giá</span>
                            </button>
                          </div>
                        </div>
                        {(() => {
                          // Tìm review của user hiện tại
                          const userReview = mockReviews.find(review => review.user.name === user.name);
                          // Lọc ra các review khác (không phải của user hiện tại)
                          const otherReviews = mockReviews.filter(review => review.user.name !== user.name);

                          // Nếu user đã review, hiển thị review của họ đầu tiên
                          const sortedReviews = userReview
                            ? [userReview, ...otherReviews]
                            : mockReviews;

                          return sortedReviews.map((review) => (
                            <div key={review.id} className={`bg-gray-700/30 rounded-xl p-4 border ${review.user.name === user.name ? 'border-yellow-400/50 bg-yellow-400/5' : 'border-gray-600/30'}`}>
                              <div className="flex items-start space-x-4">
                                <div className={`w-10 h-10 bg-gradient-to-br ${review.user.avatarColor} rounded-full flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                  <span className="text-white text-sm font-bold">{review.user.avatar}</span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-white font-semibold flex items-center">
                                      {review.user.name}
                                      {review.user.name === user.name && (
                                        <span className="ml-2 px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded-full border border-yellow-400/30">
                                          Bạn
                                        </span>
                                      )}
                                    </span>
                                    <span className="text-gray-400 text-sm">{review.timestamp}</span>
                                    <div className="flex space-x-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          size={12}
                                          className={star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-600"}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-yellow-400 text-sm font-medium">{review.rating}/5</span>
                                  </div>
                                  <p className="text-gray-300 text-sm leading-relaxed">
                                    {review.content}
                                  </p>
                                  <div className="flex items-center space-x-6 mt-3">
                                    <button className="text-gray-400 hover:text-white text-sm transition-colors">👍 {review.likes}</button>
                                    <button className="text-gray-400 hover:text-white text-sm transition-colors">👎 {review.dislikes}</button>
                                    <button className="text-gray-400 hover:text-white text-sm transition-colors">Trả lời</button>
                                    <button className="text-gray-400 hover:text-white text-sm transition-colors">Thêm</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                      </>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Scroll to Top Button - Chỉ hiện khi scroll xuống */}
      {
        showScrollButton && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition-all duration-300 z-50"
          >
            <ChevronUp size={20} className='m-auto' />
          </button>
        )
      }

      {/* Share Modal */}
      {
        showShareModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg mx-4 border border-gray-700/50 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <Share className="w-6 h-6 mr-2 text-yellow-400" />
                  Chia sẻ phim
                </h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Movie Info */}
              <div className="flex items-center space-x-4 mb-8 p-6 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-2xl border border-gray-600/30">
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-20 h-28 object-cover rounded-xl shadow-lg"
                />
                <div className="flex-1">
                  <h4 className="text-white font-bold text-xl mb-2">{movie.title}</h4>
                  <p className="text-gray-300 text-sm mb-2">{getYear(movie.releaseDate)} • {formatDuration(movie.duration)}</p>
                  <div className="flex items-center space-x-1">
                    <Star size={16} className="text-yellow-400 fill-current" />
                    <span className="text-yellow-400 text-sm font-semibold">{movie.rating.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm ml-2">• {movie.genres.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
              </div>

              {/* Share URL */}
              <div className="mb-8">
                <label className="block text-gray-200 text-sm font-semibold mb-3 flex items-center">
                  <Share className="w-4 h-4 mr-2 text-yellow-400" />
                  Link chia sẻ
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={`${window.location.origin}/movie/${movie.id}`}
                    readOnly
                    className="flex-1 bg-gray-700/50 text-white px-4 py-3 rounded-l-xl border border-gray-600/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 transition-all duration-200"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-r-lg font-semibold transition-all duration-200 ${copied
                      ? 'bg-green-500 hover:bg-green-600 text-white'
                      : 'bg-yellow-400 hover:bg-yellow-500 text-black'
                      }`}
                  >
                    {copied ? (
                      <>
                        <Check size={16} />
                        <span>Đã copy!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={16} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="space-y-4">
                <h4 className="text-gray-200 text-sm font-semibold flex items-center">
                  <Users className="w-4 h-4 mr-2 text-yellow-400" />
                  Chia sẻ qua mạng xã hội
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <button className="flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-4 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                    <span className="font-medium">Twitter</span>
                  </button>
                  <button
                    className="flex items-center justify-center space-x-2 bg-black hover:bg-gray-900 text-white py-3 px-5 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 48 48">
                      <path d="M41.6 14.8c-2.6-.1-5.1-1-7.2-2.6v14.3c0 8.6-7 15.5-15.5 15.5-3.1 0-6-.9-8.4-2.5 3.1.4 6.4-.4 8.9-2.5-2.6-.1-4.8-1.8-5.5-4.2.9.1 1.8.1 2.7-.1-2.7-.6-4.8-2.9-4.8-5.8v-.1c.8.5 1.8.8 2.9.9-2.6-1.8-3.3-5.3-1.8-8 3.1 3.8 7.8 6.2 13 6.5-1-4.9 2.6-9.2 7.4-9.2 2.1 0 4 .9 5.3 2.3 1.7-.3 3.3-1 4.8-1.9-.6 1.8-1.8 3.3-3.3 4.3 1.5-.2 3-.6 4.3-1.2-1 1.5-2.3 2.9-3.8 4z" />
                    </svg>
                    <span className="font-medium">TikTok</span>
                  </button>

                  <button className="flex items-center justify-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white py-4 px-4 rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-medium">Facebook</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-lg mx-4 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center">
                <Star className="w-6 h-6 mr-2 text-yellow-400" />
                Đánh giá phim
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Movie Info */}
            <div className="flex items-center space-x-4 mb-8 p-6 bg-gradient-to-r from-gray-700/40 to-gray-600/40 rounded-2xl border border-gray-600/30">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl shadow-lg"
              />
              <div className="flex-1">
                <h4 className="text-white font-bold text-xl mb-2">{movie.title}</h4>
                <p className="text-gray-300 text-sm mb-2">{getYear(movie.releaseDate)} • {formatDuration(movie.duration)}</p>
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-semibold">{movie.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-gray-200 text-sm font-semibold mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Đánh giá của bạn
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`p-2 rounded-lg transition-all duration-200 ${star <= reviewRating
                      ? 'text-yellow-400 bg-yellow-400/20'
                      : 'text-gray-400 hover:text-yellow-400'
                      }`}
                  >
                    <Star size={24} className={star <= reviewRating ? "fill-current" : ""} />
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-sm mt-2">{reviewRating}/5 sao</p>
            </div>

            {/* Review Content */}
            <div className="mb-8">
              <label className="block text-gray-200 text-sm font-semibold mb-3">
                Nội dung đánh giá
              </label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về phim này..."
                className="w-full bg-gray-700/50 text-white placeholder-gray-400 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/50 border border-gray-600/50 transition-all duration-200"
                rows={4}
              />
              <p className="text-gray-400 text-sm mt-2">{reviewContent.length}/1000 ký tự</p>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                onClick={() => setShowReviewModal(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmitReview}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
              >
                Gửi đánh giá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Watch Confirmation Modal */}
      {showWatchConfirmation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-800/95 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md mx-4 border border-gray-700/50 shadow-2xl text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h3 className="text-xl font-bold text-white mb-4">Xác nhận đã xem phim</h3>
            <p className="text-gray-300 text-sm mb-6">
              Để đánh giá phim này, bạn cần xác nhận rằng bạn đã xem ít nhất 2/3 thời lượng phim.
            </p>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowWatchConfirmation(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200"
              >
                Hủy
              </button>
              <button
                onClick={handleWatchConfirmation}
                className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-lg"
              >
                Xác nhận đã xem
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={closeToast}
        duration={3000}
      />
    </div>
  );
};

export default MovieDetailPage; 