import React from 'react';
import { Users, Calendar, MapPin, Edit, Trash2 } from 'lucide-react';

const PartnershipsPage = ({ darkMode, t, language, otherEvents, showAdmin, editEvent, deleteEvent }) => {
    const partnershipEvents = otherEvents.filter(event => event.type === 'partnership');

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] bg-clip-text text-transparent' : 'text-[#2D2A26]'}`}>
                    {t('Evente Bashkëpunimi', 'Partnership Events')}
                </h1>
                <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('Bashkëpunimet tona me organizata të ndryshme', 'Our partnerships with various organizations')}
                </p>
            </div>

            {partnershipEvents.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30">
                        <Users className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                        {t('Asnjë event bashkëpunimi ende', 'No partnership events yet')}
                    </h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {t('Eventet e bashkëpunimit do të shfaqen këtu kur të publikohen', 'Partnership events will appear here when published')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {partnershipEvents.map((event) => (
                        <div
                            key={event.id}
                            className={`backdrop-blur-lg rounded-2xl border hover:border-amber-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20 overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                        >
                            <div className="relative h-48">
                                <img
                                    src={event.image}
                                    alt={event.titleAl}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                {showAdmin && (
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={() => editEvent(event)}
                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition z-10 shadow-lg"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="bg-[#FF6B6B] text-white p-2 rounded-full hover:bg-[#FF5252] transition z-10 shadow-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <Users className="w-5 h-5 text-amber-500" />
                                    <span className="text-sm text-amber-500 font-medium">
                                        {t('Bashkëpunim', 'Partnership')}
                                    </span>
                                </div>
                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                    {language === 'al' ? event.titleAl : event.titleEn}
                                </h3>
                                <div className={`flex items-center text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{language === 'al' ? event.dateAl : event.dateEn}</span>
                                </div>
                                {event.location && (
                                    <div className={`flex items-center text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{event.location}</span>
                                    </div>
                                )}
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {language === 'al' ? event.descAl : event.descEn}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ==========================================

export default PartnershipsPage;
