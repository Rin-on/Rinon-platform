import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Globe, ChevronLeft, ChevronRight, ChevronDown, Trash2, Plus, Calendar, Users, Award, Leaf, TrendingUp, Film, Play, MapPin, LogOut, Send, Heart, Sun, Moon, Edit, Brain, Globe as GlobeIcon, Clock, Star, Bookmark, ExternalLink, BookmarkCheck, Calendar as CalendarIcon, GraduationCap, Eye, EyeOff, Share2, Copy, Download, Check, Instagram, Home, Newspaper, User, Search, ChevronUp, Shield, ArrowRight, LayoutGrid, Palette, MessageSquare } from 'lucide-react';

// Capacitor imports for native app
import { Capacitor } from '@capacitor/core';
import { App as CapApp } from '@capacitor/app';

import supabase from './utils/supabase';
import { trackPageView, trackArticleRead, updateReadDuration } from './utils/helpers';
import ShareModal from './components/ShareModal';
import TermsModal from './components/TermsModal';
import AuthModal from './components/AuthModal';
import PreferencesModal from './components/PreferencesModal';
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
import useDataLoaders from './hooks/useDataLoaders';
import useAuthHandlers from './hooks/useAuthHandlers';
import useCrudHandlers from './hooks/useCrudHandlers';

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

    const [signupForm, setSignupForm] = useState({ first_name: '', last_name: '', age: '', email: '', phone: '', reason: '', skills: '', referral_source: '' });
    const [signupSubmitting, setSignupSubmitting] = useState(false);
    const [signupSuccess, setSignupSuccess] = useState(false);

    const [eventInterests, setEventInterests] = useState({}); // { eventId: count }
    const [userEventInterests, setUserEventInterests] = useState([]); // array of event IDs user is interested in

    const [userBadges, setUserBadges] = useState([]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // --- Data loading functions (via custom hook) ---
    const {
        loadUserProfile, loadArticles, loadEvents, loadPartners, loadTeamMembers,
        loadEventInterests, toggleEventInterest, loadUserBadges,
        loadLetters, loadPendingLetters, loadVideos, loadSavedVideos,
    } = useDataLoaders({
        user, setLoading, setArticles, setOtherEvents, setPartners, setStaffMembers,
        setEventInterests, setUserEventInterests, setUserBadges,
        setVideos, setSavedVideos, setLetters, setPendingLetters,
        setUserProfile, setShowAdmin, setShowTermsModal,
        setShowAuthModal, setAuthMode, userEventInterests,
    });

    // --- Auth handlers (via custom hook) ---
    const {
        handleSignup, handleAcceptTerms, handleRejectTerms,
        handleLogin, handleGoogleSignIn, handleLogout,
        handleDeleteAccount, updatePreferences,
    } = useAuthHandlers({
        t, language, user, pendingUser, setPendingUser,
        setShowTermsModal, setShowPreferences, loadUserProfile,
    });

    // --- CRUD handlers (via custom hook) ---
    const {
        editArticle, handleSubmitArticle, deleteArticle,
        editEvent, handleSubmitEvent, deleteEvent,
        editPartner, handleSubmitPartner, deletePartner,
        editMember, handleSubmitMember, deleteMember,
        toggleSaveVideo, openVideo, closeVideo, submitVideo, deleteVideo,
        fetchAnalytics,
    } = useCrudHandlers({
        t, user, userProfile,
        formData, setFormData,
        eventFormData, setEventFormData,
        partnerFormData, setPartnerFormData,
        memberFormData, setMemberFormData,
        videoFormData, setVideoFormData,
        editMode, setEditMode, editingItem, setEditingItem,
        editingDraftId, setEditingDraftId, setDrafts,
        setShowAddForm, setShowAddEventForm, setShowAddPartnerForm,
        setShowAddMemberForm, setShowAddVideoForm,
        loadArticles, loadEvents, loadPartners, loadTeamMembers, loadVideos,
        savedVideos, setSavedVideos,
        selectedVideo, setSelectedVideo, setShowVideoModal,
        setShowAuthModal, setAuthMode,
        setAnalyticsLoading, setAnalyticsData,
    });

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