import React from 'react';
import { X, ExternalLink, Clock, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import { getCategoryColor, formatDateAl } from '../utils/helpers';

const ArticleModal = ({ selectedArticle, setShowArticleModal, language, darkMode, t, savedArticles, toggleSaveArticle, setShareItem, setShowShareModal }) => {
    if (!selectedArticle) return null;
    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowArticleModal(false);
                    window.history.pushState({}, '', '/');
                }
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
        >
            <div
                className="bg-[#2D2A26] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                onTouchEnd={(e) => e.stopPropagation()}
            >
                {/* Hero Image */}
                <div className="relative h-80">
                    <img
                        src={selectedArticle.image}
                        alt={selectedArticle.titleAl}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-transparent to-transparent" />
                    <button
                        onClick={() => {
                            setShowArticleModal(false);
                            window.history.pushState({}, '', '/');
                        }}
                        className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-all"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>
                </div>

                {/* Article Content */}
                <div className="px-5 md:px-8 pt-6 pb-10">
                    {/* Category badge */}
                    {selectedArticle.category && (
                        <span className={`inline-block text-xs px-3 py-1 rounded-full font-semibold text-white mb-3 ${getCategoryColor(selectedArticle.category)}`}>
                            {selectedArticle.category}
                        </span>
                    )}

                    {/* Title */}
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                        {language === 'al' ? selectedArticle.titleAl : selectedArticle.titleEn}
                    </h2>

                    {/* Author / Date / Source row */}
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {selectedArticle.author && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">{selectedArticle.author.charAt(0).toUpperCase()}</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{t('Nga', 'By')}</p>
                                    <p className="text-sm text-amber-400 font-medium">{selectedArticle.author}</p>
                                </div>
                            </div>
                        )}
                        {selectedArticle.source && (
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">{t('Burimi', 'Source')}</p>
                                    <p className="text-sm text-gray-300">{selectedArticle.source}</p>
                                </div>
                            </div>
                        )}
                        {selectedArticle.date && (
                            <div className="flex items-center gap-2 ml-auto">
                                <Clock className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-400">{formatDateAl(selectedArticle.date)}</span>
                            </div>
                        )}
                    </div>

                    {/* Save / Share toolbar */}
                    <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                        <button
                            onClick={() => toggleSaveArticle(selectedArticle.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${savedArticles.includes(selectedArticle.id) ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            {savedArticles.includes(selectedArticle.id) ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                            {savedArticles.includes(selectedArticle.id) ? t('Ruajtur', 'Saved') : t('Ruaj', 'Save')}
                        </button>
                        <button
                            onClick={() => { setShareItem({ item: selectedArticle, type: 'article' }); setShowShareModal(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                        >
                            <Share2 className="w-4 h-4" />
                            {t('Ndaj', 'Share')}
                        </button>
                    </div>

                    {/* Article body */}
                    <div className="text-base md:text-lg text-gray-200 leading-loose whitespace-pre-line">
                        {language === 'al' ? selectedArticle.contentAl : selectedArticle.contentEn}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;
