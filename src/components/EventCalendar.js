import React, { useState } from 'react';
import { TrendingUp, Brain, Film, Award, Play, Leaf, Users, Heart, Star, Calendar, Calendar as CalendarIcon, Share2, Bookmark, BookmarkCheck, ChevronLeft, ChevronRight, MapPin, Clock, ExternalLink, X, Edit, Trash2 } from 'lucide-react';

// Event Calendar Component
const EventCalendar = React.memo(({ language, darkMode, events, showAdmin, editEvent, deleteEvent, t, openShareModal, openEvent, currentDate, setCurrentDate, eventInterests, userEventInterests, toggleEventInterest }) => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showOnlyFree, setShowOnlyFree] = useState(false);
    const [savedEvents, setSavedEvents] = useState([]);
    const [showDayModal, setShowDayModal] = useState(false);

    const categories = [
        { value: 'all', label: { al: 'Të gjitha', en: 'All' }, icon: TrendingUp, color: 'amber' },
        { value: 'tech', label: { al: 'Teknologji', en: 'Tech' }, icon: Brain, color: 'blue' },
        { value: 'culture', label: { al: 'Kulturë', en: 'Culture' }, icon: Film, color: 'coral' },
        { value: 'career', label: { al: 'Karrierë', en: 'Career' }, icon: Award, color: 'orange' },
        { value: 'sports', label: { al: 'Sport', en: 'Sports' }, icon: Play, color: 'green' },
        { value: 'environment', label: { al: 'Mjedis', en: 'Environment' }, icon: Leaf, color: 'emerald' },
        { value: 'education', label: { al: 'Edukim', en: 'Education' }, icon: Users, color: 'indigo' },
        { value: 'social', label: { al: 'Social', en: 'Social' }, icon: Heart, color: 'rose' }
    ];

    // Transform events data to calendar format
    const transformedEvents = {};
    events.forEach(event => {
        const dateKey = event.date || new Date().toISOString().split('T')[0];
        if (!transformedEvents[dateKey]) {
            transformedEvents[dateKey] = [];
        }
        transformedEvents[dateKey].push({
            ...event,
            category: event.category || 'general',
            is_free: event.is_free !== false,
            spots_left: event.spots_left || 50,
            total_spots: event.total_spots || 100,
            attendees: event.attendees || 0
        });
    });

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getEventsForDay = (day) => {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        let dayEvents = transformedEvents[dateKey] || [];

        if (selectedCategory !== 'all') {
            dayEvents = dayEvents.filter(e => e.category === selectedCategory);
        }

        if (showOnlyFree) {
            dayEvents = dayEvents.filter(e => e.is_free);
        }

        return dayEvents;
    };

    const openDayModal = (day) => {
        const eventsForDay = getEventsForDay(day);
        if (eventsForDay.length > 0) {
            setSelectedDate({ day, events: eventsForDay });
            setShowDayModal(true);
        }
    };

    const exportToCalendar = (event) => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${event.titleAl}
