// Firebase Google Account Sync Manager

import { pushUserDataToFirebase, subscribeToUserRoom, getUserDataFromFirebase } from '../firebase';

let activeUserId = null;
let unsubscribeListener = null;

export function setActiveUser(userId) {
  activeUserId = userId;
  if (!userId && unsubscribeListener) {
    unsubscribeListener();
    unsubscribeListener = null;
  }
}

export function getActiveUserId() {
  return activeUserId;
}

/**
 * Fetch cloud data once upon login for immediate cross-device population
 */
export async function fetchUserCloudData(userId) {
  if (!userId) return null;
  return getUserDataFromFirebase(userId);
}

/**
 * Push local state to logged-in Google user room in Firebase
 */
export async function pushUserSyncData(data) {
  if (!activeUserId) return false;
  return pushUserDataToFirebase(activeUserId, data);
}

/**
 * Subscribe to Google Account real-time updates
 */
export function startGoogleRealtimeSync(userId, onDataReceived) {
  if (!userId) return;
  activeUserId = userId;

  if (unsubscribeListener) {
    unsubscribeListener();
  }

  unsubscribeListener = subscribeToUserRoom(userId, (remoteData) => {
    if (remoteData) {
      onDataReceived(remoteData);
    }
  });
}

export function stopGoogleSync() {
  if (unsubscribeListener) {
    unsubscribeListener();
    unsubscribeListener = null;
  }
  activeUserId = null;
}
