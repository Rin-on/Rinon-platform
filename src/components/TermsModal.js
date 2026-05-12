import React, { useState } from 'react';
import { Check } from 'lucide-react';

const TermsModal = ({ showTermsModal, onAccept, onReject, darkMode, t }) => {
    const [activeTab, setActiveTab] = useState('terms'); // 'terms' or 'privacy'
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

    if (!showTermsModal) return null;

    const canAccept = agreedToTerms && agreedToPrivacy;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-[#2D2A26]' : 'bg-white'} rounded-3xl max-w-2xl w-full shadow-2xl border ${darkMode ? 'border-amber-500/20' : 'border-amber-200'} max-h-[90vh] flex flex-col`}>
                {/* Header */}
                <div className={`p-6 border-b ${darkMode ? 'border-amber-500/20' : 'border-amber-200'}`}>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent text-center">
                        {t('Mirë se vini në RinON!', 'Welcome to RinON!')}
                    </h2>
                    <p className={`text-center mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('Ju lutemi lexoni dhe pranoni kushtet për të vazhduar', 'Please read and accept the terms to continue')}
                    </p>
                </div>

                {/* Tabs */}
                <div className={`flex border-b ${darkMode ? 'border-amber-500/20' : 'border-amber-200'}`}>
                    <button
                        onClick={() => setActiveTab('terms')}
                        className={`flex-1 py-3 px-4 font-medium transition-all ${activeTab === 'terms'
                            ? 'text-amber-500 border-b-2 border-amber-500'
                            : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t('Kushtet e Shërbimit', 'Terms of Service')}
                        {agreedToTerms && <Check className="w-4 h-4 inline ml-2 text-green-500" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('privacy')}
                        className={`flex-1 py-3 px-4 font-medium transition-all ${activeTab === 'privacy'
                            ? 'text-amber-500 border-b-2 border-amber-500'
                            : darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {t('Politika e Privatësisë', 'Privacy Policy')}
                        {agreedToPrivacy && <Check className="w-4 h-4 inline ml-2 text-green-500" />}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {activeTab === 'terms' && (
                        <div
                            className={`h-[300px] overflow-y-auto p-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}

                        >
                            <h3 className="text-lg font-semibold text-amber-500 mb-3">{t('Kushtet e Shërbimit', 'Terms of Service')}</h3>

                            <h4 className="font-semibold mt-4 mb-2">{t('1. Pranimi i Kushteve', '1. Acceptance of Terms')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Duke përdorur aplikacionin RinON, ju pranoni të jeni të detyruar nga këto Kushte të Shërbimit.',
                                'By using the RinON application, you agree to be bound by these Terms of Service.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('2. Përshkrimi i Shërbimit', '2. Description of Service')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'RinON është një platformë për fuqizimin e rinisë në Shqipëri, duke ofruar informacion për ngjarje, lajme dhe mundësi.',
                                'RinON is a platform for youth empowerment in Albania, providing information about events, news and opportunities.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('3. Llogaritë e Përdoruesve', '3. User Accounts')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Ju pranoni të jepni informacion të saktë, të mbroni fjalëkalimin tuaj, dhe të jeni përgjegjës për aktivitetet nën llogarinë tuaj.',
                                'You agree to provide accurate information, protect your password, and be responsible for activities under your account.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('4. Sjellja e Pranueshme', '4. Acceptable Behavior')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Ju pranoni të MOS postoni përmbajtje ofenduese, të mos ngacmoni përdorues të tjerë, dhe të mos shpërndani informacion të rremë.',
                                'You agree NOT to post offensive content, harass other users, or spread false information.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('5. Ndërprerja', '5. Termination')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Ne mund të pezullojmë ose fshijmë llogarinë tuaj nëse shkelni këto kushte.',
                                'We may suspend or delete your account if you violate these terms.'
                            )}</p>

                            <p className="mt-4 text-xs text-gray-500">
                                {t('Lexoni versionin e plotë në', 'Read the full version at')}:
                                <a href="https://rinon.al/terms-of-service.html" target="_blank" rel="noopener noreferrer" className="text-amber-500 ml-1 hover:underline">
                                    rinon.al/terms-of-service
                                </a>
                            </p>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div
                            className={`h-[300px] overflow-y-auto p-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}

                        >
                            <h3 className="text-lg font-semibold text-amber-500 mb-3">{t('Politika e Privatësisë', 'Privacy Policy')}</h3>

                            <h4 className="font-semibold mt-4 mb-2">{t('1. Të Dhënat që Mbledhim', '1. Data We Collect')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Ne mbledhim: adresën e email-it, emrin, dhe përmbajtjen që krijoni.',
                                'We collect: email address, name, and content you create.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('2. Si i Përdorim të Dhënat', '2. How We Use Data')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Të dhënat përdoren për: menaxhimin e llogarisë dhe përmirësimin e shërbimeve.',
                                'Data is used for: account management and improving services.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('3. Ruajtja e të Dhënave', '3. Data Storage')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Të dhënat ruhen në serverat e sigurt të Supabase në Bashkimin Evropian.',
                                'Data is stored on secure Supabase servers in the European Union.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('4. Ndarja e të Dhënave', '4. Data Sharing')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Ne NUK shesim të dhënat tuaja. Ndajmë vetëm me ofruesit e shërbimeve (Supabase).',
                                'We DO NOT sell your data. We only share with service providers (Supabase).'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('5. Të Drejtat Tuaja', '5. Your Rights')}</h4>
                            <p className="mb-3 text-sm">{t(
                                'Ju keni të drejtën të aksesoni, korrigjoni, dhe fshini të dhënat tuaja në çdo kohë.',
                                'You have the right to access, correct, and delete your data at any time.'
                            )}</p>

                            <h4 className="font-semibold mt-4 mb-2">{t('6. Kontakti', '6. Contact')}</h4>
                            <p className="mb-3 text-sm">
                                Email: <a href="mailto:rinonalbania@gmail.com" className="text-amber-500 hover:underline">rinonalbania@gmail.com</a>
                            </p>

                            <p className="mt-4 text-xs text-gray-500">
                                {t('Lexoni versionin e plotë në', 'Read the full version at')}:
                                <a href="https://rinon.al/privacy-policy.html" target="_blank" rel="noopener noreferrer" className="text-amber-500 ml-1 hover:underline">
                                    rinon.al/privacy-policy
                                </a>
                            </p>
                        </div>
                    )}
                </div>

                {/* Checkboxes */}
                <div className={`p-4 border-t ${darkMode ? 'border-amber-500/20' : 'border-amber-200'} space-y-3`}>
                    <label className={`flex items-start gap-3 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                            type="checkbox"
                            checked={agreedToTerms}
                            onChange={(e) => setAgreedToTerms(e.target.checked)}
                            className="w-5 h-5 mt-0.5 rounded border-amber-500/30 bg-transparent text-amber-500 focus:ring-amber-500/20"
                        />
                        <span className="text-sm">
                            {t('Kam lexuar dhe pranoj', 'I have read and accept the')} <span className="text-amber-500 font-medium">{t('Kushtet e Shërbimit', 'Terms of Service')}</span>
                        </span>
                    </label>
                    <label className={`flex items-start gap-3 cursor-pointer ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <input
                            type="checkbox"
                            checked={agreedToPrivacy}
                            onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                            className="w-5 h-5 mt-0.5 rounded border-amber-500/30 bg-transparent text-amber-500 focus:ring-amber-500/20"
                        />
                        <span className="text-sm">
                            {t('Kam lexuar dhe pranoj', 'I have read and accept the')} <span className="text-amber-500 font-medium">{t('Politikën e Privatësisë', 'Privacy Policy')}</span>
                        </span>
                    </label>
                </div>

                {/* Buttons */}
                <div className={`p-6 border-t ${darkMode ? 'border-amber-500/20' : 'border-amber-200'} flex gap-3`}>
                    <button
                        onClick={onReject}
                        className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${darkMode
                            ? 'bg-[#3D3A36] text-gray-300 hover:bg-[#4D4A46]'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        {t('Refuzo', 'Decline')}
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={!canAccept}
                        className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${canAccept
                            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white hover:from-amber-500 hover:to-[#FF5252] shadow-lg shadow-amber-500/30'
                            : darkMode
                                ? 'bg-[#3D3A36] text-gray-500 cursor-not-allowed'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {t('Pranoj dhe Vazhdo', 'Accept & Continue')}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Auth Modal Component

export default TermsModal;
