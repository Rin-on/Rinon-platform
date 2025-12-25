/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// firebase-messaging-sw.js
// Place this file in your /public folder

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ============================================
// MUST MATCH YOUR App.js Firebase config!
// ============================================
firebase.initializeApp({
    apiKey: "AIzaSyBQWErh4Kg0YPUniX3EfGjYBMl99n6LWN8",
    authDomain: "rinon-notifications.firebaseapp.com",
    projectId: "rinon-notifications",
    storageBucket: "rinon-notifications.firebasestorage.app",
    messagingSenderId: "1048258783490",
    appId: "1:1048258783490:web:88da7361ad7b7d931a7a1b"
});

const messaging = firebase.messaging();

// Handle background messages (when app is NOT focused)
messaging.onBackgroundMessage((payload) => {
    console.log('=== SW: Background message ===', payload);

    // Get data from the payload
    // FCM sends data in different places depending on message type
    const data = payload.data || {};
    const notification = payload.notification || {};

    const title = data.title || notification.title || 'RinON';
    const body = data.body || notification.body || '';
    const url = data.url || '';
    const tag = data.tag || `rinon-${url || Date.now()}`;

    const options = {
        body: body,
        icon: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/bigiii.png',
        badge: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/bigiii.png',
        tag: tag, // Prevents duplicates
        renotify: false,
        requireInteraction: false,
        data: {
            url: url,
            click_url: data.click_url || ''
        }
    };

    console.log('Showing notification:', title, options);
    return self.registration.showNotification(title, options);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('=== SW: Notification clicked ===');
    console.log('Data:', event.notification.data);

    event.notification.close();

    const data = event.notification.data || {};
    const url = data.url || '';
    const clickUrl = data.click_url || '';

    // Determine target URL
    let targetUrl = '/';

    if (clickUrl) {
        // Use pre-built click URL from server, but clean it
        targetUrl = clickUrl.replace(/["']/g, '');
    } else if (url) {
        // Build URL from article/event format
        const cleanUrl = url.replace(/["']/g, ''); // Remove any quotes
        const parts = cleanUrl.split(':');
        if (parts.length >= 2) {
            const type = parts[0];
            const id = parts.slice(1).join(':').replace(/["']/g, ''); // Clean the ID

            if (type === 'article') {
                targetUrl = `/?openArticle=${id}`;
            } else if (type === 'event') {
                targetUrl = `/?openEvent=${id}`;
            }
        }
    }

    console.log('Opening URL:', targetUrl);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // Try to focus existing window
                for (const client of clientList) {
                    if (client.url.includes(self.location.origin) && 'focus' in client) {
                        return client.focus().then(() => client.navigate(targetUrl));
                    }
                }
                // Open new window
                if (clients.openWindow) {
                    return clients.openWindow(targetUrl);
                }
            })
    );
});

// Log when service worker activates
self.addEventListener('activate', (event) => {
    console.log('=== SW: Activated ===');
});

self.addEventListener('install', (event) => {
    console.log('=== SW: Installed ===');
    self.skipWaiting(); // Activate immediately
});
