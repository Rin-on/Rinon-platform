import React from 'react';
import { X, Bookmark, BookmarkCheck, Calendar, MapPin } from 'lucide-react';

const UserActivityModal = ({
    showUserActivity,
    setShowUserActivity,
    darkMode,
    t,
    language,
    userActivityTab,
    setUserActivityTab,
    savedArticles,
    savedEvents,
    getSavedArticlesData,
    getSavedEventsData,
    openArticle,
    toggleSaveArticle,
    toggleSaveEvent,
}) => {
    if (!showUserActivity) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowUserActivity(false)}>
            <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`} />
            <div
                className={`relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl ${darkMode ? 'bg-[#1a1918]' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('Të Ruajturat e Mia', 'My Saved Items')}
                    </h2>
                    <button
                        onClick={() => setShowUserActivity(false)}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                </div>

                <div className={`flex border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                    <button
                        onClick={() => setUserActivityTab('saved')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${userActivityTab === 'saved'
                            ? 'text-amber-500 border-b-2 border-amber-500'
                            : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                        {t('Artikuj', 'Articles')} ({savedArticles.length})
                    </button>
                    <button
                        onClick={() => setUserActivityTab('events')}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${userActivityTab === 'events'
                            ? 'text-amber-500 border-b-2 border-amber-500'
                            : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                    >
                        {t('Evente', 'Events')} ({savedEvents.length})
                    </button>
                </div>

                <div className="overflow-y-auto max-h-[50vh] p-4">
                    {userActivityTab === 'saved' ? (
                        getSavedArticlesData().length > 0 ? (
                            <div className="space-y-3">
                                {getSavedArticlesData().map(article => (
                                    <div
                                        key={article.id}
                                        className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                                        onClick={() => { openArticle(article); setShowUserActivity(false); }}
                                    >
                                        <img src={article.image} alt={article.titleAl} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium text-sm line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {language === 'al' ? article.titleAl : article.titleEn}
                                            </h4>
                                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {article.category}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleSaveArticle(article.id); }}
                                            className="p-2 text-amber-500"
                                        >
                                            <BookmarkCheck className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Bookmark className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {t('Nuk ke artikuj të ruajtur', 'No saved articles yet')}
                                </p>
                            </div>
                        )
                    ) : (
                        getSavedEventsData().length > 0 ? (
                            <div className="space-y-3">
                                {getSavedEventsData().map(event => (
                                    <div
                                        key={event.id}
                                        className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'}`}
                                    >
                                        <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                                            <Calendar className="w-5 h-5 text-amber-500" />
                                            <span className={`text-xs font-medium mt-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                                {event.date?.slice(5, 10)}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium text-sm line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {language === 'al' ? event.titleAl : event.titleEn}
                                            </h4>
                                            <p className={`text-xs mt-1 flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                <MapPin className="w-3 h-3" />
                                                {event.location}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }}
                                            className="p-2 text-amber-500"
                                        >
                                            <BookmarkCheck className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Calendar className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {t('Nuk ke evente të ruajtura', 'No saved events yet')}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserActivityModal;
