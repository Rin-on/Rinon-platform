// Firebase Messaging Service Worker for RinON
// This file MUST be in the public folder at the root level

importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyBQWErh4Kg0YPUniX3EfGjYBMl99n6LWN8",
    authDomain: "rinon-notifications.firebaseapp.com",
    projectId: "rinon-notifications",
    storageBucket: "rinon-notifications.firebasestorage.app",
    messagingSenderId: "1048258783490",
    appId: "1:1048258783490:web:88da7361ad7b7d931a7a1b"
});

const messaging = firebase.messaging();

// Handle background messages (when the app is not in focus)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'RinON';
    const notificationOptions = {
        body: payload.notification?.body || 'Ke një njoftim të ri!',
        icon: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/rinonrinon.png',
        badge: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/rinonrinon.png',
        tag: payload.data?.type || 'rinon-notification',
        data: {
            url: payload.data?.url || 'https://rinon.al',
            type: payload.data?.type || 'general'
        },
        // Vibration pattern for mobile
        vibrate: [100, 50, 100],
        // Actions the user can take
        actions: [
            {
                action: 'open',
                title: 'Shiko',
                icon: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/rinonrinon.png'
            },
            {
                action: 'close',
                title: 'Mbyll'
            }
        ]
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Notification click:', event);

    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    // Get the URL from the notification data
    const urlToOpen = event.notification.data?.url || 'https://rinon.al';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If a window is already open, focus it
            for (const client of clientList) {
                if (client.url.includes('rinon.al') && 'focus' in client) {
                    client.focus();
                    client.navigate(urlToOpen);
                    return;
                }
            }
            // Otherwise, open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
