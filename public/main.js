// USE WITH FIREBASE AUTH
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';
import viewDirectorBasedOnUserAuthStatus from '../utils/viewDirector';
import '../styles/main.scss';

window.bootstrap = bootstrap;

const init = () => {
  viewDirectorBasedOnUserAuthStatus();
};

init();
