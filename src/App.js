import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, Globe, ChevronLeft, ChevronRight, MessageCircle, Trash2, Plus, Calendar, Users, Award, Leaf, TrendingUp, Film, Play, MapPin, LogIn, LogOut, Settings, Send, Heart, ChevronDown, Sun, Moon, Edit, Brain, Globe as GlobeIcon, Clock, Filter, Star, Bookmark, ExternalLink, BookmarkCheck, Calendar as CalendarIcon, List, School, GraduationCap, Trophy, Eye, EyeOff, AlertTriangle, Share2, Copy, Download, Check, Instagram, Home, Newspaper, User, Search, RefreshCw, Bell, BookmarkPlus, Sparkles, ArrowUp, ChevronUp } from 'lucide-react';
import DOMPurify from 'dompurify';
import { Analytics } from '@vercel/analytics/react';


// Initialize Supabase
const supabase = createClient(
    'https://hslwkxwarflnvjfytsul.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbHdreHdhcmZsbnZqZnl0c3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzY5NzcsImV4cCI6MjA3NTc1Mjk3N30.bwAqhvyRaNaec9vkJRytf_ktZRPrbbbViiTGcjWIus4'
);


// Validation utilities
const validateInput = {
    text: (input, maxLength = 1000) => {
        if (typeof input !== 'string') return false;
        if (input.trim().length === 0) return false;
        if (input.length > maxLength) return false;
        return true;
    },

    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    url: (url) => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    },

    sanitizeHtml: (dirty) => {
        if (!dirty) return '';
        return DOMPurify.sanitize(dirty, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
            ALLOWED_ATTR: []
        });
    }
};


// Password validation
const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);

    if (password.length < minLength) {
        return { valid: false, message: 'Password must be at least 8 characters' };
    }

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
        return {
            valid: false,
            message: 'Password must contain uppercase, lowercase, and numbers'
        };
    }

    return { valid: true };
};

// Error handler
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    return 'An error occurred. Please try again.';
};

// Image upload utility
const uploadImage = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

