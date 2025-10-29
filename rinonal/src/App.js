import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Menu, X, Globe, ChevronLeft, ChevronRight, MessageCircle, Trash2, Plus, Calendar, Users, Award, Leaf, TrendingUp, Film, Play, MapPin, LogIn, LogOut, Settings, Send, Heart, ChevronDown, Sun, Moon } from 'lucide-react';
import DOMPurify from 'dompurify';
import Filter from 'bad-words';

// Initialize Supabase
const supabase = createClient(
    'https://hslwkxwarflnvjfytsul.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbHdreHdhcmZsbnZqZnl0c3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzY5NzcsImV4cCI6MjA3NTc1Mjk3N30.bwAqhvyRaNaec9vkJRytf_ktZRPrbbbViiTGcjWIus4'
);

// Initialize profanity filter
const filter = new Filter();
// Add Albanian bad words (optional)
filter.addWords('mut', 'idiot', 'budalla'); // Add more Albanian words as needed

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
        if (!url) return true; // Optional field
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
    },

    // Check for profanity
    containsProfanity: (text) => {
        return filter.isProfane(text);
    },

    // Clean profanity from text
    cleanProfanity: (text) => {
        return filter.clean(text);
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
    t
}) => {
    if (!selectedTopic) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12">
                <h1 className={`text-5xl font-bold mb-8 ${darkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>{t('Hapësira e Diskutimit', 'Discussion Space')}</h1>
                {topics.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30">
                            <MessageCircle className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {t('Asnjë temë diskutimi ende', 'No discussion topics yet')}
                        </h3>
                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {t('Temat do të shfaqen këtu kur të krijohen', 'Topics will appear here when created')}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {topics.map((topic) => (
                            <div
                                key={topic.id}
                                className={`backdrop-blur-lg p-6 rounded-2xl border hover:border-purple-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 relative ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                                    }`}
                            >
                                {showAdmin && userProfile?.is_admin && (
                                    <button
                                        onClick={() => deleteTopic(topic.id)}
                                        className="absolute top-3 right-3 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition z-10 shadow-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setSelectedTopic(topic)}
                                    className="text-left w-full"
                                >
                                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'al' ? topic.title_al : topic.title_en || topic.title_al}</h3>
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

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <button onClick={() => setSelectedTopic(null)} className="text-purple-400 hover:text-purple-300 flex items-center gap-2 mb-6">
                <ChevronLeft className="w-4 h-4" />
                {t('Kthehu', 'Back')}
            </button>

            <div className={`backdrop-blur-lg p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'al' ? selectedTopic.title_al : selectedTopic.title_en || selectedTopic.title_al}</h2>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? selectedTopic.description_al : selectedTopic.description_en || selectedTopic.description_al}</p>
            </div>

            <div className={`backdrop-blur-lg p-6 rounded-2xl border mb-6 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder={t('Shkruani mendimin tuaj...', 'Write your thoughts...')}
                    className={`w-full px-4 py-3 border rounded-xl resize-none placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all ${darkMode ? 'bg-slate-800 border-purple-500/30 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'
                        }`}
                    rows="4"
                    maxLength="2000"
                />
                <button onClick={submitPost} className="mt-3 px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 flex items-center gap-2 shadow-lg shadow-purple-500/50 transition-all">
                    <Send className="w-4 h-4" />
                    {t('Posto', 'Post')}
                </button>
            </div>

            <div className="space-y-4">
                {topicPosts.length === 0 ? (
                    <div className={`backdrop-blur-lg p-12 rounded-2xl border text-center ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                        <MessageCircle className={`w-12 h-12 mx-auto mb-4 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                                <p className="font-medium text-purple-400">{post.user_name}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{new Date(post.created_at).toLocaleDateString()}</span>
                                    {(post.user_id === user?.id || userProfile?.is_admin) && (
                                        <button onClick={() => deletePost(post.id)} className="p-1 hover:bg-pink-500/20 rounded text-pink-400">
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

// Auth Modal Component
const AuthModal = ({ showAuthModal, setShowAuthModal, authMode, setAuthMode, handleSignup, handleLogin, setShowPreferences, darkMode, t }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');

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

            const { error } = await handleSignup(email, password, displayName);
            if (error) setError(error.message);
            else setShowAuthModal(false);
        } else {
            if (!validateInput.email(email)) {
                setError(t('Email i pavlefshëm', 'Invalid email address'));
                return;
            }

            const { error } = await handleLogin(email, password);
            if (error) setError(error.message);
            else setShowAuthModal(false);
        }
    };

    if (!showAuthModal) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-purple-500/20">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {authMode === 'login' ? t('Hyr', 'Login') : t('Regjistrohu', 'Sign Up')}
                    </h2>
                    <button onClick={() => setShowAuthModal(false)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-all">
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
                            className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                    <input
                        type="password"
                        placeholder={t('Fjalëkalimi', 'Password')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />

                    {error && <p className="text-pink-400 text-sm">{error}</p>}

                    <button onClick={handleSubmit} className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 transform hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/50">
                        {authMode === 'login' ? t('Hyr', 'Login') : t('Regjistrohu', 'Sign Up')}
                    </button>
                </div>

                <p className="text-center text-sm mt-4 text-gray-400">
                    {authMode === 'login' ? t('Nuk keni llogari?', "Don't have an account?") : t('Keni llogari?', 'Have an account?')}
                    <button onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="ml-2 text-purple-400 font-medium hover:text-purple-300">
                        {authMode === 'login' ? t('Regjistrohu', 'Sign up') : t('Hyr', 'Login')}
                    </button>
                </p>
            </div>
        </div>
    );
};

// Preferences Modal Component
const PreferencesModal = ({ showPreferences, setShowPreferences, userProfile, updatePreferences, categories, language, darkMode, t }) => {
    const [selected, setSelected] = useState(userProfile?.preferences || []);

    const toggleCategory = (cat) => {
        setSelected(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
    };

    if (!showPreferences) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-purple-500/20">
                <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{t('Zgjidhni Preferencat', 'Choose Preferences')}</h2>
                <p className="text-gray-400 mb-6">{t('Zgjidhni temat që ju interesojnë', 'Select topics that interest you')}</p>

                <div className="space-y-3 mb-6">
                    {categories.filter(c => c.al !== 'Te Gjitha').map(cat => (
                        <button
                            key={cat.al}
                            onClick={() => toggleCategory(cat.al)}
                            className={`w-full px-4 py-3 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${selected.includes(cat.al)
                                ? 'border-purple-500 bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 shadow-lg shadow-purple-500/30'
                                : 'border-slate-600 text-gray-400 hover:border-purple-500/50'
                                }`}
                        >
                            {language === 'al' ? cat.al : cat.en}
                        </button>
                    ))}
                </div>

                <div className="flex gap-3">
                    <button onClick={() => setShowPreferences(false)} className="flex-1 px-4 py-3 border border-slate-600 rounded-xl text-gray-400 hover:border-slate-500 transition-all">
                        {t('Anulo', 'Cancel')}
                    </button>
                    <button onClick={() => { updatePreferences(selected); setShowPreferences(false); }} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50">
                        {t('Ruaj', 'Save')}
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
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddEventForm, setShowAddEventForm] = useState(false);
    const [showAddTopicForm, setShowAddTopicForm] = useState(false);
    const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [darkMode, setDarkMode] = useState(true);
    const [pageTransition, setPageTransition] = useState(false);
    const [hasPageLoaded, setHasPageLoaded] = useState(false);
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [showPreferences, setShowPreferences] = useState(false);
    const [topics, setTopics] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [topicPosts, setTopicPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    const [formData, setFormData] = useState({
        titleAl: '', titleEn: '', contentAl: '', contentEn: '',
        category: 'Sport dhe Kulturë', image: '', source: '', featured: false
    });

    const [eventFormData, setEventFormData] = useState({
        titleAl: '', titleEn: '', dateAl: '', dateEn: '',
        type: '', descAl: '', descEn: '', location: '', image: ''
    });

    const [topicFormData, setTopicFormData] = useState({
        titleAl: '', titleEn: '', descriptionAl: '', descriptionEn: ''
    });

    const [partnerFormData, setPartnerFormData] = useState({
        nameAl: '', nameEn: '', descriptionAl: '', descriptionEn: '',
        visionAl: '', visionEn: '', goalsAl: '', goalsEn: '', website: '', image: ''
    });

    const [memberFormData, setMemberFormData] = useState({
        name: '', role: ''
    });

    const [articles, setArticles] = useState([]);
    const [otherEvents, setOtherEvents] = useState([]);
    const [partners, setPartners] = useState([]);
    const [staffMembers, setStaffMembers] = useState([]);

    const t = (al, en) => language === 'al' ? al : en;

    const categories = [
        { al: 'Te Gjitha', en: 'All', icon: TrendingUp },
        { al: 'Sport dhe Kulturë', en: 'Sports and Culture', icon: Play },
        { al: 'Politikë dhe Ekonomi', en: 'Politics and Economics', icon: Users },
        { al: 'Mjedis', en: 'Environment', icon: Leaf },
        { al: 'Showbiz', en: 'Entertainment', icon: Film }
    ];

    const changePage = (page) => {
        setPageTransition(true);
        setHasPageLoaded(false);
        setMobileMenuOpen(false);
        setTimeout(() => {
            setCurrentPage(page);
            setPageTransition(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setHasPageLoaded(true), 100);
        }, 350);
    };

    useEffect(() => {
        setHasPageLoaded(true);
    }, []);

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
    }, []);

    useEffect(() => {
        if (selectedTopic && user) loadPosts(selectedTopic.id);
    }, [selectedTopic, user]);

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
                    descAl: e.desc_al, descEn: e.desc_en, location: e.location, image: e.image
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

    const handleSignup = async (email, password, displayName) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email, password,
                options: { data: { display_name: validateInput.sanitizeHtml(displayName) } }
            });

            if (!error && data.user) {
                await supabase.from('user_profiles').insert([{
                    id: data.user.id,
                    display_name: validateInput.sanitizeHtml(displayName),
                    preferences: []
                }]);
                setShowPreferences(true);
            }

            return { data, error };
        } catch (err) {
            return { error: { message: handleError(err, 'handleSignup') } };
        }
    };

    const handleLogin = async (email, password) => {
        try {
            return await supabase.auth.signInWithPassword({ email, password });
        } catch (err) {
            return { error: { message: handleError(err, 'handleLogin') } };
        }
    };

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (err) {
            console.error(handleError(err, 'handleLogout'));
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

        // Check for profanity
        if (validateInput.containsProfanity(newPost)) {
            alert(t('Ju lutem mos përdorni gjuhë ofenduese', 'Please do not use offensive language'));
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

    const handleSubmitArticle = async () => {
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

        if (formData.image && !validateInput.url(formData.image)) {
            alert(t('URL e imazhit është e pavlefshme', 'Invalid image URL'));
            return;
        }

        try {
            const article = {
                title_al: validateInput.sanitizeHtml(formData.titleAl),
                title_en: validateInput.sanitizeHtml(formData.titleEn || formData.titleAl),
                content_al: validateInput.sanitizeHtml(formData.contentAl),
                content_en: validateInput.sanitizeHtml(formData.contentEn || formData.contentAl),
                category: formData.category,
                image: formData.image || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800`,
                source: validateInput.sanitizeHtml(formData.source),
                featured: formData.featured,
                author_id: user?.id
            };

            const { data, error } = await supabase.from('articles').insert([article]).select();

            if (error) throw error;

            if (data) {
                loadArticles();
                setFormData({
                    titleAl: '', titleEn: '', contentAl: '', contentEn: '',
                    category: 'Sport dhe Kulturë', image: '', source: '', featured: false
                });
                setShowAddForm(false);
                alert(t('Artikulli u publikua me sukses!', 'Article published successfully!'));
            }
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

        if (eventFormData.image && !validateInput.url(eventFormData.image)) {
            alert(t('URL e imazhit është e pavlefshme', 'Invalid image URL'));
            return;
        }

        try {
            const event = {
                title_al: validateInput.sanitizeHtml(eventFormData.titleAl),
                title_en: validateInput.sanitizeHtml(eventFormData.titleEn || eventFormData.titleAl),
                date_al: validateInput.sanitizeHtml(eventFormData.dateAl),
                date_en: validateInput.sanitizeHtml(eventFormData.dateEn || eventFormData.dateAl),
                type: validateInput.sanitizeHtml(eventFormData.type),
                desc_al: validateInput.sanitizeHtml(eventFormData.descAl),
                desc_en: validateInput.sanitizeHtml(eventFormData.descEn || eventFormData.descAl),
                location: validateInput.sanitizeHtml(eventFormData.location),
                image: eventFormData.image || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800`
            };

            const { data, error } = await supabase.from('events').insert([event]).select();

            if (error) throw error;

            if (data) {
                loadEvents();
                setEventFormData({
                    titleAl: '', titleEn: '', dateAl: '', dateEn: '',
                    type: '', descAl: '', descEn: '', location: '', image: ''
                });
                setShowAddEventForm(false);
                alert(t('Eventi u shtua me sukses!', 'Event added successfully!'));
            }
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

        if (partnerFormData.image && !validateInput.url(partnerFormData.image)) {
            alert(t('URL e imazhit është e pavlefshme', 'Invalid image URL'));
            return;
        }

        try {
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
                image: partnerFormData.image || `https://images.unsplash.com/photo-${Math.random().toString(36).substr(2, 9)}?w=800`
            };

            const { data, error } = await supabase.from('partners').insert([partner]).select();

            if (error) throw error;

            if (data) {
                loadPartners();
                setPartnerFormData({
                    nameAl: '', nameEn: '', descriptionAl: '', descriptionEn: '',
                    visionAl: '', visionEn: '', goalsAl: '', goalsEn: '', website: '', image: ''
                });
                setShowAddPartnerForm(false);
                alert(t('Partneri u shtua me sukses!', 'Partner added successfully!'));
            }
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

            const { data, error } = await supabase.from('team_members').insert([member]).select();

            if (error) throw error;

            if (data) {
                loadTeamMembers();
                setMemberFormData({ name: '', role: '' });
                setShowAddMemberForm(false);
                alert(t('Anëtari u shtua me sukses!', 'Member added successfully!'));
            }
        } catch (err) {
            alert(handleError(err, 'handleSubmitMember'));
        }
    };

    const featuredArticles = articles.filter(a => a.featured);
    const filteredArticles = activeCategory === 'Te Gjitha' || activeCategory === 'All'
        ? articles
        : articles.filter(a => a.category === activeCategory);

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % featuredArticles.length);
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);

    const openArticle = (article) => {
        setSelectedArticle(article);
        setShowArticleModal(true);
    };

    const EventsPage = () => (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className={`text-5xl font-bold mb-8 ${darkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>{t('Evente', 'Events')}</h1>
            {otherEvents.length === 0 ? (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30">
                        <Calendar className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                            className={`backdrop-blur-lg rounded-2xl border hover:border-purple-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                                }`}
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
                                    <button
                                        onClick={() => deleteEvent(event.id)}
                                        className="absolute top-3 right-3 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition z-10 shadow-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="p-6">
                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-300 text-sm font-semibold rounded-full mb-3 border border-purple-500/30">
                                    {event.type}
                                </span>
                                <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'al' ? event.titleAl : event.titleEn}</h3>
                                <div className={`flex items-center text-sm mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <Calendar className="w-4 h-4 mr-2" />
                                    <span>{language === 'al' ? event.dateAl : event.dateEn}</span>
                                </div>
                                <div className={`flex items-center text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{event.location}</span>
                                </div>
                                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{language === 'al' ? event.descAl : event.descEn}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    // NEW: Partnership Events Page
    const PartnershipsPage = () => {
        const partnershipEvents = otherEvents.filter(event => event.type === 'partnership');

        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>
                        {t('Evente Bashkëpunimi', 'Partnership Events')}
                    </h1>
                    <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {t('Bashkëpunimet tona me organizata të ndryshme', 'Our partnerships with various organizations')}
                    </p>
                </div>

                {partnershipEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30">
                            <Users className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                                className={`backdrop-blur-lg rounded-2xl border hover:border-purple-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                                    }`}
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
                                        <button
                                            onClick={() => deleteEvent(event.id)}
                                            className="absolute top-3 right-3 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition z-10 shadow-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Users className="w-5 h-5 text-purple-400" />
                                        <span className="text-sm text-purple-400 font-medium">
                                            {t('Bashkëpunim', 'Partnership')}
                                        </span>
                                    </div>
                                    <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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

    // UPDATED: About Page with Partners Section
    const AboutPage = () => (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className={`text-5xl font-bold mb-8 text-center ${darkMode ? 'bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent' : 'text-gray-900'}`}>{t('Rreth Nesh', 'About Us')}</h1>

            <div className={`backdrop-blur-lg rounded-2xl border p-8 mb-8 ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('Përshkrimi', 'Description')}</h2>
                <p className={`leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t(
                        'RinON është një platformë dixhitale e dedikuar për rininë shqiptare, e krijuar për të promovuar aktivizmin, kulturën, edukimin dhe zhvillimin personal të të rinjve. Ne besojmë se të rinjtë janë motori i ndryshimit dhe përparimit të shoqërisë sonë.',
                        'RinON is a digital platform dedicated to Albanian youth, created to promote activism, culture, education and personal development of young people. We believe that young people are the engine of change and progress in our society.'
                    )}
                </p>

                <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('Vizioni Ynë', 'Our Vision')}</h2>
                <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t(
                        'Të krijojmë një komunitet të fortë dhe aktiv të të rinjve shqiptarë që punojnë së bashku për një të ardhme më të mirë. Ne synojmë të jemi platforma kryesore për lajme, ngjarje dhe diskutime që ndikojnë në jetën e përditshme të të rinjve në Shqipëri.',
                        'To create a strong and active community of young Albanians working together for a better future. We aim to be the main platform for news, events and discussions that affect the daily lives of young people in Albania.'
                    )}
                </p>
            </div>

            {/* Partners Section - MOVED HERE */}
            {partners.length > 0 && (
                <div className="mb-12">
                    <h2 className={`text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {t('Partnerët Tanë', 'Our Partners')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {partners.map((partner) => (
                            <div
                                key={partner.id}
                                className={`backdrop-blur-lg rounded-2xl border hover:border-purple-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 overflow-hidden ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                                    }`}
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
                                        <button
                                            onClick={() => deletePartner(partner.id)}
                                            className="absolute top-3 right-3 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition z-10 shadow-lg"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="p-6">
                                    <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'al' ? partner.nameAl : partner.nameEn}</h3>

                                    <div className="mb-4">
                                        <h4 className="font-semibold text-purple-400 mb-1">{t('Përshkrimi', 'Description')}</h4>
                                        <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? partner.descriptionAl : partner.descriptionEn}</p>
                                    </div>

                                    {(partner.visionAl || partner.visionEn) && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-purple-400 mb-1">{t('Vizioni', 'Vision')}</h4>
                                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? partner.visionAl : partner.visionEn}</p>
                                        </div>
                                    )}

                                    {(partner.goalsAl || partner.goalsEn) && (
                                        <div className="mb-4">
                                            <h4 className="font-semibold text-purple-400 mb-1">{t('Qëllimet', 'Goals')}</h4>
                                            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{language === 'al' ? partner.goalsAl : partner.goalsEn}</p>
                                        </div>
                                    )}

                                    {partner.website && (
                                        <a href={partner.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium">
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
                <h2 className={`text-4xl font-bold mb-6 text-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('Ekipi Ynë', 'Our Team')}</h2>
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
                                className={`backdrop-blur-lg rounded-2xl border p-6 hover:border-purple-500/50 transition-all transform hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/20 relative ${darkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'
                                    }`}
                            >
                                {showAdmin && (
                                    <button
                                        onClick={() => deleteMember(member.id)}
                                        className="absolute top-3 right-3 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition shadow-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                                <h3 className={`font-bold text-lg mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{member.name}</h3>
                                <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{member.role}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 text-center border border-purple-500/30 backdrop-blur-lg transition-all hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`font-bold text-2xl mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>5000+</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('Anëtarë Aktivë', 'Active Members')}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 text-center border border-purple-500/30 backdrop-blur-lg transition-all hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                        <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`font-bold text-2xl mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>150+</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('Evente të Organizuara', 'Events Organized')}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-6 text-center border border-purple-500/30 backdrop-blur-lg transition-all hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-500/50">
                        <Leaf className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`font-bold text-2xl mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>25+</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{t('Projekte Mjedisore', 'Environmental Projects')}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
            <header className={`backdrop-blur-lg border-b sticky top-0 z-50 shadow-lg transition-colors duration-300 ${darkMode
                ? 'bg-slate-800/80 border-purple-500/20 shadow-purple-500/10'
                : 'bg-white/80 border-purple-200 shadow-purple-200/20'
                }`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => changePage('home')}>
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 group-hover:scale-110 transition-transform">
                                <span className="text-white font-bold text-xl">R</span>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">RinON</h1>
                                <p className="text-xs text-purple-400 uppercase tracking-wide">
                                    {t('Aktivizo Rininë Tënde', 'Activate Your Youth')}
                                </p>
                            </div>
                        </div>

                        <nav className="hidden md:flex items-center space-x-6">
                            <button onClick={() => changePage('home')} className={`font-medium transition-all ${currentPage === 'home' ? 'text-purple-400' : darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>
                                {t('Faqja Kryesore', 'Home')}
                            </button>
                            <button onClick={() => changePage('events')} className={`font-medium transition-all ${currentPage === 'events' ? 'text-purple-400' : darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>
                                {t('Evente', 'Events')}
                            </button>
                            <button onClick={() => changePage('partners')} className={`font-medium flex items-center gap-1 transition-all ${currentPage === 'partners' ? 'text-purple-400' : darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>
                                <Users className="w-4 h-4" />
                                {t('Bashkëpunime', 'Cooperations')}
                            </button>
                            {user && (
                                <button onClick={() => changePage('discussion')} className={`font-medium flex items-center gap-2 transition-all ${currentPage === 'discussion' ? 'text-purple-400' : darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>
                                    <MessageCircle className="w-4 h-4" />
                                    {t('Bisedim', 'Discussion')}
                                </button>
                            )}
                            <button onClick={() => changePage('about')} className={`font-medium transition-all ${currentPage === 'about' ? 'text-purple-400' : darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}>
                                {t('Rreth Nesh', 'About')}
                            </button>
                        </nav>

                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="md:hidden p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all border border-purple-500/30"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>

                        <div className="hidden md:flex items-center space-x-4">
                            <button
                                onClick={() => setLanguage(language === 'al' ? 'en' : 'al')}
                                className="flex items-center space-x-1 px-3 py-1.5 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all border border-purple-500/30"
                            >
                                <Globe className="h-4 w-4" />
                                <span className="font-medium text-sm">{language.toUpperCase()}</span>
                            </button>

                            <button
                                onClick={() => setDarkMode(!darkMode)}
                                className="p-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-all border border-purple-500/30"
                                title={darkMode ? t('Light Mode', 'Light Mode') : t('Dark Mode', 'Dark Mode')}
                            >
                                {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                            </button>

                            {user ? (
                                <div className="flex items-center gap-3">
                                    <span className={`text-sm hidden sm:inline ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userProfile?.display_name || user.email}</span>
                                    <button onClick={() => setShowPreferences(true)} className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-purple-600/20' : 'hover:bg-purple-100'}`}>
                                        <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                                    </button>
                                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-red-600 text-white rounded-lg hover:from-pink-500 hover:to-red-500 transition-all shadow-lg shadow-pink-500/50">
                                        <LogOut className="w-4 h-4" />
                                        <span className="hidden sm:inline">{t('Dil', 'Logout')}</span>
                                    </button>
                                </div>
                            ) : (
                                <button onClick={() => { setShowAuthModal(true); setAuthMode('login'); }} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50">
                                    <LogIn className="w-4 h-4" />
                                    {t('Hyr', 'Login')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}>
                    <div
                        className={`absolute top-[72px] left-0 right-0 transition-colors duration-300 border-b shadow-2xl ${darkMode
                            ? 'bg-slate-800 border-purple-500/20'
                            : 'bg-white border-purple-200'
                            }`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <nav className="flex flex-col p-4 space-y-2">
                            <button
                                onClick={() => { changePage('home'); setMobileMenuOpen(false); }}
                                className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${currentPage === 'home'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : darkMode
                                        ? 'text-gray-400 hover:bg-purple-600/20 hover:text-purple-400'
                                        : 'text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                    }`}
                            >
                                {t('Faqja Kryesore', 'Home')}
                            </button>
                            <button
                                onClick={() => { changePage('events'); setMobileMenuOpen(false); }}
                                className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${currentPage === 'events'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : darkMode
                                        ? 'text-gray-400 hover:bg-purple-600/20 hover:text-purple-400'
                                        : 'text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                    }`}
                            >
                                {t('Evente', 'Events')}
                            </button>
                            <button
                                onClick={() => { changePage('partners'); setMobileMenuOpen(false); }}
                                className={`text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${currentPage === 'partners'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : darkMode
                                        ? 'text-gray-400 hover:bg-purple-600/20 hover:text-purple-400'
                                        : 'text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                    }`}
                            >
                                <Users className="w-4 h-4" />
                                {t('Bashkëpunime', 'Cooperations')}
                            </button>
                            {user && (
                                <button
                                    onClick={() => { changePage('discussion'); setMobileMenuOpen(false); }}
                                    className={`text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${currentPage === 'discussion'
                                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                        : darkMode
                                            ? 'text-gray-400 hover:bg-purple-600/20 hover:text-purple-400'
                                            : 'text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                        }`}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {t('Bisedim', 'Discussion')}
                                </button>
                            )}
                            <button
                                onClick={() => { changePage('about'); setMobileMenuOpen(false); }}
                                className={`text-left px-4 py-3 rounded-lg font-medium transition-all ${currentPage === 'about'
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : darkMode
                                        ? 'text-gray-400 hover:bg-purple-600/20 hover:text-purple-400'
                                        : 'text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                    }`}
                            >
                                {t('Rreth Nesh', 'About')}
                            </button>

                            <div className={`border-t pt-4 mt-4 space-y-3 ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
                                {user && (
                                    <div className={`px-4 py-3 rounded-lg ${darkMode ? 'bg-purple-600/10' : 'bg-purple-100'}`}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">
                                                    {userProfile?.display_name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {userProfile?.display_name || 'Admin'}
                                                </p>
                                                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center justify-between px-4">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t('Gjuha', 'Language')}
                                    </span>
                                    <button
                                        onClick={() => setLanguage(language === 'al' ? 'en' : 'al')}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${darkMode
                                            ? 'bg-white/10 border-white/20 hover:bg-white/20'
                                            : 'bg-purple-100 border-purple-300 hover:bg-purple-200'
                                            }`}
                                    >
                                        <Globe className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-purple-600'}`} />
                                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-purple-600'}`}>
                                            {language === 'al' ? 'AL' : 'EN'}
                                        </span>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between px-4">
                                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        {t('Modaliteti', 'Mode')}
                                    </span>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${darkMode
                                            ? 'bg-white/10 border-white/20 hover:bg-white/20'
                                            : 'bg-purple-100 border-purple-300 hover:bg-purple-200'
                                            }`}
                                    >
                                        {darkMode ? <Sun className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-purple-600'}`} /> : <Moon className={`w-4 h-4 ${darkMode ? 'text-white' : 'text-purple-600'}`} />}
                                        <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-purple-600'}`}>
                                            {darkMode ? t('Dritë', 'Light') : t('Errët', 'Dark')}
                                        </span>
                                    </button>
                                </div>

                                {user && (
                                    <button
                                        onClick={() => {
                                            setShowPreferences(true);
                                            setMobileMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${darkMode
                                            ? 'bg-purple-600/20 border-purple-500/50 hover:bg-purple-600/30'
                                            : 'bg-purple-100 border-purple-300 hover:bg-purple-200'
                                            }`}
                                    >
                                        <span className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>
                                            {t('Preferencat', 'Preferences')}
                                        </span>
                                        <Settings className={`w-4 h-4 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`} />
                                    </button>
                                )}

                                {user ? (
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-500 hover:to-pink-500 transition-all"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span className="font-medium">{t('Dil', 'Logout')}</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setShowAuthModal(true);
                                            setAuthMode('login');
                                            setMobileMenuOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        <span className="font-medium">{t('Hyr', 'Login')}</span>
                                    </button>
                                )}
                            </div>
                        </nav>
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
            />

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

        .animate-page-enter {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-page-exit {
          animation: fadeOut 0.35s ease-out;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

            <main className={pageTransition ? 'animate-page-exit' : hasPageLoaded ? '' : 'animate-page-enter'}>
                {loading ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{t('Duke u ngarkuar...', 'Loading...')}</p>
                        </div>
                    </div>
                ) : currentPage === 'home' ? (
                    <>
                        {featuredArticles.length > 0 && (
                            <div className="relative bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 text-white overflow-hidden">
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 animate-pulse"></div>
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
                                                        e.target.src = 'https://images.unsplash.com/photo-5578974 65ba0?w=800';
                                                    }}
                                                />
                                                <div className="absolute inset-0 z-20 flex items-center">
                                                    <div className="max-w-3xl mx-auto px-4 md:px-8">
                                                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold rounded-full mb-6 shadow-lg shadow-purple-500/50 animate-pulse">
                                                            {article.category}
                                                        </span>
                                                        <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                                                            {language === 'al' ? article.titleAl : article.titleEn}
                                                        </h2>
                                                        <p className="text-xl text-gray-200 mb-8 line-clamp-2">
                                                            {language === 'al' ? article.contentAl : article.contentEn}
                                                        </p>
                                                        <button
                                                            onClick={() => openArticle(article)}
                                                            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-bold hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 transition-all shadow-lg shadow-purple-500/50"
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

                        <div className={`backdrop-blur-lg border-b sticky top-[72px] z-40 transition-colors duration-300 ${darkMode
                            ? 'bg-slate-800/80 border-purple-500/20'
                            : 'bg-white/80 border-purple-200'
                            }`}>
                            <div className="max-w-7xl mx-auto px-4 py-4">
                                <div className="flex items-center space-x-2 overflow-x-auto">
                                    {categories.map((cat) => {
                                        const Icon = cat.icon;
                                        const catName = language === 'al' ? cat.al : cat.en;
                                        const isActive = activeCategory === cat.al || activeCategory === cat.en;
                                        return (
                                            <button
                                                key={cat.al}
                                                onClick={() => setActiveCategory(catName)}
                                                className={`flex items-center space-x-2 px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all transform hover:scale-105 ${isActive
                                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                                                    : darkMode
                                                        ? 'bg-slate-700/50 text-gray-400 hover:bg-slate-700 border border-purple-500/30'
                                                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200 border border-purple-300'
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                                <span>{catName}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 py-12">
                            {filteredArticles.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-purple-500/30">
                                        <TrendingUp className={`w-10 h-10 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                                    </div>
                                    <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {t('Asnjë artikull ende', 'No articles yet')}
                                    </h3>
                                    <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                                        {t('Artikujt do të shfaqen këtu kur të publikohen', 'Articles will appear here when published')}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredArticles.map((article) => (
                                        <div
                                            key={article.id}
                                            className="group relative overflow-hidden rounded-3xl cursor-pointer transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/30"
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

                                                <span className="absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold backdrop-blur-sm shadow-lg">
                                                    {article.category}
                                                </span>
                                                {showAdmin && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteArticle(article.id);
                                                        }}
                                                        className="absolute top-4 right-4 bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition z-10 shadow-lg"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}

                                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                                    <h3 className="text-2xl font-bold mb-2 line-clamp-2 group-hover:text-purple-300 transition">
                                                        {language === 'al' ? article.titleAl : article.titleEn}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-sm opacity-80">
                                                        <span>{article.date}</span>
                                                        <span className="text-purple-300 font-medium group-hover:underline">
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
                ) : currentPage === 'discussion' && user ? (
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
                    />
                ) : null}
            </main>

            {showArticleModal && selectedArticle && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl">
                        <div className="relative h-80">
                            <img
                                src={selectedArticle.image}
                                alt={selectedArticle.titleAl}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800';
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-800 via-transparent to-transparent" />
                            <button
                                onClick={() => setShowArticleModal(false)}
                                className="absolute top-4 right-4 bg-slate-900/80 hover:bg-slate-900 p-2 rounded-full backdrop-blur-lg transition-all"
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

            {showAddForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {t('Shto Artikull', 'Add Article')}
                            </h2>
                            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-all">
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder={t('Titulli (Shqip) *', 'Title (Albanian) *')}
                                value={formData.titleAl}
                                onChange={(e) => setFormData({ ...formData, titleAl: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Titulli (Anglisht)', 'Title (English)')}
                                value={formData.titleEn}
                                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përmbajtja (Shqip) *', 'Content (Albanian) *')}
                                value={formData.contentAl}
                                onChange={(e) => setFormData({ ...formData, contentAl: e.target.value })}
                                rows="6"
                                maxLength="10000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përmbajtja (Anglisht)', 'Content (English)')}
                                value={formData.contentEn}
                                onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                                rows="6"
                                maxLength="10000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
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
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Burimi', 'Source')}
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <label className="flex items-center gap-3 text-white">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                    className="w-5 h-5 rounded border-purple-500/30 bg-slate-700 text-purple-600 focus:ring-purple-500/20"
                                />
                                <span>{t('Artikull i veçantë', 'Featured article')}</span>
                            </label>
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-3 border border-slate-600 rounded-xl text-gray-400 hover:border-slate-500 transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitArticle} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50">
                                    {t('Publiko', 'Publish')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddEventForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {t('Shto Event', 'Add Event')}
                            </h2>
                            <button onClick={() => setShowAddEventForm(false)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-all">
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
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Titulli (Anglisht)', 'Title (English)')}
                                value={eventFormData.titleEn}
                                onChange={(e) => setEventFormData({ ...eventFormData, titleEn: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Data (Shqip) *', 'Date (Albanian) *')}
                                value={eventFormData.dateAl}
                                onChange={(e) => setEventFormData({ ...eventFormData, dateAl: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Data (Anglisht)', 'Date (English)')}
                                value={eventFormData.dateEn}
                                onChange={(e) => setEventFormData({ ...eventFormData, dateEn: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Tipi', 'Type')}
                                value={eventFormData.type}
                                onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value })}
                                maxLength="50"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Lokacioni', 'Location')}
                                value={eventFormData.location}
                                onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Shqip)', 'Description (Albanian)')}
                                value={eventFormData.descAl}
                                onChange={(e) => setEventFormData({ ...eventFormData, descAl: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')}
                                value={eventFormData.descEn}
                                onChange={(e) => setEventFormData({ ...eventFormData, descEn: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Imazhi', 'Image URL')}
                                value={eventFormData.image}
                                onChange={(e) => setEventFormData({ ...eventFormData, image: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowAddEventForm(false)} className="flex-1 px-4 py-3 border border-slate-600 rounded-xl text-gray-400 hover:border-slate-500 transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitEvent} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50">
                                    {t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddTopicForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {t('Shto Temë Diskutimi', 'Add Discussion Topic')}
                            </h2>
                            <button onClick={() => setShowAddTopicForm(false)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-all">
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
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Titulli (Anglisht)', 'Title (English)')}
                                value={topicFormData.titleEn}
                                onChange={(e) => setTopicFormData({ ...topicFormData, titleEn: e.target.value })}
                                maxLength="200"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Shqip) *', 'Description (Albanian) *')}
                                value={topicFormData.descriptionAl}
                                onChange={(e) => setTopicFormData({ ...topicFormData, descriptionAl: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')}
                                value={topicFormData.descriptionEn}
                                onChange={(e) => setTopicFormData({ ...topicFormData, descriptionEn: e.target.value })}
                                rows="4"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowAddTopicForm(false)} className="flex-1 px-4 py-3 border border-slate-600 rounded-xl text-gray-400 hover:border-slate-500 transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitTopic} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50">
                                    {t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddPartnerForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {t('Shto Partner', 'Add Partner')}
                            </h2>
                            <button onClick={() => setShowAddPartnerForm(false)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-all">
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
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Emri (Anglisht) *', 'Name (English) *')}
                                value={partnerFormData.nameEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, nameEn: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Shqip)', 'Description (Albanian)')}
                                value={partnerFormData.descriptionAl}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, descriptionAl: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Përshkrimi (Anglisht)', 'Description (English)')}
                                value={partnerFormData.descriptionEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, descriptionEn: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Vizioni (Shqip)', 'Vision (Albanian)')}
                                value={partnerFormData.visionAl}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, visionAl: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Vizioni (Anglisht)', 'Vision (English)')}
                                value={partnerFormData.visionEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, visionEn: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Qëllimet (Shqip)', 'Goals (Albanian)')}
                                value={partnerFormData.goalsAl}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, goalsAl: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <textarea
                                placeholder={t('Qëllimet (Anglisht)', 'Goals (English)')}
                                value={partnerFormData.goalsEn}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, goalsEn: e.target.value })}
                                rows="3"
                                maxLength="1000"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all resize-none"
                            />
                            <input
                                type="text"
                                placeholder={t('Website', 'Website')}
                                value={partnerFormData.website}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, website: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('URL Imazhi', 'Image URL')}
                                value={partnerFormData.image}
                                onChange={(e) => setPartnerFormData({ ...partnerFormData, image: e.target.value })}
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowAddPartnerForm(false)} className="flex-1 px-4 py-3 border border-slate-600 rounded-xl text-gray-400 hover:border-slate-500 transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitPartner} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50">
                                    {t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAddMemberForm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-slate-800 rounded-3xl max-w-md w-full border border-purple-500/20 shadow-2xl p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                {t('Shto Anëtar Ekipi', 'Add Team Member')}
                            </h2>
                            <button onClick={() => setShowAddMemberForm(false)} className="p-2 hover:bg-purple-500/20 rounded-lg transition-all">
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
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <input
                                type="text"
                                placeholder={t('Roli *', 'Role *')}
                                value={memberFormData.role}
                                onChange={(e) => setMemberFormData({ ...memberFormData, role: e.target.value })}
                                maxLength="100"
                                className="w-full px-4 py-3 bg-slate-700 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                            />
                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowAddMemberForm(false)} className="flex-1 px-4 py-3 border border-slate-600 rounded-xl text-gray-400 hover:border-slate-500 transition-all">
                                    {t('Anulo', 'Cancel')}
                                </button>
                                <button onClick={handleSubmitMember} className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-500/50">
                                    {t('Shto', 'Add')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showAdmin && (
                <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Artikull', 'Add Article')}
                    >
                        <Plus className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddEventForm(true)}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:from-blue-500 hover:to-purple-500 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Event', 'Add Event')}
                        style={{ animationDelay: '0.5s' }}
                    >
                        <Calendar className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddTopicForm(true)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:from-purple-500 hover:to-indigo-500 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Temë Diskutimi', 'Add Discussion Topic')}
                        style={{ animationDelay: '1s' }}
                    >
                        <MessageCircle className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddPartnerForm(true)}
                        className="bg-gradient-to-r from-orange-600 to-pink-600 text-white p-4 rounded-full shadow-2xl hover:from-orange-500 hover:to-pink-500 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Partner', 'Add Partner')}
                        style={{ animationDelay: '1.5s' }}
                    >
                        <Users className="h-6 w-6" />
                    </button>
                    <button
                        onClick={() => setShowAddMemberForm(true)}
                        className="bg-gradient-to-r from-pink-600 to-red-600 text-white p-4 rounded-full shadow-2xl hover:from-pink-500 hover:to-red-500 transform hover:scale-110 transition-all duration-300 animate-pulse-glow"
                        title={t('Shto Anëtar Ekipi', 'Add Team Member')}
                        style={{ animationDelay: '2s' }}
                    >
                        <Award className="h-6 w-6" />
                    </button>
                </div>
            )}

            <footer className={`border-t py-12 transition-colors duration-300 ${darkMode
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 text-white border-purple-500/20'
                : 'bg-gradient-to-br from-gray-50 via-gray-100 to-purple-50 text-gray-900 border-purple-200'
                }`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">RinON</h3>
                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('Platforma dixhitale për rininë shqiptare', 'Digital platform for Albanian youth')}
                            </p>
                            <a
                                href="https://instagram.com/rinon_albania"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-block transition-colors ${darkMode ? 'text-gray-400 hover:text-purple-400' : 'text-gray-600 hover:text-purple-600'}`}
                            >
                                Instagram: @rinon_albania
                            </a>
                        </div>

                        <div>
                            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('Navigim', 'Navigation')}</h3>
                            <ul className={`space-y-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <li><button onClick={() => changePage('home')} className={`transition-colors ${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>{t('Faqja Kryesore', 'Home')}</button></li>
                                <li><button onClick={() => changePage('events')} className={`transition-colors ${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>{t('Evente', 'Events')}</button></li>
                                <li><button onClick={() => changePage('partners')} className={`transition-colors ${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>{t('Bashkëpunime', 'Cooperations')}</button></li>
                                <li><button onClick={() => changePage('about')} className={`transition-colors ${darkMode ? 'hover:text-purple-400' : 'hover:text-purple-600'}`}>{t('Rreth Nesh', 'About')}</button></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('Behu Vullnetar', 'Become a Volunteer')}</h3>
                            <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {t('Bashkohu me ne dhe kontribuo për një të ardhme më të mirë!', 'Join us and contribute to a better future!')}
                            </p>
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSd2J3S01v9PhZyQgSLNLmZ5YnDUbQePlta_LXx1D13VLB644A/viewform?usp=dialog"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-purple-500/50"
                            >
                                <Heart className="w-4 h-4" />
                                {t('Apliko Tani', 'Apply Now')}
                            </a>
                        </div>
                    </div>

                    <div className={`border-t pt-8 text-center transition-colors duration-300 ${darkMode ? 'border-purple-500/20' : 'border-purple-200'}`}>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            © 2025 RinON. {t('Të gjitha të drejtat e rezervuara.', 'All rights reserved.')}
                        </p>
                        {userProfile?.is_admin && (
                            <button
                                onClick={() => setShowAdmin(!showAdmin)}
                                className={`mt-4 text-sm transition-colors ${darkMode ? 'text-gray-500 hover:text-purple-400' : 'text-gray-400 hover:text-purple-600'}`}
                            >
                                🔐 {showAdmin ? t('Fsheh Admin', 'Hide Admin') : t('Trego Admin', 'Show Admin')}
                            </button>
                        )}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RinON;
