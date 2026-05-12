import React from 'react';
import { X, Edit } from 'lucide-react';

const ARTICLE_CATEGORIES = [
    { al: 'Aktualitet', en: 'Current Affairs' },
    { al: 'Arsim & Karrierë', en: 'Education & Career' },
    { al: 'Kulturë', en: 'Culture' },
    { al: 'Opinione', en: 'Opinions' },
    { al: 'Shoqëri', en: 'Society' },
    { al: 'Rreth Europës', en: 'About Europe' },
];

export const AddArticleForm = ({
    showAddForm,
    setShowAddForm,
    editMode,
    setEditMode,
    editingItem,
    setEditingItem,
    editingDraftId,
    setEditingDraftId,
    drafts,
    setShowDraftsModal,
    formData,
    setFormData,
    language,
    t,
    saveDraft,
    handleSubmitArticle,
}) => {
    if (!showAddForm) return null;
    return (
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
                        <button
                            onClick={() => { setShowAddForm(false); setEditMode(false); setEditingItem(null); setEditingDraftId(null); }}
                            className="p-2 hover:bg-amber-500/20 rounded-lg transition-all"
                        >
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
                        {ARTICLE_CATEGORIES.map(cat => (
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
                        placeholder={t('Autori (Nga)', 'Author (By)')}
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        maxLength="100"
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
                    <label className="flex items-center gap-3 text-white p-3 rounded-xl border-2 border-teal-500/50 bg-teal-500/10">
                        <input
                            type="checkbox"
                            checked={formData.isHeadArticle}
                            onChange={(e) => setFormData({ ...formData, isHeadArticle: e.target.checked })}
                            className="w-5 h-5 rounded border-teal-500 bg-[#3D3A36] text-teal-500 focus:ring-teal-500/20"
                        />
                        <div>
                            <span className="font-semibold text-teal-400">🗞️ {t('Artikulli Kryesor i Javës', 'Head Article of the Week')}</span>
                            <p className="text-xs text-white/60 mt-0.5">{t("Will appear as the main article in N'gazeta", "Will appear as the main article in N'gazeta")}</p>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 text-white p-3 rounded-xl border-2 border-[#EAB308]/50 bg-[#EAB308]/10">
                        <input
                            type="checkbox"
                            checked={formData.showOnHomepage}
                            onChange={(e) => setFormData({ ...formData, showOnHomepage: e.target.checked })}
                            className="w-5 h-5 rounded border-[#EAB308] bg-[#3D3A36] text-[#EAB308] focus:ring-[#EAB308]/20"
                        />
                        <div>
                            <span className="font-semibold text-[#EAB308]">📍 {t('Shfaq në Faqen Kryesore', 'Show on Homepage')}</span>
                            <p className="text-xs text-white/60 mt-0.5">{t('Do të shfaqet në seksionin "Të zgjedhura për ty"', 'Will appear in "Selected for you" section')}</p>
                        </div>
                    </label>
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
                        <button
                            onClick={() => { setShowAddForm(false); setEditMode(false); setEditingItem(null); setEditingDraftId(null); }}
                            className="px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all"
                        >
                            {t('Anulo', 'Cancel')}
                        </button>
                        <button
                            onClick={saveDraft}
                            className="flex-1 px-4 py-3 border border-amber-500/30 text-amber-400 rounded-xl hover:bg-amber-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            <Edit className="w-4 h-4" />
                            {editingDraftId ? t('Përditëso Draft', 'Update Draft') : t('Ruaj Draft', 'Save Draft')}
                        </button>
                        <button
                            onClick={() => handleSubmitArticle()}
                            className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50"
                        >
                            {editMode ? t('Përditëso', 'Update') : (editingDraftId ? t('Publiko Draft', 'Publish Draft') : t('Publiko', 'Publish'))}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AddEventForm = ({
    showAddEventForm,
    setShowAddEventForm,
    editMode,
    setEditMode,
    setEditingItem,
    eventFormData,
    setEventFormData,
    t,
    handleSubmitEvent,
}) => {
    if (!showAddEventForm) return null;
    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#2D2A26] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-amber-500/20 shadow-2xl p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        {editMode ? t('Ndrysho Event', 'Edit Event') : t('Shto Event', 'Add Event')}
                    </h2>
                    <button
                        onClick={() => { setShowAddEventForm(false); setEditMode(false); setEditingItem(null); }}
                        className="p-2 hover:bg-amber-500/20 rounded-lg transition-all"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
                <div className="space-y-4">
                    <input type="text" placeholder={t('Titulli (Shqip) *', 'Title (Albanian) *')} value={eventFormData.titleAl} onChange={(e) => setEventFormData({ ...eventFormData, titleAl: e.target.value })} maxLength="200" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="text" placeholder={t('Titulli (Anglisht)', 'Title (English)')} value={eventFormData.titleEn} onChange={(e) => setEventFormData({ ...eventFormData, titleEn: e.target.value })} maxLength="200" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="date" value={eventFormData.date} onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="time" value={eventFormData.time} onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })} placeholder={t('Ora e fillimit', 'Start time')} className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                        <input type="time" value={eventFormData.endTime} onChange={(e) => setEventFormData({ ...eventFormData, endTime: e.target.value })} placeholder={t('Ora e mbarimit', 'End time')} className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    </div>
                    <input type="text" placeholder={t('Data (Shqip) *', 'Date (Albanian) *')} value={eventFormData.dateAl} onChange={(e) => setEventFormData({ ...eventFormData, dateAl: e.target.value })} maxLength="100" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="text" placeholder={t('Data (Anglisht)', 'Date (English)')} value={eventFormData.dateEn} onChange={(e) => setEventFormData({ ...eventFormData, dateEn: e.target.value })} maxLength="100" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <select value={eventFormData.type} onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all">
                        <option value="">{t('Tipi i eventit', 'Event type')}</option>
                        <option value="event">{t('Event i zakonshëm', 'Regular event')}</option>
                        <option value="partnership">{t('Bashkëpunim', 'Partnership')}</option>
                    </select>
                    <select value={eventFormData.category} onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all">
                        <option value="general">{t('Të përgjithshme', 'General')}</option>
                        <option value="tech">{t('Teknologji', 'Tech')}</option>
                        <option value="culture">{t('Kulturë', 'Culture')}</option>
                        <option value="career">{t('Karrierë', 'Career')}</option>
                        <option value="sports">{t('Sport', 'Sports')}</option>
                        <option value="environment">{t('Mjedis', 'Environment')}</option>
                        <option value="education">{t('Edukim', 'Education')}</option>
                        <option value="social">{t('Social', 'Social')}</option>
                    </select>
                    <input type="text" placeholder={t('Lokacioni', 'Location')} value={eventFormData.location} onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })} maxLength="200" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="text" placeholder={t('Adresa', 'Address')} value={eventFormData.address} onChange={(e) => setEventFormData({ ...eventFormData, address: e.target.value })} maxLength="255" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <textarea placeholder={t('Përshkrimi (Shqip)', 'Description (Albanian)')} value={eventFormData.descAl} onChange={(e) => setEventFormData({ ...eventFormData, descAl: e.target.value })} rows="4" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <textarea placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')} value={eventFormData.descEn} onChange={(e) => setEventFormData({ ...eventFormData, descEn: e.target.value })} rows="4" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <div className="grid grid-cols-2 gap-3">
                        <input type="number" placeholder={t('Vende të mbetura', 'Spots left')} value={eventFormData.spotsLeft} onChange={(e) => setEventFormData({ ...eventFormData, spotsLeft: parseInt(e.target.value) || 0 })} className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                        <input type="number" placeholder={t('Vende totale', 'Total spots')} value={eventFormData.totalSpots} onChange={(e) => setEventFormData({ ...eventFormData, totalSpots: parseInt(e.target.value) || 0 })} className="px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    </div>
                    <label className="flex items-center gap-3 text-white">
                        <input type="checkbox" checked={eventFormData.isFree} onChange={(e) => setEventFormData({ ...eventFormData, isFree: e.target.checked })} className="w-5 h-5 rounded" />
                        <span>{t('Event Falas', 'Free Event')}</span>
                    </label>
                    {!eventFormData.isFree && (
                        <input type="text" placeholder={t('Çmimi', 'Price')} value={eventFormData.price} onChange={(e) => setEventFormData({ ...eventFormData, price: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    )}
                    <input type="text" placeholder={t('Link Regjistrimi', 'Registration Link')} value={eventFormData.registrationLink} onChange={(e) => setEventFormData({ ...eventFormData, registrationLink: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="text" placeholder={t('URL Imazhi', 'Image URL')} value={eventFormData.image} onChange={(e) => setEventFormData({ ...eventFormData, image: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <label className="flex items-center gap-3 text-white p-3 rounded-xl border-2 border-[#EAB308]/50 bg-[#EAB308]/10">
                        <input type="checkbox" checked={eventFormData.showOnHomepage} onChange={(e) => setEventFormData({ ...eventFormData, showOnHomepage: e.target.checked })} className="w-5 h-5 rounded border-[#EAB308] bg-[#3D3A36] text-[#EAB308] focus:ring-[#EAB308]/20" />
                        <div>
                            <span className="font-semibold text-[#EAB308]">📍 {t('Shfaq në Faqen Kryesore', 'Show on Homepage')}</span>
                            <p className="text-xs text-white/60 mt-0.5">{t('Do të shfaqet në seksionin "Të zgjedhura për ty"', 'Will appear in "Selected for you" section')}</p>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 text-white">
                        <input type="checkbox" checked={eventFormData.isFeatured} onChange={(e) => setEventFormData({ ...eventFormData, isFeatured: e.target.checked })} className="w-5 h-5 rounded" />
                        <span>{t('Event i Veçantë', 'Featured Event')}</span>
                    </label>
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => { setShowAddEventForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">{t('Anulo', 'Cancel')}</button>
                        <button onClick={handleSubmitEvent} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">{editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AddPartnerForm = ({
    showAddPartnerForm,
    setShowAddPartnerForm,
    editMode,
    setEditMode,
    setEditingItem,
    partnerFormData,
    setPartnerFormData,
    t,
    handleSubmitPartner,
}) => {
    if (!showAddPartnerForm) return null;
    return (
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
                    <input type="text" placeholder={t('Emri (Shqip) *', 'Name (Albanian) *')} value={partnerFormData.nameAl} onChange={(e) => setPartnerFormData({ ...partnerFormData, nameAl: e.target.value })} maxLength="100" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="text" placeholder={t('Emri (Anglisht) *', 'Name (English) *')} value={partnerFormData.nameEn} onChange={(e) => setPartnerFormData({ ...partnerFormData, nameEn: e.target.value })} maxLength="100" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <textarea placeholder={t('Përshkrimi (Shqip)', 'Description (Albanian)')} value={partnerFormData.descriptionAl} onChange={(e) => setPartnerFormData({ ...partnerFormData, descriptionAl: e.target.value })} rows="3" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <textarea placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')} value={partnerFormData.descriptionEn} onChange={(e) => setPartnerFormData({ ...partnerFormData, descriptionEn: e.target.value })} rows="3" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <textarea placeholder={t('Vizioni (Shqip)', 'Vision (Albanian)')} value={partnerFormData.visionAl} onChange={(e) => setPartnerFormData({ ...partnerFormData, visionAl: e.target.value })} rows="3" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <textarea placeholder={t('Vizioni (Anglisht)', 'Vision (English)')} value={partnerFormData.visionEn} onChange={(e) => setPartnerFormData({ ...partnerFormData, visionEn: e.target.value })} rows="3" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <textarea placeholder={t('Qëllimet (Shqip)', 'Goals (Albanian)')} value={partnerFormData.goalsAl} onChange={(e) => setPartnerFormData({ ...partnerFormData, goalsAl: e.target.value })} rows="3" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <textarea placeholder={t('Qëllimet (Anglisht)', 'Goals (English)')} value={partnerFormData.goalsEn} onChange={(e) => setPartnerFormData({ ...partnerFormData, goalsEn: e.target.value })} rows="3" maxLength="1000" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none" />
                    <input type="text" placeholder={t('Website', 'Website')} value={partnerFormData.website} onChange={(e) => setPartnerFormData({ ...partnerFormData, website: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="text" placeholder={t('URL Imazhi', 'Image URL')} value={partnerFormData.image} onChange={(e) => setPartnerFormData({ ...partnerFormData, image: e.target.value })} className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => { setShowAddPartnerForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">{t('Anulo', 'Cancel')}</button>
                        <button onClick={handleSubmitPartner} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">{editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AddMemberForm = ({
    showAddMemberForm,
    setShowAddMemberForm,
    editMode,
    setEditMode,
    setEditingItem,
    memberFormData,
    setMemberFormData,
    t,
    handleSubmitMember,
}) => {
    if (!showAddMemberForm) return null;
    return (
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
                    <input type="text" placeholder={t('Emri *', 'Name *')} value={memberFormData.name} onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })} maxLength="100" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <input type="text" placeholder={t('Roli *', 'Role *')} value={memberFormData.role} onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })} maxLength="100" className="w-full px-4 py-3 bg-[#3D3A36] border border-amber-500/30 rounded-xl text-white placeholder-gray-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all" />
                    <div className="flex gap-3 pt-4">
                        <button onClick={() => { setShowAddMemberForm(false); setEditMode(false); setEditingItem(null); }} className="flex-1 px-4 py-3 border border-[#3D3A36] rounded-xl text-gray-400 hover:border-[#4D4A46] transition-all">{t('Anulo', 'Cancel')}</button>
                        <button onClick={handleSubmitMember} className="flex-1 px-4 py-3 bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white rounded-xl hover:from-amber-500 hover:to-[#FF5252] transition-all shadow-lg shadow-amber-500/50">{editMode ? t('Përditëso', 'Update') : t('Shto', 'Add')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
