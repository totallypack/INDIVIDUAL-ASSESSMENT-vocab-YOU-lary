import * as bootstrap from 'bootstrap';
import renderToDOM from '../utils/renderToDom';
import weaponIcon from '../images/weapon.png';
import armorIcon from '../images/armor.png';
import potionIcon from '../images/potion.png';
import scrollIcon from '../images/scroll.png';
import otherIcon from '../images/other.png';
import favoriteIcon from '../images/favorite.png';

const navBar = () => {
  const domString = `
    <nav class="navbar fixed-top navbar-expand-lg navbar-dark bg-dark mb-5">
    <div class="container-fluid">
        <a class="navbar-brand title" href="#" id="all-items">My Magic Item Chest
        <span class="sr-only">(current)</span>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarText">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item active">
              <a class="nav-link" href="#" id="all-favorites" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View Favorites">
                <img src="${favoriteIcon}" alt="favorites" height="25px" width="25px"><span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item active">
              <a class="nav-link" href="#" id="weapons" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View Weapons">
                <img src="${weaponIcon}" alt="weapon" height="25px" width="25px"><span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item active">
              <a class="nav-link" href="#" id="armor" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View Armor">
                <img src="${armorIcon}" alt="armor" height="25px" width="25px"><span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item active">
              <a class="nav-link" href="#" id="potion" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View Potions">
                <img src="${potionIcon}" alt="potion" height="25px" width="25px"><span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item active">
              <a class="nav-link" href="#" id="scroll" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View Scrolls">
                <img src="${scrollIcon}" alt="scroll" height="25px" width="25px"><span class="sr-only">(current)</span>
              </a>
            </li>
            <li class="nav-item active">
              <a class="nav-link" href="#" id="other" data-bs-toggle="tooltip" data-bs-placement="bottom" data-bs-title="View All Other Items">
                <img src="${otherIcon}" alt="other" height="25px" width="25px"><span class="sr-only">(current)</span>
              </a>
            </li>
            <li>
            <input
              class="form-control mr-sm-2"
              id="search"
              placeholder="Search Magic Items"
              aria-label="Search"
            />
            </li>
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" id="sortDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                 Sort By
                </a>
                <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="sortDropdown">
                  <li><a class="dropdown-item" href="#" id="sort-alphabetical">Name (A-Z)</a></li>
                  <li><a class="dropdown-item" href="#" id="sort-alphabetical-desc">Name (Z-A)</a></li>
                  <li><a class="dropdown-item" href="#" id="sort-newest">Newest First</a></li>
                  <li><a class="dropdown-item" href="#" id="sort-oldest">Oldest First</a></li>
                </ul>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="friendsDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                Your Party
              </a>
              <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="friendsDropdown">
                <li><a class="dropdown-item" href="#" id="add-friend">Add Friend</a></li>
                <li><a class="dropdown-item" href="#" id="friend-requests">Friend Requests</a></li>
                <li><a class="dropdown-item" href="#" id="view-friends">View Friends</a></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="#" id="shared-items">Shared Items</a></li>
              </ul>
            </li>
          </ul>
          <span class="navbar-text">
            <div id="logout-button"></div>
          </span>
        </div>
        </div>
      </nav>`;

  renderToDOM('#navigation', domString);
  setTimeout(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }, 100);
};

export default navBar;
