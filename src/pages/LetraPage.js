import React from 'react';
import { Edit, Trash2, ChevronDown } from 'lucide-react';
import supabase from '../utils/supabase';

const LetraPage = ({
    darkMode, t, showAdmin, userProfile, user, letters,
    showPendingLetters, setShowPendingLetters, pendingLetters, loadPendingLetters, loadLetters,
    editingLetter, setEditingLetter, letterFormRef,
    letterSubmitStatus, setLetterSubmitStatus, letterFormData, setLetterFormData,
    setShowAuthModal
}) => (
    /* ==========================================
       LETRA NGA RINASI — Emigration Letters Archive
       ========================================== */
    <div className={`min-h-screen ${darkMode ? 'bg-gray-950' : 'bg-stone-50'}`}>

        {/* ── Admin Moderation Panel ─────────────────── */}
        {showAdmin && userProfile?.is_admin && (
            <div className={`border-b ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-stone-200 bg-stone-100'} px-4 py-4`}>
                <div className="max-w-2xl mx-auto">
                    <button
                        onClick={() => {
                            const next = !showPendingLetters;
                            setShowPendingLetters(next);
                            if (next) loadPendingLetters();
                        }}
                        className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                    >
                        <ChevronDown className={`w-4 h-4 transition-transform ${showPendingLetters ? 'rotate-180' : ''}`} />
                        {t(`Letra për aprovim (${pendingLetters.length})`, `Letters pending approval (${pendingLetters.length})`)}
                    </button>
                    {showPendingLetters && (
                        <div className="mt-4 space-y-3">
                            {pendingLetters.length === 0 ? (
                                <p className="text-sm text-gray-400 italic">{t('Nuk ka letra për aprovim.', 'No letters pending approval.')}</p>
                            ) : pendingLetters.map(letter => (
                                <div key={letter.id} className={`rounded-md p-4 border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-stone-200'}`}>
                                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        <span className="font-semibold">{letter.initials}</span> · {letter.profession} · {letter.destination}
                                    </p>
                                    <p className={`text-xs mb-3 line-clamp-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{letter.content?.substring(0, 150)}...</p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={async () => {
                                                await supabase.from('letters').update({
                                                    is_approved: true,
                                                    approved_at: new Date().toISOString(),
                                                    approved_by: user?.id
                                                }).eq('id', letter.id);
                                                loadPendingLetters();
                                                loadLetters();
                                            }}
                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded transition-colors"
                                        >
                                            {t('Aprovo', 'Approve')}
                                        </button>
                                        <button
                                            onClick={async () => {
                                                await supabase.from('letters').delete().eq('id', letter.id);
                                                loadPendingLetters();
                                            }}
                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded transition-colors"
                                        >
                                            {t('Fshi', 'Delete')}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ── Section 1: Page Header ─────────────────── */}
        <div className="pt-16 pb-8 px-6 text-center max-w-2xl mx-auto">
            <div className="w-16 h-px bg-amber-400 mx-auto mb-6" />
            <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                {t('Letra nga Rinasi', 'Letters from Those Who Left')}
            </h1>
            <p className={`mt-4 text-base md:text-lg leading-relaxed max-w-lg mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {t(
                    'Çdo ditë, të rinj shqiptarë largohen. Disa kthehen, shumica jo. Këtu janë fjalët e tyre — ato që nuk i thanë kurrë para se të largoheshin.',
                    'Every day, young Albanians leave. Some return, most do not. Here are their words — the ones they never said before they left.'
                )}
            </p>
            <button
                onClick={() => letterFormRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className={`mt-6 text-sm font-medium transition-colors ${darkMode ? 'text-amber-400 hover:text-amber-300' : 'text-amber-600 hover:text-amber-700'}`}
            >
                {t('Shkruaj letrën tënde ↓', 'Write your letter ↓')}
            </button>
            <div className="w-16 h-px bg-amber-400 mx-auto mt-8" />
        </div>

        {/* ── Section 2: Letters Feed ────────────────── */}
        <div className="max-w-xl mx-auto px-4 py-8 flex flex-col gap-10">
            {letters.length === 0 ? (
                <p className="text-gray-400 italic py-20 text-center" style={{ fontFamily: "'Caveat', cursive" }}>
                    {t('Letrat e para janë duke ardhur...', 'The first letters are on their way...')}
                </p>
            ) : letters.map(letter => (
                <div
                    key={letter.id}
                    className={`rounded-sm border border-l-2 p-6 md:p-8 ${darkMode
                        ? 'bg-gray-900 border-gray-800 border-l-amber-300/30'
                        : 'bg-white border-stone-200 border-l-amber-300/50'
                    }`}
                >
                    {/* Admin controls */}
                    {showAdmin && userProfile?.is_admin && editingLetter?.id !== letter.id && (
                        <div className="flex gap-2 justify-end mb-3">
                            <button
                                onClick={() => setEditingLetter({ ...letter })}
                                className="p-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                            >
                                <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={async () => {
                                    await supabase.from('letters').delete().eq('id', letter.id);
                                    loadLetters();
                                }}
                                className="p-1.5 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    )}

                    {/* Inline edit form */}
                    {editingLetter?.id === letter.id ? (
                        <div className="space-y-3">
                            <textarea
                                value={editingLetter.content}
                                onChange={(e) => setEditingLetter({ ...editingLetter, content: e.target.value })}
                                rows={5}
                                maxLength={1000}
                                className={`w-full px-3 py-2 rounded border text-base resize-none focus:outline-none focus:border-amber-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-stone-50 border-stone-300 text-gray-900'}`}
                                style={{ fontFamily: "'Caveat', cursive" }}
                            />
                            <div className="grid grid-cols-3 gap-2">
                                {['initials', 'destination', 'profession'].map(field => (
                                    <input
                                        key={field}
                                        type="text"
                                        value={editingLetter[field]}
                                        onChange={(e) => setEditingLetter({ ...editingLetter, [field]: e.target.value })}
                                        placeholder={field}
                                        className={`px-3 py-2 rounded border text-sm focus:outline-none focus:border-amber-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-stone-50 border-stone-300 text-gray-900'}`}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={async () => {
                                        await supabase.from('letters').update({
                                            initials: editingLetter.initials,
                                            destination: editingLetter.destination,
                                            profession: editingLetter.profession,
                                            content: editingLetter.content
                                        }).eq('id', letter.id);
                                        setEditingLetter(null);
                                        loadLetters();
                                    }}
                                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                                >
                                    {t('Ruaj', 'Save')}
                                </button>
                                <button
                                    onClick={() => setEditingLetter(null)}
                                    className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-stone-200 text-gray-700 hover:bg-stone-300'}`}
                                >
                                    {t('Anulo', 'Cancel')}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p
                                className={`text-lg md:text-xl leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                                style={{ fontFamily: "'Caveat', cursive" }}
                            >
                                {letter.content}
                            </p>
                            <div className={`h-px mt-6 ${darkMode ? 'bg-gray-800' : 'bg-stone-200'}`} />
                            <div className="flex items-center justify-between mt-4">
                                <span className={`text-sm font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                    {letter.initials}
                                </span>
                                <span className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {letter.profession} · {letter.destination}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </div>

        {/* ── Section 3: Submission Form ─────────────── */}
        <div
            ref={letterFormRef}
            className={`mt-12 py-12 px-6 ${darkMode ? 'bg-gray-900' : 'bg-stone-100'}`}
        >
            <div className="max-w-lg mx-auto">
                <h2 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
                    {t('Shkruaj letrën tënde', 'Write your letter')}
                </h2>
                <p className={`mt-2 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('Trego historinë tënde. Mund të mbetesh anonim/e.', 'Share your story. You can stay anonymous.')}
                </p>

                {!user ? (
                    <div className="mt-8 text-center">
                        <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {t('Hyr në llogarinë tënde për të shkruar.', 'Log in to your account to write.')}
                        </p>
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2.5 rounded-md text-sm font-semibold transition-colors"
                        >
                            {t('Hyr', 'Log In')}
                        </button>
                    </div>
                ) : letterSubmitStatus === 'success' ? (
                    <div className="mt-8 text-center py-8">
                        <p className={`text-base font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {t('Faleminderit! Letra jote do të shqyrtohet.', 'Thank you! Your letter will be reviewed.')}
                        </p>
                    </div>
                ) : (
                    <form
                        className="mt-8 space-y-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            if (!letterFormData.initials.trim() || !letterFormData.destination.trim() || !letterFormData.content.trim()) return;
                            setLetterSubmitStatus('submitting');
                            try {
                                const { error } = await supabase.from('letters').insert([{
                                    initials: letterFormData.initials.trim(),
                                    destination: letterFormData.destination.trim(),
                                    profession: letterFormData.profession.trim(),
                                    content: letterFormData.content.trim(),
                                    is_approved: false,
                                    submitted_by: user.id,
                                    submitted_at: new Date().toISOString()
                                }]);
                                if (error) throw error;
                                setLetterSubmitStatus('success');
                                setLetterFormData({ initials: '', destination: '', profession: '', content: '' });
                            } catch {
                                setLetterSubmitStatus('error');
                                setTimeout(() => setLetterSubmitStatus(null), 3000);
                            }
                        }}
                    >
                        <div>
                            <label className={`text-sm font-medium mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('Inicialet e tua', 'Your initials')}
                            </label>
                            <input
                                type="text"
                                placeholder={t('P.sh. A.B.', 'e.g. A.B.')}
                                value={letterFormData.initials}
                                onChange={(e) => setLetterFormData({ ...letterFormData, initials: e.target.value })}
                                maxLength={5}
                                required
                                className={`w-full px-4 py-3 rounded-md border text-base focus:outline-none focus:border-amber-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('Ku jeton tani?', 'Where do you live now?')}
                            </label>
                            <input
                                type="text"
                                placeholder={t('P.sh. Gjermani', 'e.g. Germany')}
                                value={letterFormData.destination}
                                onChange={(e) => setLetterFormData({ ...letterFormData, destination: e.target.value })}
                                required
                                className={`w-full px-4 py-3 rounded-md border text-base focus:outline-none focus:border-amber-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('Profesioni', 'Profession')}
                            </label>
                            <input
                                type="text"
                                placeholder={t('P.sh. Studente, Inxhinier', 'e.g. Student, Engineer')}
                                value={letterFormData.profession}
                                onChange={(e) => setLetterFormData({ ...letterFormData, profession: e.target.value })}
                                className={`w-full px-4 py-3 rounded-md border text-base focus:outline-none focus:border-amber-400 transition-colors ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-400'}`}
                            />
                        </div>
                        <div>
                            <label className={`text-sm font-medium mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {t('Letra jote', 'Your letter')}
                            </label>
                            <textarea
                                placeholder={t('Shkruaj letrën tënde këtu...', 'Write your letter here...')}
                                value={letterFormData.content}
                                onChange={(e) => setLetterFormData({ ...letterFormData, content: e.target.value })}
                                rows={6}
                                maxLength={1000}
                                required
                                className={`w-full px-4 py-3 rounded-md border text-base focus:outline-none focus:border-amber-400 transition-colors resize-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-400'}`}
                            />
                            <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                {letterFormData.content.length}/1000
                            </p>
                        </div>
                        {letterSubmitStatus === 'error' && (
                            <p className="text-sm text-red-500">{t('Ndodhi një gabim. Provo sërish.', 'Something went wrong. Please try again.')}</p>
                        )}
                        <button
                            type="submit"
                            disabled={letterSubmitStatus === 'submitting'}
                            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold py-3 rounded-md transition-colors mt-6"
                        >
                            {letterSubmitStatus === 'submitting'
                                ? t('Duke dërguar...', 'Sending...')
                                : t('Dërgo Letrën', 'Send Letter')}
                        </button>
                    </form>
                )}
            </div>
        </div>
    </div>
);

export default LetraPage;
