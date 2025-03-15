import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import loginButton from '../components/loginButton';
import logoutButton from '../components/logoutButton';
import client from './client';
import startApp from './startApp';
import updateUserData from './updateUserData';

const viewDirectorBasedOnUserAuthStatus = () => {
  firebase.initializeApp(client);
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // person is logged in do something...
      document.querySelector('#login-form-container').style.display = 'none';
      document.querySelector('#app').style.display = 'block';
      startApp(user);
      updateUserData(user);
      logoutButton();
    } else {
      // person is NOT logged in
      document.querySelector('#login-form-container').style.display = 'flex';
      document.querySelector('#app').style.display = 'none';
      loginButton();
    }
  });
};

export default viewDirectorBasedOnUserAuthStatus;
