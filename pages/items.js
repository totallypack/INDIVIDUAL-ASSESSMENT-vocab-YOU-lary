import clearDom from '../utils/clearDom';
import renderToDOM from '../utils/renderToDom';

const emptyItem = () => {
  const domString = '<h1>No Magic Items</h1>';
  renderToDOM('#cards', domString);
};

const showItem = (array) => {
  clearDom();

  const btnString = '<button class="btn btn-lg mb-4" id="add-item-btn">Collect a New Magic Item</button>';
  renderToDOM('#add-button', btnString);

  let domString = '';
  array.forEach((item) => {
    domString += `
    <div class="card text-center">
      <div class="card-header">
        ${item.type}
      </div>
      <div class="card-body">
        <h5 class="card-title">${item.item}</h5>
        <p class="card-sub-title">${item.rarity}</p>
        <p class="card-text">${item.description}</p>
        <i class="btn btn-danger" id="delete-item-btn--${item.firebaseKey}">Delete</i>
        <i id="edit-item-btn--${item.firebaseKey}" class="btn btn-info">Edit</i>
      </div>
      <div class="card-footer text-body-secondary">
      ${item.favorite ? 'Favorite ✓' : ''}
      </div>
    </div>
    `;
  });
  renderToDOM('#cards', domString);
};

export { showItem, emptyItem };
