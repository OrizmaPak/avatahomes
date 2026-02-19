// push.js

(async function initPollingNotifications() {
    // 1. Bail out if Notifications API isn’t supported
    if (!('Notification' in window)) {
      console.warn('This browser does not support Notifications');
      return;
    }
  
    // 2. Ask for permission if it’s not already granted/denied
    let permission = Notification.permission;
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }
  
    // 3. If granted, kick off polling
    if (permission === 'granted') {
      startPolling();
      // Dummy push to test the notification
      showNotification('Test Notification', 'This is a test notification.', './index.php');
    } else {
      console.warn('Notifications permission not granted:', permission);
    } 
  })();
  
  function startPolling() {
    // Immediately check once…
    pollForNotifications();
    // …then every 30 seconds 
    setInterval(pollForNotifications, 30000);
  }
  
  async function pollForNotifications() {
    try {
      const res = await fetch('../controllers/notifyduerents.php', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const notifications = await res.json(); // expect an array
  
      notifications.forEach(({ title, body, url }) => {
        showNotification(title, body, url);
      });
    } catch (err) {
      console.error('Polling failed:', err);
    }
  }
  
  function showNotification(title, body, url) {
    const options = {
      body,
      icon: './images/icon.png',
      data: { url }
    };
  
    // Use Service Worker if registered, otherwise fallback
    navigator.serviceWorker.getRegistration()
      .then(reg => {
        if (reg) {
          reg.showNotification(title, options);
        } else {
          // fallback to simple Notification
          new Notification(title, options);
        }
      });
  }
  
  // Handle click on the notification to focus/open the URL
  self.addEventListener
    ? self.addEventListener('notificationclick', event => {
        event.notification.close();
        const target = event.notification.data.url || './index.php';
        event.waitUntil(clients.openWindow(target));
      })
    : null; 
