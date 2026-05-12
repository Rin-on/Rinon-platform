import React from 'react';
import { Play, Clock, Eye, Bookmark, Share2, Plus, Trash2 } from 'lucide-react';

const ShikoPage = ({
    darkMode,
    t,
    language,
    videos,
    videoCategory,
    setVideoCategory,
    savedVideos,
    openVideo,
    toggleSaveVideo,
    userProfile,
    showAdmin,
    setShowAddVideoForm,
    deleteVideo,
}) => {
    const videoCategories = [
        { id: 'all', labelAl: 'Të Gjitha', labelEn: 'All', icon: '🎬' },
        { id: 'podcast', labelAl: 'Podcast', labelEn: 'Podcast', icon: '🎙️' },
        { id: 'events', labelAl: 'Evente', labelEn: 'Events', icon: '📹' },
        { id: 'interviews', labelAl: 'Intervista', labelEn: 'Interviews', icon: '🎤' },
        { id: 'external', labelAl: 'Të Jashtme', labelEn: 'External', icon: '🌍' },
    ];

    const filteredVideos = videoCategory === 'all' ? videos : videos.filter(v => v.category === videoCategory);
    const featuredVideo = videos.find(v => v.is_featured) || videos[0];

    const formatViews = (count) => {
        if (!count) return '0';
        if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
        return count.toString();
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🎬</span>
                    <div>
                        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {t('Shiko', 'Watch')}
                        </h1>
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                            {t('Video, podcast dhe më shumë', 'Videos, podcasts and more')}
                        </p>
                    </div>
                </div>
                {userProfile?.is_admin && showAdmin && (
                    <button
                        onClick={() => setShowAddVideoForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t('Shto Video', 'Add Video')}
                    </button>
                )}
            </div>

            {featuredVideo && (
                <div
                    className={`relative rounded-2xl overflow-hidden mb-8 cursor-pointer group ${darkMode ? 'bg-[#3D3A36]' : 'bg-white'}`}
                    onClick={() => openVideo(featuredVideo)}
                >
                    <div className="aspect-video md:aspect-[21/9] relative">
                        <img
                            src={featuredVideo.thumbnail || `https://img.youtube.com/vi/${featuredVideo.youtube_id}/maxresdefault.jpg`}
                            alt={language === 'al' ? featuredVideo.title_al : featuredVideo.title_en}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-7 h-7 text-white ml-1" fill="white" />
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {featuredVideo.is_rinon_original && (
                                    <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">🌟 RinON Original</span>
                                )}
                                <span className={`px-3 py-1 text-white text-xs font-medium rounded-full ${darkMode ? 'bg-white/20' : 'bg-black/30'}`}>
                                    {videoCategories.find(c => c.id === featuredVideo.category)?.icon}{' '}
                                    {language === 'al'
                                        ? videoCategories.find(c => c.id === featuredVideo.category)?.labelAl
                                        : videoCategories.find(c => c.id === featuredVideo.category)?.labelEn}
                                </span>
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                                {language === 'al' ? featuredVideo.title_al : featuredVideo.title_en}
                            </h3>
                            <p className="text-gray-300 text-sm mb-3 line-clamp-2 max-w-2xl">
                                {language === 'al' ? featuredVideo.description_al : featuredVideo.description_en}
                            </p>
                            <div className="flex items-center gap-4 text-gray-400 text-sm">
                                <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{featuredVideo.duration || '0:00'}</span>
                                <span className="flex items-center gap-1"><Eye className="w-4 h-4" />{formatViews(featuredVideo.view_count)} {t('shikime', 'views')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                {videoCategories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setVideoCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${videoCategory === cat.id
                            ? 'bg-amber-500 text-white'
                            : darkMode
                                ? 'bg-[#3D3A36] text-gray-300 hover:bg-[#4D4A46]'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span className="font-medium">{language === 'al' ? cat.labelAl : cat.labelEn}</span>
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {videoCategory === 'all'
                        ? t('Të Gjitha Videot', 'All Videos')
                        : `${videoCategories.find(c => c.id === videoCategory)?.icon} ${language === 'al'
                            ? videoCategories.find(c => c.id === videoCategory)?.labelAl
                            : videoCategories.find(c => c.id === videoCategory)?.labelEn}`
                    }
                </h3>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{filteredVideos.length} video</span>
            </div>

            {filteredVideos.length === 0 ? (
                <div className={`text-center py-16 rounded-2xl ${darkMode ? 'bg-[#3D3A36]' : 'bg-gray-50'}`}>
                    <Play className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('Asnjë video në këtë kategori ende 🎬', 'No videos in this category yet 🎬')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredVideos.map(video => (
                        <div
                            key={video.id}
                            className={`rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${darkMode ? 'bg-[#3D3A36] hover:bg-[#4D4A46]' : 'bg-white hover:bg-gray-50 border border-gray-200'}`}
                            onClick={() => openVideo(video)}
                        >
                            <div className="relative aspect-video">
                                <img
                                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/maxresdefault.jpg`}
                                    alt={language === 'al' ? video.title_al : video.title_en}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`; }}
                                />
                                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
                                    {video.duration || '0:00'}
                                </div>
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center">
                                        <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
                                    </div>
                                </div>
                                {video.is_rinon_original && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500 text-white text-[10px] font-medium rounded-full">🌟 RinON</div>
                                )}
                                {userProfile?.is_admin && showAdmin && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteVideo(video.id); }}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                            <div className="p-4">
                                <h4 className={`font-semibold mb-1 line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {language === 'al' ? video.title_al : video.title_en}
                                </h4>
                                <div className="flex items-center justify-between mt-3">
                                    <div className={`flex items-center gap-3 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{formatViews(video.view_count)}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleSaveVideo(video.id); }}
                                            className={`p-1.5 rounded-full transition-colors ${savedVideos.includes(video.id) ? 'text-amber-500 bg-amber-500/20' : darkMode ? 'text-gray-500 hover:text-amber-400' : 'text-gray-400 hover:text-amber-500'}`}
                                        >
                                            <Bookmark className="w-4 h-4" fill={savedVideos.includes(video.id) ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const title = language === 'al' ? video.title_al : video.title_en;
                                                const shareText = `🎬 ${title}\n\nShiko në RinON!`;
                                                if (navigator.share) {
                                                    navigator.share({ title: 'RinON', text: shareText, url: 'https://rinon.al/shiko' });
                                                } else {
                                                    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                                                }
                                            }}
                                            className={`p-1.5 rounded-full transition-colors ${darkMode ? 'text-gray-500 hover:text-amber-400' : 'text-gray-400 hover:text-amber-500'}`}
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {savedVideos.length > 0 && (
                <div className="mt-12">
                    <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Bookmark className="w-5 h-5 text-amber-500" fill="currentColor" />
                        {t('Të Ruajtura', 'Saved')} ({savedVideos.length})
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                        {videos.filter(v => savedVideos.includes(v.id)).map(video => (
                            <div
                                key={video.id}
                                className={`flex-shrink-0 w-64 rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-105 ${darkMode ? 'bg-[#3D3A36]' : 'bg-white border border-gray-200'}`}
                                onClick={() => openVideo(video)}
                            >
                                <div className="relative aspect-video">
                                    <img
                                        src={video.thumbnail || `https://img.youtube.com/vi/${video.youtube_id}/hqdefault.jpg`}
                                        alt={language === 'al' ? video.title_al : video.title_en}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-white text-xs rounded">{video.duration || '0:00'}</div>
                                </div>
                                <div className="p-3">
                                    <h4 className={`font-medium text-sm line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {language === 'al' ? video.title_al : video.title_en}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ShikoPage;
