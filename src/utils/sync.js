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
  activeUserId = userId;
  return getUserDataFromFirebase(userId);
}

/**
 * Push local state to logged-in Google user room in Firebase
 */
export async function pushUserSyncData(param1, param2) {
  let uid = activeUserId;
  let data = param1;

  if (typeof param1 === 'string') {
    uid = param1;
    data = param2;
  } else if (param1?.userId) {
    uid = param1.userId;
  }

  if (!uid) {
    console.warn('pushUserSyncData aborted: activeUserId is null');
    return false;
  }

  return pushUserDataToFirebase(uid, data);
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
