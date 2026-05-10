import React from 'react';
import EventCalendar from '../components/EventCalendar';

const EventsPage = ({ darkMode, t, language, otherEvents, showAdmin, editEvent, deleteEvent, openShareModal, openEvent, calendarDate, setCalendarDate, eventInterests, userEventInterests, toggleEventInterest }) => (
    <div className="relative max-w-7xl mx-auto px-4 py-12 overflow-hidden">
        {/* Decorative Yellow Circles Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className={`absolute -top-20 -right-20 w-72 h-72 rounded-full border-4 ${darkMode ? 'border-amber-500/20' : 'border-amber-400/30'} flex items-center justify-center`}>
                <span className={`text-4xl font-black ${darkMode ? 'text-amber-500/10' : 'text-amber-400/20'} tracking-wider`}>RinON</span>
            </div>
            <div className={`absolute top-40 -left-16 w-48 h-48 rounded-full ${darkMode ? 'bg-amber-500/5' : 'bg-amber-400/10'}`} />
            <div className={`absolute top-1/3 right-1/4 w-16 h-16 rounded-full ${darkMode ? 'bg-amber-500/10' : 'bg-amber-400/15'}`} />
            <div className={`absolute bottom-40 -left-10 w-64 h-64 rounded-full border-2 ${darkMode ? 'border-amber-500/15' : 'border-amber-400/25'} flex items-center justify-center`}>
                <span className={`text-2xl font-bold ${darkMode ? 'text-amber-500/8' : 'text-amber-400/15'} tracking-widest rotate-12`}>RinON</span>
            </div>
            <div className={`absolute bottom-20 right-10 w-24 h-24 rounded-full border-3 ${darkMode ? 'border-amber-500/20' : 'border-amber-400/30'}`} />
            <div className={`absolute top-60 right-20 w-8 h-8 rounded-full ${darkMode ? 'bg-amber-500/15' : 'bg-amber-400/25'}`} />
            <div className={`absolute bottom-60 left-40 w-6 h-6 rounded-full ${darkMode ? 'bg-amber-500/20' : 'bg-amber-400/30'}`} />
            <div className={`absolute top-1/2 -right-32 w-96 h-96 rounded-full border ${darkMode ? 'border-amber-500/10' : 'border-amber-400/20'}`} />
        </div>

        {/* Page Header */}
        <div className="relative z-10 text-center mb-10">
            <h1 className={`text-5xl md:text-6xl font-black mb-3 ${darkMode ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] bg-clip-text text-transparent' : 'text-[#2D2A26]'}`}>
                {t('Ndonjë e re?', 'Anything new?')}
            </h1>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t('Zgjidh datën dhe zbulo mundësitë', 'Pick a date and discover opportunities')}
            </p>
        </div>

        {/* Calendar View Only */}
        <div className="relative z-10">
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
                currentDate={calendarDate}
                setCurrentDate={setCalendarDate}
                eventInterests={eventInterests}
                userEventInterests={userEventInterests}
                toggleEventInterest={toggleEventInterest}
            />
        </div>
    </div>
);

export default EventsPage;
