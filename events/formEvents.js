import { createWord, updateWord, getWord } from '../api/wordData';
import { showWord } from '../pages/words';

const formEvents = (user) => {
  document.querySelector('#main-container').addEventListener('submit', (e) => {
    e.preventDefault();
    if (e.target.id.includes('submit-word')) {
      const payload = {
        word: document.querySelector('#word').value,
        pronunciation: document.querySelector('#pronunciation').value,
        definition: document.querySelector('#definition').value,
        learned: document.querySelector('#words-learn').checked,
        uid: user.uid
      };

      createWord(payload).then(({ name }) => {
        const patchPayload = { firebaseKey: name };

        updateWord(patchPayload).then(() => {
          getWord(user.uid).then((word) => showWord(word));
        });
      });
    }

    if (e.target.id.includes('update-word')) {
      const [, firebaseKey] = e.target.id.split('--');
      const patchPayload = {
        word: document.querySelector('#word').value,
        pronunciation: document.querySelector('#pronunciation').value,
        definition: document.querySelector('#definition').value,
        learned: document.querySelector('#words-learn').checked,
        firebaseKey,
        uid: user.uid
      };

      updateWord(patchPayload).then(() => {
        getWord(user.uid).then((word) => showWord(word));
      });
    }
  });
};

export default formEvents;
