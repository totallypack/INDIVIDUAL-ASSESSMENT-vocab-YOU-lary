import { getWord } from '../api/wordData';
import { showWord, emptyWords } from '../pages/words';
import { signOut } from '../utils/auth';

const navigationEvents = (user) => {
  document.querySelector('#logout-button')
    .addEventListener('click', signOut);

  document.querySelector('#all-learned').addEventListener('click', () => {
    // Get all words for the user
    getWord(user.uid).then((words) => {
      // Filter to only show words where learned === true
      const learnedWords = words.filter((item) => item.learned === true);
      // Check if we have any learned words
      if (learnedWords.length) {
        // Call showWord with just the filtered words
        showWord(learnedWords);
      } else {
        // If no learned words, show empty state
        emptyWords();
      }
    });
  });

  document.querySelector('#all-words').addEventListener('click', (e) => {
    if (e.target.id.includes('all-words')) {
      const [, firebaseKey] = e.target.id.split('--');
      getWord(user.uid).then((word) => showWord(word.filter((item) => item.category_id === firebaseKey)));
    }
  });

  // STRETCH: SEARCH
  document.querySelector('#search').addEventListener('keyup', (e) => {
    const searchValue = document.querySelector('#search').value.toLowerCase();
    console.warn(searchValue);

    // WHEN THE USER PRESSES ENTER, MAKE THE API CALL AND CLEAR THE INPUT
    if (e.keyCode === 13) {
      // MAKE A CALL TO THE API TO FILTER ON THE BOOKS
      // IF THE SEARCH DOESN'T RETURN ANYTHING, SHOW THE EMPTY STORE
      // OTHERWISE SHOW THE STORE

      document.querySelector('#search').value = '';
    }
  });
};

export default navigationEvents;
