import React, { useState } from 'react';
import { X, Copy, Check, Instagram, Share2, Download } from 'lucide-react';

const ShareModal = ({ isOpen, onClose, item, type, language, darkMode, t }) => {
    const [captionCopied, setCaptionCopied] = useState(false);
    const [linkCopied, setLinkCopied] = useState(false);

    if (!isOpen || !item) return null;

    const isArticle = type === 'article';
    const title = language === 'al' ? item.titleAl : (item.titleEn || item.titleAl);
    const description = isArticle
        ? (language === 'al' ? item.contentAl : (item.contentEn || item.contentAl))
        : (language === 'al' ? item.descAl : (item.descEn || item.descAl));

    // Truncate description for caption
    const shortDesc = description ? description.substring(0, 150) + (description.length > 150 ? '...' : '') : '';

    // Generate hashtags based on category
    const getHashtags = () => {
        const baseHashtags = '#RinON #RiniaShqiptare #AlbanianYouth #Shqipëri';
        const categoryHashtags = {
            'Aktualitet': '#Aktualitet #News #Shqipëri',
            'Arsim & Karrierë': '#Arsim #Karrierë #Education #Youth',
            'Kulturë': '#Kulturë #Culture #Albania',
            'Opinione': '#Opinione #Opinion #Youth',
            'Shoqëri': '#Shoqëri #Society #Youth',
            'Rreth Europës': '#Europe #EU #EuropeExplained'
        };
        return `${baseHashtags} ${categoryHashtags[item.category] || '#Youth #Albania'}`;
    };

    // Generate share link
    const shareLink = `https://rinon.al/${isArticle ? 'article' : 'event'}/${item.id}`;

    // Generate full caption
    const fullCaption = `${title}\n\n${shortDesc}\n\n🔗 Lexo më shumë: ${shareLink}\n\n${getHashtags()}`;

    const copyCaption = async () => {
        try {
            await navigator.clipboard.writeText(fullCaption);
            setCaptionCopied(true);
            setTimeout(() => setCaptionCopied(false), 2000);
        } catch {
            // Fallback for older browsers - execCommand is deprecated but needed for fallback
            const textArea = document.createElement('textarea');
            textArea.value = fullCaption;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); } catch { /* ignore */ }
            document.body.removeChild(textArea);
            setCaptionCopied(true);
            setTimeout(() => setCaptionCopied(false), 2000);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        } catch {
            // Fallback for older browsers - execCommand is deprecated but needed for fallback
            const textArea = document.createElement('textarea');
            textArea.value = shareLink;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try { document.execCommand('copy'); } catch { /* ignore */ }
            document.body.removeChild(textArea);
            setLinkCopied(true);
            setTimeout(() => setLinkCopied(false), 2000);
        }
    };

    const handleImageDownload = async () => {
        const imageUrl = item.image;

        // Check if it's a Supabase storage URL (your domain)
        const isSupabaseImage = imageUrl && imageUrl.includes('hslwkxwarflnvjfytsul.supabase.co');

        if (isSupabaseImage) {
            // Direct download for Supabase images
            try {
                const response = await fetch(imageUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rinon-${type}-${item.id}.jpg`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            } catch (err) {
                // Fallback: open in new tab
                window.open(imageUrl, '_blank');
            }
        } else {
            // For external URLs, open in new tab
            window.open(imageUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className={`rounded-3xl max-w-lg w-full shadow-2xl border overflow-hidden ${darkMode ? 'bg-[#2D2A26] border-amber-500/30' : 'bg-white border-amber-200'
                }`}>
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                            <Instagram className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-white">
                                {t('Shpërndaj në Instagram', 'Share to Instagram')}
                            </h3>
                            <p className="text-white/70 text-sm">
                                {isArticle ? t('Artikull', 'Article') : t('Event', 'Event')}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full transition-all"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Image Preview */}
                <div className="relative">
                    <img
                        src={item.image}
                        alt={title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800';
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${isArticle ? 'bg-amber-500' : 'bg-[#FF6B6B]'
                            }`}>
                            {item.category || item.type || 'RinON'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                    {/* Caption Preview */}
                    <div>
                        <label className={`text-sm font-semibold mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            {t('Caption për Instagram:', 'Instagram Caption:')}
                        </label>
                        <div className={`p-3 rounded-xl text-sm max-h-32 overflow-y-auto ${darkMode ? 'bg-[#3D3A36]/50 text-gray-300' : 'bg-gray-100 text-gray-700'
                            }`}>
                            <p className="whitespace-pre-wrap">{fullCaption}</p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={copyCaption}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${captionCopied
                                ? 'bg-green-600 text-white'
                                : 'bg-gradient-to-r from-amber-400 via-orange-500 to-[#FF6B6B] text-white hover:from-amber-500 hover:to-[#FF5252]'
                                }`}
                        >
                            {captionCopied ? (
                                <>
                                    <Check className="w-4 h-4" />
                                    {t('U kopjua!', 'Copied!')}
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4" />
                                    {t('Kopjo Caption', 'Copy Caption')}
                                </>
                            )}
                        </button>

                        <button
                            onClick={handleImageDownload}
                            className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${darkMode
                                ? 'bg-[#3D3A36] text-white hover:bg-[#4D4A46] border border-amber-500/30'
                                : 'bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300'
                                }`}
                        >
                            <Download className="w-4 h-4" />
                            {t('Shkarko Foto', 'Download Image')}
                        </button>
                    </div>

                    {/* Link Section */}
                    <div className={`flex items-center gap-2 p-3 rounded-xl ${darkMode ? 'bg-[#3D3A36]/50' : 'bg-gray-100'
                        }`}>
                        <input
                            type="text"
                            value={shareLink}
                            readOnly
                            className={`flex-1 bg-transparent text-sm outline-none ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                }`}
                        />
                        <button
                            onClick={copyLink}
                            className={`p-2 rounded-lg transition-all ${linkCopied
                                ? 'bg-green-600 text-white'
                                : 'bg-amber-500 text-white hover:bg-[#FFE5D9]0'
                                }`}
                        >
                            {linkCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                    </div>

                    {/* Instructions */}
                    <div className={`text-xs space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p className="font-semibold">{t('Si të postosh:', 'How to post:')}</p>
                        <p>1. {t('Shkarko foton ose ruaje nga tab-i i ri', 'Download the image or save from new tab')}</p>
                        <p>2. {t('Kopjo caption-in', 'Copy the caption')}</p>
                        <p>3. {t('Hap Instagram dhe krijo post të ri', 'Open Instagram and create new post')}</p>
                        <p>4. {t('Ngjit caption-in dhe posto!', 'Paste the caption and post!')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Terms and Privacy Policy Modal Component

export default ShareModal;
