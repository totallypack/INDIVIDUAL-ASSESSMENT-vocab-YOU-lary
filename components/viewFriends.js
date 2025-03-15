import { getFriends, removeFriend } from '../api/friendData';
import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';
import viewFriendSharedItems from './viewFriendSharedItems';

const viewFriends = (user) => {
  clearDom();

  // Display a loading message
  renderToDOM('#cards', '<h2>Loading friends...</h2>');

  // Get the user's friendships
  getFriends(user.uid).then((friendships) => {
    // Filter to only show accepted friendships
    const acceptedFriends = friendships.filter((friendship) => friendship.status === 'accepted');

    if (acceptedFriends.length === 0) {
      renderToDOM('#cards', `
        <div class="friends-container">
          <h2>Your Friends</h2>
          <div class="alert alert-info">You don't have any friends yet. Add friends to see them here!</div>
          <button class="btn btn-primary" id="navigate-add-friend">Add Friends</button>
        </div>
      `);

      // Add event listener for the "Add Friends" button
      document.querySelector('#navigate-add-friend').addEventListener('click', () => {
        document.querySelector('#add-friend').click();
      });

      return;
    }

    // Create HTML for the friends list
    let domString = `
      <div class="friends-container">
        <h2>Your Friends</h2>
        <div class="card-grid">
    `;

    // Loop through each friend
    acceptedFriends.forEach((friend) => {
      // Prioritize name, then email, then fallback to 'Friend'
      const displayName = friend.name || friend.email || 'Friend';

      domString += `
        <div class="card friend-card">
          <div class="card-body">
            <h5 class="card-title">${displayName}</h5>
            ${friend.email ? `<p class="card-text">${friend.email}</p>` : ''}
            <button class="btn btn-danger remove-friend" data-key="${friend.firebaseKey}">Remove Friend</button>
            <button class="btn btn-primary view-shared-items" data-uid="${friend.uid}">View Shared Items</button>
          </div>
        </div>
      `;
    });

    domString += `
        </div>
      </div>
    `;

    renderToDOM('#cards', domString);
    // Add event listeners for remove friend buttons
    document.querySelectorAll('.remove-friend').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const friendshipKey = e.target.dataset.key;
        removeFriend(user.uid, friendshipKey)
          .then(() => {
            // Refresh the view
            viewFriends(user);
          });
      });
    });

    // Add event listeners for view shared items buttons
    document.querySelectorAll('.view-shared-items').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const friendUid = e.target.dataset.uid;
        // This assumes you have a function to view a specific friend's shared items
        viewFriendSharedItems(user, friendUid);
      });
    });
  });
};

export default viewFriends;
