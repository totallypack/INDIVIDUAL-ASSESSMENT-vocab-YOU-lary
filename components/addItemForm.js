import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

// USING THIS FORM FOR BOTH CREATE AND UPDATE
const addItemForm = (obj = {}) => {
  clearDom();
  const domString = `
    <form id="submit-item" class="mb-4">
      <div class="form-group">
        <label for="item">Magic Item</label>
        <input type="text" class="form-control" id="item" aria-describedby="item" placeholder="Item Name" value="${obj.item || ''}" required>
      </div>
      <div class="form-group">
        <label for="rarity">Rarity</label>
        <input type="text" class="form-control" id="rarity" placeholder="Rarity" value="${obj.rarity || ''}" required>
      </div>
      <div class="form-group">
        <label for="description">Description</label>
        <textarea class="form-control" placeholder="Description" id="description" style="height: 100px">${obj.description || ''}</textarea>
      </div>
      <div class="form-group">
        <label for="item-tags">Tags</label>
        <select class="form-control" id="item-tags" multiple>
          <option value="Weapon">Weapon</option>
          <option value="Armor">Armor</option>
          <option value="Potion">Potion</option>
          <option value="Scroll">Scroll</option>
          <option value="Accessory">Accessory</option>
          <option value="Other">Other</option>
        </select>
        <small class="form-text text-muted">Hold Ctrl (or Cmd on Mac) to select multiple tags</small>
      </div>
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="item-favorite" ${obj.favorite ? 'checked' : ''}>
        <label class="form-check-label" for="words-learn">Favorite</label>
      </div>
      <button type="submit" class="btn btn-primary">Submit Item
      </button>
    </form>`;

  renderToDOM('#form-container', domString);

  // Pre-select tags if they exist in the object
  if (obj.tags && Array.isArray(obj.tags)) {
    const tagsSelect = document.querySelector('#item-tags');
    // Loop through all options and set selected for matching tags
    Array.from(tagsSelect.options).forEach((option) => {
      if (obj.tags.includes(option.value)) {
        // eslint-disable-next-line no-param-reassign
        option.selected = true;
      }
    });
  }
};

export default addItemForm;
