import { getItem } from '../api/itemData';
import { showItem, emptyItem } from '../pages/items';
import { signOut } from '../utils/auth';

const navigationEvents = (user) => {
  document.querySelector('#logout-button')
    .addEventListener('click', signOut);

  document.querySelector('#all-favorites').addEventListener('click', () => {
    getItem(user.uid).then((words) => {
      const favorites = words.filter((item) => item.favorite === true);
      if (favorites.length) {
        showItem(favorites);
      } else {
        emptyItem();
      }
    });
  });

  const addTypeFilterEvent = (buttonId, typeValue) => {
    document.querySelector(`#${buttonId}`).addEventListener('click', () => {
      getItem(user.uid).then((items) => {
        const filteredItems = items.filter((item) => item.type && Array.isArray(item.type) && item.type.includes(typeValue));
        if (filteredItems.length) {
          showItem(filteredItems);
        } else {
          emptyItem();
        }
      });
    });
  };

  addTypeFilterEvent('weapons', 'Weapon');
  addTypeFilterEvent('armor', 'Armor');
  addTypeFilterEvent('potion', 'Potion');
  addTypeFilterEvent('scroll', 'Scroll');
  addTypeFilterEvent('other', 'Other');

  document.querySelector('#all-items').addEventListener('click', (e) => {
    if (e.target.id.includes('all-items')) {
      const [, firebaseKey] = e.target.id.split('--');
      getItem(user.uid).then((word) => showItem(word.filter((item) => item.category_id === firebaseKey)));
    }
  });

  // STRETCH: SEARCH
  document.querySelector('#search').addEventListener('keyup', (e) => {
    const searchValue = document.querySelector('#search').value.toLowerCase();
    if (e.keyCode === 13) { // Enter key
      getItem(user.uid).then((items) => {
        const searchResults = items.filter((item) => {
          // Search by item name
          const nameMatch = item.item && item.item.toLowerCase().includes(searchValue);
          // Search by rarity
          const rarityMatch = item.rarity && item.rarity.toLowerCase().includes(searchValue);
          // Search by description
          const descMatch = item.description && item.description.toLowerCase().includes(searchValue);
          // Search by type (if it's an array of strings)
          const typeMatch = item.type && Array.isArray(item.type) && item.type.some((t) => t.toLowerCase().includes(searchValue));
          // Search by type (if it's a string)
          const typeStringMatch = item.type && typeof item.type === 'string' && item.type.toLowerCase().includes(searchValue);
          // Combine all the search criteria
          return nameMatch || rarityMatch || descMatch || typeMatch || typeStringMatch;
        });
        if (searchResults.length) {
          showItem(searchResults);
        } else {
          emptyItem();
        }
        // Clear the search field
        document.querySelector('#search').value = '';
      });
    }
  });
};

export default navigationEvents;
