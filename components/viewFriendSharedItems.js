import { getItem } from '../api/itemData';
import { showItem } from '../pages/items';
import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

const viewFriendSharedItems = (user, friendUid) => {
  clearDom();

  // Display a loading message
  renderToDOM('#cards', '<h2>Loading shared items...</h2>');

  // Get the friend's items
  getItem(friendUid).then((items) => {
    // Filter to only show public items
    const sharedItems = items.filter((item) => item.public === true);

    if (sharedItems.length === 0) {
      renderToDOM('#cards', `
        <div class="shared-items-container">
          <h2>Shared Items</h2>
          <div class="alert alert-info">This friend hasn't shared any items yet.</div>
          <button class="btn btn-secondary" id="back-to-friends">Back to Friends</button>
        </div>
      `);

      // Add event listener for the "Back to Friends" button
      document.querySelector('#back-to-friends').addEventListener('click', () => {
        document.querySelector('#view-friends').click();
      });

      return;
    }

    // Show the shared items
    showItem(sharedItems, true);

    // Add a back button
    const backButton = '`<button class="btn btn-secondary mt-3" id="back-to-friends">Back to Friends</button>`';
    document.querySelector('#add-button').innerHTML += backButton;

    // Add event listener for the back button
    document.querySelector('#back-to-friends').addEventListener('click', () => {
      document.querySelector('#view-friends').click();
    });
  });
};

export default viewFriendSharedItems;
