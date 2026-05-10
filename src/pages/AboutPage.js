import React from 'react';
import { Users, Calendar, Leaf, Edit, Trash2 } from 'lucide-react';

const AboutPage = ({ darkMode, t, language, partners, staffMembers, showAdmin, editPartner, deletePartner, editMember, deleteMember }) => (
    <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className={`text-5xl font-bold mb-8 text-center ${darkMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] bg-clip-text text-transparent' : 'text-[#2D2A26]'}`}>{t('Rreth Nesh', 'About Us')}</h1>

        <div className={`backdrop-blur-lg rounded-2xl border p-8 mb-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{t('Përshkrimi', 'Description')}</h2>
            <p className={`leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t(
                    'RinON është një platformë dixhitale e dedikuar për rininë shqiptare, e krijuar për të promovuar aktivizmin, kulturën, edukimin dhe zhvillimin personal të të rinjve. Ne besojmë se të rinjtë janë motori i ndryshimit dhe përparimit të shoqërisë sonë.',
                    'RinON is a digital platform dedicated to Albanian youth, created to promote activism, culture, education and personal development of young people. We believe that young people are the engine of change and progress in our society.'
                )}
            </p>

            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{t('Vizioni Ynë', 'Our Vision')}</h2>
            <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t(
                    'Të krijojmë një komunitet të fortë dhe aktiv të të rinjve shqiptarë që punojnë së bashku për një të ardhme më të mirë. Ne synojmë të jemi platforma kryesore për lajme, ngjarje dhe diskutime që ndikojnë në jetën e përditshme të të rinjve në Shqipëri.',
                    'To create a strong and active community of young Albanians working together for a better future. We aim to be the main platform for news, events and discussions that affect the daily lives of young people in Albania.'
                )}
            </p>
        </div>

        {partners.length > 0 && (
            <div className="mb-12">
                <h2 className={`text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                    {t('Partnerët Tanë', 'Our Partners')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {partners.map((partner) => (
                        <div
                            key={partner.id}
                            className={`backdrop-blur-lg rounded-2xl border hover:border-amber-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20 overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                        >
                            <div className="relative h-64">
                                <img
                                    src={partner.image}
                                    alt={partner.nameAl}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                {showAdmin && (
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={() => editPartner(partner)}
                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition z-10 shadow-lg"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deletePartner(partner.id)}
                                            className="bg-[#FF6B6B] text-white p-2 rounded-full hover:bg-[#FF5252] transition z-10 shadow-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{language === 'al' ? partner.nameAl : partner.nameEn}</h3>

                                <div className="mb-4">
                                    <h4 className="font-semibold text-amber-500 mb-1">{t('Përshkrimi', 'Description')}</h4>
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? partner.descriptionAl : partner.descriptionEn}</p>
                                </div>

                                {(partner.visionAl || partner.visionEn) && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-amber-500 mb-1">{t('Vizioni', 'Vision')}</h4>
                                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? partner.visionAl : partner.visionEn}</p>
                                    </div>
                                )}

                                {(partner.goalsAl || partner.goalsEn) && (
                                    <div className="mb-4">
                                        <h4 className="font-semibold text-amber-500 mb-1">{t('Qëllimet', 'Goals')}</h4>
                                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? partner.goalsAl : partner.goalsEn}</p>
                                    </div>
                                )}

                                {partner.website && (
                                    <a href={partner.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium">
                                        {t('Vizito faqen', 'Visit website')} →
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        <div className="mb-12">
            <h2 className={`text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{t('Ekipi Ynë', 'Our Team')}</h2>
            {staffMembers.length === 0 ? (
                <div className="text-center py-12">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {t('Anëtarët e ekipit do të shfaqen këtu', 'Team members will appear here')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {staffMembers.map((member) => (
                        <div
                            key={member.id}
                            className={`backdrop-blur-lg rounded-2xl border p-6 hover:border-amber-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20 relative ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                        >
                            {showAdmin && (
                                <div className="absolute top-3 right-3 flex gap-2">
                                    <button
                                        onClick={() => editMember(member)}
                                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition shadow-lg"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => deleteMember(member.id)}
                                        className="bg-[#FF6B6B] text-white p-2 rounded-full hover:bg-[#FF5252] transition shadow-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{member.name}</h3>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{member.role}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 text-center border border-amber-500/30 backdrop-blur-lg transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/50">
                    <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-bold text-2xl mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>5000+</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('Anëtarë Aktivë', 'Active Members')}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 text-center border border-amber-500/30 backdrop-blur-lg transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/50">
                    <Calendar className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-bold text-2xl mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>150+</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('Evente të Organizuara', 'Events Organized')}</p>
            </div>

            <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-6 text-center border border-amber-500/30 backdrop-blur-lg transition-all hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/50">
                    <Leaf className="w-8 h-8 text-white" />
                </div>
                <h3 className={`font-bold text-2xl mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>15+</h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('Projekte Rinore', 'Youth Projects')}</p>
            </div>
        </div>
    </div>
);

export default AboutPage;