const FOMOPopup = ({ showPopup, onClose, darkMode, t, onNavigateToEvents }) => {
    const [attendees, setAttendees] = useState(247);

    useEffect(() => {
        if (showPopup) {
            const interval = setInterval(() => {
                setAttendees(prev => prev + Math.floor(Math.random() * 3));
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [showPopup]);

    if (!showPopup) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className={`rounded-3xl max-w-md w-full p-8 shadow-2xl border animate-slideUp relative ${darkMode ? 'bg-[#2D2A26] border-amber-500/30' : 'bg-white border-amber-200'
                }`}>
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-amber-500/20 rounded-lg transition-all"
                >
                    <X className="w-5 h-5 text-gray-400" />
                </button>

                <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/50 animate-pulse">
                        <Calendar className="w-10 h-10 text-white" />
                    </div>

                    <h3 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2D2A26]'
                        }`}>
                        {t('Diçka e Madhe Po Ndodh!', 'Something Big is Happening!')}
                    </h3>

                    <div className="mb-6">
                        <p className={`text-xl mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {attendees}
                            </span>
                        </p>
                        <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('të rinj tashmë kanë rezervuar evente këtë javë', 'youth have already booked events this week')}
                        </p>
                    </div>

                    <p className={`text-2xl font-bold mb-6 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        {t('Shiko çfarë po humb...', "See what you're missing...")}
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onClose();
                                onNavigateToEvents();
                            }}
                            className="w-full px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50 font-semibold"
                        >
                            {t('Eksploro Kalendarin', 'Explore Calendar')}
                        </button>

                        <button
                            onClick={onClose}
                            className={`w-full px-6 py-3 rounded-xl border transition-all font-semibold ${darkMode
                                ? 'border-gray-600 text-gray-400 hover:bg-gray-800'
                                : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {t('Shiko Më Vonë', 'See Later')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
// Event Calendar Component
const EventCalendar = ({ language, darkMode, events, showAdmin, editEvent, deleteEvent, t, openShareModal, openEvent }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
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
            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4">
                <div className={`backdrop-blur-lg rounded-xl p-4 border ${darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
                    }`}>
                    <div className="flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-amber-500" />
                        <div>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{totalEvents}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('Evente Totale', 'Total Events')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`backdrop-blur-lg rounded-xl p-4 border ${darkMode ? 'bg-green-600/10 border-green-500/30' : 'bg-green-100 border-green-300'
                    }`}>
                    <div className="flex items-center gap-3">
                        <Star className="w-8 h-8 text-green-400" />
                        <div>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{freeEvents}</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('Evente Falas', 'Free Events')}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={`backdrop-blur-lg rounded-xl p-4 border ${darkMode ? 'bg-[#FF6B6B]/10 border-[#FF6B6B]/30' : 'bg-[#FFE5D9] border-[#FF6B6B]/50'
                    }`}>
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-[#FF6B6B]" />
                        <div>
                            <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>500+</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('Të Rinj Aktivë', 'Active Youth')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`flex-1 px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${darkMode
                        ? 'bg-[#3D3A36] border-amber-500/30 text-white'
                        : 'bg-white border-amber-200 text-[#2D2A26]'
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
                    className={`px-6 py-3 rounded-xl border transition-all ${showOnlyFree
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-500'
                        : darkMode
                            ? 'bg-[#3D3A36] border-amber-500/30 text-gray-300 hover:bg-[#4D4A46]'
                            : 'bg-white border-amber-200 text-gray-700 hover:bg-[#FFE5D9]'
                        }`}
                >
                    <Filter className="w-5 h-5 inline mr-2" />
                    {t('Vetëm Falas', 'Free Only')}
                </button>
            </div>

            {/* Calendar Header */}
            <div className={`backdrop-blur-lg rounded-2xl border p-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                }`}>
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={prevMonth}
                        className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-50'
                            }`}
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                        {monthNames[language][month]} {year}
                    </h2>

                    <button
                        onClick={nextMonth}
                        className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-50'
                            }`}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>

                {/* Day Names */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                    {dayNames[language].map(day => (
                        <div key={day} className={`text-center font-semibold py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'
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

                        return (
                            <button
                                key={day}
                                onClick={() => openDayModal(day)}
                                className={`aspect-square rounded-xl p-2 transition-all relative ${isToday
                                    ? 'ring-2 ring-amber-500'
                                    : ''
                                    } ${dayEvents.length > 0
                                        ? darkMode
                                            ? 'bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30'
                                            : 'bg-amber-50 hover:bg-[#FFE5D9] border border-amber-200'
                                        : darkMode
                                            ? 'hover:bg-[#3D3A36]'
                                            : 'hover:bg-gray-100'
                                    }`}
                            >
                                <div className={`text-sm font-semibold ${dayEvents.length > 0
                                    ? 'text-amber-500'
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
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center bg-${cat?.color || 'amber'}-500`}
                                                    title={event.titleAl}
                                                >
                                                    <Icon className="w-3 h-3 text-white" />
                                                </div>
                                            );
                                        })}
                                        {dayEvents.length > 3 && (
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] flex items-center justify-center text-white text-xs font-bold">
                                                +{dayEvents.length - 3}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Day Modal */}
            {showDayModal && selectedDate && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className={`rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl ${darkMode ? 'bg-[#2D2A26] border-amber-500/20' : 'bg-white border-amber-200'
                        }`}>
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

                                    <div className="flex gap-3">
                                        {event.registration_link && (
                                            <a
                                                href={event.registration_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-lg hover:from-amber-500 hover:to-[#FF5252] transition-all text-center flex items-center justify-center gap-2"
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
                                            {t('Eksporto', 'Export')}
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
};

// Discussion Page Component
const DiscussionPageContent = ({
    selectedTopic,
    setSelectedTopic,
    topics,
    topicPosts,
    newPost,
    setNewPost,
    submitPost,
    deletePost,
    deleteTopic,
    user,
    userProfile,
    showAdmin,
    language,
    darkMode,
    t,
    setShowAuthModal,
    setAuthMode
}) => {
    if (!selectedTopic) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h1 className={`text-5xl font-bold mb-8 ${darkMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] bg-clip-text text-transparent' : 'text-[#2D2A26]'}`}>{t('Hapësira e Diskutimit', 'Discussion Space')}</h1>

                {!user && (
                    <div className={`backdrop-blur-lg rounded-2xl border p-8 mb-8 text-center ${darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                        <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            {t('Kyçu për të parë diskutimet', 'Sign in to view discussions')}
                        </h3>
                        <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('Duhet të kyçesh për të parë dhe marrë pjesë në diskutime', 'You need to sign in to view and participate in discussions')}
                        </p>
                        <button
                            onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                            className="px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50 flex items-center gap-2 mx-auto"
                        >
                            <LogIn className="w-5 h-5" />
                            {t('Kyçu Tani', 'Sign In Now')}
                        </button>
                    </div>
                )}

                {topics.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30">
                            <MessageCircle className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            {t('Asnjë temë diskutimi ende', 'No discussion topics yet')}
                        </h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {t('Temat do të shfaqen këtu kur të krijohen', 'Topics will appear here when created')}
                        </p>
                    </div>
                ) : (
                    <div className={`grid gap-4 md:grid-cols-2 ${!user ? 'filter blur-sm pointer-events-none' : ''}`}>
                        {topics.map((topic) => (
                            <div
                                key={topic.id}
                                className={`backdrop-blur-lg p-6 rounded-2xl border hover:border-amber-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20 relative ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                                    }`}
                            >
                                {showAdmin && userProfile?.is_admin && (
                                    <button
                                        onClick={() => deleteTopic(topic.id)}
                                        className="absolute top-3 right-3 bg-[#FF6B6B] text-white p-2 rounded-full hover:bg-[#FF5252] transition z-10 shadow-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedTopic(topic)}
                                    className="text-left w-full"
                                >
                                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{language === 'al' ? topic.title_al : topic.title_en || topic.title_al}</h3>
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? topic.description_al : topic.description_en || topic.description_al}</p>
                                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(topic.created_at).toLocaleDateString()}</p>
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12">
                <button onClick={() => setSelectedTopic(null)} className="text-amber-500 hover:text-amber-400 flex items-center gap-2 mb-6">
                    <ChevronLeft className="w-4 h-4" />
                    {t('Kthehu', 'Back')}
                </button>
                <div className={`backdrop-blur-lg rounded-2xl border p-8 text-center ${darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                    <MessageCircle className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                        {t('Kyçu për të parë diskutimet', 'Sign in to view discussions')}
                    </h3>
                    <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('Duhet të kyçesh për të parë dhe marrë pjesë në diskutime', 'You need to sign in to view and participate in discussions')}
                    </p>
                    <button
                        onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                        className="px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50 flex items-center gap-2 mx-auto"
                    >
                        <LogIn className="w-5 h-5" />
                        {t('Kyçu Tani', 'Sign In Now')}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button onClick={() => setSelectedTopic(null)} className="text-amber-500 hover:text-amber-400 flex items-center gap-2 mb-6">
                <ChevronLeft className="w-4 h-4" />
                {t('Kthehu', 'Back')}
            </button>

            <div className={`backdrop-blur-lg p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{language === 'al' ? selectedTopic.title_al : selectedTopic.title_en || selectedTopic.title_al}</h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? selectedTopic.description_al : selectedTopic.description_en || selectedTopic.description_al}</p>
            </div>

            <div className={`backdrop-blur-lg p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder={t('Shkruani mendimin tuaj...', 'Write your thoughts...')}
                    className={`w-full px-4 py-3 border rounded-xl resize-none placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all ${darkMode ? 'bg-[#2D2A26] border-amber-500/30 text-white' : 'bg-gray-50 border-gray-300 text-[#2D2A26]'
                        }`}
                    rows="4"
                    maxLength="2000"
                />
                <button onClick={submitPost} className="mt-3 px-6 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] flex items-center gap-2 shadow-lg shadow-amber-500/50 transition-all">
                    <Send className="w-4 h-4" />
                    {t('Posto', 'Post')}
                </button>
            </div>

            <div className="space-y-4">
                {topicPosts.length === 0 ? (
                    <div className={`backdrop-blur-lg p-12 rounded-2xl border text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <MessageCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            {t('Asnjë koment ende', 'No comments yet')}
                        </h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {t('Bëhu i pari që komenton këtë temë!', 'Be the first to comment on this topic!')}
                        </p>
                    </div>
                ) : (
                    topicPosts.map(post => (
                        <div key={post.id} className={`backdrop-blur-lg p-6 rounded-2xl border ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-start justify-between mb-3">
                                <p className="font-medium text-amber-500">{post.user_name}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(post.created_at).toLocaleDateString()}</span>
                                    {(post.user_id === user?.id || userProfile?.is_admin) && (
                                        <button onClick={() => deletePost(post.id)} className="p-1 hover:bg-[#FF6B6B]/20 rounded text-[#FF6B6B]">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className={`whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{post.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
const ShareModal = ({ isOpen, onClose, item, type, language, darkMode, t }) => {
    const [captionCopied, setCaptionCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    if (!isOpen || !item) return null;

    const isArticle = type === 'article';
    const title = language === 'al' ? item.titleAl : (item.titleEn || item.titleAl);
    const description = isArticle
        ? (language === 'al' ? item.contentAl : (item.contentEn || item.contentAl))
        : (language === 'al' ? item.descAl : (item.descEn || item.descAl));

    // Truncate description for caption
    const shortDesc = description ? description.substring(0, 150) + (description.length > 150 ? '...' : '') : '';

    // Generate hashtags based on category
    const getHashtags = () => {
        const baseHashtags = '#RinON #RiniaShqiptare #AlbanianYouth #Shqipëri';
        const categoryHashtags = {
            'Sport dhe Kulturë': '#Sport #Kulturë #Culture',
            'Politikë dhe Ekonomi': '#Politikë #Ekonomi #Politics',
            'Vullnetarizëm': '#Vullnetarizëm #Volunteering #Youth',
            'Lifestyle': '#Lifestyle #Rinor',
            'AI': '#AI #Technology #Tech',
            'Rreth Europes': '#Europe #EU #EuropeExplained'
        };
        return `${baseHashtags} ${categoryHashtags[item.category] || '#Youth #Albania'}`;
    };

    // Generate share link
    const shareLink = `https://rinon.al/${isArticle ? 'article' : 'event'}/${item.id}`;

    // Generate full caption
    const fullCaption = `${title}\n\n${shortDesc}\n\n🔗 Lexo më shumë: ${shareLink}\n\n${getHashtags()}`;

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(fullCaption);
            setCaptionCopied(true);
            setTimeout(() => setCaptionCopied(false), 2000);
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = fullCaption;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCaptionCopied(true);
            setTimeout(() => setCaptionCopied(false), 2000);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (err) {
            const textArea = document.createElement('textarea');
            textArea.value = shareLink;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    const handleImageDownload = async () => {
        const imageUrl = item.image;

        // Check if it's a Supabase storage URL (your domain)
        const isSupabaseImage = imageUrl && imageUrl.includes('hslwkxwarflnvjfytsul.supabase.co');

        if (isSupabaseImage) {
            // Direct download for Supabase images
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rinon-${type}-${item.id}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (err) {
                // Fallback: open in new tab
                window.open(imageUrl, '_blank');
            }
        } else {
            // For external URLs, open in new tab
            window.open(imageUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className={`rounded-3xl max-w-lg w-full shadow-2xl border overflow-hidden ${darkMode ? 'bg-[#2D2A26] border-amber-500/30' : 'bg-white border-amber-200'
                }`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Instagram className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {t('Shpërndaj në Instagram', 'Share to Instagram')}
                            </h3>
                            <p className="text-white/70 text-sm">
                                {isArticle ? t('Artikull', 'Article') : t('Event', 'Event')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-all"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Image Preview */}
                <div className="relative">
                    <img
                        src={item.image}
                        alt={title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${isArticle ? 'bg-amber-500' : 'bg-[#FF6B6B]'
                            }`}>
                            {item.category || item.type || 'RinON'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Caption Preview */}
                    <div>
                        <label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            {t('Caption për Instagram:', 'Instagram Caption:')}
                        </label>
                        <div className={`p-3 rounded-xl text-sm max-h-32 overflow-y-auto ${darkMode ? 'bg-[#3D3A36]/50 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                            <p className="whitespace-pre-wrap">{fullCaption}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={copyCaption}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${captionCopied
                                ? 'bg-green-600 text-white'
                                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white hover:from-amber-500 hover:to-[#FF5252]'
                                }`}
                        >
                            {captionCopied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    {t('U kopjua!', 'Copied!')}
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    {t('Kopjo Caption', 'Copy Caption')}
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleImageDownload}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${darkMode
                                ? 'bg-[#3D3A36] text-white hover:bg-[#4D4A46] border border-amber-500/30'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
                                }`}
                        >
                            <Download className="w-4 h-4" />
                            {t('Shkarko Foto', 'Download Image')}
                        </button>
                    </div>

                    {/* Link Section */}
                    <div className={`flex items-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-[#3D3A36]/50' : 'bg-gray-100'
                        }`}>
                        <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        />
                        <button
                            onClick={copyLink}
                            className={`p-2 rounded-lg transition-all ${linkCopied
                                ? 'bg-green-600 text-white'
                                : 'bg-amber-500 text-white hover:bg-[#FFE5D9]0'
                                }`}
                        >
                            {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p className="font-semibold">{t('Si të postosh:', 'How to post:')}</p>
                        <p>1. {t('Shkarko foton ose ruaje nga tab-i i ri', 'Download the image or save from new tab')}</p>
                        <p>2. {t('Kopjo caption-in', 'Copy the caption')}</p>
                        <p>3. {t('Hap Instagram dhe krijo post të ri', 'Open Instagram and create new post')}</p>
                        <p>4. {t('Ngjit caption-in dhe posto!', 'Paste the caption and post!')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
// Auth Modal Component
const AuthModal = ({ showAuthModal, setShowAuthModal, authMode, setAuthMode, handleSignup, handleLogin, setShowPreferences, darkMode, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const handleSubmit = async () => {
        setError('');

        if (authMode === 'signup') {
            if (!validateInput.email(email)) {
                setError(t('Email i pavlefshëm', 'Invalid email address'));
                return;
            }

            const passwordCheck = validatePassword(password);
            if (!passwordCheck.valid) {
                setError(passwordCheck.message);
                return;
            }

            if (!validateInput.text(displayName, 50)) {
                setError(t('Emri duhet të jetë 1-50 karaktere', 'Name must be 1-50 characters'));
                return;
            }

            const { error } = await handleSignup(email, password, displayName, rememberMe);
            if (error) setError(error.message);
            else setShowAuthModal(false);
        } else {
            if (!validateInput.email(email)) {
                setError(t('Email i pavlefshëm', 'Invalid email address'));
                return;
            }

            const { error } = await handleLogin(email, password, rememberMe);
            if (error) setError(error.message);
            else setShowAuthModal(false);
        }
    };
    if (!showAuthModal) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#2D2A26] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-amber-500/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        {authMode === 'login' ? t('Hyr', 'Login') : t('Regjistrohu', 'Sign Up')}
                    </h2>
                    <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="space-y-4">
                    {authMode === 'signup' && (
                        <input
                            type="text"
                            placeholder={t('Emri juaj', 'Your name')}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength="50"
                            className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('Fjalëkalimi', 'Password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 pr-12 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-amber-500 transition-colors"
                        >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                    </div>

                    <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="w-4 h-4 rounded border-amber-500/30 bg-[#3D3A36] text-amber-600 focus:ring-amber-500/20"
                        />
                        <span className="text-sm">{t('Më mbaj mend', 'Remember me')}</span>
                    </label>

                    {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

                    <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white py-3 rounded-xl font-semibold hover:from-amber-500 hover:to-[#FF5252] transform hover:scale-[1.02] transition-all shadow-lg shadow-amber-500/50">
                        {authMode === 'login' ? t('Hyr', 'Login') : t('Regjistrohu', 'Sign Up')}
                    </button>
                </div>

                <p className="text-center text-sm mt-4 text-gray-400">
                    {authMode === 'login' ? t('Nuk keni llogari?', "Don't have an account?") : t('Keni llogari?', 'Have an account?')}
                    <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="ml-2 text-amber-500 font-medium hover:text-amber-400">
                        {authMode === 'login' ? t('Regjistrohu', 'Sign up') : t('Hyr', 'Login')}
                    </button>
                </p>
            </div>
        </div>
    );
};

// Preferences Modal Component
// Preferences Modal Component
const PreferencesModal = ({ showPreferences, setShowPreferences, userProfile, updatePreferences, categories, language, darkMode, t, onDeleteAccount }) => {
    const [selected, setSelected] = useState(userProfile?.preferences || []);

    const toggleCategory = (cat) => {
        setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    if (!showPreferences) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#2D2A26] rounded-3xl p-8 max-w-md w-full shadow-2xl border border-amber-500/20 max-h-[90vh] overflow-y-auto">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">{t('Zgjidhni Preferencat', 'Choose Preferences')}</h2>
                <p className="text-gray-400 mb-6">{t('Zgjidhni temat që ju interesojnë', 'Select topics that interest you')}</p>

                <div className="space-y-3 mb-6">
                    {categories.filter(c => c.al !== 'Te Gjitha').map(cat => (
                        <button
                            key={cat.al}
                            onClick={() => toggleCategory(cat.al)}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${selected.includes(cat.al)
                                ? 'border-amber-500 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 shadow-lg shadow-amber-500/30'
                                : 'border-[#3D3A36] text-gray-400 hover:border-amber-500/50'
                                }`}
                        >
                            {language === 'al' ? cat.al : cat.en}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3 mb-8">
                    <button onClick={() => setShowPreferences(false)} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                        {t('Anulo', 'Cancel')}
                    </button>
                    <button onClick={() => { updatePreferences(selected); setShowPreferences(false); }} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                        {t('Ruaj', 'Save')}
                    </button>
                </div>

                {/* Danger Zone - Delete Account */}
                <div className="border-t border-red-500/30 pt-6">
                    <h3 className="text-lg font-bold text-red-400 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        {t('Zona e Rrezikshme', 'Danger Zone')}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {t(
                            'Fshirja e llogarisë është e përhershme dhe nuk mund të zhbëhet.',
                            'Deleting your account is permanent and cannot be undone.'
                        )}
                    </p>
                    <button
                        onClick={() => {
                            setShowPreferences(false);
                            onDeleteAccount();
                        }}
                        className="w-full px-4 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white rounded-xl hover:from-[#FF5252] hover:to-[#FF4040] transition-all flex items-center justify-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        {t('Fshi Llogarinë', 'Delete Account')}
                    </button>
                </div>
            </div>
        </div>
    );
};
const RinON = () => {
    const [language, setLanguage] = useState('al');
    const [currentPage, setCurrentPage] = useState('home');
    const [activeCategory, setActiveCategory] = useState('Te Gjitha');
    const [showAdmin, setShowAdmin] = useState(false);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddEventForm, setShowAddEventForm] = useState(false);
    const [showAddTopicForm, setShowAddTopicForm] = useState(false);
    const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [fabOpen, setFabOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [darkMode, setDarkMode] = useState(false);
    const [pageTransition, setPageTransition] = useState(false);
    const [hasPageLoaded, setHasPageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Te Gjitha');

    // UX Enhancement States
    const [showFirstTimeTooltip, setShowFirstTimeTooltip] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [newItemsCount, setNewItemsCount] = useState(0);
    const [savedArticles, setSavedArticles] = useState([]);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [showFOMOPopup, setShowFOMOPopup] = useState(false);
    const [eventViewMode, setEventViewMode] = useState('calendar');

    const [editingItem, setEditingItem] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [showPreferences, setShowPreferences] = useState(false);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [topicPosts, setTopicPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    // User Activity Bank - Saved items & history
    const [showUserActivity, setShowUserActivity] = useState(false);
    const [savedEvents, setSavedEvents] = useState([]);
    const [userActivityTab, setUserActivityTab] = useState('saved'); // 'saved', 'history'

    // Native Share Modal
    const [showNativeShare, setShowNativeShare] = useState(false);
    const [nativeShareItem, setNativeShareItem] = useState(null);

    // Drafts System
    const [drafts, setDrafts] = useState([]);
    const [showDraftsModal, setShowDraftsModal] = useState(false);
    const [editingDraftId, setEditingDraftId] = useState(null);

    const [formData, setFormData] = useState({
        titleAl: '', titleEn: '', contentAl: '', contentEn: '',
        category: 'Sport dhe Kulturë', image: '', imageFile: null, source: '', featured: false
    });

    const [eventFormData, setEventFormData] = useState({
        titleAl: '', titleEn: '', dateAl: '', dateEn: '',
        type: '', descAl: '', descEn: '', location: '', image: '', imageFile: null,
        date: '', time: '', endTime: '', address: '', category: 'general',
        spotsLeft: 100, totalSpots: 100, isFree: true, price: '',
        registrationLink: '', isFeatured: false, tags: []
    });

    const [topicFormData, setTopicFormData] = useState({
        titleAl: '', titleEn: '', descriptionAl: '', descriptionEn: ''
    });

    const [partnerFormData, setPartnerFormData] = useState({
        nameAl: '', nameEn: '', descriptionAl: '', descriptionEn: '',
        visionAl: '', visionEn: '', goalsAl: '', goalsEn: '', website: '', image: '', imageFile: null
    });

    const [memberFormData, setMemberFormData] = useState({
        name: '', role: ''
    });

    const [articles, setArticles] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [partners, setPartners] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);
    // ==========================================
    // SCHOOLS FEATURE - STATE VARIABLES
    // ==========================================
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [schoolPosts, setSchoolPosts] = useState([]);
    const [schoolCouncil, setSchoolCouncil] = useState([]);
    const [studentOfMonth, setStudentOfMonth] = useState([]);
    const [showAddSchoolForm, setShowAddSchoolForm] = useState(false);
    const [showSchoolPostForm, setShowSchoolPostForm] = useState(false);
    const [showCouncilForm, setShowCouncilForm] = useState(false);
    const [showStudentOfMonthForm, setShowStudentOfMonthForm] = useState(false);

    const [schoolFormData, setSchoolFormData] = useState({
        nameAl: '', nameEn: '', descriptionAl: '', descriptionEn: '',
        slug: '', logo: '', coverImage: '', address: '',
        contactEmail: '', contactPhone: '', website: ''
    });

    const [schoolPostFormData, setSchoolPostFormData] = useState({
        titleAl: '', titleEn: '', contentAl: '', contentEn: '',
        type: 'news', image: '', imageFile: null,
        eventDate: '', eventTime: '', eventLocation: '', isFeatured: false
    });

    const [councilFormData, setCouncilFormData] = useState({
        studentName: '', position: '', academicYear: '', grade: '',
        photo: '', bioAl: '', bioEn: '', email: '', displayOrder: 0
    });

    const [studentOfMonthFormData, setStudentOfMonthFormData] = useState({
        studentName: '', grade: '', monthYear: '',
        achievementAl: '', achievementEn: '', photo: '',
        quoteAl: '', quoteEn: '', teacherCommentAl: '', teacherCommentEn: ''
    });
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareItem, setShareItem] = useState({ item: null, type: null });
    const t = (al, en) => language === 'al' ? al : en;
    // ==========================================
    // SCHOOLS FEATURE - PERMISSION HELPERS
    // ==========================================
    const canEditSchool = (schoolId) => {
        if (!user || !userProfile) return false;
        if (userProfile.role === 'super_admin') return true;
        if (userProfile.role === 'school_admin' && userProfile.school_id === schoolId) return true;
        return false;
    };

    const isSuperAdmin = () => {
        return userProfile?.role === 'super_admin';
    };

    // ==========================================
    // SCHOOLS FEATURE - LOAD FUNCTIONS
    // ==========================================
    const loadSchools = async () => {
        try {
            const { data, error } = await supabase
                .from('schools')
                .select('*')
                .eq('is_active', true)
                .order('name_al', { ascending: true });
            if (error) throw error;
            setSchools(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadSchools'));
        }
    };

    const loadSchoolPosts = async (schoolId) => {
        try {
            const { data, error } = await supabase
                .from('school_posts')
                .select('*')
                .eq('school_id', schoolId)
                .order('created_at', { ascending: false });
            if (error) throw error;
            setSchoolPosts(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadSchoolPosts'));
        }
    };

    const loadSchoolCouncil = async (schoolId) => {
        try {
            const { data, error } = await supabase
                .from('school_council')
                .select('*')
                .eq('school_id', schoolId)
                .order('display_order', { ascending: true });
            if (error) throw error;
            setSchoolCouncil(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadSchoolCouncil'));
        }
    };

    const loadStudentOfMonth = async (schoolId) => {
        try {
            const { data, error } = await supabase
                .from('student_of_month')
                .select('*')
                .eq('school_id', schoolId)
                .order('created_at', { ascending: false })
                .limit(6);
            if (error) throw error;
            setStudentOfMonth(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadStudentOfMonth'));
        }
    };
    const categories = [
        { al: 'Te Gjitha', en: 'All', icon: TrendingUp },
        { al: 'Sport dhe Kulturë', en: 'Sports and Culture', icon: Play },
        { al: 'Politikë dhe Ekonomi', en: 'Politics and Economics', icon: Users },
        { al: 'Vullnetarizëm', en: 'Volunteering', icon: Leaf },
        { al: 'Lifestyle', en: 'Lifestyle', icon: Film },
        { al: 'AI', en: 'AI', icon: Brain },
        { al: 'Rreth Europes', en: 'Europe Explained', icon: GlobeIcon }
    ];

    const changePage = (page) => {
        setPageTransition(true);
        setHasPageLoaded(false);
        setMobileMenuOpen(false);
        setTimeout(() => {
            setCurrentPage(page);
            setPageTransition(false);
            // Reset selectedSchool when leaving school-portal
            if (page !== 'school-portal') {
                setSelectedSchool(null);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setHasPageLoaded(true), 100);
        }, 350);
    };

    useEffect(() => {
        setHasPageLoaded(true);

        const timer = setTimeout(() => {
            setShowFOMOPopup(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    // First-time visitor tooltip
    useEffect(() => {
        const hasVisited = localStorage.getItem('rinon_visited');
        if (!hasVisited) {
            setTimeout(() => {
                setShowFirstTimeTooltip(true);
                setTimeout(() => {
                    setShowFirstTimeTooltip(false);
                    localStorage.setItem('rinon_visited', 'true');
                }, 5000);
            }, 2000);
        }
    }, []);

    // Load saved articles from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('rinon_saved_articles');
        if (saved) {
            setSavedArticles(JSON.parse(saved));
        }
        const savedEvts = localStorage.getItem('rinon_saved_events');
        if (savedEvts) {
            setSavedEvents(JSON.parse(savedEvts));
        }
        // Load drafts
        loadDrafts();
    }, []);

    // Scroll position listener for scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll to top function
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Pull-to-refresh handler
    const handlePullToRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([
            loadArticles(),
            loadEvents(),
        ]);
        setTimeout(() => setIsRefreshing(false), 1000);
    };

    // ==========================================
    // DRAFTS MANAGEMENT SYSTEM
    // ==========================================

    // Load drafts from localStorage
    const loadDrafts = () => {
        const savedDrafts = localStorage.getItem('rinon_drafts');
        if (savedDrafts) {
            setDrafts(JSON.parse(savedDrafts));
        }
    };

    // Save draft to localStorage
    const saveDraft = () => {
        if (!formData.titleAl && !formData.contentAl) {
            alert(t('Shkruaj diçka para se ta ruash si draft', 'Write something before saving as draft'));
            return;
        }

        const newDraft = {
            id: editingDraftId || Date.now().toString(),
            titleAl: formData.titleAl,
            titleEn: formData.titleEn,
            contentAl: formData.contentAl,
            contentEn: formData.contentEn,
            category: formData.category,
            image: formData.image,
            source: formData.source,
            featured: formData.featured,
            createdAt: editingDraftId ? drafts.find(d => d.id === editingDraftId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        setDrafts(prev => {
            let updated;
            if (editingDraftId) {
                // Update existing draft
                updated = prev.map(d => d.id === editingDraftId ? newDraft : d);
            } else {
                // Add new draft
                updated = [newDraft, ...prev];
            }
            localStorage.setItem('rinon_drafts', JSON.stringify(updated));
            return updated;
        });

        // Reset form
        setFormData({
            titleAl: '', titleEn: '', contentAl: '', contentEn: '',
            category: 'Sport dhe Kulturë', image: '', imageFile: null, source: '', featured: false
        });
        setEditingDraftId(null);
        setShowAddForm(false);
        alert(t('Draft u ruajt me sukses!', 'Draft saved successfully!'));
    };

    // Load draft into form for editing
    const editDraft = (draft) => {
        setFormData({
            titleAl: draft.titleAl || '',
            titleEn: draft.titleEn || '',
            contentAl: draft.contentAl || '',
            contentEn: draft.contentEn || '',
            category: draft.category || 'Sport dhe Kulturë',
            image: draft.image || '',
            imageFile: null,
            source: draft.source || '',
            featured: draft.featured || false
        });
        setEditingDraftId(draft.id);
        setShowDraftsModal(false);
        setShowAddForm(true);
    };

    // Delete draft
    const deleteDraft = (draftId) => {
        if (window.confirm(t('Je i sigurt që dëshiron ta fshish këtë draft?', 'Are you sure you want to delete this draft?'))) {
            setDrafts(prev => {
                const updated = prev.filter(d => d.id !== draftId);
                localStorage.setItem('rinon_drafts', JSON.stringify(updated));
                return updated;
            });
        }
    };

    // Publish draft (convert to article)
    const publishDraft = async (draft) => {
        setFormData({
            titleAl: draft.titleAl || '',
            titleEn: draft.titleEn || '',
            contentAl: draft.contentAl || '',
            contentEn: draft.contentEn || '',
            category: draft.category || 'Sport dhe Kulturë',
            image: draft.image || '',
            imageFile: null,
            source: draft.source || '',
            featured: draft.featured || false
        });
        setEditingDraftId(draft.id);
        setShowDraftsModal(false);
        setShowAddForm(true);
    };

    // Save/Unsave article handler
    const toggleSaveArticle = (articleId) => {
        setSavedArticles(prev => {
            const newSaved = prev.includes(articleId)
                ? prev.filter(id => id !== articleId)
                : [...prev, articleId];
            localStorage.setItem('rinon_saved_articles', JSON.stringify(newSaved));
            return newSaved;
        });
    };

    // Search filter function
    const getFilteredArticles = () => {
        let filtered = articles;

        // Category filter
        if (selectedCategoryFilter !== 'Te Gjitha') {
            filtered = filtered.filter(a => a.category === selectedCategoryFilter);
        }

        // Search query filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.titleAl?.toLowerCase().includes(query) ||
                a.titleEn?.toLowerCase().includes(query) ||
                a.contentAl?.toLowerCase().includes(query) ||
                a.contentEn?.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    // Search filter for events
    const getFilteredEvents = () => {
        let filtered = otherEvents;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(e =>
                e.titleAl?.toLowerCase().includes(query) ||
                e.titleEn?.toLowerCase().includes(query) ||
                e.descAl?.toLowerCase().includes(query) ||
                e.descEn?.toLowerCase().includes(query) ||
                e.location?.toLowerCase().includes(query)
            );
        }

        return filtered;
    };

    // Native Share function - opens device share sheet
    const handleNativeShare = async (item, type) => {
        const title = language === 'al' ? item.titleAl : item.titleEn;
        const url = `${window.location.origin}/${type}/${item.id}`;
        const text = type === 'article'
            ? t('Lexo këtë artikull në RinON', 'Read this article on RinON')
            : t('Shiko këtë event në RinON', 'Check out this event on RinON');

        // Check if native share is supported
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    // If share was cancelled, don't show error
                    console.log('Share failed:', err);
                }
            }
        } else {
            // Fallback: show custom share modal
            setNativeShareItem({ item, type, url, title });
            setShowNativeShare(true);
        }
    };

    // Save/Unsave event handler
    const toggleSaveEvent = (eventId) => {
        setSavedEvents(prev => {
            const newSaved = prev.includes(eventId)
                ? prev.filter(id => id !== eventId)
                : [...prev, eventId];
            localStorage.setItem('rinon_saved_events', JSON.stringify(newSaved));
            return newSaved;
        });
    };

    // Get saved articles with full data
    const getSavedArticlesData = () => {
        return articles.filter(a => savedArticles.includes(a.id));
    };

    // Get saved events with full data
    const getSavedEventsData = () => {
        return otherEvents.filter(e => savedEvents.includes(e.id));
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            if (session?.user) loadUserProfile(session.user.id);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) loadUserProfile(session.user.id);
            else setUserProfile(null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        loadArticles();
        loadTopics();
        loadEvents();
        loadPartners();
        loadTeamMembers();
        loadSchools();
    }, []);
    useEffect(() => {
        if (selectedSchool) {
            loadSchoolPosts(selectedSchool.id);
            loadSchoolCouncil(selectedSchool.id);
            loadStudentOfMonth(selectedSchool.id);
        }
    }, [selectedSchool]);
    useEffect(() => {
        if (selectedTopic && user) loadPosts(selectedTopic.id);
    }, [selectedTopic, user]);
    // URL Routing - Handle shared links like /article/123 or /event/456
    useEffect(() => {
        const handleRouting = () => {
            const path = window.location.pathname;

            // Check if URL matches /article/[id]
            const articleMatch = path.match(/^\/article\/(.+)$/);
            if (articleMatch && articles.length > 0) {
                const articleId = articleMatch[1];
                const article = articles.find(a => String(a.id) === articleId);
                if (article) {
                    setSelectedArticle(article);
                    setShowArticleModal(true);
                    setCurrentPage('home');
                }
                return;
            }

            // Check if URL matches /event/[id]
            const eventMatch = path.match(/^\/event\/(.+)$/);
            if (eventMatch && otherEvents.length > 0) {
                const eventId = eventMatch[1];
                const event = otherEvents.find(e => String(e.id) === eventId);
                if (event) {
                    setSelectedEvent(event);
                    setShowEventModal(true);
                    setCurrentPage('events');
                }
                return;
            }
        };

        if (!loading) {
            handleRouting();
        }
    }, [articles, otherEvents, loading]);
    const loadUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
            if (error) throw error;
            if (data) {
                setUserProfile(data);
                if (data.is_admin) setShowAdmin(true);
            }
        } catch (err) {
            console.error(handleError(err, 'loadUserProfile'));
        }
    };

    const loadArticles = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            if (data && data.length > 0) {
                const formattedArticles = data.map(a => ({
                    id: a.id, titleAl: a.title_al, titleEn: a.title_en,
                    contentAl: a.content_al, contentEn: a.content_en,
                    category: a.category, image: a.image, source: a.source,
                    featured: a.featured, date: new Date(a.created_at).toISOString().split('T')[0]
                }));
                setArticles(formattedArticles);
            }
        } catch (err) {
            console.error(handleError(err, 'loadArticles'));
        } finally {
            setLoading(false);
        }
    };

    const loadTopics = async () => {
        try {
            const { data, error } = await supabase.from('topics').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setTopics(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadTopics'));
        }
    };

    const loadEvents = async () => {
        try {
            const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            if (data && data.length > 0) {
                const formattedEvents = data.map(e => ({
                    id: e.id, titleAl: e.title_al, titleEn: e.title_en,
                    dateAl: e.date_al, dateEn: e.date_en, type: e.type,
                    descAl: e.desc_al, descEn: e.desc_en, location: e.location, image: e.image,
                    date: e.date, time: e.time, endTime: e.end_time, address: e.address,
                    category: e.category, spots_left: e.spots_left, total_spots: e.total_spots,
                    is_free: e.is_free, price: e.price, attendees: e.attendees,
                    partner: e.partner, registration_link: e.registration_link,
                    is_featured: e.is_featured, is_trending: e.is_trending, tags: e.tags
                }));
                setOtherEvents(formattedEvents);
            }
        } catch (err) {
            console.error(handleError(err, 'loadEvents'));
        }
    };

    const loadPartners = async () => {
        try {
            const { data, error } = await supabase.from('partners').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            if (data && data.length > 0) {
                const formattedPartners = data.map(p => ({
                    id: p.id, nameAl: p.name_al, nameEn: p.name_en,
                    descriptionAl: p.description_al, descriptionEn: p.description_en,
                    visionAl: p.vision_al, visionEn: p.vision_en,
                    goalsAl: p.goals_al, goalsEn: p.goals_en,
                    website: p.website, image: p.image
                }));
                setPartners(formattedPartners);
            }
        } catch (err) {
            console.error(handleError(err, 'loadPartners'));
        }
    };

    const loadTeamMembers = async () => {
        try {
            const { data, error } = await supabase.from('team_members').select('*').order('created_at', { ascending: true });
            if (error) throw error;
            if (data && data.length > 0) setStaffMembers(data);
        } catch (err) {
            console.error(handleError(err, 'loadTeamMembers'));
        }
    };

    const loadPosts = async (topicId) => {
        try {
            const { data, error } = await supabase.from('posts').select('*').eq('topic_id', topicId).order('created_at', { ascending: false });
            if (error) throw error;
            setTopicPosts(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadPosts'));
        }
    };

    const handleSignup = async (email, password, displayName, rememberMe = true) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password,
                options: {
                    data: { display_name: validateInput.sanitizeHtml(displayName) },
                    emailRedirectTo: window.location.origin
                }
            });

            if (!error && data.user) {
                await supabase.from('user_profiles').insert([{
                    id: data.user.id,
                    display_name: validateInput.sanitizeHtml(displayName),
                    preferences: []
                }]);

                // Set session persistence based on rememberMe
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }

                setShowPreferences(true);
            }

            return { data, error };
        } catch (err) {
            return { error: { message: handleError(err, 'handleSignup') } };
        }
    };

    const handleLogin = async (email, password, rememberMe = true) => {
        try {
            const result = await supabase.auth.signInWithPassword({ email, password });

            if (!result.error) {
                // Set session persistence based on rememberMe
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                    // If not remember me, session will be cleared on browser close
                }
            }

            return result;
        } catch (err) {
            return { error: { message: handleError(err, 'handleLogin') } };
        }
    };

    const handleLogout = async () => {
        try {
            localStorage.removeItem('rememberMe');
            await supabase.auth.signOut();
        } catch (err) {
            console.error(handleError(err, 'handleLogout'));
        }
    };
    const handleDeleteAccount = async () => {
        if (!user) return;

        const confirmDelete = window.confirm(
            t(
                'Jeni i sigurt që dëshironi të fshini llogarinë tuaj? Ky veprim nuk mund të zhbëhet dhe të gjitha të dhënat tuaja do të fshihen përgjithmonë.',
                'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently deleted.'
            )
        );

        if (!confirmDelete) return;

        const doubleConfirm = window.confirm(
            t(
                'Konfirmoni përsëri: A jeni ABSOLUTISHT i sigurt? Kjo do të fshijë llogarinë tuaj përgjithmonë.',
                'Confirm again: Are you ABSOLUTELY sure? This will delete your account forever.'
            )
        );

        if (!doubleConfirm) return;

        try {
            // Delete user's posts first
            await supabase.from('posts').delete().eq('user_id', user.id);

            // Delete user profile
            await supabase.from('user_profiles').delete().eq('id', user.id);

            // Note: Deleting from auth.users requires a server-side function or Supabase Edge Function
            // For now, we'll sign out and show a message
            await supabase.auth.signOut();

            alert(t(
                'Llogaria juaj u fshi me sukses. Ju lutem kontaktoni suportin nëse keni nevojë për ndihmë të mëtejshme.',
                'Your account has been deleted successfully. Please contact support if you need further assistance.'
            ));

        } catch (err) {
            alert(handleError(err, 'handleDeleteAccount'));
        }
    };
    const updatePreferences = async (prefs) => {
        if (!user) return;
        try {
            const { error } = await supabase.from('user_profiles').update({ preferences: prefs }).eq('id', user.id);
            if (error) throw error;
            loadUserProfile(user.id);
        } catch (err) {
            console.error(handleError(err, 'updatePreferences'));
        }
    };

    const submitPost = async () => {
        if (!newPost.trim() || !selectedTopic || !user) return;

        if (!validateInput.text(newPost, 2000)) {
            alert(t('Postimi duhet të jetë 1-2000 karaktere', 'Post must be 1-2000 characters'));
            return;
        }

        try {
            const { error } = await supabase.from('posts').insert([{
                topic_id: selectedTopic.id,
                user_id: user.id,
                user_name: userProfile?.display_name || user.email,
                content: validateInput.sanitizeHtml(newPost)
            }]);

            if (error) throw error;

            setNewPost('');
            loadPosts(selectedTopic.id);
        } catch (err) {
            alert(handleError(err, 'submitPost'));
        }
    };

    const deletePost = async (id) => {
        try {
            const { error } = await supabase.from('posts').delete().eq('id', id);
            if (error) throw error;
            if (selectedTopic) loadPosts(selectedTopic.id);
        } catch (err) {
            alert(handleError(err, 'deletePost'));
        }
    };

    const deleteTopic = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë temë?', 'Are you sure you want to delete this topic?'))) {
            try {
                const { error } = await supabase.from('topics').delete().eq('id', id);
                if (error) throw error;
                loadTopics();
            } catch (err) {
                alert(handleError(err, 'deleteTopic'));
            }
        }
    };

    const deleteArticle = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë artikull?', 'Are you sure you want to delete this article?'))) {
            try {
                const { error } = await supabase.from('articles').delete().eq('id', id);
                if (error) throw error;
                loadArticles();
            } catch (err) {
                alert(handleError(err, 'deleteArticle'));
            }
        }
    };

    const deleteEvent = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë event?', 'Are you sure you want to delete this event?'))) {
            try {
                const { error } = await supabase.from('events').delete().eq('id', id);
                if (error) throw error;
                loadEvents();
            } catch (err) {
                alert(handleError(err, 'deleteEvent'));
            }
        }
    };

    const deletePartner = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë partner?', 'Are you sure you want to delete this partner?'))) {
            try {
                const { error } = await supabase.from('partners').delete().eq('id', id);
                if (error) throw error;
                loadPartners();
            } catch (err) {
                alert(handleError(err, 'deletePartner'));
            }
        }
    };

    const deleteMember = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë anëtar?', 'Are you sure you want to delete this member?'))) {
            try {
                const { error } = await supabase.from('team_members').delete().eq('id', id);
                if (error) throw error;
                loadTeamMembers();
            } catch (err) {
                alert(handleError(err, 'deleteMember'));
            }
        }
    };

    const editArticle = (article) => {
        setEditingItem(article);
        setEditMode(true);
        setFormData({
            titleAl: article.titleAl,
            titleEn: article.titleEn,
            contentAl: article.contentAl,
            contentEn: article.contentEn,
            category: article.category,
            image: article.image,
            imageFile: null,
            source: article.source,
            featured: article.featured
        });
        setShowAddForm(true);
    };

    const editEvent = (event) => {
        setEditingItem(event);
        setEditMode(true);
        setEventFormData({
            titleAl: event.titleAl,
            titleEn: event.titleEn,
            dateAl: event.dateAl,
            dateEn: event.dateEn,
            type: event.type,
            descAl: event.descAl,
            descEn: event.descEn,
            location: event.location,
            image: event.image,
            imageFile: null,
            date: event.date || '',
            time: event.time || '',
            endTime: event.endTime || '',
            address: event.address || '',
            category: event.category || 'general',
            spotsLeft: event.spots_left || 100,
            totalSpots: event.total_spots || 100,
            isFree: event.is_free !== false,
            price: event.price || '',
            registrationLink: event.registration_link || '',
            isFeatured: event.is_featured || false,
            tags: event.tags || []
        });
        setShowAddEventForm(true);
    };

    const editPartner = (partner) => {
        setEditingItem(partner);
        setEditMode(true);
        setPartnerFormData({
            nameAl: partner.nameAl,
            nameEn: partner.nameEn,
            descriptionAl: partner.descriptionAl,
            descriptionEn: partner.descriptionEn,
            visionAl: partner.visionAl,
            visionEn: partner.visionEn,
            goalsAl: partner.goalsAl,
            goalsEn: partner.goalsEn,
            website: partner.website,
            image: partner.image,
            imageFile: null
        });
        setShowAddPartnerForm(true);
    };

    const editMember = (member) => {
        setEditingItem(member);
        setEditMode(true);
        setMemberFormData({
            name: member.name,
            role: member.role
        });
        setShowAddMemberForm(true);
    };

    const handleSubmitArticle = async (saveAsDraft = false) => {
        if (!formData.titleAl || !formData.contentAl) {
            alert(t('Ju lutem plotësoni fushat e detyrueshme në shqip', 'Please fill in required Albanian fields'));
            return;
        }

        if (!validateInput.text(formData.titleAl, 200)) {
            alert(t('Titulli duhet të jetë 1-200 karaktere', 'Title must be 1-200 characters'));
            return;
        }

        if (!validateInput.text(formData.contentAl, 10000)) {
            alert(t('Përmbajtja duhet të jetë 1-10000 karaktere', 'Content must be 1-10000 characters'));
            return;
        }

        try {
            let imageUrl = formData.image;

            if (formData.imageFile) {
                imageUrl = await uploadImage(formData.imageFile);
            }

            const article = {
                title_al: validateInput.sanitizeHtml(formData.titleAl),
                title_en: validateInput.sanitizeHtml(formData.titleEn || formData.titleAl),
                content_al: validateInput.sanitizeHtml(formData.contentAl),
                content_en: validateInput.sanitizeHtml(formData.contentEn || formData.contentAl),
                category: formData.category,
                image: imageUrl || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800`,
                source: validateInput.sanitizeHtml(formData.source),
                featured: formData.featured,
                author_id: user?.id
            };

            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('articles').update(article).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('articles').insert([article]));
            }

            if (error) throw error;

            // If publishing from a draft, delete the draft
            if (editingDraftId) {
                setDrafts(prev => {
                    const updated = prev.filter(d => d.id !== editingDraftId);
                    localStorage.setItem('rinon_drafts', JSON.stringify(updated));
                    return updated;
                });
                setEditingDraftId(null);
            }

            loadArticles();
            setFormData({
                titleAl: '', titleEn: '', contentAl: '', contentEn: '',
                category: 'Sport dhe Kulturë', image: '', imageFile: null, source: '', featured: false
            });
            setShowAddForm(false);
            setEditMode(false);
            setEditingItem(null);

            alert(t(editMode ? 'Artikulli u përditësua me sukses!' : 'Artikulli u publikua me sukses!',
                editMode ? 'Article updated successfully!' : 'Article published successfully!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitArticle'));
        }
    };

    const handleSubmitEvent = async () => {
        if (!eventFormData.titleAl || !eventFormData.dateAl) {
            alert(t('Ju lutem plotësoni fushat e detyrueshme në shqip', 'Please fill in required Albanian fields'));
            return;
        }

        if (!validateInput.text(eventFormData.titleAl, 200)) {
            alert(t('Titulli duhet të jetë 1-200 karaktere', 'Title must be 1-200 characters'));
            return;
        }

        try {
            let imageUrl = eventFormData.image;

            if (eventFormData.imageFile) {
                imageUrl = await uploadImage(eventFormData.imageFile);
            }

            const event = {
                title_al: validateInput.sanitizeHtml(eventFormData.titleAl),
                title_en: validateInput.sanitizeHtml(eventFormData.titleEn || eventFormData.titleAl),
                date_al: validateInput.sanitizeHtml(eventFormData.dateAl),
                date_en: validateInput.sanitizeHtml(eventFormData.dateEn || eventFormData.dateAl),
                type: validateInput.sanitizeHtml(eventFormData.type),
                desc_al: validateInput.sanitizeHtml(eventFormData.descAl),
                desc_en: validateInput.sanitizeHtml(eventFormData.descEn || eventFormData.descAl),
                location: validateInput.sanitizeHtml(eventFormData.location),
                image: imageUrl || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800`,
                date: eventFormData.date,
                time: eventFormData.time,
                end_time: eventFormData.endTime,
                address: validateInput.sanitizeHtml(eventFormData.address),
                category: eventFormData.category,
                spots_left: eventFormData.spotsLeft,
                total_spots: eventFormData.totalSpots,
                is_free: eventFormData.isFree,
                price: eventFormData.price,
                attendees: 0,
                partner: validateInput.sanitizeHtml(eventFormData.partner || ''),
                registration_link: eventFormData.registrationLink,
                is_featured: eventFormData.isFeatured,
                is_trending: false,
                tags: eventFormData.tags
            };

            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('events').update(event).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('events').insert([event]));
            }

            if (error) throw error;

            loadEvents();
            setEventFormData({
                titleAl: '', titleEn: '', dateAl: '', dateEn: '',
                type: '', descAl: '', descEn: '', location: '', image: '', imageFile: null,
                date: '', time: '', endTime: '', address: '', category: 'general',
                spotsLeft: 100, totalSpots: 100, isFree: true, price: '',
                registrationLink: '', isFeatured: false, tags: []
            });
            setShowAddEventForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Eventi u përditësua me sukses!' : 'Eventi u shtua me sukses!',
                editMode ? 'Event updated successfully!' : 'Event added successfully!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitEvent'));
        }
    };

    const handleSubmitTopic = async () => {
        if (!topicFormData.titleAl || !topicFormData.descriptionAl) {
            alert(t('Ju lutem plotësoni fushat e detyrueshme në shqip', 'Please fill in required Albanian fields'));
            return;
        }

        if (!validateInput.text(topicFormData.titleAl, 200)) {
            alert(t('Titulli duhet të jetë 1-200 karaktere', 'Title must be 1-200 characters'));
            return;
        }

        if (!validateInput.text(topicFormData.descriptionAl, 1000)) {
            alert(t('Përshkrimi duhet të jetë 1-1000 karaktere', 'Description must be 1-1000 characters'));
            return;
        }

        try {
            const topic = {
                title_al: validateInput.sanitizeHtml(topicFormData.titleAl),
                title_en: validateInput.sanitizeHtml(topicFormData.titleEn || topicFormData.titleAl),
                description_al: validateInput.sanitizeHtml(topicFormData.descriptionAl),
                description_en: validateInput.sanitizeHtml(topicFormData.descriptionEn || topicFormData.descriptionAl),
                created_by: user?.id
            };

            const { data, error } = await supabase.from('topics').insert([topic]).select();

            if (error) throw error;

            if (data) {
                loadTopics();
                setTopicFormData({
                    titleAl: '', titleEn: '', descriptionAl: '', descriptionEn: ''
                });
                setShowAddTopicForm(false);
                alert(t('Tema u shtua me sukses!', 'Topic added successfully!'));
            }
        } catch (err) {
            alert(handleError(err, 'handleSubmitTopic'));
        }
    };

    const handleSubmitPartner = async () => {
        if (!partnerFormData.nameAl || !partnerFormData.nameEn) {
            alert(t('Ju lutem plotësoni emrin', 'Please fill in the name'));
            return;
        }

        if (!validateInput.text(partnerFormData.nameAl, 100)) {
            alert(t('Emri duhet të jetë 1-100 karaktere', 'Name must be 1-100 characters'));
            return;
        }

        if (partnerFormData.website && !validateInput.url(partnerFormData.website)) {
            alert(t('URL e website është e pavlefshme', 'Invalid website URL'));
            return;
        }

        try {
            let imageUrl = partnerFormData.image;

            if (partnerFormData.imageFile) {
                imageUrl = await uploadImage(partnerFormData.imageFile);
            }

            const partner = {
                name_al: validateInput.sanitizeHtml(partnerFormData.nameAl),
                name_en: validateInput.sanitizeHtml(partnerFormData.nameEn),
                description_al: validateInput.sanitizeHtml(partnerFormData.descriptionAl),
                description_en: validateInput.sanitizeHtml(partnerFormData.descriptionEn),
                vision_al: validateInput.sanitizeHtml(partnerFormData.visionAl),
                vision_en: validateInput.sanitizeHtml(partnerFormData.visionEn),
                goals_al: validateInput.sanitizeHtml(partnerFormData.goalsAl),
                goals_en: validateInput.sanitizeHtml(partnerFormData.goalsEn),
                website: partnerFormData.website,
                image: imageUrl || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800`
            };

            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('partners').update(partner).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('partners').insert([partner]));
            }

            if (error) throw error;

            loadPartners();
            setPartnerFormData({
                nameAl: '', nameEn: '', descriptionAl: '', descriptionEn: '',
                visionAl: '', visionEn: '', goalsAl: '', goalsEn: '', website: '', image: '', imageFile: null
            });
            setShowAddPartnerForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Partneri u përditësua me sukses!' : 'Partneri u shtua me sukses!',
                editMode ? 'Partner updated successfully!' : 'Partner added successfully!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitPartner'));
        }
    };

    const handleSubmitMember = async () => {
        if (!memberFormData.name || !memberFormData.role) {
            alert(t('Ju lutem plotësoni të gjitha fushat', 'Please fill in all fields'));
            return;
        }

        if (!validateInput.text(memberFormData.name, 100)) {
            alert(t('Emri duhet të jetë 1-100 karaktere', 'Name must be 1-100 characters'));
            return;
        }

        if (!validateInput.text(memberFormData.role, 100)) {
            alert(t('Roli duhet të jetë 1-100 karaktere', 'Role must be 1-100 characters'));
            return;
        }

        try {
            const member = {
                name: validateInput.sanitizeHtml(memberFormData.name),
                role: validateInput.sanitizeHtml(memberFormData.role)
            };

            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('team_members').update(member).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('team_members').insert([member]));
            }

            if (error) throw error;

            loadTeamMembers();
            setMemberFormData({ name: '', role: '' });
            setShowAddMemberForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Anëtari u përditësua me sukses!' : 'Anëtari u shtua me sukses!',
                editMode ? 'Member updated successfully!' : 'Member added successfully!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitMember'));
        }
    };
    // ==========================================
    // SCHOOLS FEATURE - SUBMIT FUNCTIONS
    // ==========================================
    const handleSubmitSchool = async () => {
        if (!schoolFormData.nameAl || !schoolFormData.slug) {
            alert(t('Ju lutem plotësoni fushat e detyrueshme', 'Please fill in required fields'));
            return;
        }
        try {
            const school = {
                name_al: validateInput.sanitizeHtml(schoolFormData.nameAl),
                name_en: validateInput.sanitizeHtml(schoolFormData.nameEn || schoolFormData.nameAl),
                description_al: validateInput.sanitizeHtml(schoolFormData.descriptionAl),
                description_en: validateInput.sanitizeHtml(schoolFormData.descriptionEn),
                slug: schoolFormData.slug.toLowerCase().replace(/\s+/g, '-'),
                logo: schoolFormData.logo,
                cover_image: schoolFormData.coverImage,
                address: validateInput.sanitizeHtml(schoolFormData.address),
                contact_email: schoolFormData.contactEmail,
                contact_phone: schoolFormData.contactPhone,
                website: schoolFormData.website
            };
            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('schools').update(school).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('schools').insert([school]));
            }
            if (error) throw error;
            loadSchools();
            setSchoolFormData({
                nameAl: '', nameEn: '', descriptionAl: '', descriptionEn: '',
                slug: '', logo: '', coverImage: '', address: '',
                contactEmail: '', contactPhone: '', website: ''
            });
            setShowAddSchoolForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Shkolla u përditësua!' : 'Shkolla u shtua!', editMode ? 'School updated!' : 'School added!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitSchool'));
        }
    };

    const handleSubmitSchoolPost = async () => {
        if (!schoolPostFormData.titleAl || !schoolPostFormData.contentAl) {
            alert(t('Ju lutem plotësoni fushat e detyrueshme', 'Please fill in required fields'));
            return;
        }
        if (!selectedSchool) {
            alert(t('Shkolla nuk është zgjedhur', 'No school selected'));
            return;
        }
        try {
            let imageUrl = schoolPostFormData.image;
            if (schoolPostFormData.imageFile) {
                imageUrl = await uploadImage(schoolPostFormData.imageFile);
            }
            const post = {
                school_id: selectedSchool.id,
                author_id: user.id,
                type: schoolPostFormData.type,
                title_al: validateInput.sanitizeHtml(schoolPostFormData.titleAl),
                title_en: validateInput.sanitizeHtml(schoolPostFormData.titleEn || schoolPostFormData.titleAl),
                content_al: validateInput.sanitizeHtml(schoolPostFormData.contentAl),
                content_en: validateInput.sanitizeHtml(schoolPostFormData.contentEn),
                image: imageUrl,
                event_date: schoolPostFormData.eventDate || null,
                event_time: schoolPostFormData.eventTime || null,
                event_location: schoolPostFormData.eventLocation || null,
                is_featured: schoolPostFormData.isFeatured
            };
            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('school_posts').update(post).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('school_posts').insert([post]));
            }
            if (error) throw error;
            loadSchoolPosts(selectedSchool.id);
            setSchoolPostFormData({
                titleAl: '', titleEn: '', contentAl: '', contentEn: '',
                type: 'news', image: '', imageFile: null,
                eventDate: '', eventTime: '', eventLocation: '', isFeatured: false
            });
            setShowSchoolPostForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Postimi u përditësua!' : 'Postimi u shtua!', editMode ? 'Post updated!' : 'Post added!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitSchoolPost'));
        }
    };

    const handleSubmitCouncil = async () => {
        if (!councilFormData.studentName || !councilFormData.position) {
            alert(t('Ju lutem plotësoni fushat e detyrueshme', 'Please fill in required fields'));
            return;
        }
        if (!selectedSchool) {
            alert(t('Shkolla nuk është zgjedhur', 'No school selected'));
            return;
        }
        try {
            const member = {
                school_id: selectedSchool.id,
                student_name: validateInput.sanitizeHtml(councilFormData.studentName),
                position: validateInput.sanitizeHtml(councilFormData.position),
                academic_year: councilFormData.academicYear,
                grade: councilFormData.grade,
                photo: councilFormData.photo,
                bio_al: validateInput.sanitizeHtml(councilFormData.bioAl),
                bio_en: validateInput.sanitizeHtml(councilFormData.bioEn),
                email: councilFormData.email,
                display_order: councilFormData.displayOrder
            };
            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('school_council').update(member).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('school_council').insert([member]));
            }
            if (error) throw error;
            loadSchoolCouncil(selectedSchool.id);
            setCouncilFormData({
                studentName: '', position: '', academicYear: '', grade: '',
                photo: '', bioAl: '', bioEn: '', email: '', displayOrder: 0
            });
            setShowCouncilForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Anëtari u përditësua!' : 'Anëtari u shtua!', editMode ? 'Member updated!' : 'Member added!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitCouncil'));
        }
    };

    const handleSubmitStudentOfMonth = async () => {
        if (!studentOfMonthFormData.studentName || !studentOfMonthFormData.achievementAl) {
            alert(t('Ju lutem plotësoni fushat e detyrueshme', 'Please fill in required fields'));
            return;
        }
        if (!selectedSchool) {
            alert(t('Shkolla nuk është zgjedhur', 'No school selected'));
            return;
        }
        try {
            const student = {
                school_id: selectedSchool.id,
                student_name: validateInput.sanitizeHtml(studentOfMonthFormData.studentName),
                grade: validateInput.sanitizeHtml(studentOfMonthFormData.grade),
                month_year: studentOfMonthFormData.monthYear,
                achievement_al: validateInput.sanitizeHtml(studentOfMonthFormData.achievementAl),
                achievement_en: validateInput.sanitizeHtml(studentOfMonthFormData.achievementEn),
                photo: studentOfMonthFormData.photo,
                quote_al: validateInput.sanitizeHtml(studentOfMonthFormData.quoteAl),
                quote_en: validateInput.sanitizeHtml(studentOfMonthFormData.quoteEn),
                teacher_comment_al: validateInput.sanitizeHtml(studentOfMonthFormData.teacherCommentAl),
                teacher_comment_en: validateInput.sanitizeHtml(studentOfMonthFormData.teacherCommentEn)
            };
            let error;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('student_of_month').update(student).eq('id', editingItem.id));
            } else {
                ({ error } = await supabase.from('student_of_month').insert([student]));
            }
            if (error) throw error;
            loadStudentOfMonth(selectedSchool.id);
            setStudentOfMonthFormData({
                studentName: '', grade: '', monthYear: '',
                achievementAl: '', achievementEn: '', photo: '',
                quoteAl: '', quoteEn: '', teacherCommentAl: '', teacherCommentEn: ''
            });
            setShowStudentOfMonthForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Nxënësi u përditësua!' : 'Nxënësi u shtua!', editMode ? 'Student updated!' : 'Student added!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitStudentOfMonth'));
        }
    };

    // ==========================================
    // SCHOOLS FEATURE - DELETE FUNCTIONS
    // ==========================================
    const deleteSchool = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë shkollë?', 'Are you sure you want to delete this school?'))) {
            try {
                const { error } = await supabase.from('schools').delete().eq('id', id);
                if (error) throw error;
                loadSchools();
            } catch (err) {
                alert(handleError(err, 'deleteSchool'));
            }
        }
    };

    const deleteSchoolPost = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë postim?', 'Are you sure you want to delete this post?'))) {
            try {
                const { error } = await supabase.from('school_posts').delete().eq('id', id);
                if (error) throw error;
                if (selectedSchool) loadSchoolPosts(selectedSchool.id);
            } catch (err) {
                alert(handleError(err, 'deleteSchoolPost'));
            }
        }
    };

    const deleteCouncilMember = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë anëtar?', 'Are you sure you want to delete this member?'))) {
            try {
                const { error } = await supabase.from('school_council').delete().eq('id', id);
                if (error) throw error;
                if (selectedSchool) loadSchoolCouncil(selectedSchool.id);
            } catch (err) {
                alert(handleError(err, 'deleteCouncilMember'));
            }
        }
    };

    const deleteStudentOfMonth = async (id) => {
        if (window.confirm(t('Jeni i sigurt që dëshironi të fshini këtë nxënës?', 'Are you sure you want to delete this student?'))) {
            try {
                const { error } = await supabase.from('student_of_month').delete().eq('id', id);
                if (error) throw error;
                if (selectedSchool) loadStudentOfMonth(selectedSchool.id);
            } catch (err) {
                alert(handleError(err, 'deleteStudentOfMonth'));
            }
        }
    };

    // ==========================================
    // SCHOOLS FEATURE - EDIT FUNCTIONS
    // ==========================================
    const editSchool = (school) => {
        setEditingItem(school);
        setEditMode(true);
        setSchoolFormData({
            nameAl: school.name_al, nameEn: school.name_en,
            descriptionAl: school.description_al, descriptionEn: school.description_en,
            slug: school.slug, logo: school.logo, coverImage: school.cover_image,
            address: school.address, contactEmail: school.contact_email,
            contactPhone: school.contact_phone, website: school.website
        });
        setShowAddSchoolForm(true);
    };

    const editSchoolPost = (post) => {
        setEditingItem(post);
        setEditMode(true);
        setSchoolPostFormData({
            titleAl: post.title_al, titleEn: post.title_en,
            contentAl: post.content_al, contentEn: post.content_en,
            type: post.type, image: post.image, imageFile: null,
            eventDate: post.event_date || '', eventTime: post.event_time || '',
            eventLocation: post.event_location || '', isFeatured: post.is_featured
        });
        setShowSchoolPostForm(true);
    };

    const editCouncilMember = (member) => {
        setEditingItem(member);
        setEditMode(true);
        setCouncilFormData({
            studentName: member.student_name, position: member.position,
            academicYear: member.academic_year, grade: member.grade,
            photo: member.photo, bioAl: member.bio_al, bioEn: member.bio_en,
            email: member.email, displayOrder: member.display_order
        });
        setShowCouncilForm(true);
    };

    const editStudentOfMonth = (student) => {
        setEditingItem(student);
        setEditMode(true);
        setStudentOfMonthFormData({
            studentName: student.student_name, grade: student.grade,
            monthYear: student.month_year, achievementAl: student.achievement_al,
            achievementEn: student.achievement_en, photo: student.photo,
            quoteAl: student.quote_al, quoteEn: student.quote_en,
            teacherCommentAl: student.teacher_comment_al, teacherCommentEn: student.teacher_comment_en
        });
        setShowStudentOfMonthForm(true);
    };
    const featuredArticles = articles.filter(a => a.featured);

    // Filtered articles with both category and search
    const filteredArticles = (() => {
        let filtered = articles;

        // Category filter (use selectedCategoryFilter from pills OR activeCategory from old system)
        const categoryToUse = selectedCategoryFilter || activeCategory;
        if (categoryToUse !== 'Te Gjitha' && categoryToUse !== 'All') {
            filtered = filtered.filter(a => a.category === categoryToUse);
        }

        // Search query filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(a =>
                a.titleAl?.toLowerCase().includes(query) ||
                a.titleEn?.toLowerCase().includes(query) ||
                a.contentAl?.toLowerCase().includes(query) ||
                a.contentEn?.toLowerCase().includes(query)
            );
        }

        return filtered;
    })();

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);

    const openArticle = (article) => {
        setSelectedArticle(article);
        setShowArticleModal(true);
        // Update browser URL without reloading page
        window.history.pushState({}, '', `/article/${article.id}`);
    };
    const openEvent = (event) => {
        setSelectedEvent(event);
        setShowEventModal(true);
        window.history.pushState({}, '', `/event/${event.id}`);
    };
    const openShareModal = (item, type) => {
        setShareItem({ item, type });
        setShowShareModal(true);
    };
    // Event Hero Slider Component
    const EventHeroSlider = ({ events, language, darkMode, t, openEvent, openShareModal }) => {
        const [currentSlide, setCurrentSlide] = useState(0);
        const [isAutoPlaying, setIsAutoPlaying] = useState(false);

        // Filter featured/trending/upcoming events (max 5)
        const featuredEvents = events
            .filter(e => e.is_featured || e.is_trending || (e.date && new Date(e.date) >= new Date()))
            .sort((a, b) => {
                // Priority: featured first, then trending, then by date
                if (a.is_featured && !b.is_featured) return -1;
                if (!a.is_featured && b.is_featured) return 1;
                if (a.is_trending && !b.is_trending) return -1;
                if (!a.is_trending && b.is_trending) return 1;
                return new Date(a.date) - new Date(b.date);
            })
            .slice(0, 5);

        // Auto-slide every 5 seconds
        useEffect(() => {
            if (!isAutoPlaying || featuredEvents.length <= 1) return;

            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
            }, 5000);

            return () => clearInterval(interval);
        }, [isAutoPlaying, featuredEvents.length]);

        const nextSlide = () => {
            setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 10000);
        };

        const prevSlide = () => {
            setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 10000);
        };

        const goToSlide = (index) => {
            setCurrentSlide(index);
            setIsAutoPlaying(false);
            setTimeout(() => setIsAutoPlaying(true), 10000);
        };

        if (featuredEvents.length === 0) return null;

        return (
            <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl shadow-amber-500/20">
                {/* Main Slider Container */}
                <div className="relative h-[400px] md:h-[500px] overflow-hidden">
                    {featuredEvents.map((event, index) => (
                        <div
                            key={event.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                                ? 'opacity-100 translate-x-0'
                                : index < currentSlide
                                    ? 'opacity-0 -translate-x-full'
                                    : 'opacity-0 translate-x-full'
                                }`}
                        >
                            {/* Background Image */}
                            <div className="absolute inset-0">
                                <img
                                    src={event.image}
                                    alt={event.titleAl}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex items-center">
                                <div className="max-w-4xl mx-auto px-6 md:px-12 w-full">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {event.type && (
                                            <span className="px-4 py-1.5 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white text-sm font-bold rounded-full shadow-lg">
                                                {event.type}
                                            </span>
                                        )}
                                        {event.is_featured && (
                                            <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                                                ⭐ {t('I Veçantë', 'Featured')}
                                            </span>
                                        )}
                                        {event.is_trending && (
                                            <span className="px-4 py-1.5 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white text-sm font-bold rounded-full shadow-lg flex items-center gap-1">
                                                🔥 {t('Trending', 'Trending')}
                                            </span>
                                        )}
                                        {event.is_free && (
                                            <span className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-full shadow-lg">
                                                {t('FALAS', 'FREE')}
                                            </span>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                                        {language === 'al' ? event.titleAl : (event.titleEn || event.titleAl)}
                                    </h2>

                                    {/* Event Details */}
                                    <div className="flex flex-wrap gap-4 md:gap-6 mb-4 text-white/90">
                                        {(event.dateAl || event.date) && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                    <Calendar className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm md:text-base font-medium">
                                                    {language === 'al' ? event.dateAl : (event.dateEn || event.dateAl)}
                                                </span>
                                            </div>
                                        )}
                                        {event.time && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                    <Clock className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm md:text-base font-medium">
                                                    {event.time}{event.endTime ? ` - ${event.endTime}` : ''}
                                                </span>
                                            </div>
                                        )}
                                        {event.location && (
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm md:text-base font-medium">
                                                    {event.location}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description Preview */}
                                    <p className="text-white/80 text-sm md:text-lg mb-6 line-clamp-2 max-w-2xl">
                                        {language === 'al' ? event.descAl : (event.descEn || event.descAl)}
                                    </p>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => openEvent(event)}
                                            className="px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl font-bold hover:from-amber-500 hover:to-[#FF5252] transform hover:scale-105 transition-all shadow-lg shadow-amber-500/50 flex items-center gap-2"
                                        >
                                            <Eye className="w-5 h-5" />
                                            {t('Shiko Detajet', 'View Details')}
                                        </button>

                                        {event.registration_link && (
                                            <a
                                                href={event.registration_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-3 bg-white text-amber-600 rounded-xl font-bold hover:bg-[#FFE5D9] transform hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                                            >
                                                <ExternalLink className="w-5 h-5" />
                                                {t('Regjistrohu', 'Register')}
                                            </a>
                                        )}

                                        <button
                                            onClick={() => openShareModal(event, 'event')}
                                            className="px-4 py-3 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 backdrop-blur-sm transition-all flex items-center gap-2 border border-white/30"
                                        >
                                            <Share2 className="w-5 h-5" />
                                            <span className="hidden md:inline">{t('Shpërndaj', 'Share')}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {featuredEvents.length > 1 && (
                    <>
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-lg border border-white/20 transition-all flex items-center justify-center group"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-lg border border-white/20 transition-all flex items-center justify-center group"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    </>
                )}

                {/* Dot Indicators */}
                {featuredEvents.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                        {featuredEvents.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`transition-all duration-300 rounded-full ${index === currentSlide
                                    ? 'w-8 h-3 bg-gradient-to-r from-amber-500 to-orange-500'
                                    : 'w-3 h-3 bg-white/40 hover:bg-white/60'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}

                {/* Progress Bar */}
                {featuredEvents.length > 1 && isAutoPlaying && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                            style={{
                                animation: 'progressBar 5s linear infinite',
                                width: '100%'
                            }}
                        />
                    </div>
                )}

                <style>{`
                @keyframes progressBar {
                    from { transform: scaleX(0); transform-origin: left; }
                    to { transform: scaleX(1); transform-origin: left; }
                }
            `}</style>
            </div>
        );
    };


    // Updated EventsPage Component with Hero Slider
    const EventsPage = () => (
        <div className="max-w-7xl mx-auto px-4 py-12">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                <h1 className={`text-5xl font-bold mb-4 md:mb-0 ${darkMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] bg-clip-text text-transparent' : 'text-[#2D2A26]'}`}>
                    {t('Evente', 'Events')}
                </h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setEventViewMode('calendar')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${eventViewMode === 'calendar'
                            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white'
                            : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <Calendar className="w-4 h-4" />
                        {t('Kalendar', 'Calendar')}
                    </button>
                    <button
                        onClick={() => setEventViewMode('list')}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${eventViewMode === 'list'
                            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white'
                            : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        <List className="w-4 h-4" />
                        {t('Listë', 'List')}
                    </button>
                </div>
            </div>

            {/* Hero Slider - Shows on BOTH Calendar and List views */}
            <EventHeroSlider
                events={otherEvents}
                language={language}
                darkMode={darkMode}
                t={t}
                openEvent={openEvent}
                openShareModal={openShareModal}
            />

            {/* View Mode Content */}
            {eventViewMode === 'calendar' ? (
                <EventCalendar
                    language={language}
                    darkMode={darkMode}
                    events={otherEvents}
                    showAdmin={showAdmin}
                    editEvent={editEvent}
                    deleteEvent={deleteEvent}
                    t={t}
                    openShareModal={openShareModal}
                    openEvent={openEvent}
                />
            ) : (
                otherEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30">
                            <Calendar className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            {t('Asnjë event ende', 'No events yet')}
                        </h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {t('Eventet do të shfaqen këtu kur të publikohen', 'Events will appear here when published')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherEvents.map((event) => (
                            <div
                                key={event.id}
                                className={`backdrop-blur-lg rounded-2xl border hover:border-amber-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20 overflow-hidden cursor-pointer ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                                onClick={() => openEvent(event)}
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
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openShareModal(event, 'event');
                                            }}
                                            className="bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white p-2 rounded-full hover:from-amber-500 hover:to-[#FF5252] transition z-10 shadow-lg"
                                            title={t('Shpërndaj', 'Share')}
                                        >
                                            <Share2 className="h-4 w-4" />
                                        </button>
                                        {showAdmin && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        editEvent(event);
                                                    }}
                                                    className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition z-10 shadow-lg"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        deleteEvent(event.id);
                                                    }}
                                                    className="bg-[#FF6B6B] text-white p-2 rounded-full hover:bg-[#FF5252] transition z-10 shadow-lg"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                    {/* Badges on cards */}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                                        {event.is_featured && (
                                            <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                                ⭐
                                            </span>
                                        )}
                                        {event.is_trending && (
                                            <span className="px-2 py-1 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white text-xs font-bold rounded-full">
                                                🔥
                                            </span>
                                        )}
                                        {event.is_free && (
                                            <span className="px-2 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full">
                                                {t('FALAS', 'FREE')}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <span className="inline-block px-3 py-1 bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-400 text-sm font-semibold rounded-full mb-3 border border-amber-500/30">
                                        {event.type}
                                    </span>
                                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                        {language === 'al' ? event.titleAl : (event.titleEn || event.titleAl)}
                                    </h3>
                                    <div className={`flex items-center text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <Calendar className="w-4 h-4 mr-2" />
                                        <span>{language === 'al' ? event.dateAl : (event.dateEn || event.dateAl)}</span>
                                    </div>
                                    <div className={`flex items-center text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <MapPin className="w-4 h-4 mr-2" />
                                        <span>{event.location}</span>
                                    </div>
                                    <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {language === 'al' ? event.descAl : (event.descEn || event.descAl)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}
        </div>
    );

    const PartnershipsPage = () => {
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

    const AboutPage = () => (
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
                    <h3 className={`font-bold text-2xl mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>25+</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('Projekte Mjedisore', 'Environmental Projects')}</p>
                </div>
            </div>
        </div>
    );

    // ==========================================
    // SCHOOLS FEATURE - PAGE COMPONENTS
    // ==========================================
    const SchoolsOverviewPage = () => (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] bg-clip-text text-transparent' : 'text-[#2D2A26]'}`}>
                    {t('Shkollat', 'Schools')}
                </h1>
                <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {t('Eksploro shkollat partnere dhe aktivitetet e tyre', 'Explore partner schools and their activities')}
                </p>
            </div>

            {schools.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30">
                        <School className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                        {t('Asnjë shkollë ende', 'No schools yet')}
                    </h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {t('Shkollat do të shfaqen këtu kur të shtohen', 'Schools will appear here when added')}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {schools.map((school) => (
                        <div
                            key={school.id}
                            className={`backdrop-blur-lg rounded-2xl border overflow-hidden hover:border-amber-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-500/20 cursor-pointer ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                            onClick={() => {
                                setSelectedSchool(school);
                                changePage('school-portal');
                            }}
                        >
                            <div className="relative h-48">
                                <img
                                    src={school.cover_image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800'}
                                    alt={school.name_al}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                                {school.logo && (
                                    <div className="absolute bottom-4 left-4 w-16 h-16 rounded-xl bg-white p-2 shadow-lg">
                                        <img
                                            src={school.logo}
                                            alt="Logo"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                                {isSuperAdmin() && showAdmin && (
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                editSchool(school);
                                            }}
                                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition z-10 shadow-lg"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteSchool(school.id);
                                            }}
                                            className="bg-[#FF6B6B] text-white p-2 rounded-full hover:bg-[#FF5252] transition z-10 shadow-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                    {language === 'al' ? school.name_al : (school.name_en || school.name_al)}
                                </h3>
                                {school.address && (
                                    <div className={`flex items-center text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        <MapPin className="w-4 h-4 mr-2 text-amber-500" />
                                        <span>{school.address}</span>
                                    </div>
                                )}
                                <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {language === 'al' ? school.description_al : (school.description_en || school.description_al)}
                                </p>
                                <div className="mt-4 flex items-center text-amber-500 text-sm font-medium">
                                    <span>{t('Shiko portalin', 'View portal')}</span>
                                    <ChevronRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const SchoolPortalPage = () => {
        if (!selectedSchool) {
            return (
                <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                        {t('Asnjë shkollë e zgjedhur', 'No school selected')}
                    </p>
                    <button
                        onClick={() => changePage('schools')}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl"
                    >
                        {t('Kthehu te shkollat', 'Back to schools')}
                    </button>
                </div>
            );
        }

        const postTypeLabels = {
            news: { al: 'Lajm', en: 'News', color: 'blue' },
            event: { al: 'Event', en: 'Event', color: 'amber' },
            success_story: { al: 'Sukses', en: 'Success', color: 'green' },
            school_trip: { al: 'Ekskursion', en: 'Trip', color: 'orange' }
        };

        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <button
                    onClick={() => {
                        setSelectedSchool(null);
                        changePage('schools');
                    }}
                    className="text-amber-500 hover:text-amber-400 flex items-center gap-2 mb-6"
                >
                    <ChevronLeft className="w-4 h-4" />
                    {t('Kthehu te shkollat', 'Back to schools')}
                </button>

                {/* School Header */}
                <div className="relative rounded-3xl overflow-hidden mb-8">
                    <div className="h-64 md:h-80">
                        <img
                            src={selectedSchool.cover_image || 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200'}
                            alt={selectedSchool.name_al}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1200';
                            }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                        <div className="flex items-end gap-6">
                            {selectedSchool.logo && (
                                <div className="w-24 h-24 rounded-2xl bg-white p-3 shadow-xl">
                                    <img
                                        src={selectedSchool.logo}
                                        alt="Logo"
                                        className="w-full h-full object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                            <div className="flex-1">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    {language === 'al' ? selectedSchool.name_al : (selectedSchool.name_en || selectedSchool.name_al)}
                                </h1>
                                <p className="text-gray-300 text-lg max-w-2xl">
                                    {language === 'al' ? selectedSchool.description_al : (selectedSchool.description_en || selectedSchool.description_al)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className={`backdrop-blur-lg rounded-2xl border p-6 mb-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {selectedSchool.address && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Adresa', 'Address')}</p>
                                    <p className={darkMode ? 'text-white' : 'text-[#2D2A26]'}>{selectedSchool.address}</p>
                                </div>
                            </div>
                        )}
                        {selectedSchool.contact_email && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <Send className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                                    <a href={`mailto:${selectedSchool.contact_email}`} className="text-amber-500 hover:text-amber-400">
                                        {selectedSchool.contact_email}
                                    </a>
                                </div>
                            </div>
                        )}
                        {selectedSchool.website && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                    <GlobeIcon className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Website</p>
                                    <a href={selectedSchool.website} target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:text-amber-400">
                                        {t('Vizito faqen', 'Visit website')}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Admin Panel */}
                {canEditSchool(selectedSchool.id) && showAdmin && (
                    <div className={`backdrop-blur-lg rounded-2xl border p-6 mb-8 ${darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}`}>
                        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            {t('Paneli i Administratorit', 'Admin Panel')}
                        </h3>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowSchoolPostForm(true)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-amber-500 text-white rounded-lg hover:from-blue-500 hover:to-amber-500 flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                {t('Shto Postim', 'Add Post')}
                            </button>
                            <button
                                onClick={() => setShowCouncilForm(true)}
                                className="px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-lg hover:from-amber-500 hover:to-[#FF5252] flex items-center gap-2"
                            >
                                <Users className="w-4 h-4" />
                                {t('Shto Anëtar Këshilli', 'Add Council Member')}
                            </button>
                            <button
                                onClick={() => setShowStudentOfMonthForm(true)}
                                className="px-4 py-2 bg-gradient-to-r from-orange-500 to-[#FF6B6B] text-white rounded-lg hover:from-orange-500 hover:to-[#FF5252] flex items-center gap-2"
                            >
                                <Trophy className="w-4 h-4" />
                                {t('Shto Nxënës të Muajit', 'Add Student of Month')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Student of Month Section */}
                {studentOfMonth.length > 0 && (
                    <div className="mb-12">
                        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            <Trophy className="w-8 h-8 inline mr-3 text-yellow-500" />
                            {t('Nxënësit e Muajit', 'Students of the Month')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {studentOfMonth.map((student) => (
                                <div
                                    key={student.id}
                                    className={`backdrop-blur-lg rounded-2xl border p-6 relative ${darkMode ? 'bg-gradient-to-br from-yellow-600/10 to-orange-600/10 border-yellow-500/30' : 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300'}`}
                                >
                                    {canEditSchool(selectedSchool.id) && showAdmin && (
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <button
                                                onClick={() => editStudentOfMonth(student)}
                                                className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition"
                                            >
                                                <Edit className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={() => deleteStudentOfMonth(student.id)}
                                                className="bg-[#FF6B6B] text-white p-1.5 rounded-full hover:bg-[#FF5252] transition"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                    <div className="flex items-start gap-4">
                                        {student.photo ? (
                                            <img
                                                src={student.photo}
                                                alt={student.student_name}
                                                className="w-20 h-20 rounded-full object-cover border-4 border-yellow-500"
                                                onError={(e) => {
                                                    e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200';
                                                }}
                                            />
                                        ) : (
                                            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                                                <GraduationCap className="w-10 h-10 text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                                {student.student_name}
                                            </h4>
                                            <p className="text-yellow-500 font-medium">{student.grade}</p>
                                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{student.month_year}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            {language === 'al' ? student.achievement_al : (student.achievement_en || student.achievement_al)}
                                        </p>
                                        {(student.quote_al || student.quote_en) && (
                                            <p className={`mt-3 italic text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                "{language === 'al' ? student.quote_al : (student.quote_en || student.quote_al)}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* School Council Section */}
                {schoolCouncil.length > 0 && (
                    <div className="mb-12">
                        <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                            <Users className="w-8 h-8 inline mr-3 text-amber-500" />
                            {t('Këshilli i Nxënësve', 'Student Council')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {schoolCouncil.map((member) => (
                                <div
                                    key={member.id}
                                    className={`backdrop-blur-lg rounded-2xl border p-6 text-center relative ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                                >
                                    {canEditSchool(selectedSchool.id) && showAdmin && (
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            <button
                                                onClick={() => editCouncilMember(member)}
                                                className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition"
                                            >
                                                <Edit className="h-3 w-3" />
                                            </button>
                                            <button
                                                onClick={() => deleteCouncilMember(member.id)}
                                                className="bg-[#FF6B6B] text-white p-1.5 rounded-full hover:bg-[#FF5252] transition"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    )}
                                    {member.photo ? (
                                        <img
                                            src={member.photo}
                                            alt={member.student_name}
                                            className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-amber-500"
                                            onError={(e) => {
                                                e.target.src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] flex items-center justify-center mx-auto mb-4">
                                            <span className="text-3xl font-bold text-white">
                                                {member.student_name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                        {member.student_name}
                                    </h4>
                                    <p className="text-amber-500 font-medium">{member.position}</p>
                                    {member.grade && (
                                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {t('Klasa', 'Grade')}: {member.grade}
                                        </p>
                                    )}
                                    {(member.bio_al || member.bio_en) && (
                                        <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {language === 'al' ? member.bio_al : (member.bio_en || member.bio_al)}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* School Posts Section */}
                <div>
                    <h2 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                        <MessageCircle className="w-8 h-8 inline mr-3 text-blue-400" />
                        {t('Lajme & Ngjarje', 'News & Events')}
                    </h2>
                    {schoolPosts.length === 0 ? (
                        <div className={`backdrop-blur-lg rounded-2xl border p-12 text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                            <MessageCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />
                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                {t('Asnjë postim ende', 'No posts yet')}
                            </h3>
                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                {t('Postimet do të shfaqen këtu', 'Posts will appear here')}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {schoolPosts.map((post) => {
                                const typeInfo = postTypeLabels[post.type] || postTypeLabels.news;
                                return (
                                    <div
                                        key={post.id}
                                        className={`backdrop-blur-lg rounded-2xl border overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}
                                    >
                                        {post.image && (
                                            <div className="relative h-48">
                                                <img
                                                    src={post.image}
                                                    alt={post.title_al}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                            </div>
                                        )}
                                        <div className="p-6 relative">
                                            {canEditSchool(selectedSchool.id) && showAdmin && (
                                                <div className="absolute top-3 right-3 flex gap-2">
                                                    <button
                                                        onClick={() => editSchoolPost(post)}
                                                        className="bg-blue-600 text-white p-1.5 rounded-full hover:bg-blue-700 transition"
                                                    >
                                                        <Edit className="h-3 w-3" />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteSchoolPost(post.id)}
                                                        className="bg-[#FF6B6B] text-white p-1.5 rounded-full hover:bg-[#FF5252] transition"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${typeInfo.color}-600`}>
                                                    {language === 'al' ? typeInfo.al : typeInfo.en}
                                                </span>
                                                {post.is_featured && (
                                                    <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                                        ⭐ {t('I Veçantë', 'Featured')}
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                                {language === 'al' ? post.title_al : (post.title_en || post.title_al)}
                                            </h3>
                                            <p className={`text-sm mb-4 line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                {language === 'al' ? post.content_al : (post.content_en || post.content_al)}
                                            </p>
                                            {post.type === 'event' && post.event_date && (
                                                <div className={`flex items-center gap-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4 text-amber-500" />
                                                        <span>{post.event_date}</span>
                                                    </div>
                                                    {post.event_time && (
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4 text-amber-500" />
                                                            <span>{post.event_time}</span>
                                                        </div>
                                                    )}
                                                    {post.event_location && (
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-4 h-4 text-amber-500" />
                                                            <span>{post.event_location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <p className={`text-xs mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {new Date(post.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#2D2A26]' : 'bg-gray-50'}`}>
            <FOMOPopup
                showPopup={showFOMOPopup}
                onClose={() => setShowFOMOPopup(false)}
                darkMode={darkMode}
                t={t}
                onNavigateToEvents={() => changePage('events')}
            />


            <header className={`backdrop-blur-lg border-b sticky top-0 z-50 shadow-lg transition-colors duration-300 ${darkMode
                ? 'bg-[#2D2A26]/80 border-amber-500/20 shadow-amber-500/10'
                : 'bg-white/80 border-amber-200 shadow-amber-200/20'
                }`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => changePage('home')}>
                            <img
                                src="https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/bigiii.png"
                                alt="RinON Logo"
                                className="w-20 h-20 object-contain group-hover:scale-110 transition-transform"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextElementSibling.style.display = 'flex';
                                }}
                            />
                            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full hidden items-center justify-center shadow-lg shadow-amber-500/50 group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">RinON</h1>
                                <p className="text-xs text-amber-500 uppercase tracking-wide">
                                    {t('Aktivizo Rininë Tënde', 'Activate Your Youth')}
                                </p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center space-x-6">
                            <button onClick={() => changePage('home')} className={`font-medium transition-all ${currentPage === 'home' ? 'text-amber-500' : darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>
                                {t('Lajme', 'News')}
                            </button>
                            <button onClick={() => changePage('events')} className={`font-medium transition-all ${currentPage === 'events' ? 'text-amber-500' : darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>
                                {t('Evente', 'Events')}
                            </button>
                            <button onClick={() => changePage('schools')} className={`font-medium flex items-center gap-1 transition-all ${currentPage === 'schools' || currentPage === 'school-portal' ? 'text-amber-500' : darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>
                                <School className="w-4 h-4" />
                                {t('Shkollat', 'Schools')}
                            </button>

                            <button onClick={() => changePage('partners')} className={`font-medium flex items-center gap-1 transition-all ${currentPage === 'partners' ? 'text-amber-500' : darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>
                                <Users className="w-4 h-4" />
                                {t('Bashkëpunime', 'Cooperations')}
                            </button>
                            <button onClick={() => changePage('discussion')} className={`font-medium flex items-center gap-2 transition-all ${currentPage === 'discussion' ? 'text-amber-500' : darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>
                                <MessageCircle className="w-4 h-4" />
                                {t('Bisedim', 'Discussion')}
                            </button>
                            <button onClick={() => changePage('about')} className={`font-medium transition-all ${currentPage === 'about' ? 'text-amber-500' : darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}>
                                {t('Rreth Nesh', 'About')}
                            </button>
                        </nav>

                        {/* Mobile Action Buttons - Search, Login, Menu */}
                        <div className="md:hidden flex items-center gap-2">
                            {/* Mobile Search Button */}
                            <button
                                onClick={() => setShowSearchBar(!showSearchBar)}
                                className={`p-2 rounded-lg transition-all border ${showSearchBar
                                        ? 'bg-amber-500 text-white border-amber-500'
                                        : 'bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30'
                                    }`}
                            >
                                <Search className="h-5 w-5" />
                            </button>

                            {/* Mobile Login/Profile Button - ALWAYS VISIBLE */}
                            {user ? (
                                <button
                                    onClick={() => setShowPreferences(true)}
                                    className="p-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-lg transition-all shadow-lg shadow-amber-500/30"
                                >
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                        <span className="text-[10px] font-bold">
                                            {userProfile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                        </span>
                                    </div>
                                </button>
                            ) : (
                                <button
                                    onClick={() => { setShowAuthModal(true); setAuthMode('login'); }}
                                    className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-lg hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/30"
                                >
                                    <LogIn className="w-4 h-4" />
                                    <span className="text-sm font-semibold">{t('Hyr', 'Login')}</span>
                                </button>
                            )}

                            {/* Hamburger Menu */}
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="p-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-all border border-amber-500/30"
                            >
                                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>

                        <div className="hidden md:flex items-center space-x-4">
                            {/* Desktop Search Bar */}
                            <div className={`relative ${showSearchBar ? 'w-64' : 'w-10'} transition-all duration-300`}>
                                {showSearchBar ? (
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder={t('Kërko lajme, evente...', 'Search news, events...')}
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={`w-full pl-10 pr-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${darkMode
                                                    ? 'bg-[#3D3A36] border-amber-500/30 text-white placeholder-gray-400'
                                                    : 'bg-white border-amber-200 text-[#2D2A26] placeholder-gray-400'
                                                }`}
                                            autoFocus
                                        />
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
                                        <button
                                            onClick={() => { setShowSearchBar(false); setSearchQuery(''); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-500/20 rounded-full"
                                        >
                                            <X className="w-4 h-4 text-gray-400" />
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setShowSearchBar(true)}
                                        className="p-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-all border border-amber-500/30"
                                    >
                                        <Search className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <button
                                onClick={() => setLanguage(language === 'al' ? 'en' : 'al')}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-all border border-amber-500/30"
                            >
                                <Globe className="h-4 w-4" />
                                <span className="font-medium text-sm">{language.toUpperCase()}</span>
                            </button>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 bg-amber-500/20 text-amber-500 rounded-lg hover:bg-amber-500/30 transition-all border border-amber-500/30"
                                title={darkMode ? t('Light Mode', 'Light Mode') : t('Dark Mode', 'Dark Mode')}
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm hidden sm:inline ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userProfile?.display_name || user.email}</span>
                                    <button onClick={() => setShowPreferences(true)} className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-amber-500/20' : 'hover:bg-amber-50'}`}>
                                        <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                    </button>
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white rounded-lg hover:from-[#FF5252] hover:to-[#FF4040] transition-all shadow-lg shadow-pink-500/50">
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">{t('Dil', 'Logout')}</span>
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => { setShowAuthModal(true); setAuthMode('login'); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-lg hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    <LogIn className="w-4 h-4" />
                                    {t('Hyr', 'Login')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar - Expandable */}
                {showSearchBar && (
                    <div className={`md:hidden px-4 pb-4 animate-slideDown ${darkMode ? 'bg-[#2D2A26]/95' : 'bg-white/95'}`}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('Kërko lajme, evente...', 'Search news, events...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-10 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all ${darkMode
                                        ? 'bg-[#3D3A36] border-amber-500/30 text-white placeholder-gray-400'
                                        : 'bg-gray-50 border-amber-200 text-[#2D2A26] placeholder-gray-400'
                                    }`}
                                autoFocus
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-500" />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-amber-500/20 rounded-full"
                                >
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </header>

            {/* ==========================================
                HORIZONTAL CATEGORY PILLS - Mobile
                Scrollable category filter below header
               ========================================== */}
            {/* Horizontal Category Pills - Only on Home Page */}
            {currentPage === 'home' && (
                <div className={`sticky top-[88px] md:top-[96px] z-40 border-b backdrop-blur-xl transition-colors duration-300 ${darkMode
                        ? 'bg-[#2D2A26]/95 border-amber-500/10'
                        : 'bg-white/95 border-amber-100'
                    }`}>
                    <div className="max-w-7xl mx-auto px-4 py-3">
                        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 -mb-1">
                            {categories.map((cat) => {
                                const isActive = selectedCategoryFilter === cat.al;
                                const Icon = cat.icon || TrendingUp;
                                return (
                                    <button
                                        key={cat.al}
                                        onClick={() => setSelectedCategoryFilter(cat.al)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${isActive
                                                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white shadow-lg shadow-amber-500/30'
                                                : darkMode
                                                    ? 'bg-[#3D3A36] text-gray-300 hover:bg-amber-500/20 hover:text-amber-400 border border-amber-500/20'
                                                    : 'bg-amber-50 text-gray-600 hover:bg-[#FFE5D9] hover:text-amber-700 border border-amber-200'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{language === 'al' ? cat.al : cat.en}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                FIRST-TIME USER TOOLTIP
                Shows swipe hint for new visitors
               ========================================== */}
            {showFirstTimeTooltip && (
                <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 animate-bounce md:hidden">
                    <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 ${darkMode ? 'bg-amber-500 text-white' : 'bg-[#2D2A26] text-white'
                        }`}>
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">{t('Swipe majtas për më shumë kategori!', 'Swipe left for more categories!')}</span>
                        <ChevronRight className="w-5 h-5 animate-pulse" />
                    </div>
                    <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 ${darkMode ? 'bg-amber-500' : 'bg-[#2D2A26]'
                        }`}></div>
                </div>
            )}

            {/* ==========================================
                PULL-TO-REFRESH INDICATOR
               ========================================== */}
            {isRefreshing && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50">
                    <div className={`px-4 py-2 rounded-full shadow-lg flex items-center gap-2 ${darkMode ? 'bg-[#3D3A36] text-amber-400' : 'bg-white text-amber-600'
                        }`}>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-sm font-medium">{t('Duke rifreskuar...', 'Refreshing...')}</span>
                    </div>
                </div>
            )}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                    {editMode ? t('Ndrysho Artikull', 'Edit Article') : (editingDraftId ? t('Vazhdo Draft', 'Continue Draft') : t('Shto Artikull', 'Add Article'))}
                                </h2>
                                {editingDraftId && (
                                    <p className="text-sm text-amber-500 mt-1">{t('Duke edituar draft', 'Editing draft')}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {drafts.length > 0 && !editingDraftId && (
                                    <button
                                        onClick={() => { setShowAddForm(false); setShowDraftsModal(true); }}
                                        className="flex items-center gap-2 px-3 py-2 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/10 transition-all text-sm"
                                    >
                                        <Edit className="w-4 h-4" />
                                        {t('Drafts', 'Drafts')} ({drafts.length})
                                    </button>
                                )}
                                <button onClick={() => { setShowAddForm(false); setEditMode(false); setEditingItem(null); setEditingDraftId(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Titulli (Shqip) *', 'Title (Albanian) *')}
                                value={formData.titleAl}
                                onChange={(e) => setFormData({ ...formData, titleAl: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Titulli (Anglisht)', 'Title (English)')}
                                value={formData.titleEn}
                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përmbajtja (Shqip) *', 'Content (Albanian) *')}
                                value={formData.contentAl}
                                onChange={(e) => setFormData({ ...formData, contentAl: e.target.value })}
                                rows="6"
                                maxLength="10000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përmbajtja (Anglisht)', 'Content (English)')}
                                value={formData.contentEn}
                                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                                rows="6"
                                maxLength="10000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            >
                                {categories.filter(c => c.al !== 'Te Gjitha').map(cat => (
                                    <option key={cat.al} value={cat.al}>{language === 'al' ? cat.al : cat.en}</option>
                                ))}
                            </select>
                            <input
                                type="text"
                                placeholder={t('URL Imazhi', 'Image URL')}
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Burimi', 'Source')}
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <label className="flex items-center gap-3 text-white">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-5 h-5 rounded border-amber-500/30 bg-[#3D3A36] text-amber-600 focus:ring-amber-500/20"
                                />
                                <span>{t('Artikull i veçantë', 'Featured article')}</span>
                            </label>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowAddForm(false); setEditMode(false); setEditingItem(null); setEditingDraftId(null); }} className="px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button
                                    onClick={saveDraft}
                                    className="flex-1 px-4 py-3 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2"
                                >
                                    <Edit className="w-4 h-4" />
                                    {editingDraftId ? t('Përditëso Draft', 'Update Draft') : t('Ruaj Draft', 'Save Draft')}
                                </button>
                                <button onClick={() => handleSubmitArticle()} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : (editingDraftId ? t('Publiko Draft', 'Publish Draft') : t('Publiko', 'Publish'))}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Event Modal */}
            {showAddEventForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {editMode ? t('Ndrysho Event', 'Edit Event') : t('Shto Event', 'Add Event')}
                            </h2>
                            <button onClick={() => { setShowAddEventForm(false); setEditMode(false); setEditingItem(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Titulli (Shqip) *', 'Title (Albanian) *')}
                                value={eventFormData.titleAl}
                                onChange={(e) => setEventFormData({ ...eventFormData, titleAl: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Titulli (Anglisht)', 'Title (English)')}
                                value={eventFormData.titleEn}
                                onChange={(e) => setEventFormData({ ...eventFormData, titleEn: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            {/* Calendar Date */}
                            <input
                                type="date"
                                placeholder={t('Data', 'Date')}
                                value={eventFormData.date}
                                onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            {/* Time Fields */}
                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="time"
                                    placeholder={t('Ora e fillimit', 'Start time')}
                                    value={eventFormData.time}
                                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                                    className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                />
                                <input
                                    type="time"
                                    placeholder={t('Ora e mbarimit', 'End time')}
                                    value={eventFormData.endTime}
                                    onChange={(e) => setEventFormData({ ...eventFormData, endTime: e.target.value })}
                                    className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                />
                            </div>

                            <input
                                type="text"
                                placeholder={t('Data (Shqip) *', 'Date (Albanian) *')}
                                value={eventFormData.dateAl}
                                onChange={(e) => setEventFormData({ ...eventFormData, dateAl: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Data (Anglisht)', 'Date (English)')}
                                value={eventFormData.dateEn}
                                onChange={(e) => setEventFormData({ ...eventFormData, dateEn: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            <input
                                type="text"
                                placeholder={t('Tipi', 'Type')}
                                value={eventFormData.type}
                                onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}
                                maxLength="50"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            <select
                                value={eventFormData.category}
                                onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            >
                                <option value="general">{t('Të përgjithshme', 'General')}</option>
                                <option value="tech">{t('Teknologji', 'Tech')}</option>
                                <option value="culture">{t('Kulturë', 'Culture')}</option>
                                <option value="career">{t('Karrierë', 'Career')}</option>
                                <option value="sports">{t('Sport', 'Sports')}</option>
                                <option value="environment">{t('Mjedis', 'Environment')}</option>
                                <option value="education">{t('Edukim', 'Education')}</option>
                                <option value="social">{t('Social', 'Social')}</option>
                            </select>

                            <input
                                type="text"
                                placeholder={t('Lokacioni', 'Location')}
                                value={eventFormData.location}
                                onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            <input
                                type="text"
                                placeholder={t('Adresa', 'Address')}
                                value={eventFormData.address}
                                onChange={(e) => setEventFormData({ ...eventFormData, address: e.target.value })}
                                maxLength="255"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            <textarea
                                placeholder={t('Përshkrimi (Shqip)', 'Description (Albanian)')}
                                value={eventFormData.descAl}
                                onChange={(e) => setEventFormData({ ...eventFormData, descAl: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')}
                                value={eventFormData.descEn}
                                onChange={(e) => setEventFormData({ ...eventFormData, descEn: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <input
                                    type="number"
                                    placeholder={t('Vende të mbetura', 'Spots left')}
                                    value={eventFormData.spotsLeft}
                                    onChange={(e) => setEventFormData({ ...eventFormData, spotsLeft: parseInt(e.target.value) || 0 })}
                                    className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                />
                                <input
                                    type="number"
                                    placeholder={t('Vende totale', 'Total spots')}
                                    value={eventFormData.totalSpots}
                                    onChange={(e) => setEventFormData({ ...eventFormData, totalSpots: parseInt(e.target.value) || 0 })}
                                    className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                />
                            </div>

                            <label className="flex items-center gap-3 text-white">
                                <input
                                    type="checkbox"
                                    checked={eventFormData.isFree}
                                    onChange={(e) => setEventFormData({ ...eventFormData, isFree: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <span>{t('Event Falas', 'Free Event')}</span>
                            </label>

                            {!eventFormData.isFree && (
                                <input
                                    type="text"
                                    placeholder={t('Çmimi', 'Price')}
                                    value={eventFormData.price}
                                    onChange={(e) => setEventFormData({ ...eventFormData, price: e.target.value })}
                                    className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                />
                            )}

                            <input
                                type="text"
                                placeholder={t('Link Regjistrimi', 'Registration Link')}
                                value={eventFormData.registrationLink}
                                onChange={(e) => setEventFormData({ ...eventFormData, registrationLink: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            <input
                                type="text"
                                placeholder={t('URL Imazhi', 'Image URL')}
                                value={eventFormData.image}
                                onChange={(e) => setEventFormData({ ...eventFormData, image: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />

                            <label className="flex items-center gap-3 text-white">
                                <input
                                    type="checkbox"
                                    checked={eventFormData.isFeatured}
                                    onChange={(e) => setEventFormData({ ...eventFormData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <span>{t('Event i Veçantë', 'Featured Event')}</span>
                            </label>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowAddEventForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitEvent} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Topic Modal */}
            {showAddTopicForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {t('Shto Temë Diskutimi', 'Add Discussion Topic')}
                            </h2>
                            <button onClick={() => setShowAddTopicForm(false)} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Titulli (Shqip) *', 'Title (Albanian) *')}
                                value={topicFormData.titleAl}
                                onChange={(e) => setTopicFormData({ ...topicFormData, titleAl: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Titulli (Anglisht)', 'Title (English)')}
                                value={topicFormData.titleEn}
                                onChange={(e) => setTopicFormData({ ...topicFormData, titleEn: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Shqip) *', 'Description (Albanian) *')}
                                value={topicFormData.descriptionAl}
                                onChange={(e) => setTopicFormData({ ...topicFormData, descriptionAl: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')}
                                value={topicFormData.descriptionEn}
                                onChange={(e) => setTopicFormData({ ...topicFormData, descriptionEn: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowAddTopicForm(false)} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitTopic} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Partner Modal */}
            {showAddPartnerForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {editMode ? t('Ndrysho Partner', 'Edit Partner') : t('Shto Partner', 'Add Partner')}
                            </h2>
                            <button onClick={() => { setShowAddPartnerForm(false); setEditMode(false); setEditingItem(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Emri (Shqip) *', 'Name (Albanian) *')}
                                value={partnerFormData.nameAl}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, nameAl: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Emri (Anglisht) *', 'Name (English) *')}
                                value={partnerFormData.nameEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, nameEn: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Shqip)', 'Description (Albanian)')}
                                value={partnerFormData.descriptionAl}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, descriptionAl: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')}
                                value={partnerFormData.descriptionEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, descriptionEn: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Vizioni (Shqip)', 'Vision (Albanian)')}
                                value={partnerFormData.visionAl}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, visionAl: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Vizioni (Anglisht)', 'Vision (English)')}
                                value={partnerFormData.visionEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, visionEn: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Qëllimet (Shqip)', 'Goals (Albanian)')}
                                value={partnerFormData.goalsAl}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, goalsAl: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Qëllimet (Anglisht)', 'Goals (English)')}
                                value={partnerFormData.goalsEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, goalsEn: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <input
                                type="text"
                                placeholder={t('Website', 'Website')}
                                value={partnerFormData.website}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, website: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Imazhi', 'Image URL')}
                                value={partnerFormData.image}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, image: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowAddPartnerForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitPartner} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Member Modal */}
            {showAddMemberForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-md w-full border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {editMode ? t('Ndrysho Anëtar', 'Edit Member') : t('Shto Anëtar Ekipi', 'Add Team Member')}
                            </h2>
                            <button onClick={() => { setShowAddMemberForm(false); setEditMode(false); setEditingItem(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Emri *', 'Name *')}
                                value={memberFormData.name}
                                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Roli *', 'Role *')}
                                value={memberFormData.role}
                                onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowAddMemberForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitMember} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Add School Modal */}
            {showAddSchoolForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {editMode ? t('Ndrysho Shkollë', 'Edit School') : t('Shto Shkollë', 'Add School')}
                            </h2>
                            <button onClick={() => { setShowAddSchoolForm(false); setEditMode(false); setEditingItem(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Emri (Shqip) *', 'Name (Albanian) *')}
                                value={schoolFormData.nameAl}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, nameAl: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Emri (Anglisht)', 'Name (English)')}
                                value={schoolFormData.nameEn}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, nameEn: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Slug (URL) *', 'Slug (URL) *')}
                                value={schoolFormData.slug}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Shqip)', 'Description (Albanian)')}
                                value={schoolFormData.descriptionAl}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, descriptionAl: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')}
                                value={schoolFormData.descriptionEn}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, descriptionEn: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Logo', 'Logo URL')}
                                value={schoolFormData.logo}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, logo: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Imazh Kopertine', 'Cover Image URL')}
                                value={schoolFormData.coverImage}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, coverImage: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Adresa', 'Address')}
                                value={schoolFormData.address}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, address: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="email"
                                placeholder={t('Email Kontakti', 'Contact Email')}
                                value={schoolFormData.contactEmail}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, contactEmail: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Telefon', 'Phone')}
                                value={schoolFormData.contactPhone}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, contactPhone: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder="Website"
                                value={schoolFormData.website}
                                onChange={(e) => setSchoolFormData({ ...schoolFormData, website: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowAddSchoolForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitSchool} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add School Post Modal */}
            {showSchoolPostForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {editMode ? t('Ndrysho Postim', 'Edit Post') : t('Shto Postim', 'Add Post')}
                            </h2>
                            <button onClick={() => { setShowSchoolPostForm(false); setEditMode(false); setEditingItem(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <select
                                value={schoolPostFormData.type}
                                onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, type: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            >
                                <option value="news">{t('Lajm', 'News')}</option>
                                <option value="event">{t('Event', 'Event')}</option>
                                <option value="success_story">{t('Histori Suksesi', 'Success Story')}</option>
                                <option value="school_trip">{t('Ekskursion', 'School Trip')}</option>
                            </select>
                            <input
                                type="text"
                                placeholder={t('Titulli (Shqip) *', 'Title (Albanian) *')}
                                value={schoolPostFormData.titleAl}
                                onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, titleAl: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Titulli (Anglisht)', 'Title (English)')}
                                value={schoolPostFormData.titleEn}
                                onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, titleEn: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përmbajtja (Shqip) *', 'Content (Albanian) *')}
                                value={schoolPostFormData.contentAl}
                                onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, contentAl: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përmbajtja (Anglisht)', 'Content (English)')}
                                value={schoolPostFormData.contentEn}
                                onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, contentEn: e.target.value })}
                                rows="4"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Imazhi', 'Image URL')}
                                value={schoolPostFormData.image}
                                onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, image: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            {schoolPostFormData.type === 'event' && (
                                <>
                                    <input
                                        type="date"
                                        value={schoolPostFormData.eventDate}
                                        onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, eventDate: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                    <input
                                        type="time"
                                        value={schoolPostFormData.eventTime}
                                        onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, eventTime: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                    <input
                                        type="text"
                                        placeholder={t('Lokacioni', 'Location')}
                                        value={schoolPostFormData.eventLocation}
                                        onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, eventLocation: e.target.value })}
                                        className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                                    />
                                </>
                            )}
                            <label className="flex items-center gap-3 text-white">
                                <input
                                    type="checkbox"
                                    checked={schoolPostFormData.isFeatured}
                                    onChange={(e) => setSchoolPostFormData({ ...schoolPostFormData, isFeatured: e.target.checked })}
                                    className="w-5 h-5 rounded"
                                />
                                <span>{t('Postim i veçantë', 'Featured post')}</span>
                            </label>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowSchoolPostForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitSchoolPost} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Council Member Modal */}
            {showCouncilForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {editMode ? t('Ndrysho Anëtar', 'Edit Member') : t('Shto Anëtar Këshilli', 'Add Council Member')}
                            </h2>
                            <button onClick={() => { setShowCouncilForm(false); setEditMode(false); setEditingItem(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Emri i Nxënësit *', 'Student Name *')}
                                value={councilFormData.studentName}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, studentName: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Pozicioni *', 'Position *')}
                                value={councilFormData.position}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, position: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Viti Akademik', 'Academic Year')}
                                value={councilFormData.academicYear}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, academicYear: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Klasa', 'Grade')}
                                value={councilFormData.grade}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, grade: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Foto', 'Photo URL')}
                                value={councilFormData.photo}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, photo: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Bio (Shqip)', 'Bio (Albanian)')}
                                value={councilFormData.bioAl}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, bioAl: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Bio (Anglisht)', 'Bio (English)')}
                                value={councilFormData.bioEn}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, bioEn: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={councilFormData.email}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="number"
                                placeholder={t('Renditja', 'Display Order')}
                                value={councilFormData.displayOrder}
                                onChange={(e) => setCouncilFormData({ ...councilFormData, displayOrder: parseInt(e.target.value) || 0 })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowCouncilForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitCouncil} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Student of Month Modal */}
            {showStudentOfMonthForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                                {editMode ? t('Ndrysho Nxënës', 'Edit Student') : t('Shto Nxënës të Muajit', 'Add Student of Month')}
                            </h2>
                            <button onClick={() => { setShowStudentOfMonthForm(false); setEditMode(false); setEditingItem(null); }} className="p-2 hover:bg-amber-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Emri i Nxënësit *', 'Student Name *')}
                                value={studentOfMonthFormData.studentName}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, studentName: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Klasa', 'Grade')}
                                value={studentOfMonthFormData.grade}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, grade: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Muaji/Viti (p.sh. Dhjetor 2025)', 'Month/Year (e.g. December 2025)')}
                                value={studentOfMonthFormData.monthYear}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, monthYear: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Arritja (Shqip) *', 'Achievement (Albanian) *')}
                                value={studentOfMonthFormData.achievementAl}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, achievementAl: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Arritja (Anglisht)', 'Achievement (English)')}
                                value={studentOfMonthFormData.achievementEn}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, achievementEn: e.target.value })}
                                rows="3"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Foto', 'Photo URL')}
                                value={studentOfMonthFormData.photo}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, photo: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Citim (Shqip)', 'Quote (Albanian)')}
                                value={studentOfMonthFormData.quoteAl}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, quoteAl: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Citim (Anglisht)', 'Quote (English)')}
                                value={studentOfMonthFormData.quoteEn}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, quoteEn: e.target.value })}
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Komenti i Mësuesit (Shqip)', 'Teacher Comment (Albanian)')}
                                value={studentOfMonthFormData.teacherCommentAl}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, teacherCommentAl: e.target.value })}
                                rows="2"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Komenti i Mësuesit (Anglisht)', 'Teacher Comment (English)')}
                                value={studentOfMonthFormData.teacherCommentEn}
                                onChange={(e) => setStudentOfMonthFormData({ ...studentOfMonthFormData, teacherCommentEn: e.target.value })}
                                rows="2"
                                className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => { setShowStudentOfMonthForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitStudentOfMonth} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">
                                    {editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50" onClick={() => setMobileMenuOpen(false)}>
                    {/* Elegant backdrop */}
                    <div className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-black/40'} backdrop-blur-sm`} />

                    {/* Minimalist slide-in panel */}
                    <div
                        className={`absolute top-0 right-0 h-full w-72 flex flex-col transition-transform duration-300 ease-out ${darkMode ? 'bg-[#1a1918]' : 'bg-[#FEFDFB]'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Clean header */}
                        <div className="flex items-center justify-between p-6 flex-shrink-0">
                            <span className={`text-sm font-light tracking-widest uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'
                                }`}>
                                Menu
                            </span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className={`p-2 -mr-2 rounded-full transition-colors ${darkMode ? 'hover:bg-white/5' : 'hover:bg-black/5'
                                    }`}
                            >
                                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </button>
                        </div>

                        {/* Navigation - Scrollable area */}
                        <div className="flex-1 overflow-y-auto">
                            <nav className="px-6 py-2">
                                <div className="space-y-1">
                                    {[
                                        { page: 'home', label: t('Lajme', 'News') },
                                        { page: 'events', label: t('Evente', 'Events') },
                                        { page: 'schools', label: t('Shkollat', 'Schools') },
                                        { page: 'partners', label: t('Bashkëpunime', 'Partners') },
                                        { page: 'discussion', label: t('Forum', 'Forum') },
                                        { page: 'about', label: t('Rreth Nesh', 'About') },
                                    ].map(({ page, label }) => (
                                        <button
                                            key={page}
                                            onClick={() => { changePage(page); setMobileMenuOpen(false); }}
                                            className={`block w-full text-left py-3 text-lg transition-colors ${currentPage === page || (page === 'schools' && currentPage === 'school-portal')
                                                    ? 'text-amber-500 font-medium'
                                                    : darkMode
                                                        ? 'text-gray-300 hover:text-white'
                                                        : 'text-gray-600 hover:text-gray-900'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            {/* Saved Items Button - for logged in users */}
                            {user && (
                                <div className="px-6 py-2">
                                    <button
                                        onClick={() => { setShowUserActivity(true); setMobileMenuOpen(false); }}
                                        className={`w-full flex items-center gap-3 py-3 text-left transition-colors ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'
                                            }`}
                                    >
                                        <Bookmark className="w-5 h-5" />
                                        <span className="text-lg">{t('Të ruajturat', 'Saved Items')}</span>
                                        {(savedArticles.length + savedEvents.length) > 0 && (
                                            <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                                                }`}>
                                                {savedArticles.length + savedEvents.length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            )}

                            {/* Subtle divider */}
                            <div className={`mx-6 my-2 border-t ${darkMode ? 'border-white/10' : 'border-black/5'}`} />

                            {/* Settings - Compact */}
                            <div className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setLanguage(language === 'al' ? 'en' : 'al')}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors ${darkMode
                                                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                                : 'bg-black/5 hover:bg-black/10 text-gray-600'
                                            }`}
                                    >
                                        <Globe className="w-4 h-4" />
                                        <span className="text-sm">{language === 'al' ? 'EN' : 'AL'}</span>
                                    </button>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-colors ${darkMode
                                                ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                                : 'bg-black/5 hover:bg-black/10 text-gray-600'
                                            }`}
                                    >
                                        {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                        <span className="text-sm">{darkMode ? t('Dritë', 'Light') : t('Errët', 'Dark')}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom section - Fixed at bottom */}
                        <div className={`p-6 flex-shrink-0 border-t ${darkMode ? 'border-white/5' : 'border-black/5'}`}>
                            {user ? (
                                <div className="space-y-3">
                                    <div className={`flex items-center gap-3 p-3 rounded-xl ${darkMode ? 'bg-white/5' : 'bg-black/5'
                                        }`}>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-white font-medium">
                                                {userProfile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {userProfile?.display_name || 'User'}
                                            </p>
                                            <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                                        className={`w-full py-2.5 text-sm font-medium rounded-xl transition-colors ${darkMode
                                                ? 'text-red-400 hover:bg-red-500/10'
                                                : 'text-red-500 hover:bg-red-50'
                                            }`}
                                    >
                                        {t('Dil nga llogaria', 'Sign out')}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => { setShowAuthModal(true); setAuthMode('login'); setMobileMenuOpen(false); }}
                                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
                                >
                                    {t('Hyr në llogari', 'Sign in')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <AuthModal
                showAuthModal={showAuthModal}
                setShowAuthModal={setShowAuthModal}
                authMode={authMode}
                setAuthMode={setAuthMode}
                handleSignup={handleSignup}
                handleLogin={handleLogin}
                setShowPreferences={setShowPreferences}
                darkMode={darkMode}
                t={t}
            />

            <PreferencesModal
                showPreferences={showPreferences}
                setShowPreferences={setShowPreferences}
                userProfile={userProfile}
                updatePreferences={updatePreferences}
                categories={categories}
                language={language}
                darkMode={darkMode}
                t={t}
                onDeleteAccount={handleDeleteAccount}
            />
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                item={shareItem.item}
                type={shareItem.type}
                language={language}
                darkMode={darkMode}
                t={t}
            />

            {/* ==========================================
                DRAFTS MODAL - View and manage saved drafts
               ========================================== */}
            {showDraftsModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDraftsModal(false)}>
                    <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`} />
                    <div
                        className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl ${darkMode ? 'bg-[#1a1918]' : 'bg-white'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'
                            }`}>
                            <div>
                                <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {t('Drafts të Mia', 'My Drafts')}
                                </h2>
                                <p className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {drafts.length} {t('draft të ruajtur', 'saved drafts')}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowDraftsModal(false)}
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                            >
                                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </button>
                        </div>

                        {/* Drafts List */}
                        <div className="overflow-y-auto max-h-[60vh] p-4">
                            {drafts.length > 0 ? (
                                <div className="space-y-3">
                                    {drafts.map(draft => (
                                        <div
                                            key={draft.id}
                                            className={`p-4 rounded-xl border transition-colors ${darkMode
                                                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                                    : 'bg-gray-50 border-gray-100 hover:bg-gray-100'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-medium line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {draft.titleAl || t('Pa titull', 'Untitled')}
                                                    </h4>
                                                    <p className={`text-sm mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                                        }`}>
                                                        {draft.contentAl?.substring(0, 150) || t('Pa përmbajtje', 'No content')}...
                                                    </p>
                                                    <div className={`flex items-center gap-3 mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'
                                                        }`}>
                                                        <span className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                                                            }`}>
                                                            {draft.category}
                                                        </span>
                                                        <span>
                                                            {t('Përditësuar', 'Updated')}: {new Date(draft.updatedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                                {draft.image && (
                                                    <img
                                                        src={draft.image}
                                                        alt=""
                                                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                )}
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-white/10">
                                                <button
                                                    onClick={() => editDraft(draft)}
                                                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode
                                                            ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <Edit className="w-4 h-4 inline mr-1" />
                                                    {t('Vazhdo', 'Continue')}
                                                </button>
                                                <button
                                                    onClick={() => publishDraft(draft)}
                                                    className="flex-1 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
                                                >
                                                    {t('Publiko', 'Publish')}
                                                </button>
                                                <button
                                                    onClick={() => deleteDraft(draft.id)}
                                                    className={`p-2 rounded-lg transition-colors ${darkMode
                                                            ? 'text-red-400 hover:bg-red-500/10'
                                                            : 'text-red-500 hover:bg-red-50'
                                                        }`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Edit className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-700' : 'text-gray-200'}`} />
                                    <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('Asnjë draft', 'No drafts yet')}
                                    </h3>
                                    <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {t('Drafts që ruan do të shfaqen këtu', 'Drafts you save will appear here')}
                                    </p>
                                    <button
                                        onClick={() => { setShowDraftsModal(false); setShowAddForm(true); }}
                                        className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-medium rounded-lg"
                                    >
                                        {t('Shkruaj Artikull', 'Write Article')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                USER ACTIVITY BANK - Saved Articles & Events
               ========================================== */}
            {showUserActivity && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowUserActivity(false)}>
                    <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`} />
                    <div
                        className={`relative w-full max-w-lg max-h-[80vh] overflow-hidden rounded-2xl ${darkMode ? 'bg-[#1a1918]' : 'bg-white'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'
                            }`}>
                            <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {t('Të Ruajturat e Mia', 'My Saved Items')}
                            </h2>
                            <button
                                onClick={() => setShowUserActivity(false)}
                                className={`p-2 rounded-full ${darkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                            >
                                <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className={`flex border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
                            <button
                                onClick={() => setUserActivityTab('saved')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${userActivityTab === 'saved'
                                        ? 'text-amber-500 border-b-2 border-amber-500'
                                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                            >
                                {t('Artikuj', 'Articles')} ({savedArticles.length})
                            </button>
                            <button
                                onClick={() => setUserActivityTab('events')}
                                className={`flex-1 py-3 text-sm font-medium transition-colors ${userActivityTab === 'events'
                                        ? 'text-amber-500 border-b-2 border-amber-500'
                                        : darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                            >
                                {t('Evente', 'Events')} ({savedEvents.length})
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[50vh] p-4">
                            {userActivityTab === 'saved' ? (
                                getSavedArticlesData().length > 0 ? (
                                    <div className="space-y-3">
                                        {getSavedArticlesData().map(article => (
                                            <div
                                                key={article.id}
                                                className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                                onClick={() => { openArticle(article); setShowUserActivity(false); }}
                                            >
                                                <img
                                                    src={article.image}
                                                    alt={article.titleAl}
                                                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-medium text-sm line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {language === 'al' ? article.titleAl : article.titleEn}
                                                    </h4>
                                                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        {article.category}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleSaveArticle(article.id); }}
                                                    className="p-2 text-amber-500"
                                                >
                                                    <BookmarkCheck className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <Bookmark className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {t('Nuk ke artikuj të ruajtur', 'No saved articles yet')}
                                        </p>
                                    </div>
                                )
                            ) : (
                                getSavedEventsData().length > 0 ? (
                                    <div className="space-y-3">
                                        {getSavedEventsData().map(event => (
                                            <div
                                                key={event.id}
                                                className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-colors ${darkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-50 hover:bg-gray-100'
                                                    }`}
                                            >
                                                <div className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${darkMode ? 'bg-amber-500/20' : 'bg-amber-100'
                                                    }`}>
                                                    <Calendar className="w-5 h-5 text-amber-500" />
                                                    <span className={`text-xs font-medium mt-1 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                                        {event.date?.slice(5, 10)}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className={`font-medium text-sm line-clamp-2 ${darkMode ? 'text-white' : 'text-gray-900'
                                                        }`}>
                                                        {language === 'al' ? event.titleAl : event.titleEn}
                                                    </h4>
                                                    <p className={`text-xs mt-1 flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                        <MapPin className="w-3 h-3" />
                                                        {event.location}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleSaveEvent(event.id); }}
                                                    className="p-2 text-amber-500"
                                                >
                                                    <BookmarkCheck className="w-5 h-5" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10">
                                        <Calendar className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            {t('Nuk ke evente të ruajtura', 'No saved events yet')}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                NATIVE SHARE MODAL - WhatsApp, Snapchat, etc.
               ========================================== */}
            {showNativeShare && nativeShareItem && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={() => setShowNativeShare(false)}>
                    <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-black/50'}`} />
                    <div
                        className={`relative w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl overflow-hidden ${darkMode ? 'bg-[#1a1918]' : 'bg-white'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-center pt-3 pb-1">
                            <div className={`w-10 h-1 rounded-full ${darkMode ? 'bg-white/20' : 'bg-gray-300'}`} />
                        </div>
                        <div className="p-5 pt-2 text-center">
                            <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {t('Shpërndaj', 'Share')}
                            </h3>
                            <p className={`text-sm mt-1 line-clamp-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {nativeShareItem.title}
                            </p>
                        </div>

                        {/* Share Options - For Everyone */}
                        <div className="px-5 pb-4">
                            <div className="grid grid-cols-4 gap-4">
                                {/* WhatsApp */}
                                <a
                                    href={`https://wa.me/?text=${encodeURIComponent(nativeShareItem.title + ' ' + nativeShareItem.url)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-green-500 flex items-center justify-center">
                                        <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>WhatsApp</span>
                                </a>

                                {/* Telegram */}
                                <a
                                    href={`https://t.me/share/url?url=${encodeURIComponent(nativeShareItem.url)}&text=${encodeURIComponent(nativeShareItem.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-blue-500 flex items-center justify-center">
                                        <Send className="w-6 h-6 text-white" />
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Telegram</span>
                                </a>

                                {/* Twitter/X */}
                                <a
                                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(nativeShareItem.title)}&url=${encodeURIComponent(nativeShareItem.url)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center">
                                        <span className="text-white font-bold text-xl">𝕏</span>
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>X</span>
                                </a>

                                {/* Copy Link */}
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(nativeShareItem.url);
                                        alert(t('Linku u kopjua!', 'Link copied!'));
                                    }}
                                    className="flex flex-col items-center gap-2"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-white/10' : 'bg-gray-100'
                                        }`}>
                                        <Copy className={`w-6 h-6 ${darkMode ? 'text-white' : 'text-gray-700'}`} />
                                    </div>
                                    <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Kopjo', 'Copy')}</span>
                                </button>
                            </div>
                        </div>

                        {/* Instagram Share - Admin Only */}
                        {userProfile?.is_admin && (
                            <>
                                <div className={`mx-5 border-t ${darkMode ? 'border-white/10' : 'border-gray-100'}`} />
                                <div className="p-5">
                                    <p className={`text-xs font-medium mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                        {t('Vetëm për Admin - Shpërndaj në Instagram', 'Admin Only - Share to Instagram')}
                                    </p>
                                    <button
                                        onClick={() => openShareModal(nativeShareItem.item, nativeShareItem.type)}
                                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-medium flex items-center justify-center gap-2"
                                    >
                                        <Instagram className="w-5 h-5" />
                                        {t('Krijo Post për Instagram', 'Create Instagram Post')}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Cancel */}
                        <div className="p-5 pt-0">
                            <button
                                onClick={() => setShowNativeShare(false)}
                                className={`w-full py-3 rounded-xl font-medium ${darkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-700'
                                    }`}
                            >
                                {t('Anulo', 'Cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from { 
            transform: translateY(20px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideDown {
          from { 
            transform: translateY(-20px);
            opacity: 0;
          }
          to { 
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
          }
          50% {
            box-shadow: 0 0 35px rgba(168, 85, 247, 0.8);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }

        .animate-page-enter {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-page-exit {
          animation: fadeOut 0.35s ease-out;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        /* Hide scrollbar for category pills */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        /* Safe area for mobile devices with notch */
        .safe-area-inset-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>

            <main className={pageTransition ? 'animate-page-exit' : hasPageLoaded ? '' : 'animate-page-enter'}>
                {loading ? (
                    /* ==========================================
                       SKELETON LOADING - Professional loading state
                       ========================================== */
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        {/* Hero Skeleton */}
                        <div className={`h-[400px] rounded-3xl mb-8 animate-pulse ${darkMode ? 'bg-[#3D3A36]' : 'bg-gray-200'}`}>
                            <div className="h-full flex flex-col justify-end p-8">
                                <div className={`w-24 h-6 rounded-full mb-4 ${darkMode ? 'bg-[#4D4A46]' : 'bg-gray-300'}`}></div>
                                <div className={`w-3/4 h-10 rounded-lg mb-2 ${darkMode ? 'bg-[#4D4A46]' : 'bg-gray-300'}`}></div>
                                <div className={`w-1/2 h-6 rounded-lg ${darkMode ? 'bg-[#4D4A46]' : 'bg-gray-300'}`}></div>
                            </div>
                        </div>

                        {/* Article Cards Skeleton */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className={`rounded-3xl overflow-hidden animate-pulse ${darkMode ? 'bg-[#3D3A36]' : 'bg-gray-200'}`}>
                                    <div className={`h-64 ${darkMode ? 'bg-[#4D4A46]' : 'bg-gray-300'}`}></div>
                                    <div className="p-4">
                                        <div className={`w-20 h-5 rounded-full mb-3 ${darkMode ? 'bg-[#5D5A56]' : 'bg-gray-300'}`}></div>
                                        <div className={`w-full h-6 rounded-lg mb-2 ${darkMode ? 'bg-[#5D5A56]' : 'bg-gray-300'}`}></div>
                                        <div className={`w-2/3 h-4 rounded-lg ${darkMode ? 'bg-[#5D5A56]' : 'bg-gray-300'}`}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : currentPage === 'home' ? (
                    <>
                        {featuredArticles.length > 0 && (
                            <div className="relative bg-gradient-to-br from-[#2D2A26] via-[#3D3A36] to-[#2D2A26] text-white overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] animate-pulse"></div>
                                </div>
                                <div className="max-w-7xl mx-auto relative">
                                    <div className="relative min-h-[600px] overflow-hidden">
                                        {featuredArticles.map((article, index) => (
                                            <div
                                                key={article.id}
                                                className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
                                                <img
                                                    src={article.image}
                                                    alt={article.titleAl}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800';
                                                    }}
                                                />
                                                <div className="absolute inset-0 z-20 flex items-center">
                                                    <div className="max-w-3xl mx-auto px-4 md:px-8">
                                                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white text-sm font-bold rounded-full mb-6 shadow-lg shadow-amber-500/50 animate-pulse">
                                                            {article.category}
                                                        </span>
                                                        <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-amber-200 to-orange-200 bg-clip-text text-transparent">
                                                            {language === 'al' ? article.titleAl : article.titleEn}
                                                        </h2>
                                                        <p className="text-xl text-gray-200 mb-8 line-clamp-2">
                                                            {language === 'al' ? article.contentAl : article.contentEn}
                                                        </p>
                                                        <button
                                                            onClick={() => openArticle(article)}
                                                            className="bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white px-8 py-4 rounded-full font-bold hover:from-amber-500 hover:to-[#FF5252] transform hover:scale-105 transition-all shadow-lg shadow-amber-500/50"
                                                        >
                                                            {t('Lexo më shumë', 'Read more')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {featuredArticles.length > 1 && (
                                            <>
                                                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-lg border border-white/20 transition-all">
                                                    <ChevronLeft className="h-6 w-6 text-white" />
                                                </button>
                                                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-lg border border-white/20 transition-all">
                                                    <ChevronRight className="h-6 w-6 text-white" />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 animate-bounce">
                                    <ChevronDown className="w-8 h-8 text-white/60" />
                                </div>
                            </div>
                        )}

                        {/* ==========================================
                            QUICK CTA CARDS - Mobile Swipeable
                            Eye-catching action cards for quick navigation
                           ========================================== */}
                        <div className="md:hidden max-w-7xl mx-auto px-4 py-6">
                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
                                {/* Events CTA */}
                                <div
                                    onClick={() => changePage('events')}
                                    className={`flex-shrink-0 w-[280px] p-5 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] ${darkMode
                                            ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30'
                                            : 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                                {t('Evente', 'Events')}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                                {otherEvents.length} {t('të disponueshme', 'available')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t('Zbulo eventet më të fundit për të rinj', 'Discover the latest youth events')}
                                    </p>
                                    <span className="text-amber-500 text-sm font-semibold flex items-center gap-1">
                                        {t('Shiko Kalendarin', 'View Calendar')} <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>

                                {/* Forum CTA */}
                                <div
                                    onClick={() => changePage('discussion')}
                                    className={`flex-shrink-0 w-[280px] p-5 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] ${darkMode
                                            ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30'
                                            : 'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                                            <MessageCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                                {t('Forum', 'Forum')}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                {topics.length} {t('tema', 'topics')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t('Diskuto me të rinj të tjerë', 'Discuss with other youth')}
                                    </p>
                                    <span className="text-blue-500 text-sm font-semibold flex items-center gap-1">
                                        {t('Bashkohu', 'Join')} <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>

                                {/* Schools CTA */}
                                <div
                                    onClick={() => changePage('schools')}
                                    className={`flex-shrink-0 w-[280px] p-5 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] ${darkMode
                                            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30'
                                            : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
                                            <School className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                                {t('Shkollat', 'Schools')}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                {schools.length} {t('shkolla', 'schools')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t('Pasqyra e shkollave Shqiptare', 'Albanian schools mirror')}
                                    </p>
                                    <span className="text-green-500 text-sm font-semibold flex items-center gap-1">
                                        {t('Eksploro', 'Explore')} <ChevronRight className="w-4 h-4" />
                                    </span>
                                </div>

                                {/* Volunteer CTA */}
                                <a
                                    href="https://docs.google.com/forms/d/e/1FAIpQLSd2J3S01v9PhZyQgSLNLmZ5YnDUbQePlta_LXx1D13VLB644A/viewform?usp=dialog"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex-shrink-0 w-[280px] p-5 rounded-2xl cursor-pointer transition-all transform hover:scale-[1.02] ${darkMode
                                            ? 'bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/30'
                                            : 'bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                                {t('Vullnetar', 'Volunteer')}
                                            </h3>
                                            <p className={`text-sm ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                                                {t('Bashkohu me ne', 'Join us')}
                                            </p>
                                        </div>
                                    </div>
                                    <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t('Behu pjesë e ekipit tonë', 'Become part of our team')}
                                    </p>
                                    <span className="text-pink-500 text-sm font-semibold flex items-center gap-1">
                                        {t('Apliko Tani', 'Apply Now')} <ChevronRight className="w-4 h-4" />
                                    </span>
                                </a>
                            </div>
                        </div>

                        {/* Search Results Info */}
                        {searchQuery && (
                            <div className="max-w-7xl mx-auto px-4 pb-4">
                                <div className={`flex items-center justify-between p-3 rounded-xl ${darkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'
                                    }`}>
                                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                        <Search className="w-4 h-4 inline mr-2" />
                                        {t('Rezultate për', 'Results for')} "<span className="font-semibold text-amber-500">{searchQuery}</span>"
                                        <span className="ml-2">({filteredArticles.length} {t('artikuj', 'articles')})</span>
                                    </p>
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="text-amber-500 text-sm font-medium hover:underline"
                                    >
                                        {t('Pastro', 'Clear')}
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="max-w-7xl mx-auto px-4 py-12">
                            {filteredArticles.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-amber-500/30">
                                        {searchQuery ? <Search className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} /> : <TrendingUp className={`w-10 h-10 ${darkMode ? 'text-amber-500' : 'text-amber-600'}`} />}
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>
                                        {searchQuery ? t('Asnjë rezultat', 'No results') : t('Asnjë artikull ende', 'No articles yet')}
                                    </h3>
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {searchQuery
                                            ? t('Provo të kërkosh diçka tjetër', 'Try searching for something else')
                                            : t('Artikujt do të shfaqen këtu kur të publikohen', 'Articles will appear here when published')
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredArticles.map((article) => (
                                        <div
                                            key={article.id}
                                            className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/30"
                                            onClick={() => openArticle(article)}
                                        >
                                            <div className="relative h-80 overflow-hidden">
                                                <img
                                                    src={article.image}
                                                    alt={article.titleAl}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800';
                                                    }}
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

                                                <span className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white text-xs font-bold backdrop-blur-sm shadow-lg">
                                                    {article.category}
                                                </span>
                                                <div className="absolute top-4 right-4 flex gap-2">
                                                    {/* Save/Bookmark Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleSaveArticle(article.id);
                                                        }}
                                                        className={`p-2 rounded-full transition z-10 shadow-lg ${savedArticles.includes(article.id)
                                                                ? 'bg-amber-500 text-white'
                                                                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                                                            }`}
                                                        title={savedArticles.includes(article.id) ? t('Hiq nga të ruajturit', 'Remove from saved') : t('Ruaj', 'Save')}
                                                    >
                                                        {savedArticles.includes(article.id) ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleNativeShare(article, 'article');
                                                        }}
                                                        className="bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white p-2 rounded-full hover:from-amber-500 hover:to-[#FF5252] transition z-10 shadow-lg"
                                                        title={t('Shpërndaj', 'Share')}
                                                    >
                                                        <Share2 className="h-4 w-4" />
                                                    </button>
                                                    {showAdmin && (
                                                        <>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    editArticle(article);
                                                                }}
                                                                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition z-10 shadow-lg"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    deleteArticle(article.id);
                                                                }}
                                                                className="bg-[#FF6B6B] text-white p-2 rounded-full hover:bg-[#FF5252] transition z-10 shadow-lg"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>

                                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                    <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-amber-400 transition">
                                                        {language === 'al' ? article.titleAl : article.titleEn}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm opacity-80">
                                                        <span>{article.date}</span>
                                                        <span className="text-amber-400 font-medium group-hover:underline">
                                                            {t('Lexo më shumë →', 'Read more →')}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : currentPage === 'events' ? (
                    <EventsPage />
                ) : currentPage === 'partners' ? (
                    <PartnershipsPage />
                ) : currentPage === 'about' ? (
                    <AboutPage />
                ) : currentPage === 'schools' ? (
                    <SchoolsOverviewPage />
                ) : currentPage === 'school-portal' ? (
                    <SchoolPortalPage />
                ) : currentPage === 'discussion' ? (
                    <DiscussionPageContent
                        selectedTopic={selectedTopic}
                        setSelectedTopic={setSelectedTopic}
                        topics={topics}
                        topicPosts={topicPosts}
                        newPost={newPost}
                        setNewPost={setNewPost}
                        submitPost={submitPost}
                        deletePost={deletePost}
                        deleteTopic={deleteTopic}
                        user={user}
                        userProfile={userProfile}
                        showAdmin={showAdmin}
                        language={language}
                        darkMode={darkMode}
                        t={t}
                        setShowAuthModal={setShowAuthModal}
                        setAuthMode={setAuthMode}
                    />
                ) : null}
            </main>

            {showArticleModal && selectedArticle && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-[#2D2A26] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl">
                        <div className="relative h-80">
                            <img
                                src={selectedArticle.image}
                                alt={selectedArticle.titleAl}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2A26] via-transparent to-transparent" />
                            <button
                                onClick={() => {
                                    setShowArticleModal(false);
                                    // Reset URL back to home
                                    window.history.pushState({}, '', '/');
                                }}
                                className="absolute top-4 right-4 bg-[#2D2A26]/80 hover:bg-[#2D2A26] p-2 rounded-full backdrop-blur-lg transition-all"
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <div className="p-8">
                            <h2 className="text-4xl font-bold text-white mb-4">
                                {language === 'al' ? selectedArticle.titleAl : selectedArticle.titleEn}
                            </h2>
                            {selectedArticle.source && (
                                <p className="text-sm text-gray-400 mb-4">
                                    {t('Burimi:', 'Source:')} {selectedArticle.source}
                                </p>
                            )}
                            <div className="prose prose-invert prose-lg max-w-none">
                                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                                    {language === 'al' ? selectedArticle.contentAl : selectedArticle.contentEn}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Event Modal */}
            {showEventModal && selectedEvent && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className={`rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border shadow-2xl ${darkMode ? 'bg-[#2D2A26] border-amber-500/20' : 'bg-white border-gray-200'}`}>
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
                                onClick={() => {
                                    setShowEventModal(false);
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
                                    onClick={() => {
                                        openShareModal(selectedEvent, 'event');
                                    }}
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
            )
            }
            {showAdmin && (
                <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white p-4 rounded-full shadow-2xl hover:from-amber-500 hover:to-[#FF5252] transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Artikull', 'Add Article')}
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddEventForm(true)}
                        className="bg-gradient-to-r from-blue-500 to-amber-500 text-white p-4 rounded-full shadow-2xl hover:from-blue-500 hover:to-amber-500 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Event', 'Add Event')}
                        style={{ animationDelay: '0.5s' }}
                    >
                        <Calendar className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddTopicForm(true)}
                        className="bg-gradient-to-r from-amber-500 to-orange-600 text-white p-4 rounded-full shadow-2xl hover:from-amber-600 hover:to-orange-700 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Temë Diskutimi', 'Add Discussion Topic')}
                        style={{ animationDelay: '1s' }}
                    >
                        <MessageCircle className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddPartnerForm(true)}
                        className="bg-gradient-to-r from-orange-500 to-[#FF6B6B] text-white p-4 rounded-full shadow-2xl hover:from-orange-500 hover:to-[#FF5252] transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Partner', 'Add Partner')}
                        style={{ animationDelay: '1.5s' }}
                    >
                        <Users className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddMemberForm(true)}
                        className="bg-gradient-to-r from-[#FF6B6B] to-[#FF5252] text-white p-4 rounded-full shadow-2xl hover:from-[#FF5252] hover:to-[#FF4040] transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Anëtar Ekipi', 'Add Team Member')}
                        style={{ animationDelay: '2s' }}
                    >
                        <Award className="h-6 w-6" />
                    </button>
                    {isSuperAdmin() && (
                        <button
                            onClick={() => setShowAddSchoolForm(true)}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full shadow-2xl hover:from-green-500 hover:to-teal-500 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                            title={t('Shto Shkollë', 'Add School')}
                            style={{ animationDelay: '2.5s' }}
                        >
                            <School className="h-6 w-6" />
                        </button>
                    )}
                </div>
            )}

            {/* ==========================================
                SCROLL TO TOP BUTTON
                Appears after scrolling down
               ========================================== */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-24 md:bottom-8 left-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 animate-fadeIn ${darkMode
                            ? 'bg-[#3D3A36] text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                            : 'bg-white text-amber-600 border border-amber-200 hover:bg-amber-50'
                        }`}
                    title={t('Kthehu lart', 'Back to top')}
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
            )}

            {/* ==========================================
                MOBILE BOTTOM NAVIGATION BAR
                Clean, elevated design with larger touch targets
               ========================================== */}
            <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 transition-colors duration-300 ${darkMode
                    ? 'bg-[#1a1918]'
                    : 'bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'
                }`}>
                <div className="flex items-center justify-around px-4 pt-3 pb-6">
                    {/* Home/News */}
                    <button
                        onClick={() => changePage('home')}
                        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] rounded-2xl transition-all active:scale-95 ${currentPage === 'home'
                                ? darkMode
                                    ? 'text-amber-400'
                                    : 'text-amber-600'
                                : darkMode
                                    ? 'text-gray-500 active:text-gray-300'
                                    : 'text-gray-400 active:text-gray-600'
                            }`}
                    >
                        <Newspaper className={`w-6 h-6 mb-1 ${currentPage === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                        <span className={`text-[11px] ${currentPage === 'home' ? 'font-semibold' : 'font-normal'}`}>
                            {t('Lajme', 'News')}
                        </span>
                    </button>

                    {/* Events - Elevated center button */}
                    <button
                        onClick={() => changePage('events')}
                        className={`flex flex-col items-center justify-center min-w-[72px] min-h-[56px] -mt-4 rounded-2xl transition-all active:scale-95 ${currentPage === 'events'
                                ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-lg shadow-amber-500/30'
                                : darkMode
                                    ? 'bg-[#2a2826] text-gray-400 active:bg-[#3a3836]'
                                    : 'bg-gray-100 text-gray-500 active:bg-gray-200'
                            }`}
                    >
                        <Calendar className={`w-6 h-6 mb-1 ${currentPage === 'events' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                        <span className={`text-[11px] ${currentPage === 'events' ? 'font-semibold' : 'font-normal'}`}>
                            {t('Evente', 'Events')}
                        </span>
                    </button>

                    {/* Forum */}
                    <button
                        onClick={() => changePage('discussion')}
                        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] rounded-2xl transition-all active:scale-95 ${currentPage === 'discussion'
                                ? darkMode
                                    ? 'text-amber-400'
                                    : 'text-amber-600'
                                : darkMode
                                    ? 'text-gray-500 active:text-gray-300'
                                    : 'text-gray-400 active:text-gray-600'
                            }`}
                    >
                        <MessageCircle className={`w-6 h-6 mb-1 ${currentPage === 'discussion' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`} />
                        <span className={`text-[11px] ${currentPage === 'discussion' ? 'font-semibold' : 'font-normal'}`}>
                            {t('Forum', 'Forum')}
                        </span>
                    </button>

                    {/* Profile/Account */}
                    <button
                        onClick={() => user ? setShowPreferences(true) : (setShowAuthModal(true), setAuthMode('login'))}
                        className={`flex flex-col items-center justify-center min-w-[64px] min-h-[56px] rounded-2xl transition-all active:scale-95 ${darkMode
                                ? 'text-gray-500 active:text-gray-300'
                                : 'text-gray-400 active:text-gray-600'
                            }`}
                    >
                        {user ? (
                            <div className="w-7 h-7 mb-1 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center ring-2 ring-offset-2 ring-offset-transparent ring-amber-400/30">
                                <span className="text-white text-xs font-semibold">
                                    {userProfile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                </span>
                            </div>
                        ) : (
                            <User className="w-6 h-6 mb-1 stroke-[1.5px]" />
                        )}
                        <span className="text-[11px] font-normal">
                            {user ? t('Profili', 'Profile') : t('Hyr', 'Login')}
                        </span>
                    </button>
                </div>
            </nav>

            {/* ==========================================
                FLOATING ACTION BUTTON (FAB) - Mobile Settings
                Quick access to language, dark mode, etc.
               ========================================== */}
            <div className="md:hidden fixed bottom-24 right-4 z-50">
                {/* FAB Menu Items */}
                <div className={`absolute bottom-14 right-0 flex flex-col gap-2 transition-all duration-300 ${fabOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
                    }`}>
                    {/* Drafts - Admin only */}
                    {showAdmin && drafts.length > 0 && (
                        <button
                            onClick={() => { setShowDraftsModal(true); setFabOpen(false); }}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-amber-500 text-white'
                                }`}
                        >
                            <Edit className="w-4 h-4" />
                            <span className="text-sm font-medium">{t('Drafts', 'Drafts')} ({drafts.length})</span>
                        </button>
                    )}

                    {/* Language Toggle */}
                    <button
                        onClick={() => { setLanguage(language === 'al' ? 'en' : 'al'); setFabOpen(false); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode
                                ? 'bg-[#3D3A36] text-white border border-amber-500/30 hover:bg-[#4D4A46]'
                                : 'bg-white text-[#2D2A26] border border-amber-200 hover:bg-amber-50'
                            }`}
                    >
                        <Globe className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{language === 'al' ? '🇬🇧 English' : '🇦🇱 Shqip'}</span>
                    </button>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={() => { setDarkMode(!darkMode); setFabOpen(false); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode
                                ? 'bg-[#3D3A36] text-white border border-amber-500/30 hover:bg-[#4D4A46]'
                                : 'bg-white text-[#2D2A26] border border-amber-200 hover:bg-amber-50'
                            }`}
                    >
                        {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-amber-500" />}
                        <span className="text-sm font-medium">{darkMode ? t('Dritë', 'Light') : t('Errët', 'Dark')}</span>
                    </button>

                    {/* Schools */}
                    <button
                        onClick={() => { changePage('schools'); setFabOpen(false); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode
                                ? 'bg-[#3D3A36] text-white border border-amber-500/30 hover:bg-[#4D4A46]'
                                : 'bg-white text-[#2D2A26] border border-amber-200 hover:bg-amber-50'
                            }`}
                    >
                        <School className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{t('Shkollat', 'Schools')}</span>
                    </button>

                    {/* About/Info */}
                    <button
                        onClick={() => { changePage('about'); setFabOpen(false); }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg transition-all whitespace-nowrap ${darkMode
                                ? 'bg-[#3D3A36] text-white border border-amber-500/30 hover:bg-[#4D4A46]'
                                : 'bg-white text-[#2D2A26] border border-amber-200 hover:bg-amber-50'
                            }`}
                    >
                        <Heart className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium">{t('Rreth Nesh', 'About Us')}</span>
                    </button>
                </div>

                {/* FAB Button */}
                <button
                    onClick={() => setFabOpen(!fabOpen)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${fabOpen
                            ? 'bg-[#FF6B6B] rotate-45'
                            : 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B]'
                        }`}
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>
            </div>

            {/* Spacer for bottom nav on mobile */}
            <div className="md:hidden h-20"></div>

            <footer className={`border-t py-12 pb-24 md:pb-12 transition-colors duration-300 ${darkMode
                ? 'bg-gradient-to-br from-[#2D2A26] via-[#3D3A36] to-[#2D2A26] text-white border-amber-500/20'
                : 'bg-gradient-to-br from-[#FFFCF2] via-[#FFE5D9] to-[#FFFCF2] text-gray-900 border-amber-200'
                }`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">RinON</h3>
                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('Platforma dixhitale për rininë shqiptare', 'Digital platform for Albanian youth')}
                            </p>
                            <div className="space-y-2">
                                <a
                                    href="https://instagram.com/rinon_albania"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block transition-colors ${darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}
                                >
                                    Instagram: @rinon_albania
                                </a>
                                <a
                                    href="mailto:rinonalbania@gmail.com"
                                    className={`block transition-colors ${darkMode ? 'text-gray-400 hover:text-amber-500' : 'text-gray-600 hover:text-amber-600'}`}
                                >
                                    Email: rinonalbania@gmail.com
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{t('Navigim', 'Navigation')}</h3>
                            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li><button onClick={() => changePage('home')} className={`transition-colors ${darkMode ? 'hover:text-amber-500' : 'hover:text-amber-600'}`}>{t('Lajme', 'News')}</button></li>
                                <li><button onClick={() => changePage('events')} className={`transition-colors ${darkMode ? 'hover:text-amber-500' : 'hover:text-amber-600'}`}>{t('Evente', 'Events')}</button></li>
                                <li><button onClick={() => changePage('partners')} className={`transition-colors ${darkMode ? 'hover:text-amber-500' : 'hover:text-amber-600'}`}>{t('Bashkëpunime', 'Cooperations')}</button></li>
                                <li><button onClick={() => changePage('about')} className={`transition-colors ${darkMode ? 'hover:text-amber-500' : 'hover:text-amber-600'}`}>{t('Rreth Nesh', 'About')}</button></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#2D2A26]'}`}>{t('Behu Vullnetar', 'Become a Volunteer')}</h3>
                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('Bashkohu me ne dhe kontribuo për një të ardhme më të mirë!', 'Join us and contribute to a better future!')}
                            </p>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSd2J3S01v9PhZyQgSLNLmZ5YnDUbQePlta_LXx1D13VLB644A/viewform?usp=dialog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] hover:from-amber-500 hover:to-[#FF5252] text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-amber-500/50"
                            >
                                <Heart className="w-4 h-4" />
                                {t('Apliko Tani', 'Apply Now')}
                            </a>
                        </div>
                    </div>

                    <div className={`border-t pt-8 text-center transition-colors duration-300 ${darkMode ? 'border-amber-500/20' : 'border-amber-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            © 2025 RinON. {t('Të gjitha të drejtat e rezervuara.', 'All rights reserved.')}
                        </p>
                        {userProfile?.is_admin && (
                            <button
                                onClick={() => setShowAdmin(!showAdmin)}
                                className={`mt-4 text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-amber-500' : 'text-gray-400 hover:text-amber-600'}`}
                            >
                                🔒 {showAdmin ? t('Fsheh Admin', 'Hide Admin') : t('Trego Admin', 'Show Admin')}
                            </button>
                        )}
                    </div>
                </div>
            </footer>
            <Analytics />
        </div>
    );
};

export default RinON;