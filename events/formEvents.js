import { createWord, updateWord, getWord } from '../api/wordData';
import { showWord } from '../pages/words';

const formEvents = () => {
  document.querySelector('#main-container').addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id.includes('submit-word')) {
      const payload = {
        word: document.querySelector('#word').value,
        pronunciation: document.querySelector('#pronunciation').value,
        definition: document.querySelector('#definition').value,
        learned: document.querySelector('#learned').checked,
      };

      createWord(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };

        updateWord(patchPayload).then(() => {
          getWord().then(showWord);
        });
      });
    }

    if (e.target.id.includes('update-word')) {
      const [, firebaseKey] = e.target.id.split('--');
      const payload = {
        word: document.querySelector('#word').value,
        pronunciation: document.querySelector('#pronunciation').value,
        definition: document.querySelector('#definition').value,
        learned: document.querySelector('#learned').checked,
        firebaseKey,
      };

      updateWord(payload).then(() => {
        getWord().then(showWord);
      });
    }
  });
};

export default formEvents;
