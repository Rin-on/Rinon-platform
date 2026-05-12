import React from 'react';
import { Menu, X, Globe, Sun, Moon, Search, Shield } from 'lucide-react';

const Header = ({
    currentPage,
    darkMode,
    t,
    changePage,
    language,
    setLanguage,
    setDarkMode,
    showAdmin,
    setShowAdmin,
    userProfile,
    user,
    setShowPreferences,
    setShowAuthModal,
    setAuthMode,
    mobileMenuOpen,
    setMobileMenuOpen,
    showSearchBar,
    setShowSearchBar,
}) => (
    <header className={`border-b sticky top-0 z-50 ${darkMode ? 'bg-[#2D2A26] border-[#3D3A36]' : 'bg-[#FFFBF7] border-gray-100'}`}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => changePage('home')}>
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308] to-[#0D9488] rounded-full opacity-30 blur-md animate-pulse"></div>
                        <div className="relative w-12 h-12 rounded-full bg-white border-2 border-[#EAB308] flex items-center justify-center shadow-md overflow-hidden">
                            <img
                                src="https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/rinon%20switch%20button.jpeg"
                                alt="RinON"
                                className="h-9 w-9 object-contain rounded-full"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden h-full w-full bg-[#134E4A] items-center justify-center">
                                <span className="text-white font-bold text-sm">R</span>
                            </div>
                        </div>
                    </div>
                    <span className={`font-bold hidden sm:block text-lg ${darkMode ? 'text-white' : 'text-[#292524]'}`}>
                        Rin<span className="text-[#EAB308]">ON</span>
                    </span>
                </div>

                <nav className="hidden md:flex items-center gap-1">
                    {[
                        { key: 'home', label: t('Home', 'Home') },
                        { key: 'lajme', label: "N'gazeta" },
                        { key: 'events', label: t('Evente', 'Events') },
                        { key: 'letra', label: t('Letra', 'Letters') },
                        { key: 'partners', label: t('Bashkëpunime', 'Partners') },
                        { key: 'about', label: t('Rreth Nesh', 'About') },
                    ].map(item => (
                        <button
                            key={item.key}
                            onClick={() => changePage(item.key)}
                            className={`px-3 py-1.5 text-sm rounded transition-colors ${currentPage === item.key
                                ? darkMode ? 'text-[#EAB308] bg-[#EAB308]/10' : 'text-[#292524] bg-gray-100'
                                : darkMode ? 'text-gray-400 hover:text-[#EAB308]' : 'text-gray-500 hover:text-[#292524]'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="flex items-center gap-2">
                {/* Admin Toggle - Desktop */}
                {userProfile?.is_admin && (
                    <button
                        onClick={() => setShowAdmin(!showAdmin)}
                        className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${showAdmin
                            ? 'bg-amber-500 text-white'
                            : darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                    >
                        <Shield className="w-4 h-4" />
                        <span>Admin</span>
                    </button>
                )}

                {/* Language Toggle - Desktop */}
                <button
                    onClick={() => setLanguage(language === 'al' ? 'en' : 'al')}
                    className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded text-sm transition-colors ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    <Globe className="w-4 h-4" />
                    <span>{language.toUpperCase()}</span>
                </button>

                {/* Dark Mode Toggle - Desktop */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`hidden md:flex p-2 rounded transition-colors ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'
                        }`}
                >
                    {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                {/* Search - desktop */}
                <button
                    onClick={() => setShowSearchBar(!showSearchBar)}
                    className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${darkMode
                        ? 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Search className="w-4 h-4" />
                </button>

                {/* Mobile icons */}
                <div className="flex md:hidden items-center gap-1">
                    <button
                        onClick={() => setShowSearchBar(!showSearchBar)}
                        className={`p-2 rounded ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Auth */}
                {user ? (
                    <button
                        onClick={() => setShowPreferences(true)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${darkMode ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-700'
                            }`}
                    >
                        {userProfile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                    </button>
                ) : (
                    <button
                        onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                        className={`text-sm font-semibold px-4 py-2 rounded-full border-2 transition-all ${darkMode ? 'text-white border-white hover:bg-white hover:text-[#292524]' : 'text-[#292524] border-[#292524] hover:bg-[#292524] hover:text-white'}`}
                    >
                        {t('Hyr', 'Login')}
                    </button>
                )}

                {/* Hamburger Menu - Mobile */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className={`md:hidden p-2 rounded ${darkMode ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                    {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
            <div className={`md:hidden border-t ${darkMode ? 'border-[#3D3A36] bg-[#2D2A26]' : 'border-gray-100 bg-white'}`}>
                <div className="px-4 py-3 space-y-1">
                    {[
                        { key: 'home', label: t('Home', 'Home') },
                        { key: 'lajme', label: "N'gazeta" },
                        { key: 'events', label: t('Evente', 'Events') },
                        { key: 'letra', label: t('Letra', 'Letters') },
                        { key: 'partners', label: t('Bashkëpunime', 'Partners') },
                        { key: 'about', label: t('Rreth Nesh', 'About') },
                    ].map(item => (
                        <button
                            key={item.key}
                            onClick={() => { changePage(item.key); setMobileMenuOpen(false); }}
                            className={`block w-full text-left px-3 py-2 rounded text-sm ${currentPage === item.key
                                ? darkMode ? 'text-white bg-white/10' : 'text-gray-900 bg-gray-100'
                                : darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}
                        >
                            {item.label}
                        </button>
                    ))}
                    <div className={`flex items-center gap-4 pt-3 mt-2 border-t ${darkMode ? 'border-[#3D3A36]' : 'border-gray-100'}`}>
                        <button
                            onClick={() => setLanguage(language === 'al' ? 'en' : 'al')}
                            className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            {language === 'al' ? 'English' : 'Shqip'}
                        </button>
                        <button
                            onClick={() => setDarkMode(!darkMode)}
                            className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            {darkMode ? t('Light', 'Light') : t('Dark', 'Dark')}
                        </button>
                        {userProfile?.is_admin && (
                            <button
                                onClick={() => setShowAdmin(!showAdmin)}
                                className={`text-sm flex items-center gap-1 ${showAdmin ? 'text-amber-500' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                            >
                                <Shield className="w-4 h-4" />
                                Admin
                            </button>
                        )}
                    </div>
                </div>
            </div>
        )}
    </header>
);

export default Header;
