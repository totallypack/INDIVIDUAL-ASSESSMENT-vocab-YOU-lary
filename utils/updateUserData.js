import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const updateUserData = (user) => {
  // Save basic user profile data
  const userRef = firebase.database().ref(`users/${user.uid}`);
  userRef.set({
    uid: user.uid,
    name: user.displayName || 'User',
    email: user.email,
    lastLogin: Date.now()
  });

  // Create email-to-uid mapping for lookup
  const emailEncoded = btoa(user.email); // Base64 encode to handle special characters
  const emailMapRef = firebase.database().ref(`emailToUid/${emailEncoded}`);
  emailMapRef.set(user.uid);
};

export default updateUserData;
