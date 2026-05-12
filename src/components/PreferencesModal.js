import React, { useState } from 'react';
import { X, LogOut, Edit } from 'lucide-react';

const PreferencesModal = ({ showPreferences, setShowPreferences, userProfile, updatePreferences, categories, language, darkMode, t, onDeleteAccount, onLogout, userBadges, user }) => {
    const [editingName, setEditingName] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(userProfile?.display_name || '');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Badge definitions
    const badgeDefinitions = {
        early_adopter: { icon: '🌟', nameAl: 'Pionier', nameEn: 'Early Adopter', descAl: 'Nga të parët në RinON', descEn: 'Among the first on RinON' },
        event_explorer: { icon: '📅', nameAl: 'Eksplorues Eventesh', nameEn: 'Event Explorer', descAl: '5+ evente të ndjekura', descEn: '5+ events attended' },
        volunteer_spirit: { icon: '💚', nameAl: 'Shpirt Vullnetar', nameEn: 'Volunteer Spirit', descAl: '3+ aktivitete vullnetare', descEn: '3+ volunteer activities' },
        super_sharer: { icon: '📤', nameAl: 'Super Shpërndarës', nameEn: 'Super Sharer', descAl: '10+ evente të shpërndara', descEn: '10+ events shared' }
    };

    const handleSaveName = async () => {
        if (newDisplayName.trim() && newDisplayName !== userProfile?.display_name) {
            await updatePreferences(null, newDisplayName.trim());
        }
        setEditingName(false);
    };

    if (!showPreferences) return null;

    const memberSince = userProfile?.joined_at ? new Date(userProfile.joined_at).toLocaleDateString(language === 'al' ? 'sq-AL' : 'en-US', { month: 'long', year: 'numeric' }) : '';

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowPreferences(false)}
        >
            <div className={`w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-[#2D2A26]' : 'bg-white'}`}>
                {/* Header with close button */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('Profili Im', 'My Profile')}
                    </h2>
                    <button
                        onClick={() => setShowPreferences(false)}
                        className={`p-1 rounded ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Profile Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                        {userProfile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1">
                        {editingName ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={newDisplayName}
                                    onChange={(e) => setNewDisplayName(e.target.value)}
                                    className={`flex-1 px-3 py-1 rounded-lg text-sm ${darkMode ? 'bg-[#3D3A36] text-white' : 'bg-gray-100 text-gray-900'}`}
                                    autoFocus
                                />
                                <button onClick={handleSaveName} className="text-amber-500 text-sm font-medium">
                                    {t('Ruaj', 'Save')}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {userProfile?.display_name || t('Pa emër', 'No name')}
                                </h3>
                                <button
                                    onClick={() => setEditingName(true)}
                                    className={`p-1 rounded ${darkMode ? 'text-gray-500 hover:text-amber-400' : 'text-gray-400 hover:text-amber-600'}`}
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                            {user?.email}
                        </p>
                        {memberSince && (
                            <p className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                {t('Anëtar që nga', 'Member since')} {memberSince}
                            </p>
                        )}
                    </div>
                </div>

                {/* Badges Section */}
                <div className="mb-6">
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        🏆 {t('Distinktivat', 'Badges')}
                    </h4>
                    {userBadges && userBadges.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {userBadges.map((badge) => {
                                const def = badgeDefinitions[badge.badge_type];
                                if (!def) return null;
                                return (
                                    <div
                                        key={badge.badge_type}
                                        className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}
                                        title={language === 'al' ? def.descAl : def.descEn}
                                    >
                                        <span>{def.icon}</span>
                                        <span>{language === 'al' ? def.nameAl : def.nameEn}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className={`text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            {t('Ende pa distinktiva. Vazhdo të eksplorosh!', 'No badges yet. Keep exploring!')}
                        </p>
                    )}
                </div>

                {/* Activity Stats */}
                <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-[#3D3A36]' : 'bg-gray-50'}`}>
                    <h4 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        📊 {t('Aktiviteti', 'Activity')}
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {userProfile?.events_attended || 0}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {t('Evente', 'Events')}
                            </div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {userProfile?.polls_voted || 0}
                            </div>
                            <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {t('Sondazhe', 'Polls')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={() => {
                        setShowPreferences(false);
                        onLogout();
                    }}
                    className={`w-full px-4 py-3 mb-4 rounded-xl flex items-center justify-center gap-2 transition-all ${darkMode
                        ? 'border border-gray-700 text-gray-300 hover:bg-gray-800'
                        : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <LogOut className="w-4 h-4" />
                    {t('Dil nga llogaria', 'Log out')}
                </button>

                {/* Danger Zone - Delete Account */}
                <div className={`border-t pt-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="text-red-500 text-sm hover:underline"
                    >
                        {t('Fshi llogarinë', 'Delete account')}
                    </button>
                </div>

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className={`mt-4 p-4 rounded-xl border ${darkMode ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                            {t('Je i sigurt? Kjo veprim nuk mund të zhbëhet.', 'Are you sure? This action cannot be undone.')}
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className={`flex-1 px-3 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}
                            >
                                {t('Anulo', 'Cancel')}
                            </button>
                            <button
                                onClick={() => {
                                    setShowPreferences(false);
                                    onDeleteAccount();
                                }}
                                className="flex-1 px-3 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600"
                            >
                                {t('Fshi', 'Delete')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PreferencesModal;
