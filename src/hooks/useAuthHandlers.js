import supabase from '../utils/supabase';
import { handleError, validateInput } from '../utils/helpers';

const useAuthHandlers = ({
    t,
    language,
    user,
    pendingUser,
    setPendingUser,
    setShowTermsModal,
    setShowPreferences,
    loadUserProfile,
}) => {
    const handleSignup = async (email, password, displayName) => {
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
                localStorage.setItem('rememberMe', 'true');
                setPendingUser(data.user);
                setShowTermsModal(true);
            }
            return { data, error };
        } catch (err) {
            return { error: { message: handleError(err, 'handleSignup') } };
        }
    };

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
            setShowPreferences(true);
        } catch (err) {
            console.error('Error accepting terms:', err);
        }
    };

    const handleRejectTerms = async () => {
        setShowTermsModal(false);
        setPendingUser(null);
        await supabase.auth.signOut();
        alert(language === 'sq'
            ? 'Duhet të pranoni kushtet për të përdorur RinON.'
            : 'You must accept the terms to use RinON.');
    };

    const handleLogin = async (email, password) => {
        try {
            const result = await supabase.auth.signInWithPassword({ email, password });
            if (!result.error) localStorage.setItem('rememberMe', 'true');
            return result;
        } catch (err) {
            return { error: { message: handleError(err, 'handleLogin') } };
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin,
                    queryParams: { access_type: 'offline', prompt: 'consent' }
                }
            });
            if (error) return { error };
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
            await supabase.from('user_profiles').delete().eq('id', user.id);
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

    return {
        handleSignup, handleAcceptTerms, handleRejectTerms,
        handleLogin, handleGoogleSignIn, handleLogout,
        handleDeleteAccount, updatePreferences,
    };
};

export default useAuthHandlers;
