import supabase from '../utils/supabase';
import { handleError, validateInput, uploadImage } from '../utils/helpers';

const useCrudHandlers = ({
    t,
    user,
    userProfile,
    // Form state
    formData, setFormData,
    eventFormData, setEventFormData,
    partnerFormData, setPartnerFormData,
    memberFormData, setMemberFormData,
    videoFormData, setVideoFormData,
    // Edit state
    editMode, setEditMode,
    editingItem, setEditingItem,
    editingDraftId, setEditingDraftId,
    setDrafts,
    // Form visibility
    setShowAddForm, setShowAddEventForm, setShowAddPartnerForm,
    setShowAddMemberForm, setShowAddVideoForm,
    // Data loaders
    loadArticles, loadEvents, loadPartners, loadTeamMembers, loadVideos,
    // Video state
    savedVideos, setSavedVideos,
    selectedVideo, setSelectedVideo, setShowVideoModal,
    // Auth modal
    setShowAuthModal, setAuthMode,
    // Analytics
    setAnalyticsLoading, setAnalyticsData,
}) => {
    // ---- Article handlers ----
    const editArticle = (article) => {
        setEditingItem(article);
        setEditMode(true);
        setFormData({
            titleAl: article.titleAl, titleEn: article.titleEn,
            contentAl: article.contentAl, contentEn: article.contentEn,
            category: article.category, image: article.image, imageFile: null,
            source: article.source, author: article.author || '',
            featured: article.featured, isHeadArticle: article.is_head_article || false,
            postType: article.postType || 'lajme', showOnHomepage: article.showOnHomepage || false
        });
        setShowAddForm(true);
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
        try {
            let imageUrl = formData.image;
            if (formData.imageFile) imageUrl = await uploadImage(formData.imageFile);
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
                data = [{ id: editingItem.id }];
            } else {
                ({ data, error } = await supabase.from('articles').insert([article]).select('id'));
            }
            if (error) throw error;
            const savedArticleId = data?.[0]?.id;
            if (savedArticleId) setEditingItem({ ...editingItem, id: savedArticleId });
            if (editingDraftId) {
                setDrafts(prev => {
                    const updated = prev.filter(d => d.id !== editingDraftId);
                    localStorage.setItem('rinon_drafts', JSON.stringify(updated));
                    return updated;
                });
                setEditingDraftId(null);
            }
            loadArticles();
            setFormData({ titleAl: '', titleEn: '', contentAl: '', contentEn: '', category: 'Arsim', image: '', imageFile: null, source: '', author: '', featured: false, postType: 'lajme', showOnHomepage: false, isHeadArticle: false });
            setShowAddForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Artikulli u përditësua me sukses!' : 'Artikulli u publikua me sukses!', editMode ? 'Article updated successfully!' : 'Article published successfully!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitArticle'));
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

    // ---- Event handlers ----
    const editEvent = (event) => {
        setEditingItem(event);
        setEditMode(true);
        setEventFormData({
            titleAl: event.titleAl, titleEn: event.titleEn,
            dateAl: event.dateAl, dateEn: event.dateEn, type: event.type,
            descAl: event.descAl, descEn: event.descEn, location: event.location,
            image: event.image, imageFile: null, date: event.date || '',
            time: event.time || '', endTime: event.endTime || '', address: event.address || '',
            category: event.category || 'general', spotsLeft: event.spots_left || 100,
            totalSpots: event.total_spots || 100, isFree: event.is_free !== false,
            price: event.price || '', registrationLink: event.registration_link || '',
            isFeatured: event.is_featured || false, tags: event.tags || [],
            showOnHomepage: event.showOnHomepage || false
        });
        setShowAddEventForm(true);
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
            if (eventFormData.imageFile) imageUrl = await uploadImage(eventFormData.imageFile);
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
                date: eventFormData.date || null, time: eventFormData.time || null,
                end_time: eventFormData.endTime || null,
                address: validateInput.sanitizeHtml(eventFormData.address || ''),
                category: eventFormData.category || 'general',
                spots_left: parseInt(eventFormData.spotsLeft) || 100,
                total_spots: parseInt(eventFormData.totalSpots) || 100,
                is_free: eventFormData.isFree !== false, price: eventFormData.price || null,
                partner: validateInput.sanitizeHtml(eventFormData.partner || ''),
                registration_link: eventFormData.registrationLink || null,
                is_featured: eventFormData.isFeatured || false,
                show_on_homepage: eventFormData.showOnHomepage || false,
                tags: eventFormData.tags || []
            };
            let error, data;
            if (editMode && editingItem && editingItem.id) {
                ({ error } = await supabase.from('events').update(eventData).eq('id', editingItem.id));
                if (!error) data = [{ id: editingItem.id }];
            } else {
                eventData.attendees = 0;
                eventData.is_trending = false;
                ({ data, error } = await supabase.from('events').insert([eventData]).select('id'));
            }
            if (error) throw error;
            const savedEventId = data?.[0]?.id;
            if (savedEventId) setEditingItem({ ...editingItem, id: savedEventId });
            loadEvents();
            setEventFormData({ titleAl: '', titleEn: '', dateAl: '', dateEn: '', type: '', descAl: '', descEn: '', location: '', image: '', imageFile: null, date: '', time: '', endTime: '', address: '', category: 'general', spotsLeft: 100, totalSpots: 100, isFree: true, price: '', registrationLink: '', isFeatured: false, tags: [], showOnHomepage: false });
            setShowAddEventForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Eventi u përditësua me sukses!' : 'Eventi u shtua me sukses!', editMode ? 'Event updated successfully!' : 'Event added successfully!'));
        } catch (err) {
            console.error('Event submit error:', err);
            alert(handleError(err, 'handleSubmitEvent'));
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

    // ---- Partner handlers ----
    const editPartner = (partner) => {
        setEditingItem(partner);
        setEditMode(true);
        setPartnerFormData({
            nameAl: partner.nameAl, nameEn: partner.nameEn,
            descriptionAl: partner.descriptionAl, descriptionEn: partner.descriptionEn,
            visionAl: partner.visionAl, visionEn: partner.visionEn,
            goalsAl: partner.goalsAl, goalsEn: partner.goalsEn,
            website: partner.website, image: partner.image, imageFile: null
        });
        setShowAddPartnerForm(true);
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
            if (partnerFormData.imageFile) imageUrl = await uploadImage(partnerFormData.imageFile);
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
            setPartnerFormData({ nameAl: '', nameEn: '', descriptionAl: '', descriptionEn: '', visionAl: '', visionEn: '', goalsAl: '', goalsEn: '', website: '', image: '', imageFile: null });
            setShowAddPartnerForm(false);
            setEditMode(false);
            setEditingItem(null);
            alert(t(editMode ? 'Partneri u përditësua me sukses!' : 'Partneri u shtua me sukses!', editMode ? 'Partner updated successfully!' : 'Partner added successfully!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitPartner'));
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

    // ---- Member handlers ----
    const editMember = (member) => {
        setEditingItem(member);
        setEditMode(true);
        setMemberFormData({ name: member.name, role: member.role });
        setShowAddMemberForm(true);
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
            alert(t(editMode ? 'Anëtari u përditësua me sukses!' : 'Anëtari u shtua me sukses!', editMode ? 'Member updated successfully!' : 'Member added successfully!'));
        } catch (err) {
            alert(handleError(err, 'handleSubmitMember'));
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

    // ---- Video handlers ----
    const toggleSaveVideo = async (videoId) => {
        if (!user) {
            setShowAuthModal(true);
            setAuthMode('login');
            return;
        }
        const isSaved = savedVideos.includes(videoId);
        try {
            if (isSaved) {
                await supabase.from('video_saves').delete().eq('video_id', videoId).eq('user_id', user.id);
                setSavedVideos(prev => prev.filter(id => id !== videoId));
            } else {
                await supabase.from('video_saves').insert({ video_id: videoId, user_id: user.id });
                setSavedVideos(prev => [...prev, videoId]);
            }
        } catch (err) {
            console.error(handleError(err, 'toggleSaveVideo'));
        }
    };

    const incrementVideoViews = async (videoId) => {
        try {
            const { data } = await supabase.from('videos').select('view_count').eq('id', videoId).single();
            await supabase.from('videos').update({ view_count: (data?.view_count || 0) + 1 }).eq('id', videoId);
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
            setVideoFormData({ titleAl: '', titleEn: '', descriptionAl: '', descriptionEn: '', youtubeId: '', thumbnail: '', category: 'podcast', duration: '', isRinONOriginal: true, isFeatured: false });
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
            if (selectedVideo?.id === videoId) closeVideo();
        } catch (err) {
            console.error(handleError(err, 'deleteVideo'));
        }
    };

    // ---- Analytics ----
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

    return {
        editArticle, handleSubmitArticle, deleteArticle,
        editEvent, handleSubmitEvent, deleteEvent,
        editPartner, handleSubmitPartner, deletePartner,
        editMember, handleSubmitMember, deleteMember,
        toggleSaveVideo, openVideo, closeVideo, submitVideo, deleteVideo,
        fetchAnalytics,
    };
};

export default useCrudHandlers;
