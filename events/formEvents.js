import { createItem, updateItem, getItem } from '../api/itemData';
import { showItem } from '../pages/items';

const formEvents = (user) => {
  document.querySelector('#main-container').addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id.includes('submit-item')) {
      const tagsSelect = document.querySelector('#item-tags');
      const selectedTags = Array.from(tagsSelect.selectedOptions).map((option) => option.value);
      const payload = {
        item: document.querySelector('#item').value,
        rarity: document.querySelector('#rarity').value,
        description: document.querySelector('#description').value,
        favorite: document.querySelector('#item-favorite').checked,
        type: selectedTags,
        uid: user.uid
      };

      createItem(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };

        updateItem(patchPayload).then(() => {
          getItem(user.uid).then((item) => showItem(item));
        });
      });
    }

    if (e.target.id.includes('update-item')) {
      const [, firebaseKey] = e.target.id.split('--');
      const tagsSelect = document.querySelector('#item-tags');
      const selectedTags = Array.from(tagsSelect.selectedOptions).map((option) => option.value);
      const patchPayload = {
        item: document.querySelector('#item').value,
        rarity: document.querySelector('#rarity').value,
        description: document.querySelector('#description').value,
        favorite: document.querySelector('#item-favorite').checked,
        type: selectedTags,
        firebaseKey,
        uid: user.uid
      };

      updateItem(patchPayload).then(() => {
        getItem(user.uid).then((item) => showItem(item));
      });
    }
  });
};

export default formEvents;
