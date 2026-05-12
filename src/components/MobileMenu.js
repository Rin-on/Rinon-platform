import React from 'react';
import { X, Globe, Sun, Moon, Bookmark } from 'lucide-react';

const MobileMenu = ({
    mobileMenuOpen,
    setMobileMenuOpen,
    darkMode,
    t,
    language,
    setLanguage,
    setDarkMode,
    currentPage,
    changePage,
    user,
    userProfile,
    savedArticles,
    savedEvents,
    setShowUserActivity,
    setShowAuthModal,
    setAuthMode,
    handleLogout,
}) => {
    if (!mobileMenuOpen) return null;
    return (
        <div className="md:hidden fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)}>
            <div className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm`} />

            <div
                className={`absolute top-0 right-0 h-full w-72 flex flex-col transition-transform duration-300 ease-out ${darkMode ? 'bg-[#1a1918]' : 'bg-[#FEFDFB]'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 flex-shrink-0">
                    <span className={`text-sm font-light tracking-widest uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Menu
                    </span>
                    <button
                        onClick={() => setMobileMenuOpen(false)}
                        className={`p-2 -mr-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}
                    >
                        <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <nav className="px-6 py-2">
                        <div className="space-y-1">
                            {[
                                { page: 'home', label: t('Home', 'Home') },
                                { page: 'lajme', label: "N'gazeta" },
                                { page: 'events', label: t('Evente', 'Events') },
                                { page: 'letra', label: t('Letra', 'Letters') },
                                { page: 'partners', label: t('Bashkëpunime', 'Partners') },
                                { page: 'about', label: t('Rreth Nesh', 'About') },
                            ].map(({ page, label }) => (
                                <button
                                    key={page}
                                    onClick={() => { changePage(page); setMobileMenuOpen(false); }}
                                    className={`block w-full text-left py-3 text-lg transition-colors ${currentPage === page
                                        ? 'text-amber-500 font-medium'
                                        : darkMode
                                            ? 'text-gray-300 hover:text-white'
                                            : 'text-gray-600 hover:text-gray-900'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </nav>

                    {user && (
                        <div className="px-6 py-2">
                            <button
                                onClick={() => { setShowUserActivity(true); setMobileMenuOpen(false); }}
                                className={`w-full flex items-center gap-3 py-3 text-left transition-colors ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
                            >
                                <Bookmark className="w-5 h-5" />
                                <span className="text-lg">{t('Të ruajturat', 'Saved Items')}</span>
                                {(savedArticles.length + savedEvents.length) > 0 && (
                                    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                        {savedArticles.length + savedEvents.length}
                                    </span>
                                )}
                            </button>
                        </div>
                    )}

                    <div className={`mx-6 my-2 border-t ${darkMode ? 'border-white/10' : 'border-black/5'}`} />

                    <div className="px-6 py-4">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setLanguage(language === 'al' ? 'en' : 'al')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors ${darkMode
                                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                    : 'bg-black/5 hover:bg-black/10 text-gray-600'
                                    }`}
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm">{language === 'al' ? 'EN' : 'AL'}</span>
                            </button>
                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors ${darkMode
                                    ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                    : 'bg-black/5 hover:bg-black/10 text-gray-600'
                                    }`}
                            >
                                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                <span className="text-sm">{darkMode ? t('Dritë', 'Light') : t('Errët', 'Dark')}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`p-6 flex-shrink-0 border-t ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
                    {user ? (
                        <div className="space-y-3">
                            <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-medium">
                                        {userProfile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {userProfile?.display_name || 'User'}
                                    </p>
                                    <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {user.email}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                className={`w-full py-2.5 text-sm font-medium rounded-xl transition-colors ${darkMode
                                    ? 'text-red-400 hover:bg-red-500/10'
                                    : 'text-red-500 hover:bg-red-50'
                                    }`}
                            >
                                {t('Dil nga llogaria', 'Sign out')}
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => { setShowAuthModal(true); setAuthMode('login'); setMobileMenuOpen(false); }}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
                        >
                            {t('Hyr në llogari', 'Sign in')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MobileMenu;
