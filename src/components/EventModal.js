import React from 'react';
import { X, Calendar, Clock, MapPin, Users, ExternalLink, Share2 } from 'lucide-react';

const EventModal = ({ selectedEvent, setShowEventModal, setSelectedEvent, language, darkMode, t, openShareModal }) => {
    if (!selectedEvent) return null;
    return (
        <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setShowEventModal(false);
                    setSelectedEvent(null);
                    window.history.pushState({}, '', '/events');
                }
            }}
        >
            <div
                className={`rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl ${darkMode ? 'bg-[#2D2A26] border-amber-500/20' : 'bg-white border-gray-200'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header Image */}
                <div className="relative h-72">
                    <img
                        src={selectedEvent.image}
                        alt={selectedEvent.titleAl}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-transparent to-transparent" />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowEventModal(false);
                            setSelectedEvent(null);
                            window.history.pushState({}, '', '/events');
                        }}
                        className="absolute top-4 right-4 bg-[#2D2A26]/80 hover:bg-[#2D2A26] p-2 rounded-full backdrop-blur-lg transition-all"
                    >
                        <X className="h-6 w-6 text-white" />
                    </button>

                    {/* Event Type Badge */}
                    <div className="absolute top-4 left-4 flex gap-2">
                        {selectedEvent.type && (
                            <span className="px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white text-sm font-bold rounded-full shadow-lg">
                                {selectedEvent.type}
                            </span>
                        )}
                        {selectedEvent.is_free && (
                            <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg">
                                {t('FALAS', 'FREE')}
                            </span>
                        )}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8">
                    <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                        {language === 'al' ? selectedEvent.titleAl : (selectedEvent.titleEn || selectedEvent.titleAl)}
                    </h2>

                    {/* Event Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Date */}
                        <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] rounded-full flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Data', 'Date')}</p>
                                <p className={`font-semibold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                    {language === 'al' ? selectedEvent.dateAl : (selectedEvent.dateEn || selectedEvent.dateAl)}
                                </p>
                            </div>
                        </div>

                        {/* Time */}
                        {selectedEvent.time && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-blue-600/10 border border-blue-500/30' : 'bg-blue-100 border border-blue-300'}`}>
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-amber-500 rounded-full flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Ora', 'Time')}</p>
                                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                        {selectedEvent.time}{selectedEvent.endTime ? ` - ${selectedEvent.endTime}` : ''}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        {selectedEvent.location && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-[#FF6B6B]/10 border border-[#FF6B6B]/30' : 'bg-[#FFE5D9] border border-[#FF6B6B]/50'}`}>
                                <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-orange-600 rounded-full flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Vendndodhja', 'Location')}</p>
                                    <p className={`font-semibold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                        {selectedEvent.location}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Spots Left */}
                        {selectedEvent.spots_left !== undefined && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl ${darkMode ? 'bg-orange-600/10 border border-orange-500/30' : 'bg-orange-100 border border-orange-300'}`}>
                                <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Vende', 'Spots')}</p>
                                    <p className={`font-semibold ${selectedEvent.spots_left < 10 ? 'text-red-400' : darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                        {selectedEvent.spots_left > 0
                                            ? `${selectedEvent.spots_left} ${t('të mbetura', 'left')}`
                                            : t('MBUSH', 'FULL')
                                        }
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            {t('Përshkrimi', 'Description')}
                        </h3>
                        <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {language === 'al' ? selectedEvent.descAl : (selectedEvent.descEn || selectedEvent.descAl)}
                        </p>
                    </div>

                    {/* Tags */}
                    {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {selectedEvent.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-sm"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4">
                        {selectedEvent.registration_link && (
                            <a
                                href={selectedEvent.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 px-6 py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all text-center font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/50"
                            >
                                <ExternalLink className="w-5 h-5" />
                                {t('Regjistrohu Tani', 'Register Now')}
                            </a>
                        )}
                        <button
                            onClick={() => openShareModal(selectedEvent, 'event')}
                            className={`px-6 py-4 rounded-xl transition-all font-bold flex items-center justify-center gap-2 ${darkMode
                                ? 'bg-[#3D3A36] text-white hover:bg-[#4D4A46] border border-amber-500/30'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
                            }`}
                        >
                            <Share2 className="w-5 h-5" />
                            {t('Shpërndaj', 'Share')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
