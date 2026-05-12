import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronLeft, ChevronRight, ChevronDown, Trash2, Plus, Calendar, Users, Award, Leaf, TrendingUp, Film, Play, MapPin, LogOut, Send, Heart, Sun, Moon, Edit, Brain, Globe as GlobeIcon, Clock, Star, Bookmark, ExternalLink, BookmarkCheck, Calendar as CalendarIcon, GraduationCap, Eye, EyeOff, Share2, Copy, Download, Check, Instagram, Home, Newspaper, User, Search, ChevronUp, Shield, ArrowRight, LayoutGrid, Palette, MessageSquare, Feather, PenTool, FileText, Mail } from 'lucide-react';

// Capacitor imports for native app
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

import supabase from './utils/supabase';
import { trackPageView, trackArticleRead, updateReadDuration, formatDateAl, getCategoryColor, validateInput, validatePassword, handleError, uploadImage } from './utils/helpers';
import EventCalendar from './components/EventCalendar';
import ShareModal from './components/ShareModal';
import TermsModal from './components/TermsModal';
import AuthModal from './components/AuthModal';
import PreferencesModal from './components/PreferencesModal';
import { HomeFadeSection, ScrollHint } from './components/HomeFadeSection';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import LetraPage from './pages/LetraPage';
import EventsPage from './pages/EventsPage';
import NgazetaPage from './pages/NgazetaPage';
import BashkohuPage from './pages/BashkohuPage';
import PartnersPage from './pages/PartnersPage';
import AboutPage from './pages/AboutPage';
import ArticleModal from './components/ArticleModal';
import EventModal from './components/EventModal';
import Header from './components/Header';
import FAB from './components/FAB';
import DraftsModal from './components/DraftsModal';
import UserActivityModal from './components/UserActivityModal';
import NativeShareModal from './components/NativeShareModal';
import HomeSignupPopup from './components/HomeSignupPopup';
import AdminAnalyticsPanel from './components/AdminAnalyticsPanel';
import MobileMenu from './components/MobileMenu';
import { AddArticleForm, AddEventForm, AddPartnerForm, AddMemberForm, AddVideoForm } from './components/AdminForms';
import ShikoPage from './pages/ShikoPage';
import VideoModal from './components/VideoModal';

// Check if running as native app
const isNativeApp = Capacitor.isNativePlatform();

