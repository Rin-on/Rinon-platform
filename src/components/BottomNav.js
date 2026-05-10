import React from 'react';
import { Home, Calendar, Newspaper, Feather, User } from 'lucide-react';

const BottomNav = ({ darkMode, currentPage, changePage, user, userProfile, setShowPreferences, setShowAuthModal, setAuthMode, isNativeApp }) => (
    <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t ${darkMode ? 'bg-[#1a1918] border-[#2D2A26]' : 'bg-white border-gray-100'}`}
        style={{ paddingBottom: isNativeApp ? 'env(safe-area-inset-bottom, 16px)' : '0px' }}
    >
        <div className={`flex items-center justify-around ${isNativeApp ? 'pt-2 pb-1' : 'py-2'}`}>
            {[
                { key: 'home', icon: Home, label: 'Home' },
                { key: 'events', icon: Calendar, label: 'Evente' },
                { key: 'lajme', icon: Newspaper, label: "N'gazeta" },
                { key: 'letra', icon: Feather, label: 'Letra' },
            ].map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.key;
                return (
                    <button
                        key={item.key}
                        onClick={() => changePage(item.key)}
                        className={`flex flex-col items-center min-w-[64px] py-1 ${isActive ? 'text-amber-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                    >
                        <Icon className="w-5 h-5" strokeWidth={isActive ? 2 : 1.5} />
                        <span className={`text-[10px] mt-1 ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                    </button>
                );
            })}
            <button
                onClick={() => user ? setShowPreferences(true) : (setShowAuthModal(true), setAuthMode('login'))}
                className={`flex flex-col items-center min-w-[64px] py-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
            >
                {user ? (
                    <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                        <span className="text-white text-[9px] font-medium">
                            {userProfile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                        </span>
                    </div>
                ) : (
                    <User className="w-5 h-5" strokeWidth={1.5} />
                )}
                <span className="text-[10px] mt-1">{user ? 'Profil' : 'Hyr'}</span>
            </button>
        </div>
    </nav>
);

export default BottomNav;