DTSTART:${event.date?.replace(/-/g, '')}T${event.time?.replace(/:/g, '') || '100000'}
DTEND:${event.date?.replace(/-/g, '')}T${event.endTime?.replace(/:/g, '') || '120000'}
LOCATION:${event.location || ''}
DESCRIPTION:${event.descAl || ''}
END:VEVENT
END:VCALENDAR`;

        const blob = new Blob([icsContent], { type: 'text/calendar' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${event.titleAl}.ics`;
        a.click();
    };

    const toggleSaveEvent = (eventId) => {
        setSavedEvents(prev =>
            prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId]
        );
    };

    const monthNames = {
        al: ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'],
        en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    };

    const dayNames = {
        al: ['Diel', 'Hën', 'Mar', 'Mër', 'Enj', 'Pre', 'Sht'],
        en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    };

    const totalEvents = Object.values(transformedEvents).flat().length;
    const freeEvents = Object.values(transformedEvents).flat().filter(e => e.is_free).length;

    return (
        <div className="space-y-6">
            {/* Enhanced Calendar Instruction Banner */}
            <div className={`rounded-3xl p-8 border relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-amber-500/15 via-orange-500/10 to-[#FF6B6B]/10 border-amber-500/30' : 'bg-gradient-to-br from-amber-50 via-orange-50 to-[#FFE5D9] border-amber-200'}`}>
                {/* Decorative elements */}
                <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full ${darkMode ? 'bg-amber-500/10' : 'bg-amber-400/20'}`} />
                <div className={`absolute -bottom-5 -left-5 w-24 h-24 rounded-full ${darkMode ? 'bg-orange-500/10' : 'bg-orange-400/15'}`} />

                <div className="relative flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-400 via-orange-500 to-[#FF6B6B] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl shadow-amber-500/30 transform rotate-3 hover:rotate-0 transition-transform">
                        <CalendarIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            {t('Si të regjistrohesh në një event?', 'How to register for an event?')}
                        </h3>
                        <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('Kliko një ditë në kalendar për të parë dhe regjistruar në eventet e asaj dite.', 'Click a day on the calendar to view and register for events on that day.')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Enhanced Stats Row */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{totalEvents}</span>
                            <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('evente', 'events')}</span>
                        </div>
                    </div>
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-xl ${darkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                            <Star className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <span className={`text-2xl font-black ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{freeEvents}</span>
                            <span className={`text-sm ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('falas', 'free')}</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Filters */}
                <div className="flex gap-3">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/30 transition-all ${darkMode
                            ? 'bg-[#3D3A36] border-amber-500/30 text-white hover:bg-[#4D4A46]'
                            : 'bg-white border-amber-200 text-[#2D2A26] hover:border-amber-400 shadow-sm'
                            }`}
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {language === 'al' ? cat.label.al : cat.label.en}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={() => setShowOnlyFree(!showOnlyFree)}
                        className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all flex items-center gap-2 ${showOnlyFree
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-500 shadow-lg shadow-green-500/30'
                            : darkMode
                                ? 'bg-[#3D3A36] border-amber-500/30 text-gray-300 hover:bg-[#4D4A46]'
                                : 'bg-white border-amber-200 text-gray-700 hover:border-amber-400 shadow-sm'
                            }`}
                    >
                        <Star className="w-4 h-4" />
                        {t('Falas', 'Free')}
                    </button>
                </div>
            </div>

            {/* Enhanced Calendar Header */}
            <div className={`backdrop-blur-lg rounded-3xl border overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-xl'
                }`}>
                {/* Month Navigation Header */}
                <div className={`p-6 ${darkMode ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/10' : 'bg-gradient-to-r from-amber-50 to-orange-50'}`}>
                    <div className="flex items-center justify-between">
                        <button
                            onClick={prevMonth}
                            className={`p-3 rounded-xl transition-all ${darkMode
                                ? 'hover:bg-amber-500/20 bg-white/5'
                                : 'hover:bg-amber-100 bg-white shadow-sm'
                                }`}
                        >
                            <ChevronLeft className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                        </button>

                        <div className="text-center">
                            <h2 className={`text-3xl font-black ${darkMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] bg-clip-text text-transparent' : 'text-[#2D2A26]'}`}>
                                {monthNames[language][month]}
                            </h2>
                            <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{year}</span>
                        </div>

                        <button
                            onClick={nextMonth}
                            className={`p-3 rounded-xl transition-all ${darkMode
                                ? 'hover:bg-amber-500/20 bg-white/5'
                                : 'hover:bg-amber-100 bg-white shadow-sm'
                                }`}
                        >
                            <ChevronRight className={`w-6 h-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                        </button>
                    </div>
                </div>

                {/* Calendar Body */}
                <div className="p-6">
                    {/* Day Names */}
                    <div className="grid grid-cols-7 gap-2 mb-4">
                        {dayNames[language].map((day, idx) => (
                            <div key={day} className={`text-center font-bold py-3 rounded-xl ${idx === 0 || idx === 6
                                ? darkMode ? 'text-amber-400 bg-amber-500/10' : 'text-amber-600 bg-amber-50'
                                : darkMode ? 'text-gray-400' : 'text-gray-600'
                                }`}>
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty cells for days before month starts */}
                        {[...Array(startingDayOfWeek)].map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square" />
                        ))}

                        {/* Days of the month */}
                        {[...Array(daysInMonth)].map((_, i) => {
                            const day = i + 1;
                            const dayEvents = getEventsForDay(day);
                            const isToday = new Date().getDate() === day &&
                                new Date().getMonth() === month &&
                                new Date().getFullYear() === year;
                            const isWeekend = (startingDayOfWeek + i) % 7 === 0 || (startingDayOfWeek + i) % 7 === 6;

                            return (
                                <button
                                    key={day}
                                    onClick={() => openDayModal(day)}
                                    className={`aspect-square rounded-2xl p-2 transition-all relative group ${isToday
                                        ? 'ring-2 ring-amber-500 ring-offset-2 ' + (darkMode ? 'ring-offset-[#2D2A26]' : 'ring-offset-white')
                                        : ''
                                        } ${dayEvents.length > 0
                                            ? darkMode
                                                ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 shadow-lg shadow-amber-500/10'
                                                : 'bg-gradient-to-br from-amber-50 to-[#FFE5D9] hover:from-amber-100 hover:to-[#FFDAC1] border border-amber-200 shadow-md'
                                            : darkMode
                                                ? 'hover:bg-[#3D3A36] ' + (isWeekend ? 'bg-white/3' : '')
                                                : 'hover:bg-gray-50 ' + (isWeekend ? 'bg-gray-50/50' : '')
                                        }`}
                                >
                                    <div className={`text-sm font-bold ${dayEvents.length > 0
                                        ? darkMode ? 'text-amber-400' : 'text-amber-600'
                                        : isToday
                                            ? darkMode ? 'text-amber-400' : 'text-amber-600'
                                            : darkMode
                                                ? 'text-gray-400'
                                                : 'text-gray-600'
                                        }`}>
                                        {day}
                                    </div>

                                    {/* Event indicators */}
                                    {dayEvents.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-1 justify-center">
                                            {dayEvents.slice(0, 3).map((event, idx) => {
                                                const cat = categories.find(c => c.value === event.category);
                                                const Icon = cat?.icon || Calendar;
                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`w-6 h-6 rounded-lg flex items-center justify-center bg-gradient-to-br from-${cat?.color || 'amber'}-400 to-${cat?.color || 'amber'}-600 shadow-sm transform group-hover:scale-110 transition-transform`}
                                                        title={event.titleAl}
                                                    >
                                                        <Icon className="w-3 h-3 text-white" />
                                                    </div>
                                                );
                                            })}
                                            {dayEvents.length > 3 && (
                                                <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                                    +{dayEvents.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Today indicator dot */}
                                    {isToday && (
                                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Day Modal */}
            {showDayModal && selectedDate && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowDayModal(false);
                        }
                    }}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                    onTouchEnd={(e) => e.stopPropagation()}
                >
                    <div
                        className={`rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl ${darkMode ? 'bg-[#2D2A26] border-amber-500/20' : 'bg-white border-amber-200'}`}
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] p-6 flex justify-between items-center">
                            <h3 className="text-2xl font-bold text-white">
                                {selectedDate.day} {monthNames[language][month]} {year}
                            </h3>
                            <button
                                onClick={() => setShowDayModal(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-all"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {selectedDate.events.map(event => (
                                <div
                                    key={event.id}
                                    className={`backdrop-blur-lg rounded-2xl border p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {event.is_featured && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                                        ⭐ {t('I Veçantë', 'Featured')}
                                                    </span>
                                                )}
                                                {event.is_trending && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white text-xs font-bold rounded-full">
                                                        🔥 {t('Trending', 'Trending')}
                                                    </span>
                                                )}
                                                {event.is_free && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                                                        {t('FALAS', 'FREE')}
                                                    </span>
                                                )}
                                            </div>
                                            <h4
                                                className={`text-xl font-bold mb-2 cursor-pointer hover:text-amber-500 transition ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}
                                                onClick={() => {
                                                    setShowDayModal(false);
                                                    openEvent(event);
                                                }}
                                            >
                                                {language === 'al' ? event.titleAl : event.titleEn}
                                            </h4>
                                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'
                                                }`}>
                                                {language === 'al' ? event.descAl : event.descEn}
                                            </p>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openShareModal(event, 'event')}
                                                className="p-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-lg hover:from-amber-500 hover:to-[#FF5252] transition"
                                            >
                                                <Share2 className="w-5 h-5" />
                                            </button>

                                            <button
                                                onClick={() => toggleSaveEvent(event.id)}
                                                className={`p-2 rounded-lg transition-all ${savedEvents.includes(event.id)
                                                    ? 'bg-amber-500 text-white'
                                                    : darkMode
                                                        ? 'bg-[#3D3A36] text-gray-400 hover:bg-[#4D4A46]'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {savedEvents.includes(event.id) ? (
                                                    <BookmarkCheck className="w-5 h-5" />
                                                ) : (
                                                    <Bookmark className="w-5 h-5" />
                                                )}
                                            </button>

                                            {showAdmin && (
                                                <>
                                                    <button
                                                        onClick={() => editEvent(event)}
                                                        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                                    >
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteEvent(event.id)}
                                                        className="p-2 bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5252] transition"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-amber-500" />
                                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                {event.time || '10:00'} - {event.endTime || '12:00'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-amber-500" />
                                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                {event.location}
                                            </span>
                                        </div>
                                        {event.spots_left !== undefined && (
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-amber-500" />
                                                <span className={`${event.spots_left < 10 ? 'text-red-400 font-bold' : darkMode ? 'text-gray-300' : 'text-gray-700'
                                                    }`}>
                                                    {event.spots_left > 0
                                                        ? `${event.spots_left} ${t('vende të mbetura', 'spots left')}`
                                                        : t('MBUSH', 'FULL')
                                                    }
                                                </span>
                                            </div>
                                        )}
                                        {event.partner && (
                                            <div className="flex items-center gap-2">
                                                <Award className="w-4 h-4 text-amber-500" />
                                                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                                                    {event.partner}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {event.tags && event.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {event.tags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="px-3 py-1 bg-amber-500/20 text-amber-500 rounded-full text-xs"
                                                >
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Who's Interested Counter */}
                                    <div className="flex items-center justify-between mb-4">
                                        <button
                                            onClick={() => toggleEventInterest(event.id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${userEventInterests.includes(event.id)
                                                ? 'bg-amber-500 text-white'
                                                : darkMode
                                                    ? 'bg-[#3D3A36] text-gray-300 hover:bg-amber-500/20 hover:text-amber-400'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-600'
                                                }`}
                                        >
                                            <Heart className={`w-4 h-4 ${userEventInterests.includes(event.id) ? 'fill-current' : ''}`} />
                                            {userEventInterests.includes(event.id)
                                                ? t('Më Intereson', 'Interested')
                                                : t('Më Intereson?', 'Interested?')
                                            }
                                        </button>
                                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {eventInterests[event.id] || 0} {t('të interesuar', 'interested')}
                                        </span>
                                    </div>

                                    <div className="flex gap-3">
                                        {event.registration_link && (
                                            <a
                                                href={event.registration_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all text-center flex items-center justify-center gap-2"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                                {t('Regjistrohu', 'Register')}
                                            </a>
                                        )}
                                        <button
                                            onClick={() => exportToCalendar(event)}
                                            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${darkMode
                                                ? 'bg-[#3D3A36] text-gray-300 hover:bg-[#4D4A46]'
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                }`}
                                        >
                                            <CalendarIcon className="w-4 h-4" />
                                            {t('Kalendar', 'Calendar')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

EventCalendar.displayName = 'EventCalendar';

// Discussion Page Component — REMOVED (Phase 1)

export default EventCalendar;
