import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';
import { sendFriendRequest, findUserByEmail, getFriends } from '../api/friendData';

const addFriendForm = (user) => {
  clearDom();
  const domString = `
    <div class="friend-form-container">
      <h2>Add a Friend</h2>
      <form id="add-friend-form" class="mb-4">
        <div class="form-group">
          <label for="friend-email">Friend's Email</label>
          <input type="email" class="form-control" id="friend-email" placeholder="Enter your friend's email" required>
        </div>
        <button type="submit" class="btn btn-primary mt-3">Send Friend Request</button>
      </form>
    </div>
  `;

  renderToDOM('#form-container', domString);

  document.querySelector('#add-friend-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const friendEmail = document.querySelector('#friend-email').value;

    // Find user by email
    findUserByEmail(friendEmail)
      .then((friendUser) => {
        // Check if user was found
        if (!friendUser) {
          throw new Error('User not found. Please check the email address.');
        }

        // Check if trying to add self
        if (friendUser.uid === user.uid) {
          throw new Error('You cannot send a friend request to yourself.');
        }

        // Check for existing friend requests
        return getFriends(user.uid)
          .then((existingFriendships) => {
            // Check for existing pending or outgoing requests
            const existingRequest = existingFriendships.find(
              (friendship) => friendship.uid === friendUser.uid && (friendship.status === 'pending' || friendship.status === 'outgoing')
            );

            if (existingRequest) {
              throw new Error('A friend request to this user already exists.');
            }

            // Check if already friends
            const existingFriendship = existingFriendships.find(
              (friendship) => friendship.uid === friendUser.uid && friendship.status === 'accepted'
            );

            if (existingFriendship) {
              throw new Error('You are already friends with this user.');
            }

            // Send friend request if all checks pass
            return sendFriendRequest(user.uid, friendUser.uid);
          });
      })
      .then(() => {
        // Clear input and show success message
        document.querySelector('#friend-email').value = '';
        document.querySelector('#form-container').innerHTML += `
          <div class="alert alert-success alert-dismissible fade show" role="alert">
            Friend request sent successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      })
      .catch((error) => {
        console.error('Error in friend request process:', error);
        // Show error message
        document.querySelector('#form-container').innerHTML += `
          <div class="alert alert-danger alert-dismissible fade show" role="alert">
            ${error.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        `;
      });
  });
};

export default addFriendForm;
