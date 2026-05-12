import React from 'react';
import { Send, Copy, Instagram } from 'lucide-react';

const NativeShareModal = ({ showNativeShare, setShowNativeShare, nativeShareItem, darkMode, t, userProfile, openShareModal }) => {
    if (!showNativeShare || !nativeShareItem) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowNativeShare(false)}>
            <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-black/50'}`} />
            <div
                className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden ${darkMode ? 'bg-[#1a1918]' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-center pt-3 pb-1">
                    <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
                </div>
                <div className="p-5 pt-2 text-center">
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('Shpërndaj', 'Share')}
                    </h3>
                    <p className={`text-sm mt-1 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {nativeShareItem.title}
                    </p>
                </div>

                <div className="px-5 pb-4">
                    <div className="grid grid-cols-4 gap-4">
                        {/* WhatsApp */}
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(nativeShareItem.title + ' ' + nativeShareItem.url)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center">
                                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>WhatsApp</span>
                        </a>

                        {/* Telegram */}
                        <a
                            href={`https://t.me/share/url?url=${encodeURIComponent(nativeShareItem.url)}&text=${encodeURIComponent(nativeShareItem.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center">
                                <Send className="w-6 h-6 text-white" />
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Telegram</span>
                        </a>

                        {/* Twitter/X */}
                        <a
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(nativeShareItem.title)}&url=${encodeURIComponent(nativeShareItem.url)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-2"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center">
                                <span className="text-white font-bold text-xl">𝕏</span>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>X</span>
                        </a>

                        {/* Copy Link */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(nativeShareItem.url);
                                alert(t('Linku u kopjua!', 'Link copied!'));
                            }}
                            className="flex flex-col items-center gap-2"
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/10' : 'bg-gray-100'}`}>
                                <Copy className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Kopjo', 'Copy')}</span>
                        </button>
                    </div>
                </div>

                {/* Instagram Share - Admin Only */}
                {userProfile?.is_admin && (
                    <>
                        <div className={`mx-5 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`} />
                        <div className="p-5">
                            <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {t('Vetëm për Admin - Shpërndaj në Instagram', 'Admin Only - Share to Instagram')}
                            </p>
                            <button
                                onClick={() => openShareModal(nativeShareItem.item, nativeShareItem.type)}
                                className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
                            >
                                <Instagram className="w-5 h-5" />
                                {t('Krijo Post për Instagram', 'Create Instagram Post')}
                            </button>
                        </div>
                    </>
                )}

                <div className="p-5 pt-0">
                    <button
                        onClick={() => setShowNativeShare(false)}
                        className={`w-full py-3 rounded-xl font-medium ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                    >
                        {t('Anulo', 'Cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NativeShareModal;
