import { signIn } from '../utils/auth';

// GOOGLE LOGIN BUTTON
const loginButton = () => {
  const domString = `
  <div class="login-container d-flex flex-column justify-content-center align-items-center">
    <div class="text-center mb-4">
      <h1 class="display-4">Magic Item Chest</h1>
      <p class="lead">Your personal inventory for magical artifacts</p>
      <hr class="my-4">
      <p>Track, organize and filter your magical items in one convenient location.</p>
    </div>
    <div class="card login-card">
      <div class="card-body text-center">
        <h3 class="card-title mb-3">Welcome!</h3>
        <p class="card-text">Sign in to access your magical inventory</p>
        <button id="google-auth" class="btn btn-danger btn-lg">
          <i class="fas fa-magic me-2"></i>Login with Google
        </button>
      </div>
    </div>
  </div>`;
  document.querySelector('#login-form-container').innerHTML = domString;
  document.querySelector('#google-auth').addEventListener('click', signIn);
};

export default loginButton;
