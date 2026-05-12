import React from 'react';
import { Plus, Edit, Heart, Globe, Sun, Moon } from 'lucide-react';

const FAB = ({ darkMode, t, language, setLanguage, setDarkMode, changePage, fabOpen, setFabOpen }) => (
    <div className="md:hidden fixed bottom-24 right-4 z-50">
        {/* FAB Menu Items */}
        <div className={`absolute bottom-14 right-0 flex flex-col gap-2 transition-all duration-300 ${fabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
            <a
                href="mailto:rinon@example.com?subject=Propozim%20Artikulli&body=P%C3%ABrsh%C3%ABndetje,%0A%0AKam%20nj%C3%AB%20ide%20p%C3%ABr%20nj%C3%AB%20artikull..."
                onClick={() => setFabOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode ? 'bg-[#3D3A36] text-white border border-[#fbbf24]/30 hover:bg-[#4D4A46]' : 'bg-white text-[#2D2A26] border border-yellow-200 hover:bg-yellow-50'}`}
            >
                <Edit className="w-4 h-4 text-[#fbbf24]" />
                <span className="text-sm font-medium">{t('Shkruaj Artikull', 'Write Article')}</span>
            </a>

            <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSd2J3S01v9PhZyQgSLNLmZ5YnDUbQePlta_LXx1D13VLB644A/viewform"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setFabOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode ? 'bg-[#3D3A36] text-white border border-[#fbbf24]/30 hover:bg-[#4D4A46]' : 'bg-white text-[#2D2A26] border border-yellow-200 hover:bg-yellow-50'}`}
            >
                <Heart className="w-4 h-4 text-[#fbbf24]" />
                <span className="text-sm font-medium">{t('Bëhu Vullnetar', 'Become Volunteer')}</span>
            </a>

            <button
                onClick={() => { setLanguage(language === 'al' ? 'en' : 'al'); setFabOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode ? 'bg-[#3D3A36] text-white border border-[#fbbf24]/30 hover:bg-[#4D4A46]' : 'bg-white text-[#2D2A26] border border-yellow-200 hover:bg-yellow-50'}`}
            >
                <Globe className="w-4 h-4 text-[#fbbf24]" />
                <span className="text-sm font-medium">{language === 'al' ? '🇬🇧 English' : '🇦🇱 Shqip'}</span>
            </button>

            <button
                onClick={() => { setDarkMode(!darkMode); setFabOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode ? 'bg-[#3D3A36] text-white border border-[#fbbf24]/30 hover:bg-[#4D4A46]' : 'bg-white text-[#2D2A26] border border-yellow-200 hover:bg-yellow-50'}`}
            >
                {darkMode ? <Sun className="w-4 h-4 text-[#fbbf24]" /> : <Moon className="w-4 h-4 text-[#fbbf24]" />}
                <span className="text-sm font-medium">{darkMode ? t('Dritë', 'Light') : t('Errët', 'Dark')}</span>
            </button>

            <button
                onClick={() => { changePage('about'); setFabOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode ? 'bg-[#3D3A36] text-white border border-[#fbbf24]/30 hover:bg-[#4D4A46]' : 'bg-white text-[#2D2A26] border border-yellow-200 hover:bg-yellow-50'}`}
            >
                <Heart className="w-4 h-4 text-[#fbbf24]" />
                <span className="text-sm font-medium">{t('Rreth Nesh', 'About Us')}</span>
            </button>
        </div>

        {/* FAB Button */}
        <button
            onClick={() => setFabOpen(!fabOpen)}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${fabOpen ? 'bg-[#FF6B6B] rotate-45' : 'bg-gradient-to-r from-[#fbbf24] to-orange-500'}`}
        >
            <Plus className="w-6 h-6 text-white" />
        </button>
    </div>
);

export default FAB;
