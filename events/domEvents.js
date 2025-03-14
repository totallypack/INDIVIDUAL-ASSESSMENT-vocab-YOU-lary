import { deleteItem, getItem, getSingleItem } from '../api/itemData';
import { showItem } from '../pages/items';
import addItemForm from '../components/addItemForm';

const domEvents = (user) => {
  document.querySelector('#main-container').addEventListener('click', (e) => {
    if (e.target.id.includes('delete-item')) {
      // eslint-disable-next-line no-alert
      if (e.target.id.includes('delete-item')) {
        console.warn('CLICKED DELETE ITEM', e.target.id);
        const [, firebaseKey] = e.target.id.split('--');

        const modal = document.querySelector('#delete-confirmation-modal');
        modal.classList.add('show');

        // Store the firebaseKey as a data attribute on the confirm button
        document.querySelector('#confirm-delete').setAttribute('data-key', firebaseKey);
      }
    }

    if (e.target.id.includes('add-item-btn')) {
      addItemForm();
    }

    if (e.target.id.includes('edit-item-btn')) {
      const [, firebaseKey] = e.target.id.split('--');

      getSingleItem(firebaseKey).then((itemObj) => addItemForm(itemObj));
    }
  });

  document.querySelector('#cancel-delete').addEventListener('click', () => {
    document.querySelector('#delete-confirmation-modal').classList.remove('show');
  });

  document.querySelector('#confirm-delete').addEventListener('click', (e) => {
    const firebaseKey = e.target.getAttribute('data-key');

    // Hide the modal
    document.querySelector('#delete-confirmation-modal').classList.remove('show');

    // Delete the item
    deleteItem(firebaseKey).then(() => {
      getItem(user.uid).then((data) => showItem(data));
    });
  });
};

export default domEvents;
