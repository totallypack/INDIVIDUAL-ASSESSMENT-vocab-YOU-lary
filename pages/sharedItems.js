import { getFriends } from '../api/friendData';
import { getItem } from '../api/itemData';
import { showItem, emptyItem } from './items';

const viewSharedItems = (user) => {
  // First get friends
  getFriends(user.uid).then((friends) => {
    // Filter for accepted friends only
    const acceptedFriends = friends.filter((friend) => friend.status === 'accepted');

    // If no friends, show message
    if (acceptedFriends.length === 0) {
      document.querySelector('#cards').innerHTML = `
        <div class="alert alert-info" role="alert">
          You don't have any friends yet. Add friends to see their shared items!
        </div>
      `;
      return;
    }

    // Get friend UIDs
    const friendUids = acceptedFriends.map((friend) => friend.uid);

    // Create promises for fetching each friend's items
    const promises = friendUids.map((uid) => getItem(uid));

    // Process all promises
    Promise.all(promises).then((results) => {
      // Flatten results and filter for public items only
      const sharedItems = results
        .flat()
        .filter((item) => item.public === true);

      // Add friend info to each item for display
      const itemsWithFriendInfo = sharedItems.map((item) => {
        // Find friend that owns this item
        const friendOwner = acceptedFriends.find((friend) => friend.uid === item.uid);
        return { ...item, friendName: friendOwner ? friendOwner.name || 'Friend' : 'Unknown' };
      });

      if (itemsWithFriendInfo.length) {
        showItem(itemsWithFriendInfo, true); // Pass true to indicate these are friend items
      } else {
        emptyItem('No shared items found. Your friends haven\'t shared any items yet.');
      }
    });
  });
};

export default viewSharedItems;
