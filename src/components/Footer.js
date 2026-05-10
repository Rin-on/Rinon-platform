import React from 'react';
import { Instagram, Heart } from 'lucide-react';

const Footer = ({ t, changePage, userProfile, showAdmin, setShowAdmin }) => (
    <footer className="relative py-16 pb-28 md:pb-16 overflow-hidden">
        {/* Tirana Background Image */}
        <div
            className="absolute inset-0"
            style={{
                backgroundImage: 'url(https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/Screenshot%202026-01-14%20180656.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 60%',
                filter: 'brightness(0.4) saturate(0.9)'
            }}
        ></div>
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(41, 37, 36, 0.7) 0%, rgba(41, 37, 36, 0.6) 50%, rgba(41, 37, 36, 0.85) 100%)' }}></div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
            {/* Logo and tagline centered */}
            <div className="text-center mb-12">
                <h3 className="text-3xl font-bold mb-3">
                    <span className="text-white">Rin</span>
                    <span className="text-[#EAB308]">ON</span>
                </h3>
                <p className="text-white/60 text-sm">
                    {t('Platforma dixhitale për rininë shqiptare', 'Digital platform for Albanian youth')}
                </p>
            </div>

            {/* Links row */}
            <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
                <button onClick={() => changePage('lajme')} className="text-white/60 hover:text-[#EAB308] transition-colors text-sm font-medium">
                    N'gazeta
                </button>
                <button onClick={() => changePage('events')} className="text-white/60 hover:text-[#EAB308] transition-colors text-sm font-medium">
                    {t('Evente', 'Events')}
                </button>
                <button onClick={() => changePage('letra')} className="text-white/60 hover:text-[#EAB308] transition-colors text-sm font-medium">
                    {t('Letra', 'Letters')}
                </button>
                <button onClick={() => changePage('partners')} className="text-white/60 hover:text-[#EAB308] transition-colors text-sm font-medium">
                    {t('Bashkëpunime', 'Cooperations')}
                </button>
                <button onClick={() => changePage('about')} className="text-white/60 hover:text-[#EAB308] transition-colors text-sm font-medium">
                    {t('Rreth Nesh', 'About')}
                </button>
            </div>

            {/* Social + Contact */}
            <div className="flex flex-col items-center gap-6 mb-10">
                <div className="flex gap-4">
                    <a
                        href="https://instagram.com/rinon_albania"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-11 h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white hover:bg-[#EAB308] hover:border-[#EAB308] hover:text-[#292524] transition-all hover:-translate-y-1"
                    >
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>
                <a
                    href="mailto:rinonalbania@gmail.com"
                    className="text-white/50 text-sm hover:text-[#EAB308] transition-colors"
                >
                    rinonalbania@gmail.com
                </a>
            </div>

            {/* Volunteer CTA */}
            <div className="text-center mb-10">
                <p className="text-white/60 text-sm mb-4">
                    {t('Bashkohu me ne dhe kontribuo për një të ardhme më të mirë!', 'Join us and contribute to a better future!')}
                </p>
                <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSd2J3S01v9PhZyQgSLNLmZ5YnDUbQePlta_LXx1D13VLB644A/viewform?usp=dialog"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#EAB308] hover:bg-[#CA8A04] text-[#292524] px-6 py-3 rounded-full text-sm font-bold transition-all hover:scale-105"
                >
                    <Heart className="w-4 h-4" />
                    {t('Behu Vullnetar', 'Become a Volunteer')}
                </a>
            </div>

            {/* Copyright */}
            <div className="border-t border-white/10 pt-8 text-center">
                <p className="text-white/40 text-xs">
                    © 2026 RinON. {t('Të gjitha të drejtat e rezervuara.', 'All rights reserved.')}
                </p>
                {userProfile?.is_admin && (
                    <button
                        onClick={() => setShowAdmin(!showAdmin)}
                        className="mt-4 text-white/30 hover:text-[#EAB308] transition-colors text-xs"
                    >
                        {showAdmin ? t('Fsheh Admin', 'Hide Admin') : t('Trego Admin', 'Show Admin')}
                    </button>
                )}
            </div>
        </div>
    </footer>
);

export default Footer;
