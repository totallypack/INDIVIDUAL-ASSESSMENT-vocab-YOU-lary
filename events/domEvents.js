import { deleteItem, getItem, getSingleItem } from '../api/itemData';
import { showItem } from '../pages/items';
import addItemForm from '../components/addItemForm';

const domEvents = (user) => {
  document.querySelector('#main-container').addEventListener('click', (e) => {
    if (e.target.id.includes('delete-item')) {
      // eslint-disable-next-line no-alert
      if (window.confirm('Want to delete?')) {
        console.warn('CLICKED DELETE ITEM', e.target.id);
        const [, firebaseKey] = e.target.id.split('--');

        deleteItem(firebaseKey).then(() => {
          getItem(user.uid).then((data) => showItem(data));
        });
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
};

export default domEvents;
