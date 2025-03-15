import firebase from 'firebase/app';
import 'firebase/database';
import client from '../utils/client';

// Get all friends for a user
const getFriends = (uid) => new Promise((resolve, reject) => {
  firebase.database().ref(`friendships/${uid}`)
    .once('value')
    .then((snapshot) => {
      const friendshipsData = snapshot.val();

      if (friendshipsData) {
        // Transform the data to include the Firebase key
        const friendships = Object.keys(friendshipsData).map((key) => {
          const friendship = {
            firebaseKey: key,
            ...friendshipsData[key]
          };
          return friendship;
        });

        resolve(friendships);
      } else {
        // No friendships found
        resolve([]);
      }
    })
    .catch((error) => {
      console.error('Error retrieving friends:', error);
      reject(error);
    });
});

// Send a friend request
const sendFriendRequest = (senderUid, recipientUid) => new Promise((resolve, reject) => {
  // Fetch sender's user data first
  firebase.database().ref(`users/${senderUid}`).once('value')
    .then(async (senderSnapshot) => {
      const senderUserData = senderSnapshot.val();

      // Then fetch recipient's user data
      const recipientSnapshot = await firebase.database().ref(`users/${recipientUid}`).once('value');
      const recipientUserData = recipientSnapshot.val();
      const timestamp = Date.now();
      const senderKey = firebase.database().ref().child('friendships').push().key;
      const recipientKey = firebase.database().ref().child('friendships').push().key;

      // Create friendship data objects
      const senderData = {
        uid: recipientUid,
        status: 'outgoing',
        timestamp,
        friendshipKey: recipientKey,
        name: recipientUserData.name,
        email: recipientUserData.email
      };

      const recipientData = {
        uid: senderUid,
        status: 'pending',
        timestamp,
        friendshipKey: senderKey,
        name: senderUserData.name,
        email: senderUserData.email
      };

      // Create entries for both users
      const updates = {};
      // Set up the updates object
      updates[`friendships/${senderUid}/${senderKey}`] = senderData;
      updates[`friendships/${recipientUid}/${recipientKey}`] = recipientData;

      // Perform the database update
      return firebase.database().ref().update(updates);
    })
    .then(() => resolve())
    .catch(reject);
});

// Accept a friend request
const acceptFriendRequest = (currentUserId, friendshipKey, senderUid) => new Promise((resolve, reject) => {
  // Reference to the current user's friendship entry
  const currentUserRef = firebase.database().ref(`friendships/${currentUserId}/${friendshipKey}`);

  // First, get the current friendship entry to confirm details
  currentUserRef.once('value')
    .then((snapshot) => {
      const friendshipData = snapshot.val();

      // Detailed validation
      if (!friendshipData) {
        console.error('No friendship data found', {
          path: `friendships/${currentUserId}/${friendshipKey}`,
          currentUserId,
          friendshipKey
        });
        throw new Error('No friendship data found');
      }

      // Find and update the corresponding entry in the sender's friendships
      return firebase.database().ref(`friendships/${senderUid}`)
        .orderByChild('uid')
        .equalTo(currentUserId)
        .once('value')
        .then((senderSnapshot) => {
          // Find the key of the sender's corresponding friendship entry
          const senderFriendshipEntries = senderSnapshot.val();

          if (!senderFriendshipEntries) {
            console.error('No corresponding sender friendship entry found', {
              senderUid,
              currentUserId
            });
            throw new Error('Corresponding sender friendship entry not found');
          }

          // Get the key of the sender's friendship entry
          const senderFriendshipKeys = Object.keys(senderFriendshipEntries);

          const senderFriendshipKey = senderFriendshipKeys[0];

          // Prepare the updates for both users
          const updates = {};
          updates[`friendships/${currentUserId}/${friendshipKey}/status`] = 'accepted';
          updates[`friendships/${senderUid}/${senderFriendshipKey}/status`] = 'accepted';

          // Perform the updates
          return firebase.database().ref().update(updates);
        });
    })
    .then(() => {
      resolve();
    })
    .catch((error) => {
      console.error('Error accepting friend request:', error);
      console.error('Error details:', {
        currentUserId,
        friendshipKey,
        senderUid,
        errorMessage: error.message
      });
      reject(error);
    });
});

// Remove a friend
const removeFriend = (uid, friendshipKey) => new Promise((resolve, reject) => {
  fetch(`${client.databaseURL}/friendships/${uid}/${friendshipKey}.json`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(resolve)
    .catch(reject);
});

const findUserByEmail = (email) => new Promise((resolve, reject) => {
  // First, check the email-to-uid mapping
  const dbRef = firebase.database().ref('emailToUid');

  dbRef.orderByKey().equalTo(btoa(email)).once('value')
    .then((snapshot) => {
      if (snapshot.exists()) {
        // Found a matching email, get the UID
        const uid = Object.values(snapshot.val())[0];

        // Now fetch the full user data using the UID
        return firebase.database().ref(`users/${uid}`).once('value');
      }

      // No matching email found
      resolve(null);
      return null;
    })
    .then((userSnapshot) => {
      if (userSnapshot) {
        const userData = userSnapshot.val();
        if (userData) {
          userData.uid = userSnapshot.key; // Add the UID to the user data
          resolve(userData);
          return;
        }

        resolve(null);
      }
    })
    .catch((error) => {
      console.error('Error finding user by email:', error);
      reject(error);
    });
});

export {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  findUserByEmail
};
