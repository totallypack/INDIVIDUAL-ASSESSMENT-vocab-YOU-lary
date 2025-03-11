import { deleteWord, getWord, getSingleWord } from '../api/wordData';
import { showWord } from '../pages/words';
import addWordForm from '../components/addWordForm';

const domEvents = () => {
  document.querySelector('#main-container').addEventListener('click', (e) => {
    if (e.target.id.includes('delete-word')) {
      // eslint-disable-next-line no-alert
      if (window.confirm('Want to delete?')) {
        console.warn('CLICKED DELETE WORD', e.target.id);
        const [, firebaseKey] = e.target.id.split('--');

        deleteWord(firebaseKey).then(() => {
          getWord().then((data) => showWord(data));
        });
      }
    }

    if (e.target.id.includes('add-word-btn')) {
      addWordForm();
    }

    if (e.target.id.includes('edit-word-btn')) {
      const [, firebaseKey] = e.target.id.split('--');

      getSingleWord(firebaseKey).then((wordObj) => addWordForm(wordObj));
    }
  });
};

export default domEvents;
