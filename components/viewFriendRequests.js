import { getFriends, acceptFriendRequest, removeFriend } from '../api/friendData';
import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

const viewFriendRequests = (user) => {
  clearDom();

  // Display a loading message
  renderToDOM('#cards', '<h2>Loading friend requests...</h2>');

  // Get the user's friendships
  getFriends(user.uid).then((friendships) => {
    console.log('All friendships retrieved:', friendships);

    // Filter to only show pending requests
    const pendingRequests = friendships.filter((friendship) => {
      console.log('Checking friendship:', friendship);
      return friendship.status === 'pending';
    });

    console.log('Pending requests:', pendingRequests);

    if (pendingRequests.length === 0) {
      renderToDOM('#cards', `
        <div class="friend-requests-container">
          <h2>Friend Requests</h2>
          <div class="alert alert-info">You have no pending friend requests.</div>
        </div>
      `);
      return;
    }

    // Create HTML for the pending requests
    let domString = `
      <div class="friend-requests-container">
        <h2>Friend Requests</h2>
        <div class="card-grid">
    `;

    // Loop through each request
    pendingRequests.forEach((request) => {
      console.log('Rendering request:', request);
      domString += `
        <div class="card friend-request-card" data-firebase-key="${request.firebaseKey}">
          <div class="card-body">
            <h5 class="card-title">Friend Request</h5>
            <p class="card-text">From: ${request.name || request.email || 'User'}</p>
            <div class="btn-group">
              <button class="btn btn-success accept-request" 
                      data-firebase-key="${request.firebaseKey}" 
                      data-sender-uid="${request.uid}">
                <span class="btn-text">Accept</span>
                <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
              </button>
              <button class="btn btn-danger reject-request" 
                      data-firebase-key="${request.firebaseKey}">
                <span class="btn-text">Reject</span>
                <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    domString += `
        </div>
      </div>
    `;

    renderToDOM('#cards', domString);

    // Add event listeners for accept buttons
    document.querySelectorAll('.accept-request').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const friendshipKey = e.target.dataset.firebaseKey;
        const { senderUid } = e.target.dataset;

        console.log('Attempting to accept friend request:', {
          currentUserId: user.uid,
          friendshipKey,
          senderUid
        });

        // Validate parameters before calling acceptFriendRequest
        if (!friendshipKey || !senderUid) {
          console.error('Missing required parameters for accepting friend request', {
            friendshipKey,
            senderUid
          });
          renderToDOM('#error-message', `
            <div class="alert alert-danger">
              Unable to process friend request. Missing required information.
            </div>
          `);
          return;
        }

        acceptFriendRequest(user.uid, friendshipKey, senderUid)
          .then((response) => {
            console.log('Friend request accepted successfully:', response);
            // Refresh the view
            viewFriendRequests(user);
          })
          .catch((error) => {
            console.error('Error accepting friend request:', error);
            // Show error message
            renderToDOM('#error-message', `
              <div class="alert alert-danger">
                Failed to accept friend request: ${error.message}
              </div>
            `);
          });
      });
    });

    // Add event listeners for reject buttons
    document.querySelectorAll('.reject-request').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const friendshipKey = e.target.dataset.firebaseKey;

        console.log('Attempting to reject friend request:', {
          currentUserId: user.uid,
          friendshipKey
        });

        // Validate parameters before calling removeFriend
        if (!friendshipKey) {
          console.error('Missing required parameters for rejecting friend request', {
            friendshipKey
          });
          renderToDOM('#error-message', `
            <div class="alert alert-danger">
              Unable to process friend request. Missing required information.
            </div>
          `);
          return;
        }

        removeFriend(user.uid, friendshipKey)
          .then(() => {
            // Refresh the view
            viewFriendRequests(user);
          })
          .catch((error) => {
            console.error('Error rejecting friend request:', error);
            // Show error message
            renderToDOM('#error-message', `
              <div class="alert alert-danger">
                Failed to reject friend request: ${error.message}
              </div>
            `);
          });
      });
    });
  }).catch((error) => {
    console.error('Error retrieving friends:', error);
    renderToDOM('#cards', `
      <div class="friend-requests-container">
        <h2>Error</h2>
        <div class="alert alert-danger">
          Failed to load friend requests: ${error.message}
        </div>
      </div>
    `);
  });
};

export default viewFriendRequests;
