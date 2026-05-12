import supabase from '../utils/supabase';
import { handleError } from '../utils/helpers';

const useDataLoaders = ({
    user,
    setLoading,
    setArticles,
    setOtherEvents,
    setPartners,
    setStaffMembers,
    setEventInterests,
    setUserEventInterests,
    setUserEventInterestsRef,
    setUserBadges,
    setVideos,
    setSavedVideos,
    setLetters,
    setPendingLetters,
    setUserProfile,
    setShowAdmin,
    setShowTermsModal,
    setShowAuthModal,
    setAuthMode,
    userEventInterests,
}) => {
    const loadUserProfile = async (userId) => {
        try {
            const { data, error } = await supabase.from('user_profiles').select('*').eq('id', userId).single();
            if (error) throw error;
            if (data) {
                setUserProfile(data);
                if (data.is_admin) setShowAdmin(true);
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
                setArticles(data.map(a => ({
                    id: a.id, titleAl: a.title_al, titleEn: a.title_en,
                    contentAl: a.content_al, contentEn: a.content_en,
                    category: a.category, image: a.image, source: a.source,
                    author: a.author || '',
                    featured: a.featured, postType: a.post_type || 'lajme',
                    showOnHomepage: a.show_on_homepage || false,
                    is_head_article: a.is_head_article || false,
                    date: new Date(a.created_at).toISOString().split('T')[0]
                })));
            }
        } catch (err) {
            console.error(handleError(err, 'loadArticles'));
        } finally {
            setLoading(false);
        }
    };

    const loadEvents = async () => {
        try {
            const { data, error } = await supabase.from('events').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            if (data && data.length > 0) {
                setOtherEvents(data.map(e => ({
                    id: e.id, titleAl: e.title_al, titleEn: e.title_en,
                    dateAl: e.date_al, dateEn: e.date_en, type: e.type,
                    descAl: e.desc_al, descEn: e.desc_en, location: e.location, image: e.image,
                    date: e.date, time: e.time, endTime: e.end_time, address: e.address,
                    category: e.category, spots_left: e.spots_left, total_spots: e.total_spots,
                    is_free: e.is_free, price: e.price, attendees: e.attendees,
                    partner: e.partner, registration_link: e.registration_link,
                    is_featured: e.is_featured, is_trending: e.is_trending, tags: e.tags,
                    showOnHomepage: e.show_on_homepage || false
                })));
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
                setPartners(data.map(p => ({
                    id: p.id, nameAl: p.name_al, nameEn: p.name_en,
                    descriptionAl: p.description_al, descriptionEn: p.description_en,
                    visionAl: p.vision_al, visionEn: p.vision_en,
                    goalsAl: p.goals_al, goalsEn: p.goals_en,
                    website: p.website, image: p.image
                })));
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

    const loadEventInterests = async () => {
        try {
            const { data, error } = await supabase.from('event_interests').select('event_id');
            if (error) throw error;
            const counts = {};
            data?.forEach(item => { counts[item.event_id] = (counts[item.event_id] || 0) + 1; });
            setEventInterests(counts);
            if (user) {
                const { data: userInterests } = await supabase
                    .from('event_interests').select('event_id').eq('user_id', user.id);
                setUserEventInterests(userInterests?.map(i => i.event_id) || []);
            }
        } catch (err) {
            console.error(handleError(err, 'loadEventInterests'));
        }
    };

    const toggleEventInterest = async (eventId) => {
        if (!user) {
            setShowAuthModal(true);
            setAuthMode('login');
            return;
        }
        const isInterested = userEventInterests.includes(eventId);
        try {
            if (isInterested) {
                await supabase.from('event_interests').delete().eq('event_id', eventId).eq('user_id', user.id);
                setUserEventInterests(prev => prev.filter(id => id !== eventId));
                setEventInterests(prev => ({ ...prev, [eventId]: Math.max((prev[eventId] || 1) - 1, 0) }));
            } else {
                await supabase.from('event_interests').insert({ event_id: eventId, user_id: user.id });
                setUserEventInterests(prev => [...prev, eventId]);
                setEventInterests(prev => ({ ...prev, [eventId]: (prev[eventId] || 0) + 1 }));
            }
        } catch (err) {
            console.error(handleError(err, 'toggleEventInterest'));
        }
    };

    const loadUserBadges = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase.from('user_badges').select('badge_type, earned_at').eq('user_id', user.id);
            if (error) throw error;
            setUserBadges(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadUserBadges'));
        }
    };

    const loadLetters = async () => {
        try {
            const { data, error } = await supabase.from('letters').select('*').eq('is_approved', true).order('submitted_at', { ascending: false });
            if (error) throw error;
            setLetters(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadLetters'));
        }
    };

    const loadPendingLetters = async () => {
        try {
            const { data, error } = await supabase.from('letters').select('*').eq('is_approved', false).order('submitted_at', { ascending: false });
            if (error) throw error;
            setPendingLetters(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadPendingLetters'));
        }
    };

    const loadVideos = async () => {
        try {
            const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            setVideos(data || []);
        } catch (err) {
            console.error(handleError(err, 'loadVideos'));
        }
    };

    const loadSavedVideos = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase.from('video_saves').select('video_id').eq('user_id', user.id);
            if (error) throw error;
            setSavedVideos(data?.map(v => v.video_id) || []);
        } catch (err) {
            console.error(handleError(err, 'loadSavedVideos'));
        }
    };

    return {
        loadUserProfile, loadArticles, loadEvents, loadPartners, loadTeamMembers,
        loadEventInterests, toggleEventInterest, loadUserBadges,
        loadLetters, loadPendingLetters, loadVideos, loadSavedVideos,
    };
};

export default useDataLoaders;
