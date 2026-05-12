import React, { useState } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { validateInput, validatePassword } from '../utils/helpers';

const AuthModal = ({ showAuthModal, setShowAuthModal, authMode, setAuthMode, handleSignup, handleLogin, handleGoogleSignIn, setShowPreferences, darkMode, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe] = useState(true); // Always true, setter unused
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        setError('');
        setIsLoading(true);

        if (authMode === 'signup') {
            if (!validateInput.email(email)) {
                setError(t('Email i pavlefshëm', 'Invalid email'));
                setIsLoading(false);
                return;
            }
            const passwordCheck = validatePassword(password);
            if (!passwordCheck.valid) {
                setError(passwordCheck.message);
                setIsLoading(false);
                return;
            }
            if (!validateInput.text(displayName, 50)) {
                setError(t('Emri duhet të jetë 1-50 karaktere', 'Name must be 1-50 characters'));
                setIsLoading(false);
                return;
            }
            const { error } = await handleSignup(email, password, displayName, rememberMe);
            if (error) setError(error.message);
            else setShowAuthModal(false);
        } else {
            if (!validateInput.email(email)) {
                setError(t('Email i pavlefshëm', 'Invalid email'));
                setIsLoading(false);
                return;
            }
            const { error } = await handleLogin(email, password, rememberMe);
            if (error) setError(error.message);
            else setShowAuthModal(false);
        }
        setIsLoading(false);
    };

    const onGoogleClick = async () => {
        setError('');
        setIsLoading(true);
        const { error } = await handleGoogleSignIn();
        if (error) setError(error.message);
        setIsLoading(false);
    };

    if (!showAuthModal) return null;

    return (
        <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowAuthModal(false)}
        >
            <div className={`w-full max-w-sm rounded-xl p-5 ${darkMode ? 'bg-[#2D2A26]' : 'bg-white'}`}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {authMode === 'login' ? t('Hyr', 'Log in') : t('Regjistrohu', 'Sign up')}
                    </h2>
                    <button
                        onClick={() => setShowAuthModal(false)}
                        className={`p-1 rounded ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Google Sign-In Button */}
                <button
                    onClick={onGoogleClick}
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-3 py-2.5 rounded-lg text-sm font-medium mb-4 border transition-colors ${darkMode
                        ? 'bg-white text-gray-800 hover:bg-gray-100 border-transparent'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-200'
                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    {t('Vazhdo me Google', 'Continue with Google')}
                </button>

                {/* Divider */}
                <div className="relative mb-4">
                    <div className={`absolute inset-0 flex items-center`}>
                        <div className={`w-full border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className={`px-2 ${darkMode ? 'bg-[#2D2A26] text-gray-500' : 'bg-white text-gray-400'}`}>
                            {t('ose', 'or')}
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    {authMode === 'signup' && (
                        <input
                            type="text"
                            placeholder={t('Emri', 'Name')}
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            maxLength="50"
                            className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${darkMode
                                ? 'bg-[#3D3A36] text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-600'
                                : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'
                                }`}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none ${darkMode
                            ? 'bg-[#3D3A36] text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-600'
                            : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'
                            }`}
                    />
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder={t('Fjalëkalimi', 'Password')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-3 py-2 pr-10 rounded-lg text-sm outline-none ${darkMode
                                ? 'bg-[#3D3A36] text-white placeholder-gray-500 focus:ring-1 focus:ring-gray-600'
                                : 'bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-1 focus:ring-gray-200'
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className={`w-full bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isLoading ? '...' : (authMode === 'login' ? t('Hyr', 'Log in') : t('Regjistrohu', 'Sign up'))}
                    </button>
                </div>

                <p className={`text-center text-sm mt-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {authMode === 'login' ? t('Nuk ke llogari?', "Don't have an account?") : t('Ke llogari?', 'Have an account?')}
                    {' '}
                    <button
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-amber-500 hover:underline"
                    >
                        {authMode === 'login' ? t('Regjistrohu', 'Sign up') : t('Hyr', 'Log in')}
                    </button>
                </p>
            </div>
        </div>
    );
};

// Preferences Modal Component
// Preferences Modal Component

export default AuthModal;
