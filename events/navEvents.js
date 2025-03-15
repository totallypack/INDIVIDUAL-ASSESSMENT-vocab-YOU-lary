import { getItem } from '../api/itemData';
import logoutButton from '../components/logoutButton';
import { showItem, emptyItem } from '../pages/items';
import addFriendForm from '../components/addFriendForm';
import viewSharedItems from '../pages/sharedItems';
import viewFriendRequests from '../components/viewFriendRequests';
import viewFriends from '../components/viewFriends';

// Variables to track state - declare these outside the function
let currentFilter = 'all';
let lastSearchQuery = '';
// eslint-disable-next-line no-unused-vars
let allItems = [];
let currentSortMethod = 'default';

const navigationEvents = (user) => {
  logoutButton();

  // Function to load all items and store them
  const loadAllItems = () => getItem(user.uid).then((items) => {
    allItems = items; // Store for later use
    return items;
  });

  // Load items when page initializes
  loadAllItems().then((items) => {
    showItem(items); // Show all items by default
  });

  // Sorting function
  const sortItems = (items, sortMethod) => {
    const itemsCopy = [...items];

    switch (sortMethod) {
      case 'alpha-asc':
        return itemsCopy.sort((a, b) => (a.item || '').localeCompare(b.item || ''));
      case 'alpha-desc':
        return itemsCopy.sort((a, b) => (b.item || '').localeCompare(a.item || ''));
      case 'newest':
        return itemsCopy.sort((a, b) => (b.firebaseKey || '').localeCompare(a.firebaseKey || ''));
      case 'oldest':
        return itemsCopy.sort((a, b) => (a.firebaseKey || '').localeCompare(b.firebaseKey || ''));
      default:
        return itemsCopy;
    }
  };

  // Favorites filter
  document.querySelector('#all-favorites').addEventListener('click', () => {
    currentFilter = 'favorites';
    loadAllItems().then((items) => {
      const favorites = items.filter((item) => item.favorite === true);
      if (favorites.length) {
        showItem(sortItems(favorites, currentSortMethod));
      } else {
        emptyItem();
      }
    });
  });

  // Type filters
  const addTypeFilterEvent = (buttonId, typeValue) => {
    document.querySelector(`#${buttonId}`).addEventListener('click', () => {
      currentFilter = typeValue;
      loadAllItems().then((items) => {
        const filteredItems = items.filter((item) => item.type && Array.isArray(item.type) && item.type.includes(typeValue));
        if (filteredItems.length) {
          showItem(sortItems(filteredItems, currentSortMethod));
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

  // All items filter
  document.querySelector('#all-items').addEventListener('click', () => {
    currentFilter = 'all';
    loadAllItems().then((items) => {
      showItem(sortItems(items, currentSortMethod));
    });
  });

  // Search function
  document.querySelector('#search').addEventListener('keyup', (e) => {
    const searchValue = document.querySelector('#search').value.toLowerCase();

    if (e.keyCode === 13) { // Enter key
      lastSearchQuery = searchValue;
      currentFilter = 'search';

      loadAllItems().then((items) => {
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

          return nameMatch || rarityMatch || descMatch || typeMatch || typeStringMatch;
        });

        if (searchResults.length) {
          showItem(sortItems(searchResults, currentSortMethod));
        } else {
          emptyItem();
        }

        // Clear the search field
        document.querySelector('#search').value = '';
      });
    }
  });

  // Apply current sorting to current view
  const applySortingToCurrentView = () => {
    // Reload items to ensure we have the latest data
    loadAllItems().then((items) => {
      // Apply filter based on currentFilter
      let filteredItems;

      switch (currentFilter) {
        case 'search':
          if (lastSearchQuery) {
            filteredItems = items.filter((item) => {
              const nameMatch = item.item && item.item.toLowerCase().includes(lastSearchQuery);
              const rarityMatch = item.rarity && item.rarity.toLowerCase().includes(lastSearchQuery);
              const descMatch = item.description && item.description.toLowerCase().includes(lastSearchQuery);
              const typeMatch = item.type && Array.isArray(item.type) && item.type.some((t) => t.toLowerCase().includes(lastSearchQuery));
              const typeStringMatch = item.type && typeof item.type === 'string' && item.type.toLowerCase().includes(lastSearchQuery);

              return nameMatch || rarityMatch || descMatch || typeMatch || typeStringMatch;
            });
          } else {
            filteredItems = items;
          }
          break;
        case 'all':
          filteredItems = items;
          break;
        case 'favorites':
          filteredItems = items.filter((item) => item.favorite === true);
          break;
        default:
          // For type filters
          filteredItems = items.filter((item) => {
            if (item.type && Array.isArray(item.type)) {
              return item.type.includes(currentFilter);
            }
            if (item.type && typeof item.type === 'string') {
              return item.type === currentFilter;
            }
            return false;
          });
          break;
      }

      // Apply current sort method and show
      if (filteredItems.length) {
        showItem(sortItems(filteredItems, currentSortMethod));
      } else {
        emptyItem();
      }
    });
  };

  // Add sort dropdown event listeners
  setTimeout(() => {
    document.querySelector('#sort-alphabetical').addEventListener('click', () => {
      currentSortMethod = 'alpha-asc';
      applySortingToCurrentView();
    });

    document.querySelector('#sort-alphabetical-desc').addEventListener('click', () => {
      currentSortMethod = 'alpha-desc';
      applySortingToCurrentView();
    });

    document.querySelector('#sort-newest').addEventListener('click', () => {
      currentSortMethod = 'newest';
      applySortingToCurrentView();
    });

    document.querySelector('#sort-oldest').addEventListener('click', () => {
      currentSortMethod = 'oldest';
      applySortingToCurrentView();
    });
  }, 500);

  document.querySelector('#add-friend').addEventListener('click', () => {
    addFriendForm(user);
  });

  document.querySelector('#friend-requests').addEventListener('click', () => {
    viewFriendRequests(user);
  });

  document.querySelector('#view-friends').addEventListener('click', () => {
    viewFriends(user);
  });

  document.querySelector('#shared-items').addEventListener('click', () => {
    viewSharedItems(user);
  });
};

export default navigationEvents;
