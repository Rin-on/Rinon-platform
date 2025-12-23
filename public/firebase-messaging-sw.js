/* eslint-disable no-undef */
/* eslint-disable no-restricted-globals */
// firebase-messaging-sw.js
// Place this file in your /public folder

// Import Firebase scripts using importScripts (this works in service workers)
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Initialize Firebase in the service worker
firebase.initializeApp({
    apiKey: "AIzaSyDSQqZ4n81rLgPLPH5HZu5eN87dxkz5tr8",
    authDomain: "rinon-39c00.firebaseapp.com",
    projectId: "rinon-39c00",
    storageBucket: "rinon-39c00.firebasestorage.app",
    messagingSenderId: "815467562361",
    appId: "1:815467562361:web:a0ea41b62f8df5b0cc8ac5",
    measurementId: "G-9YB1S91QFP"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Background message received:', payload);

    const notificationTitle = payload.notification?.title || 'RinON';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/bigiii.png',
        badge: 'https://hslwkxwarflnvjfytsul.supabase.co/storage/v1/object/public/image/bigiii.png',
        data: payload.data,
        requireInteraction: false,
        vibrate: [200, 100, 200]
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click when app is in background or closed
self.addEventListener('notificationclick', (event) => {
    console.log('=== SERVICE WORKER: Notification clicked ===');
    console.log('Event:', event);
    console.log('Notification data:', event.notification.data);
    console.log('Notification tag:', event.notification.tag);

    event.notification.close();

    // Try multiple ways to get the URL data
    const urlData = event.notification.data?.url || event.notification.data;
    console.log('URL data extracted:', urlData);

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            console.log('Clients found:', clientList.length);

            let targetUrl = '/';

            if (urlData) {
                console.log('Processing URL data:', urlData);

                // Handle if urlData is a string with format "article:id"
                if (typeof urlData === 'string' && urlData.includes(':')) {
                    const parts = urlData.split(':');
                    const type = parts[0];
                    const id = parts[1];

                    console.log('Parsed - type:', type, 'id:', id);

                    if (type === 'article') {
                        targetUrl = `/?openArticle=${id}`;
                    } else if (type === 'event') {
                        targetUrl = `/?openEvent=${id}`;
                    }
                }
                // Handle if urlData is an object with url property
                else if (typeof urlData === 'object' && urlData.url) {
                    const parts = urlData.url.split(':');
                    const type = parts[0];
                    const id = parts[1];

                    console.log('Parsed from object - type:', type, 'id:', id);

                    if (type === 'article') {
                        targetUrl = `/?openArticle=${id}`;
                    } else if (type === 'event') {
                        targetUrl = `/?openEvent=${id}`;
                    }
                }
            }

            console.log('Target URL:', targetUrl);

            // Try to focus existing window
            for (let i = 0; i < clientList.length; i++) {
                const client = clientList[i];
                console.log('Checking client:', client.url);
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    console.log('Focusing existing window and sending message');
                    client.focus();
                    client.postMessage({
                        type: 'NOTIFICATION_CLICK',
                        url: urlData
                    });
                    return client.navigate(targetUrl);
                }
            }

            // Open new window if no existing window found
            console.log('Opening new window with URL:', targetUrl);
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );

    console.log('=== SERVICE WORKER: Handler complete ===');
});
