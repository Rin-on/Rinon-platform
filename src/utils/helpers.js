import supabase from './supabase';
import DOMPurify from 'dompurify';

// ── Session ID for analytics ─────────────────────────────────────────────
export const getSessionId = () => {
    let sid = window.sessionStorage.getItem('rinon_session');
    if (!sid) {
        sid = crypto.randomUUID();
        window.sessionStorage.setItem('rinon_session', sid);
    }
    return sid;
};

// ── Analytics tracking ───────────────────────────────────────────────────
export const trackPageView = async (page, userId = null) => {
    try {
        await supabase.from('page_views').insert({
            page,
            referrer: document.referrer || null,
            user_agent: navigator.userAgent,
            session_id: getSessionId(),
            user_id: userId || null,
        });
    } catch (e) {}
};

export const trackArticleRead = async (articleId, userId = null) => {
    try {
        const { data } = await supabase.from('article_reads').insert({
            article_id: articleId,
            session_id: getSessionId(),
            user_id: userId || null,
        }).select('id').single();
        return data?.id;
    } catch (e) { return null; }
};

export const updateReadDuration = async (readId, durationSeconds, scrollDepth) => {
    if (!readId) return;
    try {
        await supabase.from('article_reads').update({
            read_duration_seconds: Math.round(durationSeconds),
            scroll_depth: Math.round(scrollDepth),
        }).eq('id', readId);
    } catch (e) {}
};

// ── Date formatting ──────────────────────────────────────────────────────
export const formatDateAl = (dateStr) => {
    if (!dateStr) return '';
    const months = ['Janar', 'Shkurt', 'Mars', 'Prill', 'Maj', 'Qershor', 'Korrik', 'Gusht', 'Shtator', 'Tetor', 'Nëntor', 'Dhjetor'];
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
};

// ── Category color mapping ───────────────────────────────────────────────
export const getCategoryColor = (category) => {
    const colors = {
        'Aktualitet': 'bg-red-500',
        'Arsim & Karrierë': 'bg-blue-500',
        'Kulturë': 'bg-purple-500',
        'Opinione': 'bg-teal-500',
        'Shoqëri': 'bg-green-500',
        'Rreth Europës': 'bg-indigo-500',
    };
    return colors[category] || 'bg-amber-500';
};

// ── Input validation ─────────────────────────────────────────────────────
export const validateInput = {
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
        if (!url) return true;
        try { new URL(url); return true; } catch { return false; }
    },
    sanitizeHtml: (dirty) => {
        if (!dirty) return '';
        return DOMPurify.sanitize(dirty, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
            ALLOWED_ATTR: []
        });
    }
};

export const validatePassword = (password) => {
    if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' };
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
        return { valid: false, message: 'Password must contain uppercase, lowercase, and numbers' };
    }
    return { valid: true };
};

export const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    return 'An error occurred. Please try again.';
};

// ── Image upload ─────────────────────────────────────────────────────────
export const uploadImage = async (file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage.from('images').upload(fileName, file);
        if (error) throw error;
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(fileName);
        return publicUrl;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};
