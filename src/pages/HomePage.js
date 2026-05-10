import React from 'react';
import { Edit, Trash2, TrendingUp, Calendar, MapPin, ChevronRight, Instagram, ArrowRight, Newspaper, GraduationCap, Palette, MessageSquare, Users, Globe as GlobeIcon } from 'lucide-react';
import { HomeFadeSection, ScrollHint } from '../components/HomeFadeSection';
import { getCategoryColor, formatDateAl } from '../utils/helpers';

const categories = [
    { al: 'Aktualitet', en: 'Current Affairs', icon: Newspaper },
    { al: 'Arsim & Karrierë', en: 'Education & Career', icon: GraduationCap },
    { al: 'Kulturë', en: 'Culture', icon: Palette },
    { al: 'Opinione', en: 'Opinions', icon: MessageSquare },
    { al: 'Shoqëri', en: 'Society', icon: Users },
    { al: 'Rreth Europës', en: 'About Europe', icon: GlobeIcon },
];

const HomePage = ({ darkMode, language, t, articles, otherEvents, letters, partners, showAdmin, editArticle, deleteArticle, openArticle, changePage, setSelectedCategoryFilter }) => (
    <>
        {/* ==========================================
            SECTION 1: Hero Article — full-width, above the fold
           ========================================== */}
        {(() => {
            const heroArticle = articles.find(a => a.is_head_article) || articles[0];
            if (!heroArticle) return null;
            return (
                <HomeFadeSection>
                    <div
                        className="group relative cursor-pointer overflow-hidden md:h-[55vh]"
                        style={{ height: '60vh', minHeight: '300px' }}
                        onClick={() => openArticle(heroArticle)}
                    >
                        <img
                            src={heroArticle.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200'}
                            alt={language === 'al' ? heroArticle.titleAl : (heroArticle.titleEn || heroArticle.titleAl)}
                            className="absolute inset-0 w-full h-full object-cover hero-zoom group-hover:scale-[1.02] transition-transform duration-500"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200'; }}
                        />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75) 100%)' }} />
                        {heroArticle.category && (
                            <div className="absolute top-4 left-4 z-10">
                                <span className="bg-amber-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                                    {heroArticle.category}
                                </span>
                            </div>
                        )}
                        {showAdmin && (
                            <div className="absolute top-4 right-4 z-10 flex gap-2">
                                <button onClick={(e) => { e.stopPropagation(); editArticle(heroArticle); }} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 shadow-lg"><Edit className="h-4 w-4" /></button>
                                <button onClick={(e) => { e.stopPropagation(); deleteArticle(heroArticle.id); }} className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-10">
                            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight line-clamp-2 mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                {language === 'al' ? heroArticle.titleAl : (heroArticle.titleEn || heroArticle.titleAl)}
                            </h1>
                            <div className="flex items-center justify-between">
                                <p className="text-sm text-gray-300">
                                    {heroArticle.author && <span>{t('Nga', 'By')} {heroArticle.author} · </span>}
                                    {formatDateAl(heroArticle.date)}
                                </p>
                                <span className="hidden md:inline-flex items-center gap-1 text-sm text-white opacity-80 group-hover:opacity-100 transition-opacity font-medium">
                                    {t('Lexo artikullin', 'Read article')} <ArrowRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    </div>
                </HomeFadeSection>
            );
        })()}

        {/* ==========================================
            SECTION 2: Latest Articles — horizontal scrollable carousel
           ========================================== */}
        {(() => {
            const heroId = (articles.find(a => a.is_head_article) || articles[0])?.id;
            const latestSix = articles.filter(a => a.id !== heroId).slice(0, 6);
            if (latestSix.length === 0) return null;
            return (
                <HomeFadeSection className="mt-1">
                    <div className="flex items-center gap-2 px-4 mt-6 mb-3">
                        <TrendingUp className="w-4 h-4 text-amber-500" />
                        <p className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {t('Më të fundit', 'Latest')}
                        </p>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-3 px-4 scrollbar-hide snap-x snap-mandatory">
                        {latestSix.map(article => (
                            <div
                                key={article.id}
                                className="relative rounded-xl overflow-hidden shadow-sm cursor-pointer flex-shrink-0 snap-start"
                                style={{ width: '72vw', maxWidth: '260px', height: '180px' }}
                                onClick={() => openArticle(article)}
                            >
                                <img
                                    src={article.image || 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'}
                                    alt={article.titleAl}
                                    className="absolute inset-0 w-full h-full object-cover"
                                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'; }}
                                />
                                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.75) 100%)' }} />
                                {article.category && (
                                    <div className="absolute top-3 left-3 z-10">
                                        <span className={`text-white px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getCategoryColor(article.category)}`}>
                                            {article.category}
                                        </span>
                                    </div>
                                )}
                                {showAdmin && (
                                    <div className="absolute top-3 right-3 z-10 flex gap-1.5">
                                        <button onClick={(e) => { e.stopPropagation(); editArticle(article); }} className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 shadow"><Edit className="h-3 w-3" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteArticle(article.id); }} className="bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 shadow"><Trash2 className="h-3 w-3" /></button>
                                    </div>
                                )}
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-10">
                                    <h3 className="text-sm font-bold text-white leading-tight line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                                        {language === 'al' ? article.titleAl : (article.titleEn || article.titleAl)}
                                    </h3>
                                    <p className="text-xs text-gray-300 mt-1">{formatDateAl(article.date)}</p>
                                </div>
                            </div>
                        ))}
                        {/* End card — link to N'gazeta */}
                        <div
                            className="relative rounded-xl overflow-hidden cursor-pointer flex-shrink-0 snap-start flex flex-col items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 transition-colors"
                            style={{ width: '72vw', maxWidth: '200px', height: '180px' }}
                            onClick={() => changePage('lajme')}
                        >
                            <Newspaper className="w-8 h-8 text-white opacity-90" />
                            <p className="text-white font-bold text-sm text-center px-3">
                                {language === 'al' ? `Shiko të gjitha ${articles.length} artikujt` : `View all ${articles.length} articles`}
                            </p>
                            <span className="text-white text-xs opacity-80 font-medium">N'gazeta →</span>
                        </div>
                    </div>
                </HomeFadeSection>
            );
        })()}

        <ScrollHint />

        {/* Accent strip between articles and categories */}
        <div className="h-1 rounded-full mx-4 mt-4 mb-2" style={{ background: 'linear-gradient(to right, #f59e0b, #f97316, #14b8a6)' }} />

        {/* ==========================================
            SECTION 3: Category Pills + Bridge to N'gazeta
           ========================================== */}
        <HomeFadeSection className="px-4 mt-2">
            <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {t('Çfarë po kërkon?', 'What are you looking for?')}
            </h3>
            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {t('Gjej artikuj sipas interesit tënd', 'Find articles by your interest')}
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(({ al, en, icon: Icon }) => (
                    <button
                        key={al}
                        onClick={() => {
                            setSelectedCategoryFilter(al);
                            changePage('lajme');
                        }}
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border flex-shrink-0 transition-colors ${darkMode ? 'border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700' : 'border-gray-200 bg-gray-50 text-gray-700 hover:bg-amber-50 hover:border-amber-300'}`}
                    >
                        <Icon className="w-4 h-4 mr-1.5" />
                        {language === 'al' ? al : en}
                    </button>
                ))}
            </div>
        </HomeFadeSection>

        {/* ==========================================
            SECTION 4: Next Upcoming Event (conditional)
           ========================================== */}
        {(() => {
            const today = new Date().toISOString().split('T')[0];
            const nextEvent = [...otherEvents]
                .filter(e => e.date)
                .sort((a, b) => a.date.localeCompare(b.date))
                .find(e => e.date >= today);
            if (!nextEvent) return null;
            const alMonths = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
            const formatEventDate = (dateStr) => {
                const d = new Date(dateStr + 'T00:00:00');
                return `${d.getDate()} ${alMonths[d.getMonth()]} ${d.getFullYear()}`;
            };
            return (
                <>
                    <div className={`h-px mx-4 my-8 ${darkMode ? 'hidden' : 'bg-gray-200'}`} />
                    <HomeFadeSection className="px-4 mt-8">
                        <div className={`flex items-center gap-2 mb-3`}>
                            <Calendar className="w-5 h-5 text-amber-500" />
                            <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {t('Eventi i Ardhshëm', 'Next Event')}
                            </h3>
                        </div>
                        <div
                            className={`border-l-4 border-amber-400 rounded-xl p-4 shadow-sm cursor-pointer transition-all flex items-center gap-3 ${darkMode ? 'bg-gray-800 border-amber-500 hover:bg-gray-700' : 'bg-amber-50 hover:bg-amber-100'}`}
                            onClick={() => changePage('events')}
                        >
                            <div className="flex-1 min-w-0">
                                <p className={`text-lg font-bold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{formatEventDate(nextEvent.date)}</p>
                                <h3 className={`text-base font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {language === 'al' ? nextEvent.titleAl : (nextEvent.titleEn || nextEvent.titleAl)}
                                </h3>
                                {nextEvent.location && (
                                    <div className={`flex items-center gap-1.5 mt-1.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        <MapPin className="w-4 h-4 flex-shrink-0" />
                                        <span className="text-sm">{nextEvent.location}</span>
                                    </div>
                                )}
                                <p className={`text-sm font-medium mt-2 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>{t('Shiko eventin →', 'View event →')}</p>
                            </div>
                            <ChevronRight className={`w-5 h-5 flex-shrink-0 ${darkMode ? 'text-amber-400' : 'text-amber-400'}`} />
                        </div>
                    </HomeFadeSection>
                </>
            );
        })()}

        {/* ==========================================
            SECTION 5: Letra nga Rinasi teaser
           ========================================== */}
        {letters.length > 0 && (() => {
            const teaser = letters[0];
            const preview = teaser.content.length > 160 ? teaser.content.substring(0, 160) + '…' : teaser.content;
            return (
                <HomeFadeSection className="px-4 mt-8">
                    <div className={`h-px mb-8 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-4 h-px bg-amber-400" />
                        <p className={`text-xs uppercase tracking-widest font-semibold ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                            {t('Letra nga Rinasi', 'Letters from Those Who Left')}
                        </p>
                    </div>
                    <div
                        className={`rounded-sm border-l-2 border-amber-300/60 p-5 cursor-pointer ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-stone-200'}`}
                        onClick={() => changePage('letra')}
                    >
                        <p
                            className={`text-lg leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
                            style={{ fontFamily: "'Caveat', cursive" }}
                        >
                            "{preview}"
                        </p>
                        <div className={`h-px mt-4 mb-3 ${darkMode ? 'bg-gray-800' : 'bg-stone-200'}`} />
                        <div className="flex items-center justify-between">
                            <span className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {teaser.initials}
                            </span>
                            <span className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {teaser.profession} · {teaser.destination}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => changePage('letra')}
                        className={`mt-3 text-sm font-medium transition-colors ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
                    >
                        {t(`Lexo të gjitha letrat (${letters.length}) →`, `Read all letters (${letters.length}) →`)}
                    </button>
                </HomeFadeSection>
            );
        })()}

        {/* ==========================================
            SECTION 6: CTA — Bëhu pjesë e RinON
           ========================================== */}
        <HomeFadeSection>
            <div className="relative overflow-hidden mt-8 py-12 px-4" style={{ background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)' }}>
                <div className="absolute right-4 top-4 w-32 h-32 rounded-full border-2 pointer-events-none" style={{ borderColor: 'rgba(245,158,11,0.1)' }} />
                <h2 className="text-2xl font-bold text-white">
                    {t('Bëhu pjesë e RinON', 'Be part of RinON')}
                </h2>
                <p className="text-gray-400 text-base mt-2 leading-relaxed">
                    {t(
                        'Ndiq lajmet, mundësitë dhe eventin e ardhshëm — gjithçka në një vend.',
                        'Follow the news, opportunities and the next event — all in one place.'
                    )}
                </p>
                <div className="flex flex-wrap gap-3 mt-6">
                    <a
                        href="https://instagram.com/rinon.al"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition"
                    >
                        <Instagram className="w-4 h-4" />
                        {t('Na ndiq në Instagram', 'Follow us on Instagram')}
                    </a>
                    <button
                        onClick={() => changePage('about')}
                        className="inline-flex items-center gap-2 border border-gray-600 text-gray-300 px-5 py-2.5 rounded-full text-sm font-medium hover:border-gray-400 hover:text-white transition"
                    >
                        {t('Rreth nesh →', 'About us →')}
                    </button>
                </div>
            </div>
        </HomeFadeSection>

        {/* ==========================================
            SECTION 7: Partner Logos (simplified, grayscale)
           ========================================== */}
        {partners.length > 0 && (
            <HomeFadeSection>
                <div className={`py-6 overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className="text-xs uppercase tracking-widest text-gray-400 text-center mb-4">BASHKË ME</p>
                    <div className="flex gap-10 overflow-x-auto px-4 scrollbar-hide items-center justify-center">
                        {partners.map((partner) => (
                            <a
                                key={partner.id}
                                href={partner.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-shrink-0 transition-opacity hover:opacity-100"
                            >
                                <img
                                    src={partner.image}
                                    alt={partner.nameAl}
                                    className="h-10 w-auto object-contain"
                                    style={{ filter: darkMode ? 'brightness(0) invert(1) opacity(0.4)' : 'grayscale(70%) opacity(0.7)' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </HomeFadeSection>
        )}
    </>
);

export default HomePage;
