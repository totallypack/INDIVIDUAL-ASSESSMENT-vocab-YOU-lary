import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

const emptyWords = () => {
  const domString = '<h1>No Vocabulary Words</h1>';
  renderToDOM('#words-learn', domString);
};

const showWord = (array) => {
  clearDom();

  const btnString = '<button class="btn btn-lg mb-4" id="add-word-btn">Add a New Word</button>';
  renderToDOM('#add-button', btnString);

  let domString = '';
  array.forEach((item) => {
    domString += `
    <div class="card text-center">
      <div class="card-header">
        Vocabulary Word
      </div>
      <div class="card-body">
        <h5 class="card-title">${item.word}</h5>
        <p class="card-title">${item.pronunciation}</p>
        <p class="card-text">${item.definition}</p>
        <i class="btn btn-danger" id="delete-word-btn--${item.firebaseKey}">Delete</i>
        <i id="edit-word-btn--${item.firebaseKey}" class="btn btn-info">Edit</i>
      </div>
      <div class="card-footer text-body-secondary">
      ${item.learned ? 'Learned ✓' : 'Not learned yet'}
      </div>
    </div>
    `;
  });
  renderToDOM('#words-learn', domString);
};

export { showWord, emptyWords };
