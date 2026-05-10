import React from 'react';
import { Check, Instagram, Award, Globe, TrendingUp, FileText, Mail } from 'lucide-react';
import { PenTool } from 'lucide-react';
import supabase from '../utils/supabase';

const BashkohuPage = ({ darkMode, signupSuccess, signupForm, setSignupForm, signupSubmitting, setSignupSubmitting, setSignupSuccess, changePage }) => (
    /* ==========================================
       BASHKOHU — RinON Member Application Form
       Standalone page, no nav, full-screen
       ========================================== */
    <div className={`min-h-screen animate-fadeIn ${darkMode ? 'bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950' : 'bg-gradient-to-b from-amber-50 via-white to-stone-50'}`}>
        {signupSuccess ? (
            /* ── Success Screen ───────────────────────── */
            <div className="flex flex-col items-center justify-center min-h-screen py-16 px-6 text-center animate-fadeIn">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                    <Check className="w-8 h-8 text-green-500" />
                </div>
                <h2 className={`mt-6 text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    Mirë se erdhe, {signupForm.first_name}!
                </h2>
                <p className={`mt-2 text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Aplikimi yt u dërgua me sukses. Do të kontaktohesh së shpejti.
                </p>
                <a
                    href="https://instagram.com/rinon_albania"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center gap-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white px-8 py-3.5 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    <Instagram className="w-5 h-5" />
                    Na ndiq në Instagram
                </a>
                <p className="mt-3 text-xs text-gray-400">për tu njoftuar i/e para/parë për mundësitë</p>
                <button
                    onClick={() => changePage('home')}
                    className="mt-6 text-amber-600 text-sm font-medium hover:text-amber-700 transition-colors"
                >
                    Eksploro rinon.al →
                </button>
            </div>
        ) : (
            /* ── Application Form ────────────────────── */
            <>
                {/* ── Top Section: What RinON Offers ── */}
                <div className="pt-12 pb-6 px-6 flex flex-col items-center">
                    {/* Logo */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#EAB308] to-[#0D9488] rounded-full opacity-20 blur-md"></div>
                        <div className="relative w-14 h-14 rounded-full bg-white border-2 border-[#EAB308] flex items-center justify-center shadow-md overflow-hidden">
                            <img
                                src="https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/rinon%20switch%20button.jpeg"
                                alt="RinON"
                                className="h-10 w-10 object-contain rounded-full"
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </div>
                    </div>

                    <h1
                        className={`mt-4 text-3xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Bëhu pjesë e RinON
                    </h1>
                    <p className={`mt-3 text-base text-center max-w-sm mx-auto leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Bashkohu me të rinjtë që po ndërtojnë të ardhmen e Shqipërisë.
                    </p>

                    <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-6 mb-8"></div>

                    {/* Benefits list */}
                    <p className={`text-lg font-bold text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Çfarë fiton si anëtar i RinON?
                    </p>

                    <div className="max-w-sm mx-auto w-full">
                        {[
                            { Icon: Award,      title: 'Certifikata',           desc: 'Merr certifikatë për çdo aktivitet, debat dhe trajnim.' },
                            { Icon: PenTool,    title: 'Publiko në N\'gazeta',  desc: 'Shkruaj artikuj dhe bëhu autor i publikuar në platformën tonë.' },
                            { Icon: Globe,      title: 'Rrjeti i partnerëve',   desc: 'Akses te FES, RYCO, KAS, OSCE dhe organizata ndërkombëtare.' },
                            { Icon: TrendingUp, title: 'Zhvillo aftësi',        desc: 'Debat, organizim eventesh, shkrim, dhe leadership — duke bërë, jo duke dëgjuar.' },
                            { Icon: FileText,   title: 'Referencë profesionale',desc: 'Merr letra rekomandimi për aplikime, punë dhe bursa.' },
                            { Icon: Mail,       title: 'Mundësi çdo javë',      desc: 'Email javor me grante, evente, thirrje dhe lajme të kuruara për ty.' },
                        ].map(({ Icon, title, desc }) => (
                            <div key={title} className="flex gap-3 items-start mb-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-amber-900/30' : 'bg-amber-100'}`}>
                                    <Icon className="w-4 h-4 text-amber-600" />
                                </div>
                                <div>
                                    <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{title}</p>
                                    <p className={`text-xs leading-relaxed mt-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-12 h-0.5 bg-amber-400 mx-auto mt-8 mb-2"></div>
                </div>

                {/* ── Form Section ── */}
                <div className="max-w-md mx-auto px-6 pt-4 pb-16">
                    <p className={`text-lg font-semibold text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Apliko për tu bashkuar
                    </p>
                    <p className="text-xs text-gray-400 mt-1 text-center mb-6">Merr vetëm 1 minutë</p>

                    <div className="space-y-5">
                        {/* Emri */}
                        <div>
                            <label className={`text-sm font-semibold mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Emri *</label>
                            <input
                                type="text"
                                placeholder="Emri yt"
                                value={signupForm.first_name}
                                onChange={e => setSignupForm(f => ({ ...f, first_name: e.target.value }))}
                                className={`w-full px-4 py-3.5 text-base rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                        </div>

                        {/* Mbiemri */}
                        <div>
                            <label className={`text-sm font-semibold mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mbiemri *</label>
                            <input
                                type="text"
                                placeholder="Mbiemri yt"
                                value={signupForm.last_name}
                                onChange={e => setSignupForm(f => ({ ...f, last_name: e.target.value }))}
                                className={`w-full px-4 py-3.5 text-base rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                        </div>

                        {/* Mosha */}
                        <div>
                            <label className={`text-sm font-semibold mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mosha *</label>
                            <input
                                type="number"
                                placeholder="P.sh. 19"
                                min={14}
                                max={35}
                                value={signupForm.age}
                                onChange={e => setSignupForm(f => ({ ...f, age: e.target.value }))}
                                className={`w-full px-4 py-3.5 text-base rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className={`text-sm font-semibold mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Email *</label>
                            <input
                                type="email"
                                placeholder="emri@gmail.com"
                                value={signupForm.email}
                                onChange={e => setSignupForm(f => ({ ...f, email: e.target.value }))}
                                className={`w-full px-4 py-3.5 text-base rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                        </div>

                        {/* Telefon */}
                        <div>
                            <label className={`text-sm font-semibold mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Numri i telefonit *</label>
                            <input
                                type="tel"
                                placeholder="+355 6X XXX XXXX"
                                value={signupForm.phone}
                                onChange={e => setSignupForm(f => ({ ...f, phone: e.target.value }))}
                                className={`w-full px-4 py-3.5 text-base rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                        </div>

                        {/* Pse dëshiron të bashkohesh */}
                        <div>
                            <label className={`text-sm font-semibold mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Pse dëshiron të bashkohesh? *</label>
                            <input
                                type="text"
                                placeholder="Një fjali e shkurtër..."
                                maxLength={150}
                                value={signupForm.reason}
                                onChange={e => setSignupForm(f => ({ ...f, reason: e.target.value }))}
                                className={`w-full px-4 py-3.5 text-base rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                            <p className={`text-xs mt-1 text-right ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{signupForm.reason.length}/150</p>
                        </div>

                        {/* Aftësi */}
                        <div>
                            <label className={`text-sm font-semibold mb-1.5 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Çfarë aftësish ke?</label>
                            <input
                                type="text"
                                placeholder="P.sh. shkrim, dizajn, organizim, fotografi..."
                                maxLength={200}
                                value={signupForm.skills}
                                onChange={e => setSignupForm(f => ({ ...f, skills: e.target.value }))}
                                className={`w-full px-4 py-3.5 text-base rounded-xl border placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400 transition-all duration-200 ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                            />
                        </div>

                        {/* Si na gjete — single-select chips */}
                        <div>
                            <label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Si na gjete?</label>
                            <div className="flex flex-wrap gap-2">
                                {['Instagram', 'Nga një mik/e', 'Nga një event', 'Kërkim online', 'Tjetër'].map(source => {
                                    const isSelected = signupForm.referral_source === source;
                                    return (
                                        <button
                                            key={source}
                                            type="button"
                                            onClick={() => setSignupForm(f => ({ ...f, referral_source: isSelected ? '' : source }))}
                                            className={`px-4 py-2 rounded-full text-sm font-medium border cursor-pointer transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-sm'
                                                    : darkMode
                                                        ? 'bg-gray-800 border-gray-700 text-gray-400 hover:border-amber-500/50'
                                                        : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300'
                                            }`}
                                        >
                                            {source}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Submit button */}
                    <button
                        onClick={async () => {
                            if (!signupForm.first_name.trim() || !signupForm.last_name.trim() || !signupForm.age || !signupForm.email.trim() || !signupForm.phone.trim() || !signupForm.reason.trim()) return;
                            setSignupSubmitting(true);
                            try {
                                const { error } = await supabase.from('community_signups').insert({
                                    first_name: signupForm.first_name.trim(),
                                    last_name: signupForm.last_name.trim(),
                                    age: parseInt(signupForm.age, 10),
                                    email: signupForm.email.trim(),
                                    phone: signupForm.phone.trim(),
                                    reason: signupForm.reason.trim(),
                                    skills: signupForm.skills.trim() || null,
                                    referral_source: signupForm.referral_source || null,
                                    source: 'general',
                                });
                                if (error) throw error;
                                // Fire-and-forget — don't block the success screen if email fails
                                fetch(`${supabase.supabaseUrl}/functions/v1/send-signup-emails`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${supabase.supabaseKey}`,
                                    },
                                    body: JSON.stringify({
                                        first_name: signupForm.first_name.trim(),
                                        last_name: signupForm.last_name.trim(),
                                        age: parseInt(signupForm.age, 10),
                                        email: signupForm.email.trim(),
                                        phone: signupForm.phone.trim(),
                                        reason: signupForm.reason.trim(),
                                        skills: signupForm.skills.trim() || null,
                                        referral_source: signupForm.referral_source || null,
                                    }),
                                }).catch(e => console.error('Email notification failed:', e));
                                setSignupSuccess(true);
                            } catch (err) {
                                console.error('Signup error:', err);
                                alert('Ndodhi një gabim. Provo sërish.');
                            } finally {
                                setSignupSubmitting(false);
                            }
                        }}
                        disabled={signupSubmitting || !signupForm.first_name.trim() || !signupForm.last_name.trim() || !signupForm.age || !signupForm.email.trim() || !signupForm.phone.trim() || !signupForm.reason.trim()}
                        className={`mt-6 w-full py-3.5 rounded-xl font-bold text-base text-white transition-all duration-200 ${
                            signupSubmitting || !signupForm.first_name.trim() || !signupForm.last_name.trim() || !signupForm.age || !signupForm.email.trim() || !signupForm.phone.trim() || !signupForm.reason.trim()
                                ? 'bg-amber-400 opacity-70 cursor-not-allowed'
                                : 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700'
                        }`}
                    >
                        {signupSubmitting ? 'Duke dërguar...' : 'Dërgo aplikimin'}
                    </button>
                </div>
            </>
        )}
    </div>
);

export default BashkohuPage;
