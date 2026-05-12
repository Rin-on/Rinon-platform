import React from 'react';
import { X, Eye, Clock, Bookmark, Share2 } from 'lucide-react';

const VideoModal = ({
    showVideoModal,
    selectedVideo,
    closeVideo,
    darkMode,
    t,
    language,
    savedVideos,
    toggleSaveVideo,
}) => {
    if (!showVideoModal || !selectedVideo) return null;

    return (
        <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) closeVideo();
            }}
        >
            <div className={`w-full max-w-5xl rounded-2xl overflow-hidden ${darkMode ? 'bg-[#2D2A26]' : 'bg-white'}`}>
                <div className="relative aspect-video bg-black">
                    <iframe
                        src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?autoplay=1&rel=0`}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        title={`RinON Video: ${selectedVideo.title_al || selectedVideo.title_en || 'Video'}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    <button
                        onClick={closeVideo}
                        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                        {selectedVideo.is_rinon_original && (
                            <span className="px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                                🌟 RinON Original
                            </span>
                        )}
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${darkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {selectedVideo.category === 'podcast' && '🎙️ Podcast'}
                            {selectedVideo.category === 'events' && '📹 Evente'}
                            {selectedVideo.category === 'interviews' && '🎤 Intervista'}
                            {selectedVideo.category === 'external' && '🌍 Të Jashtme'}
                        </span>
                    </div>

                    <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'al' ? selectedVideo.title_al : selectedVideo.title_en}
                    </h2>

                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {language === 'al' ? selectedVideo.description_al : selectedVideo.description_en}
                    </p>

                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            <span className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {selectedVideo.view_count || 0} {t('shikime', 'views')}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {selectedVideo.duration || '0:00'}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => toggleSaveVideo(selectedVideo.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${savedVideos.includes(selectedVideo.id)
                                    ? 'bg-amber-500 text-white'
                                    : darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Bookmark className="w-5 h-5" fill={savedVideos.includes(selectedVideo.id) ? 'currentColor' : 'none'} />
                                {savedVideos.includes(selectedVideo.id) ? t('Ruajtur', 'Saved') : t('Ruaj', 'Save')}
                            </button>
                            <button
                                onClick={() => {
                                    const title = language === 'al' ? selectedVideo.title_al : selectedVideo.title_en;
                                    const shareText = `🎬 ${title}\n\nShiko në RinON!`;
                                    if (navigator.share) {
                                        navigator.share({ title: 'RinON', text: shareText, url: 'https://rinon.al/shiko' });
                                    } else {
                                        window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                                    }
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <Share2 className="w-5 h-5" />
                                {t('Shpërndaj', 'Share')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoModal;
