/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// firebase-messaging-sw.js
// Place this file in your /public folder

// Import Firebase scripts using importScripts (this works in service workers)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// ============================================
// CRITICAL: This config MUST match your App.js
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

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('=== BACKGROUND MESSAGE RECEIVED ===');
    console.log('Payload:', JSON.stringify(payload, null, 2));

    const notificationTitle = payload.notification?.title || 'RinON';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/bigiii.png',
        badge: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/bigiii.png',
        // Store URL data for click handling
        data: {
            url: payload.data?.url,
            type: payload.data?.type
        },
        // Use unique tag to PREVENT duplicate notifications
        tag: `rinon-${payload.data?.url || Date.now()}`,
        requireInteraction: false,
        vibrate: [200, 100, 200],
        // Don't re-notify if same tag exists
        renotify: false
    };

    console.log('Notification options:', JSON.stringify(notificationOptions, null, 2));
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click when app is in background or closed
self.addEventListener('notificationclick', (event) => {
    console.log('=== NOTIFICATION CLICKED ===');
    console.log('Notification data:', event.notification.data);

    event.notification.close();

    // Get URL from notification data
    const urlData = event.notification.data?.url;
    console.log('URL data:', urlData);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            console.log('Found clients:', clientList.length);

            let targetUrl = '/';

            if (urlData) {
                // Parse format: "article:uuid" or "event:uuid"
                const parts = urlData.split(':');
                if (parts.length >= 2) {
                    const type = parts[0];
                    // Join remaining parts in case UUID has colons
                    const id = parts.slice(1).join(':');

                    console.log('Type:', type, 'ID:', id);

                    if (type === 'article') {
                        targetUrl = `/?openArticle=${id}`;
                    } else if (type === 'event') {
                        targetUrl = `/?openEvent=${id}`;
                    }
                }
            }

            console.log('Target URL:', targetUrl);

            // Try to find and focus existing window
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    console.log('Focusing existing window');
                    return client.focus().then(() => {
                        // Send message to app
                        client.postMessage({
                            type: 'NOTIFICATION_CLICK',
                            url: urlData
                        });
                        return client.navigate(targetUrl);
                    });
                }
            }

            // No existing window - open new one
            console.log('Opening new window:', targetUrl);
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
