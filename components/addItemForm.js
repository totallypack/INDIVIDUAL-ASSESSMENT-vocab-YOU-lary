import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

// USING THIS FORM FOR BOTH CREATE AND UPDATE
const addItemForm = (obj = {}) => {
  clearDom();

  // Prepare tag options (for checkbox display)
  const tagOptions = [
    { value: 'Weapon', label: 'Weapon' },
    { value: 'Armor', label: 'Armor' },
    { value: 'Potion', label: 'Potion' },
    { value: 'Scroll', label: 'Scroll' },
    { value: 'Accessory', label: 'Accessory' },
    { value: 'Other', label: 'Other' }
  ];

  // Generate HTML for tag checkboxes
  const tagCheckboxes = tagOptions.map((type) => {
    const isChecked = obj.type && Array.isArray(obj.type) && obj.type.includes(type.value);
    return `
      <div class="form-check form-check-inline">
        <input class="form-check-input tag-checkbox" type="checkbox" id="tag-${type.value}" 
              value="${type.value}" ${isChecked ? 'checked' : ''}>
        <label class="form-check-label" for="tag-${type.value}">${type.label}</label>
      </div>
    `;
  }).join('');

  // Create hidden select element for compatibility with existing code
  const hiddenSelectOptions = tagOptions.map((type) => `<option value="${type.value}">${type.label}</option>`).join('');

  const domString = `
    <form id="${obj.firebaseKey ? `update-item--${obj.firebaseKey}` : 'submit-item'}" class="mb-4">
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
        <label>Tags</label>
        <div class="tag-checkboxes mb-2">
          ${tagCheckboxes}
        </div>
        <!-- Hidden select element that will be updated when checkboxes change -->
        <select class="d-none" id="item-tags" multiple>
          ${hiddenSelectOptions}
        </select>
      </div>
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="item-favorite" ${obj.favorite ? 'checked' : ''}>
        <label class="form-check-label" for="words-learn">Favorite</label>
      </div>
      <div class="form-check">
        <input type="checkbox" class="form-check-input" id="item-public" ${obj.public ? 'checked' : ''}>
        <label class="form-check-label" for="item-public">Share with Friends</label>
      </div>
      <button type="submit" class="btn btn-primary">${obj.firebaseKey ? 'Update' : 'Submit'} Item
      </button>
    </form>`;

  renderToDOM('#form-container', domString);

  // Set up the synchronization between checkboxes and hidden select
  const syncTagsToSelect = () => {
    const checkboxes = document.querySelectorAll('.tag-checkbox:checked');
    const selectElement = document.querySelector('#item-tags');

    // Clear all selections
    for (let i = 0; i < selectElement.options.length; i++) {
      selectElement.options[i].selected = false;
    }

    // Set selected based on checkboxes
    checkboxes.forEach((checkbox) => {
      const option = Array.from(selectElement.options).find((opt) => opt.value === checkbox.value);
      if (option) option.selected = true;
    });
  };

  // Add change event listeners to all checkboxes
  document.querySelectorAll('.tag-checkbox').forEach((checkbox) => {
    checkbox.addEventListener('change', syncTagsToSelect);
  });

  // Initial sync in case of pre-selected tags
  syncTagsToSelect();
};

export default addItemForm;
