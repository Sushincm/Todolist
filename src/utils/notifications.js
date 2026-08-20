// Native Browser Web Notifications API Utility (100% Free)

export function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications.');
    return Promise.resolve('denied');
  }
  return Notification.requestPermission();
}

export function getNotificationPermission() {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export function sendNativeNotification(title, options = {}) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    const defaultOptions = {
      icon: '/pwa-192x192.png',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      ...options,
    };
    new Notification(title, defaultOptions);
  } catch (e) {
    console.error('Notification error:', e);
  }
}

export function notifyFocusComplete(taskTitle) {
  sendNativeNotification('🎯 Focus Sprint Finished!', {
    body: taskTitle ? `Great job on "${taskTitle}"! Time for a 5-minute break.` : 'Great job! Take a 5-minute break.',
    tag: 'focus-complete',
  });
}

export function notifyBreakComplete() {
  sendNativeNotification('☕ Break Finished!', {
    body: 'Time to get back into focus. Pick your next task!',
    tag: 'break-complete',
  });
}

export function notifyMorningFrog(frogTitle) {
  sendNativeNotification('🐸 Eat Your Frog Today!', {
    body: frogTitle ? `Your top focus today is: "${frogTitle}". Let's crush it!` : 'Pick your #1 top priority task today!',
    tag: 'morning-frog',
  });
}
