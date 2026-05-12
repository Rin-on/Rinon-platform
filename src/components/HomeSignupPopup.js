import React from 'react';
import { Star, Bookmark, Users } from 'lucide-react';

const HomeSignupPopup = ({ showHomeSignupPopup, setShowHomeSignupPopup, darkMode, t, setAuthMode, setShowAuthModal }) => {
    if (!showHomeSignupPopup) return null;
    return (
        <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && setShowHomeSignupPopup(false)}
        >
            <div className={`w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden animate-slideUp ${darkMode ? 'bg-[#2D2A26]' : 'bg-[#FFFBF7]'}`}>
                <div className="flex justify-center pt-3 pb-2 sm:hidden">
                    <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-gray-600' : 'bg-gray-300'}`}></div>
                </div>

                <div className="px-6 pt-4 pb-6 text-center">
                    <div className="flex justify-center gap-1 mb-4">
                        <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#0D9488]"></div>
                        <div className="w-3 h-3 rounded-full bg-[#FBBF24]"></div>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#1F2937]'}`}>
                        {t('Hej! 👋', 'Hey! 👋')}
                    </h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-[#1F2937]/60'}`}>
                        {t('Krijo llogari për të mos humbur mundësi të reja', 'Create an account to not miss new opportunities')}
                    </p>
                </div>

                <div className={`mx-6 p-4 rounded-2xl mb-6 ${darkMode ? 'bg-[#3D3A36]' : 'bg-white'}`}>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                            <Star className="w-5 h-5 text-[#F97316]" />
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#1F2937]'}`}>
                            {t('Zbulo evente & mundësi të reja', 'Discover new events & opportunities')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
                            <Bookmark className="w-5 h-5 text-[#0D9488]" />
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#1F2937]'}`}>
                            {t('Ruaj dhe organizo gjërat e tua', 'Save and organize your stuff')}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-[#FBBF24]" />
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-[#1F2937]'}`}>
                            {t('Bashkohu me komunitetin', 'Join the community')}
                        </p>
                    </div>
                </div>

                <div className="px-6 pb-6 space-y-3">
                    <button
                        onClick={() => {
                            setShowHomeSignupPopup(false);
                            setAuthMode('register');
                            setShowAuthModal(true);
                        }}
                        className="w-full py-4 bg-[#F97316] text-white rounded-xl font-semibold hover:bg-[#EA580C] transition-all"
                    >
                        {t('Regjistrohu — është falas', "Sign up — it's free")}
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setShowHomeSignupPopup(false);
                                setAuthMode('login');
                                setShowAuthModal(true);
                            }}
                            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${darkMode ? 'text-gray-300 hover:bg-white/10' : 'text-[#1F2937] hover:bg-black/5'}`}
                        >
                            {t('Hyr', 'Log in')}
                        </button>
                        <button
                            onClick={() => setShowHomeSignupPopup(false)}
                            className={`flex-1 py-3 rounded-xl font-medium transition-colors ${darkMode ? 'text-gray-500 hover:bg-white/10' : 'text-[#1F2937]/40 hover:bg-black/5'}`}
                        >
                            {t('Më vonë', 'Later')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSignupPopup;
