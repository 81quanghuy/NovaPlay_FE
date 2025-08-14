import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Play,
    Pause,
    Volume2,
    VolumeX,
    Maximize,
    Settings,
    Heart,
    Plus,
    Share2,
    Users,
    Flag,
    Star,
    Clock,
    Calendar,
    ThumbsUp,
    ThumbsDown,
    Send,
    ChevronDown,
    ChevronUp,
    SkipBack,
    SkipForward,
    X,
    Monitor,
    Subtitles,
    Zap,
    ArrowLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Toast from '../components/Toast';
import { mockMovies } from '../data/mockMovies';

// Mock video stream data
const mockVideoStreams = {
    1: {
        title: "Đời Sẽ Vẫn Đẹp Tươi",
        streams: [
            { quality: "1080p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", label: "Server 1" },
            { quality: "720p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", label: "Server 2" },
            { quality: "480p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", label: "Server 3" }
        ],
        subtitles: [
            { language: "Tiếng Việt", url: "subtitle-vi.vtt" },
            { language: "English", url: "subtitle-en.vtt" },
            { language: "中文", url: "subtitle-zh.vtt" }
        ],
        audioTracks: [
            { language: "Tiếng Việt", label: "Lồng tiếng" },
            { language: "English", label: "Thuyết minh" },
            { language: "Korean", label: "Gốc" }
        ]
    },
    2: {
        title: "Avengers: Endgame",
        streams: [
            { quality: "4K", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", label: "Server 1" },
            { quality: "1080p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", label: "Server 2" },
            { quality: "720p", url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", label: "Server 3" }
        ],
        subtitles: [
            { language: "Tiếng Việt", url: "subtitle-vi.vtt" },
            { language: "English", url: "subtitle-en.vtt" }
        ],
        audioTracks: [
            { language: "Tiếng Việt", label: "Lồng tiếng" },
            { language: "English", label: "Thuyết minh" }
        ]
    }
};

const MovieWatchPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const videoRef = useRef<HTMLVideoElement>(null);
    const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

    // Video player states
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [volume, setVolume] = useState(1);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [selectedQuality, setSelectedQuality] = useState('1080p');
    const [selectedServer, setSelectedServer] = useState(0);
    const [selectedSubtitle, setSelectedSubtitle] = useState('Tiếng Việt');
    const [selectedAudio, setSelectedAudio] = useState('Tiếng Việt');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [buffering, setBuffering] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    // UI states
    const [showComments, setShowComments] = useState(false);
    const [comment, setComment] = useState('');
    const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
        show: false,
        message: '',
        type: 'success'
    });

    // Mock movie data
    const movie = mockMovies.find(m => m.id === parseInt(id || '1')) || mockMovies[0];
    const videoData = mockVideoStreams[parseInt(id || '1') as keyof typeof mockVideoStreams] || mockVideoStreams[1];

    // Mock comments data
    const mockComments = [
        {
            id: 1,
            user: { name: 'Nguyễn Văn A', avatar: 'NV', avatarColor: 'from-blue-500 to-blue-600' },
            content: 'Phim hay quá! Diễn viên diễn xuất rất tốt.',
            timestamp: '2 giờ trước',
            likes: 15,
            dislikes: 2
        },
        {
            id: 2,
            user: { name: 'Trần Thị B', avatar: 'TT', avatarColor: 'from-pink-500 to-pink-600' },
            content: 'Cốt truyện hấp dẫn, không thể rời mắt.',
            timestamp: '3 giờ trước',
            likes: 8,
            dislikes: 1
        },
        {
            id: 3,
            user: { name: 'Lê Văn C', avatar: 'LV', avatarColor: 'from-green-500 to-green-600' },
            content: 'Phim này đáng xem, đặc biệt là phần âm nhạc.',
            timestamp: '5 giờ trước',
            likes: 12,
            dislikes: 0
        }
    ];

    // Playback speed options
    const playbackRates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

    // Video player functions
    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play().catch(() => {
                    setToast({
                        show: true,
                        message: 'Không thể phát video!',
                        type: 'error'
                    });
                });
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current && !isDragging) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value);
        setCurrentTime(time);
    };

    const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const time = parseFloat(target.value);
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            setCurrentTime(time);
        }
        setIsDragging(false);
    };

    const handleSeekStart = () => {
        setIsDragging(true);
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(e.target.value);
        if (videoRef.current) {
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
        }
    };

    const skipTime = (seconds: number) => {
        if (videoRef.current) {
            const newTime = videoRef.current.currentTime + seconds;
            videoRef.current.currentTime = Math.max(0, Math.min(newTime, duration));
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    const changePlaybackRate = (rate: number) => {
        if (videoRef.current) {
            videoRef.current.playbackRate = rate;
            setPlaybackRate(rate);
            setShowSettings(false);
            setToast({
                show: true,
                message: `Tốc độ phát: ${rate}x`,
                type: 'success'
            });
        }
    };

    const changeQuality = (quality: string, serverIndex: number) => {
        setSelectedQuality(quality);
        setSelectedServer(serverIndex);
        setShowSettings(false);

        setToast({
            show: true,
            message: `Đã chuyển sang ${quality} - ${videoData.streams[serverIndex].label}`,
            type: 'success'
        });
    };

    const changeSubtitle = (subtitle: string) => {
        setSelectedSubtitle(subtitle);
        setShowSettings(false);
        setToast({
            show: true,
            message: `Đã chuyển sang phụ đề ${subtitle}`,
            type: 'success'
        });
    };

    const changeAudio = (audio: string) => {
        setSelectedAudio(audio);
        setShowSettings(false);
        setToast({
            show: true,
            message: `Đã chuyển sang âm thanh ${audio}`,
            type: 'success'
        });
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            videoRef.current?.requestFullscreen().catch(() => {
                setToast({
                    show: true,
                    message: 'Không thể vào chế độ toàn màn hình!',
                    type: 'error'
                });
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    const formatTime = (time: number) => {
        if (isNaN(time) || time === Infinity) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    // Action handlers
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

    const handleShareClick = () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            setToast({
                show: true,
                message: 'Đã copy link phim!',
                type: 'success'
            });
        }).catch(() => {
            setToast({
                show: true,
                message: 'Không thể copy link!',
                type: 'error'
            });
        });
    };

    const handleWatchTogetherClick = () => {
        if (!user) {
            setToast({
                show: true,
                message: 'Bạn phải đăng nhập để sử dụng tính năng này!',
                type: 'error'
            });
        } else {
            setToast({
                show: true,
                message: 'Đã tạo phòng xem chung!',
                type: 'success'
            });
        }
    };

    const handleReportClick = () => {
        setToast({
            show: true,
            message: 'Đã gửi báo cáo!',
            type: 'success'
        });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setToast({
                show: true,
                message: 'Bạn phải đăng nhập để bình luận!',
                type: 'error'
            });
            return;
        }
        if (!comment.trim()) {
            setToast({
                show: true,
                message: 'Vui lòng nhập nội dung bình luận!',
                type: 'error'
            });
            return;
        }
        setToast({
            show: true,
            message: 'Đã gửi bình luận!',
            type: 'success'
        });
        setComment('');
    };

    // Auto-hide controls
    useEffect(() => {
        let timeout: NodeJS.Timeout;
        if (showControls && !showSettings) {
            timeout = setTimeout(() => {
                setShowControls(false);
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [showControls, showSettings]);

    // Handle fullscreen change
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    skipTime(-10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    skipTime(10);
                    break;
                case 'KeyM':
                    e.preventDefault();
                    toggleMute();
                    break;
                case 'KeyF':
                    e.preventDefault();
                    toggleFullscreen();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyPress);
        return () => document.removeEventListener('keydown', handleKeyPress);
    }, [isPlaying, isMuted, isFullscreen]);

    return (
        <div className="min-h-screen bg-gray-900">
            {/* Video Player Section */}
            <div className="relative bg-black">
                <div
                    className="relative w-full h-screen max-h-[70vh] cursor-pointer group"
                    onMouseMove={() => setShowControls(true)}
                    onMouseLeave={() => setShowControls(false)}
                >
                    {/* Video Element */}
                    <video
                        ref={videoRef}
                        className="w-full h-full object-contain"
                        poster={movie.backdropUrl}
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onWaiting={() => setBuffering(true)}
                        onCanPlay={() => setBuffering(false)}
                        onError={() => {
                            setToast({
                                show: true,
                                message: 'Lỗi tải video!',
                                type: 'error'
                            });
                        }}
                        playsInline
                    >
                        <source src={videoData.streams[selectedServer].url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Buffering Indicator */}
                    {buffering && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="flex flex-col items-center space-y-4">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-red-500 border-t-transparent"></div>
                                <span className="text-white text-sm">Đang tải...</span>
                            </div>
                        </div>
                    )}

                    {/* Video Controls Overlay */}
                    {showControls && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent">
                            {/* Top Controls */}
                            <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                                <Link
                                    to={`/phim/${movie.id}`}
                                    className="flex items-center space-x-2 text-white hover:text-red-400 transition-colors bg-black/30 px-3 py-2 rounded-lg backdrop-blur-sm"
                                >
                                    <ArrowLeft size={20} />
                                    <span>Quay lại</span>
                                </Link>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setShowSettings(!showSettings)}
                                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors bg-black/30 backdrop-blur-sm"
                                    >
                                        <Settings size={20} />
                                    </button>
                                    <button
                                        onClick={handleReportClick}
                                        className="p-2 text-white hover:bg-white/20 rounded-full transition-colors bg-black/30 backdrop-blur-sm"
                                    >
                                        <Flag size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Settings Popup */}
                            {showSettings && (
                                <div className="absolute top-16 right-4 bg-gray-900/95 backdrop-blur-md rounded-xl shadow-2xl z-50 min-w-[280px] p-6 border border-gray-700">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-white font-semibold text-lg">Cài đặt</h3>
                                        <button
                                            onClick={() => setShowSettings(false)}
                                            className="text-gray-400 hover:text-white transition-colors p-1"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>

                                    {/* Quality Settings */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Monitor size={18} className="text-red-400" />
                                            <span className="text-white font-medium">Chất lượng</span>
                                        </div>
                                        <div className="space-y-2">
                                            {videoData.streams.map((stream, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => changeQuality(stream.quality, index)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${selectedQuality === stream.quality && selectedServer === index
                                                        ? 'bg-red-500 text-white shadow-lg'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span>{stream.label}</span>
                                                        <span className="text-xs font-medium">{stream.quality}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subtitle Settings */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Subtitles size={18} className="text-red-400" />
                                            <span className="text-white font-medium">Phụ đề</span>
                                        </div>
                                        <div className="space-y-2">
                                            {videoData.subtitles.map((subtitle, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => changeSubtitle(subtitle.language)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${selectedSubtitle === subtitle.language
                                                        ? 'bg-red-500 text-white shadow-lg'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        }`}
                                                >
                                                    {subtitle.language}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Audio Settings */}
                                    <div className="mb-6">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Volume2 size={18} className="text-red-400" />
                                            <span className="text-white font-medium">Âm thanh</span>
                                        </div>
                                        <div className="space-y-2">
                                            {videoData.audioTracks.map((audio, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => changeAudio(audio.language)}
                                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200 ${selectedAudio === audio.language
                                                        ? 'bg-red-500 text-white shadow-lg'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center">
                                                        <span>{audio.language}</span>
                                                        <span className="text-xs opacity-75">{audio.label}</span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Speed Settings */}
                                    <div>
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Zap size={18} className="text-red-400" />
                                            <span className="text-white font-medium">Tốc độ phát</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {playbackRates.map((rate) => (
                                                <button
                                                    key={rate}
                                                    onClick={() => changePlaybackRate(rate)}
                                                    className={`px-3 py-2 rounded-lg text-sm transition-all duration-200 ${playbackRate === rate
                                                        ? 'bg-red-500 text-white shadow-lg'
                                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        }`}
                                                >
                                                    {rate}x
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Center Play Button */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button
                                    onClick={togglePlay}
                                    className="w-20 h-20 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center transition-all duration-200 shadow-2xl group-hover:scale-110"
                                >
                                    {isPlaying ? (
                                        <Pause size={32} className="text-white" />
                                    ) : (
                                        <Play size={32} className="text-white ml-1" />
                                    )}
                                </button>
                            </div>

                            {/* Bottom Controls */}
                            <div className="absolute bottom-4 left-4 right-4">
                                {/* Progress Bar */}
                                <div className="mb-4">
                                    <div className="relative">
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration || 0}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            onMouseDown={handleSeekStart}
                                            onMouseUp={handleSeekEnd}
                                            onTouchStart={handleSeekStart}
                                            onTouchEnd={handleSeekEnd}
                                            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                        />
                                        <div className="flex justify-between text-white text-sm mt-2">
                                            <span className="bg-black/50 px-2 py-1 rounded text-xs">{formatTime(currentTime)}</span>
                                            <span className="bg-black/50 px-2 py-1 rounded text-xs">{formatTime(duration)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Control Buttons */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => skipTime(-10)}
                                            className="text-white hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                        >
                                            <SkipBack size={24} />
                                        </button>
                                        <button
                                            onClick={togglePlay}
                                            className="text-white hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                        >
                                            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                                        </button>
                                        <button
                                            onClick={() => skipTime(10)}
                                            className="text-white hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                        >
                                            <SkipForward size={24} />
                                        </button>

                                        {/* Volume Control */}
                                        <div className="relative flex items-center space-x-2"
                                            onMouseEnter={() => setShowVolumeSlider(true)}
                                            onMouseLeave={() => setShowVolumeSlider(false)}>
                                            <button
                                                onClick={toggleMute}
                                                className="text-white hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                            >
                                                {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
                                            </button>
                                            {showVolumeSlider && (
                                                <div className="absolute bottom-full left-0 mb-3 bg-gray-900/95 backdrop-blur-md rounded-lg p-3 border border-gray-700">
                                                    <input
                                                        type="range"
                                                        min="0"
                                                        max="1"
                                                        step="0.1"
                                                        value={volume}
                                                        onChange={handleVolumeChange}
                                                        className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                                                        style={{ transform: 'rotate(-90deg)' }}
                                                    />
                                                    <div className="text-center text-white text-xs mt-2">
                                                        {Math.round(volume * 100)}%
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Speed Display */}
                                        <div className="text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                                            {playbackRate}x
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={toggleFullscreen}
                                            className="text-white hover:text-red-400 transition-colors p-2 hover:bg-white/10 rounded-full"
                                        >
                                            <Maximize size={24} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Movie Info and Actions */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Movie Title and Basic Info */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
                            <div className="flex items-center space-x-4 text-gray-300 mb-4">
                                <div className="flex items-center space-x-1">
                                    <Star size={16} className="text-yellow-400 fill-current" />
                                    <span>{movie.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock size={16} />
                                    <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Calendar size={16} />
                                    <span>{movie.releaseDate.split('-')[0]}</span>
                                </div>
                            </div>
                            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-4 mb-6">
                            <button
                                onClick={handleFavoriteClick}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <Heart size={16} />
                                <span>Yêu thích</span>
                            </button>
                            <button
                                onClick={handleAddToListClick}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <Plus size={16} />
                                <span>Thêm vào</span>
                            </button>
                            <button
                                onClick={handleShareClick}
                                className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                <Share2 size={16} />
                                <span>Chia sẻ</span>
                            </button>
                            <button
                                onClick={handleWatchTogetherClick}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            >
                                <Users size={16} />
                                <span>Xem chung</span>
                            </button>
                        </div>

                        {/* Video Stream Info */}
                        <div className="bg-gray-800 rounded-lg p-6 mb-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Thông tin Stream</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Chất lượng hiện tại:</span>
                                        <span className="text-white font-medium">{selectedQuality}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Server:</span>
                                        <span className="text-white">{videoData.streams[selectedServer].label}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Tốc độ phát:</span>
                                        <span className="text-white">{playbackRate}x</span>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Phụ đề:</span>
                                        <span className="text-white">{selectedSubtitle}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Âm thanh:</span>
                                        <span className="text-white">{selectedAudio}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Âm lượng:</span>
                                        <span className="text-white">{Math.round(volume * 100)}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-semibold text-white">Bình luận</h3>
                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    {showComments ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </button>
                            </div>

                            {showComments && (
                                <>
                                    {/* Comment Input */}
                                    <form onSubmit={handleCommentSubmit} className="mb-6">
                                        <div className="flex space-x-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                <span className="text-white text-sm font-bold">
                                                    {user ? user.name?.charAt(0).toUpperCase() : 'G'}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <textarea
                                                    ref={commentTextareaRef}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    placeholder={user ? "Viết bình luận..." : "Đăng nhập để bình luận"}
                                                    disabled={!user}
                                                    className="w-full p-3 bg-gray-700 text-white rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                                                    rows={3}
                                                />
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-sm text-gray-400">
                                                        {comment.length}/1000
                                                    </span>
                                                    <button
                                                        type="submit"
                                                        disabled={!user || !comment.trim()}
                                                        className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                                                    >
                                                        <Send size={16} />
                                                        <span>Gửi</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Comments List */}
                                    <div className="space-y-4">
                                        {mockComments.map((comment) => (
                                            <div key={comment.id} className="flex space-x-3">
                                                <div className={`w-10 h-10 bg-gradient-to-br ${comment.user.avatarColor} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                    <span className="text-white text-sm font-bold">{comment.user.avatar}</span>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-2 mb-1">
                                                        <span className="text-white font-semibold">{comment.user.name}</span>
                                                        <span className="text-gray-400 text-sm">{comment.timestamp}</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm mb-2">{comment.content}</p>
                                                    <div className="flex items-center space-x-4">
                                                        <button className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors">
                                                            <ThumbsUp size={14} />
                                                            <span>{comment.likes}</span>
                                                        </button>
                                                        <button className="flex items-center space-x-1 text-gray-400 hover:text-white text-sm transition-colors">
                                                            <ThumbsDown size={14} />
                                                            <span>{comment.dislikes}</span>
                                                        </button>
                                                        <button className="text-gray-400 hover:text-white text-sm transition-colors">
                                                            Trả lời
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Movie Details */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Thông tin phim</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Thể loại:</span>
                                    <span className="text-white">{movie.genres.join(', ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Chất lượng:</span>
                                    <span className="text-white">{movie.quality}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Loại phim:</span>
                                    <span className="text-white">{movie.type === 'movie' ? 'Phim Lẻ' : 'Phim Bộ'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Ngày phát hành:</span>
                                    <span className="text-white">{movie.releaseDate}</span>
                                </div>
                            </div>
                        </div>

                        {/* Available Streams */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Server có sẵn</h3>
                            <div className="space-y-2">
                                {videoData.streams.map((stream, index) => (
                                    <button
                                        key={index}
                                        onClick={() => changeQuality(stream.quality, index)}
                                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${selectedQuality === stream.quality && selectedServer === index
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span>{stream.label}</span>
                                            <span className="text-xs">{stream.quality}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Related Movies */}
                        <div className="bg-gray-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Phim liên quan</h3>
                            <div className="space-y-3">
                                {mockMovies.slice(0, 3).map((relatedMovie) => (
                                    <Link
                                        key={relatedMovie.id}
                                        to={`/xem-phim/${relatedMovie.id}`}
                                        className="flex space-x-3 group"
                                    >
                                        <img
                                            src={relatedMovie.posterUrl}
                                            alt={relatedMovie.title}
                                            className="w-16 h-24 object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                                        />
                                        <div className="flex-1">
                                            <h4 className="text-white text-sm font-medium group-hover:text-red-400 transition-colors line-clamp-2">
                                                {relatedMovie.title}
                                            </h4>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Star size={12} className="text-yellow-400 fill-current" />
                                                <span className="text-gray-400 text-xs">{relatedMovie.rating}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
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

export default MovieWatchPage;
