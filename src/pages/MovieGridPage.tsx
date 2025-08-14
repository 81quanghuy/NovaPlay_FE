import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Play, Heart, Plus, Star, Clock, MapPin, Users, Award, Sparkles } from 'lucide-react';
import { mockMovies } from '../data/mockMovies';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';

const MovieGridPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(35);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });
    const { user } = useAuth();

    // Calculate pagination
    const indexOfLastMovie = currentPage * moviesPerPage;
    const indexOfFirstMovie = indexOfLastMovie - moviesPerPage;
    const currentMovies = mockMovies.slice(indexOfFirstMovie, indexOfLastMovie);
    const totalPages = Math.ceil(mockMovies.length / moviesPerPage);

    // Reset to page 1 if current page is out of bounds
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [currentPage, totalPages]);

    // Scroll to top with smooth animation when page changes
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, [currentPage]);

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handleFavoriteClick = () => {
        if (!user) {
            setToast({
                show: true,
                message: 'Bạn phải đăng nhập để sử dụng tính năng này!',
                type: 'error'
            });
        } else {
            setToast({
                show: true,
                message: 'Đã thêm vào danh sách yêu thích!',
                type: 'success'
            });
        }
    };

    const handleAddToListClick = () => {
        if (!user) {
            setToast({
                show: true,
                message: 'Bạn phải đăng nhập để sử dụng tính năng này!',
                type: 'error'
            });
        } else {
            setToast({
                show: true,
                message: 'Đã thêm vào danh sách!',
                type: 'success'
            });
        }
    };

    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    };

    const formatRating = (rating: number) => {
        return rating.toFixed(1);
    };

    return (
        <div className="min-h-screen bg-gray-900 pt-16">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-white mb-4">
                            Khám Phá Phim
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                            Khám phá bộ sưu tập phim đa dạng với hàng nghìn tác phẩm từ khắp nơi trên thế giới
                        </p>
                        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <Sparkles size={16} />
                                <span>{mockMovies.length} phim</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users size={16} />
                                <span>Hàng nghìn người xem</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Award size={16} />
                                <span>Chất lượng cao</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Movies Grid */}
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                    {currentMovies.map((movie) => (
                        <div key={movie.id} className="group relative bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                            {/* Movie Poster */}
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <img
                                    src={movie.posterUrl}
                                    alt={movie.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                                        <Link
                                            to={`/xem-phim/${movie.id}`}
                                            className="w-10 h-10 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <Play size={16} className="text-white ml-0.5" />
                                        </Link>
                                        <button
                                            onClick={handleFavoriteClick}
                                            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <Heart size={16} className="text-white" />
                                        </button>
                                        <button
                                            onClick={handleAddToListClick}
                                            className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <Plus size={16} className="text-white" />
                                        </button>
                                    </div>
                                </div>

                                {/* Quality Badge */}
                                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    {movie.quality}
                                </div>

                                {/* Type Badge */}
                                <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
                                    {movie.type === 'movie' ? 'Phim Lẻ' : 'Phim Bộ'}
                                </div>

                                {/* Rating */}
                                <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                                    <Star size={12} className="text-yellow-400 fill-current" />
                                    <span>{formatRating(movie.rating)}</span>
                                </div>
                            </div>

                            {/* Movie Info */}
                            <div className="p-3">
                                <h3 className="text-sm font-semibold text-white mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                                    {movie.title}
                                </h3>
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <Clock size={12} />
                                        <span>{formatDuration(movie.duration)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <MapPin size={12} />
                                        <span>{movie.releaseDate.split('-')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="mt-12 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                            {/* Previous Button */}
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Trước
                            </button>

                            {/* Page Numbers */}
                            {getPageNumbers().map((page, index) => (
                                <button
                                    key={index}
                                    onClick={() => typeof page === 'number' && setCurrentPage(page)}
                                    disabled={page === '...'}
                                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                                        ? 'bg-red-500 text-white'
                                        : page === '...'
                                            ? 'text-gray-400 cursor-default'
                                            : 'text-gray-300 bg-gray-800 border border-gray-600 hover:bg-gray-700'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Next Button */}
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                )}

                {/* Page Info */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Hiển thị {indexOfFirstMovie + 1}-{Math.min(indexOfLastMovie, mockMovies.length)} trong tổng số {mockMovies.length} phim
                </div>
            </div>

            {/* Toast Notification */}
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.show}
                onClose={() => setToast({ ...toast, show: false })}
                duration={3000}
            />
        </div>
    );
};

export default MovieGridPage;
