import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { getCategoryColor, formatDateAl } from '../utils/helpers';

const NgazetaPage = ({ darkMode, t, language, ngazetaFilteredContent, openArticle, showAdmin, editArticle, deleteArticle }) => (
    <>
        {/* ==========================================
            N'GAZETA PAGE — clean unified article feed
           ========================================== */}
        {ngazetaFilteredContent.length === 0 ? (
            <p className="text-gray-400 py-20 text-center">{t('Nuk ka artikuj në këtë kategori.', 'No articles in this category.')}</p>
        ) : (
            <>
                {/* Mobile: single column / Desktop: two-column grid */}
                <div className="px-4 md:px-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 md:max-w-6xl md:mx-auto">
                    {ngazetaFilteredContent.map((article, index) => {
                        const isWide = index === 0 || index % 5 === 0;
                        return (
                            <div
                                key={article.id}
                                className={`group rounded-xl overflow-hidden shadow-sm cursor-pointer md:hover:scale-[1.02] md:hover:shadow-md transition-transform duration-300 ${isWide ? 'md:col-span-2' : ''}`}
                                onClick={() => openArticle(article)}
                            >
                                {/* Image section */}
                                <div className={`relative overflow-hidden h-44 ${isWide ? 'md:h-72' : 'md:h-52'}`}>
                                    <img
                                        src={article.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'}
                                        alt={language === 'al' ? article.titleAl : (article.titleEn || article.titleAl)}
                                        className="absolute inset-0 w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'; }}
                                    />
                                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.75) 100%)' }} />
                                    {article.category && (
                                        <span className={`absolute top-3 left-3 text-white text-xs px-3 py-1 rounded-full font-semibold ${getCategoryColor(article.category)}`}>
                                            {article.category}
                                        </span>
                                    )}
                                    {showAdmin && (
                                        <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                                            <button onClick={(e) => { e.stopPropagation(); editArticle(article); }} className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 shadow"><Edit className="h-3 w-3" /></button>
                                            <button onClick={(e) => { e.stopPropagation(); deleteArticle(article.id); }} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow"><Trash2 className="h-3 w-3" /></button>
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 right-3 z-10">
                                        <h3
                                            className={`font-bold text-white leading-tight line-clamp-2 ${isWide ? 'text-xl md:text-2xl' : 'text-lg md:text-xl'}`}
                                            style={{ fontFamily: "'Playfair Display', serif" }}
                                        >
                                            {language === 'al' ? article.titleAl : (article.titleEn || article.titleAl)}
                                        </h3>
                                    </div>
                                </div>
                                {/* Info bar */}
                                <div className={`flex justify-between items-center py-2 px-3 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                    <span className="text-xs text-gray-500">{formatDateAl(article.date)}</span>
                                    {article.author && (
                                        <span className={`text-xs font-medium ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{article.author}</span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Article count footer */}
                <p className="text-xs text-gray-400 text-center py-4">
                    {language === 'al' ? `Duke shfaqur ${ngazetaFilteredContent.length} artikuj` : `Showing ${ngazetaFilteredContent.length} articles`}
                </p>
            </>
        )}
    </>
);

export default NgazetaPage;