const RinON = () => {
    const [language, setLanguage] = useState('al');
    const [currentPage, setCurrentPage] = useState('home');
    const [showAdmin, setShowAdmin] = useState(false);
    const [showArticleModal, setShowArticleModal] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showAddEventForm, setShowAddEventForm] = useState(false);
    const [showAddPartnerForm, setShowAddPartnerForm] = useState(false);
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [fabOpen, setFabOpen] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [pageTransition, setPageTransition] = useState(false);
    const [hasPageLoaded, setHasPageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchBar, setShowSearchBar] = useState(false);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Te Gjitha');

    // UX Enhancement States
    const [, setShowFirstTimeTooltip] = useState(false); // Value unused, only setter needed
    const [savedArticles, setSavedArticles] = useState([]);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [showHomeSignupPopup, setShowHomeSignupPopup] = useState(false);

    // N'gazeta content type filter: 'all' (Home), 'lajme' (News only), 'artikuj' (Articles only)

    // Calendar state - moved to parent to persist across re-renders
    const [calendarDate, setCalendarDate] = useState(new Date());

    const [editingItem, setEditingItem] = useState(null);
    const [editMode, setEditMode] = useState(false);

    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const [showPreferences, setShowPreferences] = useState(false);
    const [showTermsModal, setShowTermsModal] = useState(false);
    const [pendingUser, setPendingUser] = useState(null); // User waiting to accept terms

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
        category: 'Arsim', image: '', imageFile: null, source: '', author: '', featured: false, postType: 'lajme', showOnHomepage: false, isHeadArticle: false
    });

    const [eventFormData, setEventFormData] = useState({
        titleAl: '', titleEn: '', dateAl: '', dateEn: '',
        type: '', descAl: '', descEn: '', location: '', image: '', imageFile: null,
        date: '', time: '', endTime: '', address: '', category: 'general',
        spotsLeft: 100, totalSpots: 100, isFree: true, price: '',
        registrationLink: '', isFeatured: false, tags: [], showOnHomepage: false
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
    // LETRA NGA RINASI — Emigration Letters Archive
    // ==========================================
    const [letters, setLetters] = useState([]);
    const [pendingLetters, setPendingLetters] = useState([]);
    const [showPendingLetters, setShowPendingLetters] = useState(false);
    const [letterFormData, setLetterFormData] = useState({ initials: '', destination: '', profession: '', content: '' });
    const [letterSubmitStatus, setLetterSubmitStatus] = useState(null); // null | 'submitting' | 'success' | 'error'
    const [editingLetter, setEditingLetter] = useState(null); // { id, initials, destination, profession, content }
    const letterFormRef = React.useRef(null);
    const articleReadRef = useRef(null); // tracks current article read session for duration update

    // Analytics dashboard state (admin-only)
    const [analyticsOpen, setAnalyticsOpen] = useState(false);
    const [analyticsData, setAnalyticsData] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);

    // ==========================================
    // BASHKOHU — Community Signup Form
    // ==========================================
    const [signupForm, setSignupForm] = useState({ first_name: '', last_name: '', age: '', email: '', phone: '', reason: '', skills: '', referral_source: '' });
    const [signupSubmitting, setSignupSubmitting] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    // ==========================================
    // EVENT INTERESTS ("Who's Going?")
    // ==========================================
    const [eventInterests, setEventInterests] = useState({}); // { eventId: count }
    const [userEventInterests, setUserEventInterests] = useState([]); // array of event IDs user is interested in

    // ==========================================
    // USER BADGES
    // ==========================================
    const [userBadges, setUserBadges] = useState([]);

    // ==========================================
    // SHIKO (VIDEOS) FEATURE - STATE VARIABLES
    // ==========================================
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoCategory, setVideoCategory] = useState('all');
    const [savedVideos, setSavedVideos] = useState([]);
    const [showAddVideoForm, setShowAddVideoForm] = useState(false);
    const [videoFormData, setVideoFormData] = useState({
        titleAl: '', titleEn: '', descriptionAl: '', descriptionEn: '',
        youtubeId: '', thumbnail: '', category: 'podcast',
        duration: '', isRinONOriginal: true, isFeatured: false
    });

    // ==========================================
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareItem, setShareItem] = useState({ item: null, type: null });
    const t = (al, en) => language === 'al' ? al : en;
    const categories = [
        { al: 'Aktualitet', en: 'Current Affairs', icon: Newspaper },
        { al: 'Arsim & Karrierë', en: 'Education & Career', icon: GraduationCap },
        { al: 'Kulturë', en: 'Culture', icon: Palette },
        { al: 'Opinione', en: 'Opinions', icon: MessageSquare },
        { al: 'Shoqëri', en: 'Society', icon: Users },
        { al: 'Rreth Europës', en: 'About Europe', icon: GlobeIcon }
    ];

    const changePage = (page) => {
        setPageTransition(true);
        setHasPageLoaded(false);
        setMobileMenuOpen(false);
        setTimeout(() => {
            setCurrentPage(page);
            trackPageView(page, user?.id);
            setPageTransition(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setHasPageLoaded(true), 100);
        }, 350);
    };

    useEffect(() => {
        setHasPageLoaded(true);

        // Handle deep links from notifications (when app was closed)
        const urlParams = new URLSearchParams(window.location.search);
        // Clean the IDs - remove any trailing quotes or whitespace
        const openArticleId = urlParams.get('openArticle')?.replace(/["']/g, '').trim();
        const openEventId = urlParams.get('openEvent')?.replace(/["']/g, '').trim();

        const handleArticleOpen = async () => {
            if (!openArticleId) return;

            console.log('Opening article from URL:', openArticleId);

            // Try to find in loaded articles first (compare as string AND number)
            let article = articles.find(a =>
                String(a.id) === String(openArticleId) || a.id === parseInt(openArticleId)
            );

            // If not found, fetch from database
            if (!article) {
                console.log('Article not loaded, fetching from database...');
                try {
                    const { data, error } = await supabase
                        .from('articles')
                        .select('*')
                        .eq('id', parseInt(openArticleId) || openArticleId)
                        .single();

                    console.log('Database response:', data, error);

                    if (data) {
                        article = {
                            id: data.id,
                            titleAl: data.title_al,
                            titleEn: data.title_en,
                            contentAl: data.content_al,
                            contentEn: data.content_en,
                            category: data.category,
                            image: data.image,
                            source: data.source,
                            featured: data.featured,
                            postType: data.post_type || 'lajme',
                            date: new Date(data.created_at).toISOString().split('T')[0]
                        };
                    }
                } catch (err) {
                    console.error('Error fetching article:', err);
                }
            }

            if (article) {
                console.log('Opening article:', article.titleAl);
                openArticle(article);
                window.history.replaceState({}, '', '/');
            } else {
                console.error('Article not found:', openArticleId);
            }
        };

        const handleEventOpen = async () => {
            if (!openEventId) return;

            console.log('Opening event from URL:', openEventId);

            // Try to find in loaded events first (compare as string AND number)
            let event = otherEvents.find(e =>
                String(e.id) === String(openEventId) || e.id === parseInt(openEventId)
            );

            // If not found, fetch from database
            if (!event) {
                console.log('Event not loaded, fetching from database...');
                try {
                    const { data } = await supabase
                        .from('events')
                        .select('*')
                        .eq('id', openEventId)
                        .single();

                    if (data) {
                        event = {
                            id: data.id,
                            titleAl: data.title_al,
                            titleEn: data.title_en,
                            dateAl: data.date_al,
                            dateEn: data.date_en,
                            type: data.type,
                            descAl: data.desc_al,
                            descEn: data.desc_en,
                            location: data.location,
                            image: data.image,
                            date: data.date,
                            time: data.time,
                            endTime: data.end_time,
                            address: data.address,
                            category: data.category,
                            spots_left: data.spots_left,
                            total_spots: data.total_spots,
                            is_free: data.is_free,
                            price: data.price,
                            attendees: data.attendees,
                            partner: data.partner,
                            registration_link: data.registration_link,
                            is_featured: data.is_featured,
                            is_trending: data.is_trending,
                            tags: data.tags
                        };
                    }
                } catch (err) {
                    console.error('Error fetching event:', err);
                }
            }

            if (event) {
                console.log('Opening event:', event.titleAl);
                setSelectedEvent(event);
                setShowEventModal(true);
                window.history.replaceState({}, '', '/');
            } else {
                console.error('Event not found:', openEventId);
            }
        };

        // Handle ?page= URL parameter (e.g. rinon.al/?page=bashkohu from QR code)
        const pageParam = urlParams.get('page');
        if (pageParam === 'bashkohu') {
            setCurrentPage('bashkohu');
            window.history.replaceState({}, '', '/');
        }

        // Execute handlers
        if (openArticleId) handleArticleOpen();
        if (openEventId) handleEventOpen();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Set body background color to prevent purple showing on zoom out
    useEffect(() => {
        const bgColor = darkMode ? '#2D2A26' : '#f9fafb';
        document.body.style.backgroundColor = bgColor;

        // Also set html element background
        document.documentElement.style.backgroundColor = bgColor;

        // Update meta theme-color for iOS Safari and Android Chrome
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = bgColor;

        // Update apple-mobile-web-app-status-bar-style
        let metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!metaAppleStatusBar) {
            metaAppleStatusBar = document.createElement('meta');
            metaAppleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
            document.head.appendChild(metaAppleStatusBar);
        }
        metaAppleStatusBar.content = 'black-translucent';

        return () => {
            document.body.style.backgroundColor = '';
            document.documentElement.style.backgroundColor = '';
        };
    }, [darkMode]);


    // ============================================
    // NATIVE APP - Navigation history for back button
    // ============================================
    const [navigationHistory, setNavigationHistory] = useState(['home']);
    const [lastBackPress, setLastBackPress] = useState(0);

    // Track page changes for navigation history
    useEffect(() => {
        if (isNativeApp && currentPage) {
            setNavigationHistory(prev => {
                // Don't add duplicate consecutive pages
                if (prev[prev.length - 1] !== currentPage) {
                    return [...prev.slice(-10), currentPage]; // Keep last 10 pages
                }
                return prev;
            });
        }
    }, [currentPage]);

    // ============================================
    // NATIVE APP - Android Back Button Handler
    // ============================================
    useEffect(() => {
        if (!isNativeApp) return;

        const backButtonListener = CapApp.addListener('backButton', ({ canGoBack }) => {
            // First, close any open modals
            if (showArticleModal) {
                setShowArticleModal(false);
                return;
            }
            if (showEventModal) {
                setShowEventModal(false);
                return;
            }
            if (showAuthModal) {
                setShowAuthModal(false);
                return;
            }
            if (mobileMenuOpen) {
                setMobileMenuOpen(false);
                return;
            }
            if (showPreferences) {
                setShowPreferences(false);
                return;
            }

            // Navigate through history
            if (navigationHistory.length > 1) {
                const newHistory = [...navigationHistory];
                newHistory.pop(); // Remove current page
                const previousPage = newHistory[newHistory.length - 1];
                setNavigationHistory(newHistory);
                setCurrentPage(previousPage);
                return;
            }

            // Double-tap to exit on home page
            if (currentPage === 'home') {
                const now = Date.now();
                if (now - lastBackPress < 2000) {
                    CapApp.exitApp();
                } else {
                    setLastBackPress(now);
                    // Show toast-like message (using alert for now)
                    // You could replace this with a proper toast
                    console.log('Press back again to exit');
                }
            } else {
                // Go to home if not in history
                changePage('home');
            }
        });

        return () => {
            backButtonListener.then(l => l.remove());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showArticleModal, showEventModal, showAuthModal, mobileMenuOpen, currentPage]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            category: 'Arsim', image: '', imageFile: null, source: '', featured: false
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
            category: draft.category || 'Arsim',
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
            category: draft.category || 'Arsim',
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



    // eslint-disable-next-line no-unused-vars
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
        loadEvents();
        loadPartners();
        loadTeamMembers();
        loadEventInterests();
        loadVideos();
        loadLetters();
        trackPageView('home');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Load user-specific data when user changes
    useEffect(() => {
        if (user) {
            loadUserBadges();
            loadEventInterests(); // Reload to get user's interests
            loadSavedVideos(); // Load user's saved videos
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);


    // Track article open/close for reads and duration
    useEffect(() => {
        if (showArticleModal && selectedArticle) {
            trackArticleRead(selectedArticle.id, user?.id).then(readId => {
                articleReadRef.current = { readId, startTime: Date.now() };
            });
        } else if (!showArticleModal && articleReadRef.current?.readId) {
            const duration = (Date.now() - articleReadRef.current.startTime) / 1000;
            updateReadDuration(articleReadRef.current.readId, duration, 100);
            articleReadRef.current = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showArticleModal]);

    // Show signup popup after scrolling on homepage (only for non-logged-in users)
    useEffect(() => {
        if (user || currentPage !== 'home') return;

        const handleScroll = () => {
            const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercent > 40 && !localStorage.getItem('rinon_home_signup_shown')) {
                setShowHomeSignupPopup(true);
                localStorage.setItem('rinon_home_signup_shown', 'true');
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [user, currentPage]);

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

                // Check if user has accepted terms (for existing users)
                if (data.terms_accepted !== true) {
                    setShowTermsModal(true);
                }
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
                    author: a.author || '',
                    featured: a.featured, postType: a.post_type || 'lajme',
                    showOnHomepage: a.show_on_homepage || false,
                    is_head_article: a.is_head_article || false,
                    date: new Date(a.created_at).toISOString().split('T')[0]
                }));
                setArticles(formattedArticles);
            }
        } catch (err) {
            console.error(handleError(err, 'loadArticles'));
        } finally {
            setLoading(false);
        }
    };


    // Load event interests (who's interested counts)
    const loadEventInterests = async () => {
        try {
            const { data, error } = await supabase
                .from('event_interests')
                .select('event_id');

            if (error) throw error;

            // Count interests per event
            const counts = {};
            data?.forEach(item => {
                counts[item.event_id] = (counts[item.event_id] || 0) + 1;
            });
            setEventInterests(counts);

            // If user is logged in, get their interests
            if (user) {
                const { data: userInterests } = await supabase
                    .from('event_interests')
                    .select('event_id')
                    .eq('user_id', user.id);

                setUserEventInterests(userInterests?.map(i => i.event_id) || []);
            }
        } catch (err) {
            console.error(handleError(err, 'loadEventInterests'));
        }
    };

    // Toggle interest in event
    const toggleEventInterest = async (eventId) => {
        if (!user) {
            setShowAuthModal(true);
            setAuthMode('login');
            return;
        }

        const isInterested = userEventInterests.includes(eventId);

        try {
            if (isInterested) {
                // Remove interest
                await supabase
                    .from('event_interests')
                    .delete()
                    .eq('event_id', eventId)
                    .eq('user_id', user.id);

                setUserEventInterests(prev => prev.filter(id => id !== eventId));
                setEventInterests(prev => ({
                    ...prev,
                    [eventId]: Math.max((prev[eventId] || 1) - 1, 0)
                }));
            } else {
                // Add interest
                await supabase
                    .from('event_interests')
                    .insert({ event_id: eventId, user_id: user.id });

                setUserEventInterests(prev => [...prev, eventId]);
                setEventInterests(prev => ({
                    ...prev,
                    [eventId]: (prev[eventId] || 0) + 1
                }));
            }
        } catch (err) {
            console.error(handleError(err, 'toggleEventInterest'));
        }
    };

    // Load user badges
    const loadUserBadges = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase
                .from('user_badges')
                .select('badge_type, earned_at')
                .eq('user_id', user.id);

            if (error) throw error;
            setUserBadges(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadUserBadges'));
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
                    is_featured: e.is_featured, is_trending: e.is_trending, tags: e.tags,
                    showOnHomepage: e.show_on_homepage || false
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

    // ==========================================
    // LETRA NGA RINASI — DATA LOADING
    // ==========================================
    const loadLetters = async () => {
        try {
            const { data, error } = await supabase
                .from('letters')
                .select('*')
                .eq('is_approved', true)
                .order('submitted_at', { ascending: false });
            if (error) throw error;
            setLetters(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadLetters'));
        }
    };

    const loadPendingLetters = async () => {
        try {
            const { data, error } = await supabase
                .from('letters')
                .select('*')
                .eq('is_approved', false)
                .order('submitted_at', { ascending: false });
            if (error) throw error;
            setPendingLetters(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadPendingLetters'));
        }
    };

    // ==========================================
    // SHIKO (VIDEOS) - DATA LOADING
    // ==========================================
    const loadVideos = async () => {
        try {
            const { data, error } = await supabase
                .from('videos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVideos(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadVideos'));
        }
    };

    const loadSavedVideos = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('video_saves')
                .select('video_id')
                .eq('user_id', user.id);

            if (error) throw error;
            setSavedVideos(data?.map(v => v.video_id) || []);
        } catch (err) {
            console.error(handleError(err, 'loadSavedVideos'));
        }
    };

    const toggleSaveVideo = async (videoId) => {
        if (!user) {
            setShowAuthModal(true);
            setAuthMode('login');
            return;
        }

        const isSaved = savedVideos.includes(videoId);

        try {
            if (isSaved) {
                await supabase
                    .from('video_saves')
                    .delete()
                    .eq('video_id', videoId)
                    .eq('user_id', user.id);

                setSavedVideos(prev => prev.filter(id => id !== videoId));
            } else {
                await supabase
                    .from('video_saves')
                    .insert({ video_id: videoId, user_id: user.id });

                setSavedVideos(prev => [...prev, videoId]);
            }
        } catch (err) {
            console.error(handleError(err, 'toggleSaveVideo'));
        }
    };

    const incrementVideoViews = async (videoId) => {
        try {
            const { data } = await supabase
                .from('videos')
                .select('view_count')
                .eq('id', videoId)
                .single();

            await supabase
                .from('videos')
                .update({ view_count: (data?.view_count || 0) + 1 })
                .eq('id', videoId);
        } catch (err) {
            console.error(handleError(err, 'incrementVideoViews'));
        }
    };

    const openVideo = (video) => {
        setSelectedVideo(video);
        setShowVideoModal(true);
        incrementVideoViews(video.id);
    };

    const closeVideo = () => {
        setSelectedVideo(null);
        setShowVideoModal(false);
    };

    const submitVideo = async () => {
        if (!userProfile?.is_admin) return;

        try {
            const videoData = {
                title_al: videoFormData.titleAl,
                title_en: videoFormData.titleEn || videoFormData.titleAl,
                description_al: videoFormData.descriptionAl,
                description_en: videoFormData.descriptionEn,
                youtube_id: videoFormData.youtubeId,
                thumbnail: videoFormData.thumbnail || `https://img.youtube.com/vi/${videoFormData.youtubeId}/maxresdefault.jpg`,
                category: videoFormData.category,
                duration: videoFormData.duration,
                is_rinon_original: videoFormData.isRinONOriginal,
                is_featured: videoFormData.isFeatured
            };

            const { error } = await supabase.from('videos').insert([videoData]);

            if (error) throw error;

            loadVideos();
            setShowAddVideoForm(false);
            setVideoFormData({
                titleAl: '', titleEn: '', descriptionAl: '', descriptionEn: '',
                youtubeId: '', thumbnail: '', category: 'podcast',
                duration: '', isRinONOriginal: true, isFeatured: false
            });
        } catch (err) {
            console.error(handleError(err, 'submitVideo'));
        }
    };

    const deleteVideo = async (videoId) => {
        if (!userProfile?.is_admin) return;
        if (!window.confirm(t('Je i sigurt?', 'Are you sure?'))) return;

        try {
            await supabase.from('videos').delete().eq('id', videoId);
            loadVideos();
            if (selectedVideo?.id === videoId) {
                closeVideo();
            }
        } catch (err) {
            console.error(handleError(err, 'deleteVideo'));
        }
    };

    const fetchAnalytics = async () => {
        setAnalyticsLoading(true);
        try {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
            const [{ data: pageViews }, { data: articleReads }] = await Promise.all([
                supabase.from('page_views').select('page, session_id, created_at').gte('created_at', sevenDaysAgo),
                supabase.from('article_reads').select('article_id, read_duration_seconds, created_at').gte('created_at', sevenDaysAgo),
            ]);
            setAnalyticsData({ pageViews: pageViews || [], articleReads: articleReads || [] });
        } catch (e) {}
        setAnalyticsLoading(false);
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
                    preferences: [],
                    terms_accepted: false,
                    terms_accepted_at: null
                }]);

                // Set session persistence based on rememberMe
                if (rememberMe) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }

                // Store pending user and show terms modal
                setPendingUser(data.user);
                setShowTermsModal(true);
            }

            return { data, error };
        } catch (err) {
            return { error: { message: handleError(err, 'handleSignup') } };
        }
    };

    // Handle terms acceptance
    const handleAcceptTerms = async () => {
        if (!pendingUser && !user) return;

        const userId = pendingUser?.id || user?.id;

        try {
            await supabase.from('user_profiles').update({
                terms_accepted: true,
                terms_accepted_at: new Date().toISOString()
            }).eq('id', userId);

            setShowTermsModal(false);
            setPendingUser(null);
            setShowPreferences(true); // Show preferences after accepting terms
        } catch (err) {
            console.error('Error accepting terms:', err);
        }
    };

    // Handle terms rejection - log out the user
    const handleRejectTerms = async () => {
        setShowTermsModal(false);
        setPendingUser(null);
        await supabase.auth.signOut();
        alert(language === 'sq'
            ? 'Duhet të pranoni kushtet për të përdorur RinON.'
            : 'You must accept the terms to use RinON.');
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

    // Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent',
                    }
                }
            });

            if (error) {
                return { error };
            }

            return { data };
        } catch (err) {
            return { error: { message: handleError(err, 'handleGoogleSignIn') } };
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
    const updatePreferences = async (prefs, newDisplayName = null) => {
        if (!user) return;
        try {
            const updateData = {};
            if (prefs !== null) updateData.preferences = prefs;
            if (newDisplayName) updateData.display_name = newDisplayName;

            if (Object.keys(updateData).length === 0) return;

            const { error } = await supabase.from('user_profiles').update(updateData).eq('id', user.id);
            if (error) throw error;
            loadUserProfile(user.id);
        } catch (err) {
            console.error(handleError(err, 'updatePreferences'));
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
            author: article.author || '',
            featured: article.featured,
            isHeadArticle: article.is_head_article || false,
            postType: article.postType || 'lajme',
            showOnHomepage: article.showOnHomepage || false
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
            tags: event.tags || [],
            showOnHomepage: event.showOnHomepage || false
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
                image: imageUrl || `https://images.unsplash.com/photo-${Math.random().toString(36).slice(2, 11)}?w=800`,
                source: validateInput.sanitizeHtml(formData.source),
                author: validateInput.sanitizeHtml(formData.author),
                featured: formData.featured,
                is_head_article: formData.isHeadArticle || false,
                post_type: formData.postType || 'lajme',
                show_on_homepage: formData.showOnHomepage || false,
                author_id: user?.id
            };

            let error, data;
            if (editMode && editingItem) {
                ({ error } = await supabase.from('articles').update(article).eq('id', editingItem.id));
                data = [{ id: editingItem.id }]; // Use existing ID
            } else {
                ({ data, error } = await supabase.from('articles').insert([article]).select('id'));
            }

            if (error) throw error;

            // Store the article ID for editing
            const savedArticleId = data?.[0]?.id;
            if (savedArticleId) {
                setEditingItem({ ...editingItem, id: savedArticleId });
            }

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
                category: 'Arsim', image: '', imageFile: null, source: '', author: '', featured: false, postType: 'lajme', showOnHomepage: false, isHeadArticle: false
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

            const eventData = {
                title_al: validateInput.sanitizeHtml(eventFormData.titleAl),
                title_en: validateInput.sanitizeHtml(eventFormData.titleEn || eventFormData.titleAl),
                date_al: validateInput.sanitizeHtml(eventFormData.dateAl),
                date_en: validateInput.sanitizeHtml(eventFormData.dateEn || eventFormData.dateAl),
                type: validateInput.sanitizeHtml(eventFormData.type || ''),
                desc_al: validateInput.sanitizeHtml(eventFormData.descAl || ''),
                desc_en: validateInput.sanitizeHtml(eventFormData.descEn || eventFormData.descAl || ''),
                location: validateInput.sanitizeHtml(eventFormData.location || ''),
                image: imageUrl || `https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800`,
                date: eventFormData.date || null,
                time: eventFormData.time || null,
                end_time: eventFormData.endTime || null,
                address: validateInput.sanitizeHtml(eventFormData.address || ''),
                category: eventFormData.category || 'general',
                spots_left: parseInt(eventFormData.spotsLeft) || 100,
                total_spots: parseInt(eventFormData.totalSpots) || 100,
                is_free: eventFormData.isFree !== false,
                price: eventFormData.price || null,
                partner: validateInput.sanitizeHtml(eventFormData.partner || ''),
                registration_link: eventFormData.registrationLink || null,
                is_featured: eventFormData.isFeatured || false,
                show_on_homepage: eventFormData.showOnHomepage || false,
                tags: eventFormData.tags || []
            };

            let error, data;
            if (editMode && editingItem && editingItem.id) {
                // Update existing event - don't overwrite attendees
                ({ error } = await supabase.from('events').update(eventData).eq('id', editingItem.id));
                if (!error) {
                    data = [{ id: editingItem.id }];
                }
            } else {
                // Insert new event with initial attendees count
                eventData.attendees = 0;
                eventData.is_trending = false;
                ({ data, error } = await supabase.from('events').insert([eventData]).select('id'));
            }

            if (error) throw error;

            // Store the event ID for editing
            const savedEventId = data?.[0]?.id;
            if (savedEventId) {
                setEditingItem({ ...editingItem, id: savedEventId });
            }

            loadEvents();
            setEventFormData({
                titleAl: '', titleEn: '', dateAl: '', dateEn: '',
                type: '', descAl: '', descEn: '', location: '', image: '', imageFile: null,
                date: '', time: '', endTime: '', address: '', category: 'general',
                spotsLeft: 100, totalSpots: 100, isFree: true, price: '',
                registrationLink: '', isFeatured: false, tags: [], showOnHomepage: false
            });
            setShowAddEventForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Eventi u përditësua me sukses!' : 'Eventi u shtua me sukses!',
                editMode ? 'Event updated successfully!' : 'Event added successfully!'));
        } catch (err) {
            console.error('Event submit error:', err);
            alert(handleError(err, 'handleSubmitEvent'));
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
                image: imageUrl || `https://images.unsplash.com/photo-${Math.random().toString(36).slice(2, 11)}?w=800`
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


    // Filtered articles with both category and search
    const filteredArticles = (() => {
        let filtered = articles;

        // Category filter - DON'T filter on 'Home', 'Te Gjitha', or 'All'
        const categoryToUse = selectedCategoryFilter;
        if (categoryToUse && categoryToUse !== 'Te Gjitha' && categoryToUse !== 'All' && categoryToUse !== 'Home') {
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

    // All news items (postType: 'lajme' or no postType set)
    // N'gazeta filtered content — all articles, optionally filtered by category
    const ngazetaFilteredContent = (() => {
        if (selectedCategoryFilter && selectedCategoryFilter !== 'Te Gjitha') {
            return filteredArticles.filter(a => a.category === selectedCategoryFilter);
        }
        return filteredArticles;
    })();


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

    // ==========================================
    // SHIKO PAGE - Videos, Podcasts, Documentaries
    // ==========================================

    return (
        <div
            className={`min-h-screen w-full transition-colors duration-300 ${darkMode ? 'bg-[#2D2A26]' : 'bg-gray-50'}`}
            style={{ paddingBottom: currentPage === 'bashkohu' ? '0' : isNativeApp ? 'env(safe-area-inset-bottom, 80px)' : '80px' }}
        >

            {currentPage !== 'bashkohu' && (
                <Header
                    currentPage={currentPage}
                    darkMode={darkMode}
                    t={t}
                    changePage={changePage}
                    language={language}
                    setLanguage={setLanguage}
                    setDarkMode={setDarkMode}
                    showAdmin={showAdmin}
                    setShowAdmin={setShowAdmin}
                    userProfile={userProfile}
                    user={user}
                    setShowPreferences={setShowPreferences}
                    setShowAuthModal={setShowAuthModal}
                    setAuthMode={setAuthMode}
                    mobileMenuOpen={mobileMenuOpen}
                    setMobileMenuOpen={setMobileMenuOpen}
                    showSearchBar={showSearchBar}
                    setShowSearchBar={setShowSearchBar}
                />
            )}

            {/* Search overlay - simplified */}
            {showSearchBar && (
                <div className={`sticky top-14 z-40 border-b ${darkMode ? 'bg-[#2D2A26] border-[#3D3A36]' : 'bg-white border-gray-100'}`}>
                    <div className="max-w-6xl mx-auto px-4 py-3">
                        <div className="relative">
                            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                type="text"
                                placeholder={t('Kërko...', 'Search...')}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-10 pr-10 py-2 rounded-lg text-sm outline-none ${darkMode
                                    ? 'bg-[#3D3A36] text-white placeholder-gray-500'
                                    : 'bg-gray-50 text-gray-900 placeholder-gray-400'
                                    }`}
                                autoFocus
                            />
                            <button
                                onClick={() => { setShowSearchBar(false); setSearchQuery(''); }}
                                className={`absolute right-3 top-1/2 -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ==========================================
                HORIZONTAL CATEGORY PILLS - Mobile
                Scrollable category filter below header
               ========================================== */}
            {/* N'gazeta Sticky Category Filter Bar */}
            {currentPage === 'lajme' && (
                <div className={`sticky top-14 z-30 border-b backdrop-blur-sm ${darkMode ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-gray-100'}`}>
                    <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 py-3">
                        {/* Të gjitha pill */}
                        <button
                            onClick={() => setSelectedCategoryFilter('Te Gjitha')}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategoryFilter === 'Te Gjitha' || !selectedCategoryFilter
                                ? 'bg-amber-500 text-white font-semibold shadow-sm'
                                : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            <LayoutGrid className="w-4 h-4 mr-1.5" />
                            {t('Të gjitha', 'All')}
                        </button>
                        {categories.map((cat) => {
                            const Icon = cat.icon;
                            const isActive = selectedCategoryFilter === cat.al;
                            return (
                                <button
                                    key={cat.al}
                                    onClick={() => setSelectedCategoryFilter(cat.al)}
                                    className={`inline-flex items-center px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors flex-shrink-0 ${isActive
                                        ? 'bg-amber-500 text-white font-semibold shadow-sm'
                                        : darkMode ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    <Icon className="w-4 h-4 mr-1.5" />
                                    {language === 'al' ? cat.al : cat.en}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            <AddArticleForm
                showAddForm={showAddForm}
                setShowAddForm={setShowAddForm}
                editMode={editMode}
                setEditMode={setEditMode}
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                editingDraftId={editingDraftId}
                setEditingDraftId={setEditingDraftId}
                drafts={drafts}
                setShowDraftsModal={setShowDraftsModal}
                formData={formData}
                setFormData={setFormData}
                language={language}
                t={t}
                saveDraft={saveDraft}
                handleSubmitArticle={handleSubmitArticle}
            />

            {/* Add Event Modal */}
            {/* Add Event Modal */}
            <AddEventForm
                showAddEventForm={showAddEventForm}
                setShowAddEventForm={setShowAddEventForm}
                editMode={editMode}
                setEditMode={setEditMode}
                setEditingItem={setEditingItem}
                eventFormData={eventFormData}
                setEventFormData={setEventFormData}
                t={t}
                handleSubmitEvent={handleSubmitEvent}
            />


            {/* Add Partner Modal */}
            <AddPartnerForm
                showAddPartnerForm={showAddPartnerForm}
                setShowAddPartnerForm={setShowAddPartnerForm}
                editMode={editMode}
                setEditMode={setEditMode}
                setEditingItem={setEditingItem}
                partnerFormData={partnerFormData}
                setPartnerFormData={setPartnerFormData}
                t={t}
                handleSubmitPartner={handleSubmitPartner}
            />

            {/* Add Member Modal */}
            <AddMemberForm
                showAddMemberForm={showAddMemberForm}
                setShowAddMemberForm={setShowAddMemberForm}
                editMode={editMode}
                setEditMode={setEditMode}
                setEditingItem={setEditingItem}
                memberFormData={memberFormData}
                setMemberFormData={setMemberFormData}
                t={t}
                handleSubmitMember={handleSubmitMember}
            />
            <MobileMenu
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                darkMode={darkMode}
                t={t}
                language={language}
                setLanguage={setLanguage}
                setDarkMode={setDarkMode}
                currentPage={currentPage}
                changePage={changePage}
                user={user}
                userProfile={userProfile}
                savedArticles={savedArticles}
                savedEvents={savedEvents}
                setShowUserActivity={setShowUserActivity}
                setShowAuthModal={setShowAuthModal}
                setAuthMode={setAuthMode}
                handleLogout={handleLogout}
            />

            <AuthModal
                showAuthModal={showAuthModal}
                setShowAuthModal={setShowAuthModal}
                authMode={authMode}
                setAuthMode={setAuthMode}
                handleSignup={handleSignup}
                handleLogin={handleLogin}
                handleGoogleSignIn={handleGoogleSignIn}
                setShowPreferences={setShowPreferences}
                darkMode={darkMode}
                t={t}
            />

            <TermsModal
                showTermsModal={showTermsModal}
                onAccept={handleAcceptTerms}
                onReject={handleRejectTerms}
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
                onLogout={handleLogout}
                userBadges={userBadges}
                user={user}
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
            <DraftsModal
                showDraftsModal={showDraftsModal}
                setShowDraftsModal={setShowDraftsModal}
                darkMode={darkMode}
                t={t}
                drafts={drafts}
                editDraft={editDraft}
                publishDraft={publishDraft}
                deleteDraft={deleteDraft}
                setShowAddForm={setShowAddForm}
            />

            {/* ==========================================
                USER ACTIVITY BANK - Saved Articles & Events
               ========================================== */}
            <UserActivityModal
                showUserActivity={showUserActivity}
                setShowUserActivity={setShowUserActivity}
                darkMode={darkMode}
                t={t}
                language={language}
                userActivityTab={userActivityTab}
                setUserActivityTab={setUserActivityTab}
                savedArticles={savedArticles}
                savedEvents={savedEvents}
                getSavedArticlesData={getSavedArticlesData}
                getSavedEventsData={getSavedEventsData}
                openArticle={openArticle}
                toggleSaveArticle={toggleSaveArticle}
                toggleSaveEvent={toggleSaveEvent}
            />

            {/* ==========================================
                NATIVE SHARE MODAL - WhatsApp, Snapchat, etc.
               ========================================== */}
            <NativeShareModal
                showNativeShare={showNativeShare}
                setShowNativeShare={setShowNativeShare}
                nativeShareItem={nativeShareItem}
                darkMode={darkMode}
                t={t}
                userProfile={userProfile}
                openShareModal={openShareModal}
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

        /* Marquee animation for partners */
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .animate-marquee {
          animation: marquee 25s linear infinite;
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
                    <HomePage
                        darkMode={darkMode}
                        language={language}
                        t={t}
                        articles={articles}
                        otherEvents={otherEvents}
                        letters={letters}
                        partners={partners}
                        showAdmin={showAdmin}
                        editArticle={editArticle}
                        deleteArticle={deleteArticle}
                        openArticle={openArticle}
                        changePage={changePage}
                        setSelectedCategoryFilter={setSelectedCategoryFilter}
                    />
                ) : currentPage === 'lajme' ? (
                    <NgazetaPage
                        darkMode={darkMode}
                        t={t}
                        language={language}
                        ngazetaFilteredContent={ngazetaFilteredContent}
                        openArticle={openArticle}
                        showAdmin={showAdmin}
                        editArticle={editArticle}
                        deleteArticle={deleteArticle}
                    />
                ) : currentPage === 'events' ? (
                    <EventsPage
                        darkMode={darkMode}
                        t={t}
                        language={language}
                        otherEvents={otherEvents}
                        showAdmin={showAdmin}
                        editEvent={editEvent}
                        deleteEvent={deleteEvent}
                        openShareModal={openShareModal}
                        openEvent={openEvent}
                        calendarDate={calendarDate}
                        setCalendarDate={setCalendarDate}
                        eventInterests={eventInterests}
                        userEventInterests={userEventInterests}
                        toggleEventInterest={toggleEventInterest}
                    />
                ) : currentPage === 'shiko' ? (
                    <ShikoPage
                        darkMode={darkMode}
                        t={t}
                        language={language}
                        videos={videos}
                        videoCategory={videoCategory}
                        setVideoCategory={setVideoCategory}
                        savedVideos={savedVideos}
                        openVideo={openVideo}
                        toggleSaveVideo={toggleSaveVideo}
                        userProfile={userProfile}
                        showAdmin={showAdmin}
                        setShowAddVideoForm={setShowAddVideoForm}
                        deleteVideo={deleteVideo}
                    />
                ) : currentPage === 'letra' ? (
                    <LetraPage
                        darkMode={darkMode}
                        t={t}
                        showAdmin={showAdmin}
                        userProfile={userProfile}
                        user={user}
                        letters={letters}
                        showPendingLetters={showPendingLetters}
                        setShowPendingLetters={setShowPendingLetters}
                        pendingLetters={pendingLetters}
                        loadPendingLetters={loadPendingLetters}
                        loadLetters={loadLetters}
                        editingLetter={editingLetter}
                        setEditingLetter={setEditingLetter}
                        letterFormRef={letterFormRef}
                        letterSubmitStatus={letterSubmitStatus}
                        setLetterSubmitStatus={setLetterSubmitStatus}
                        letterFormData={letterFormData}
                        setLetterFormData={setLetterFormData}
                        setShowAuthModal={setShowAuthModal}
                    />
                ) : currentPage === 'partners' ? (
                    <PartnersPage
                        darkMode={darkMode}
                        t={t}
                        language={language}
                        otherEvents={otherEvents}
                        showAdmin={showAdmin}
                        editEvent={editEvent}
                        deleteEvent={deleteEvent}
                    />
                ) : currentPage === 'about' ? (
                    <AboutPage
                        darkMode={darkMode}
                        t={t}
                        language={language}
                        partners={partners}
                        staffMembers={staffMembers}
                        showAdmin={showAdmin}
                        editPartner={editPartner}
                        deletePartner={deletePartner}
                        editMember={editMember}
                        deleteMember={deleteMember}
                    />
                ) : currentPage === 'bashkohu' ? (
                    <BashkohuPage
                        darkMode={darkMode}
                        signupSuccess={signupSuccess}
                        signupForm={signupForm}
                        setSignupForm={setSignupForm}
                        signupSubmitting={signupSubmitting}
                        setSignupSubmitting={setSignupSubmitting}
                        setSignupSuccess={setSignupSuccess}
                        changePage={changePage}
                    />
                ) : null}
            </main>

            {showArticleModal && selectedArticle && (
                <ArticleModal
                    selectedArticle={selectedArticle}
                    setShowArticleModal={setShowArticleModal}
                    language={language}
                    darkMode={darkMode}
                    t={t}
                    savedArticles={savedArticles}
                    toggleSaveArticle={toggleSaveArticle}
                    setShareItem={setShareItem}
                    setShowShareModal={setShowShareModal}
                />
            )}
            <VideoModal
                showVideoModal={showVideoModal}
                selectedVideo={selectedVideo}
                closeVideo={closeVideo}
                darkMode={darkMode}
                t={t}
                language={language}
                savedVideos={savedVideos}
                toggleSaveVideo={toggleSaveVideo}
            />

            <AddVideoForm
                showAddVideoForm={showAddVideoForm}
                setShowAddVideoForm={setShowAddVideoForm}
                videoFormData={videoFormData}
                setVideoFormData={setVideoFormData}
                t={t}
                submitVideo={submitVideo}
                darkMode={darkMode}
            />

            {/* Youthful Signup Popup */}
            <HomeSignupPopup
                showHomeSignupPopup={showHomeSignupPopup}
                setShowHomeSignupPopup={setShowHomeSignupPopup}
                darkMode={darkMode}
                t={t}
                setAuthMode={setAuthMode}
                setShowAuthModal={setShowAuthModal}
            />

            {/* Event Modal */}
            {showEventModal && selectedEvent && (
                <EventModal
                    selectedEvent={selectedEvent}
                    setShowEventModal={setShowEventModal}
                    setSelectedEvent={setSelectedEvent}
                    language={language}
                    darkMode={darkMode}
                    t={t}
                    openShareModal={openShareModal}
                />
            )}
            {showAdmin && (
                <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
                    <button
                        onClick={() => {
                            const next = !analyticsOpen;
                            setAnalyticsOpen(next);
                            if (next && !analyticsData) fetchAnalytics();
                        }}
                        className={`p-4 rounded-full shadow-2xl transform hover:scale-110 transition-all duration-300 ${analyticsOpen ? 'bg-teal-600 text-white' : 'bg-gray-800 text-teal-400 hover:bg-gray-700'}`}
                        title={t('Analitika', 'Analytics')}
                    >
                        <TrendingUp className="h-6 w-6" />
                    </button>
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
                </div>
            )}

            {/* ── Admin Analytics Panel ───────────────────────────────── */}
            <AdminAnalyticsPanel
                showAdmin={showAdmin}
                userProfile={userProfile}
                analyticsOpen={analyticsOpen}
                darkMode={darkMode}
                analyticsLoading={analyticsLoading}
                analyticsData={analyticsData}
                fetchAnalytics={fetchAnalytics}
                articles={articles}
            />

            {/* ==========================================
                SCROLL TO TOP BUTTON
                Appears after scrolling down
               ========================================== */}
            {showScrollTop && currentPage !== 'home' && (
                <button
                    onClick={scrollToTop}
                    className={`fixed bottom-24 md:bottom-8 left-4 z-40 w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 animate-fadeIn ${darkMode
                        ? 'bg-[#3D3A36] text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                        : 'bg-white text-amber-600 border border-amber-200 hover:bg-amber-50'
                        }`}
                    title={t('Kthehu lart', 'Back to top')}
                >
                    <ChevronUp className="w-6 h-6" />
                </button>
            )}


            {currentPage !== 'bashkohu' && <BottomNav
                darkMode={darkMode}
                currentPage={currentPage}
                changePage={changePage}
                user={user}
                userProfile={userProfile}
                setShowPreferences={setShowPreferences}
                setShowAuthModal={setShowAuthModal}
                setAuthMode={setAuthMode}
                isNativeApp={isNativeApp}
            />}

            {currentPage !== 'home' && currentPage !== 'lajme' && (
                <FAB
                    darkMode={darkMode}
                    t={t}
                    language={language}
                    setLanguage={setLanguage}
                    setDarkMode={setDarkMode}
                    changePage={changePage}
                    fabOpen={fabOpen}
                    setFabOpen={setFabOpen}
                />
            )}

            {/* Spacer for bottom nav on mobile */}
            <div className="md:hidden h-20"></div>

            <Footer
                t={t}
                changePage={changePage}
                userProfile={userProfile}
                showAdmin={showAdmin}
                setShowAdmin={setShowAdmin}
            />

        </div>
    );
};

export default RinON;