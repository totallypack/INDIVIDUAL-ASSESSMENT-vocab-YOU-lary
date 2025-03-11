import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

// USING THIS FORM FOR BOTH CREATE AND UPDATE
const addWordForm = (obj = {}) => {
  clearDom();
  const domString = `
    <form id="submit-word" class="mb-4">
      <div class="form-group">
        <label for="word">Vocabulary Word</label>
        <input type="text" class="form-control" id="word" aria-describedby="word" placeholder="Enter Word" value="${obj.word || ''}" required>
      </div>
      <div class="form-group">
        <label for="pronunciation">Pronunciation</label>
        <input type="text" class="form-control" id="pronunciation" placeholder="Pronunciation" value="${obj.pronunciation || ''}" required>
      </div>
      <div class="form-group">
        <label for="definition">Definition</label>
        <textarea class="form-control" placeholder="Definition" id="definition" style="height: 100px">${obj.definition || ''}</textarea>
      </div>
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="words-learn" ${obj.learned ? 'checked' : ''}>
        <label class="form-check-label" for="words-learn">Learned this word?</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit Word
      </button>
    </form>`;

  renderToDOM('#form-container', domString);
};

export default addWordForm;
