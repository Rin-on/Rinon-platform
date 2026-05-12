import React from 'react';
import { X, Edit, Trash2 } from 'lucide-react';

const DraftsModal = ({ showDraftsModal, setShowDraftsModal, darkMode, t, drafts, editDraft, publishDraft, deleteDraft, setShowAddForm }) => {
    if (!showDraftsModal) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowDraftsModal(false)}>
            <div className={`absolute inset-0 ${darkMode ? 'bg-black/70' : 'bg-black/50'} backdrop-blur-sm`} />
            <div
                className={`relative w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-2xl ${darkMode ? 'bg-[#1a1918]' : 'bg-white'}`}
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-white/10' : 'border-gray-100'}`}>
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

                <div className="overflow-y-auto max-h-[60vh] p-4">
                    {drafts.length > 0 ? (
                        <div className="space-y-3">
                            {drafts.map(draft => (
                                <div
                                    key={draft.id}
                                    className={`p-4 rounded-xl border transition-colors ${darkMode
                                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                                        : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h4 className={`font-medium line-clamp-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {draft.titleAl || t('Pa titull', 'Untitled')}
                                            </h4>
                                            <p className={`text-sm mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                {draft.contentAl?.substring(0, 150) || t('Pa përmbajtje', 'No content')}...
                                            </p>
                                            <div className={`flex items-center gap-3 mt-2 text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                                <span className={`px-2 py-0.5 rounded-full ${darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                                    {draft.category}
                                                </span>
                                                <span>
                                                    {t('Përditësuar', 'Updated')}: {new Date(draft.updatedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        {draft.image && (
                                            <img src={draft.image} alt="" className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-dashed border-gray-200 dark:border-white/10">
                                        <button
                                            onClick={() => editDraft(draft)}
                                            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${darkMode
                                                ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
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
                                            className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
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
    );
};

export default DraftsModal;
