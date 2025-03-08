// USE WITH FIREBASE AUTH
import viewDirectorBasedOnUserAuthStatus from '../utils/viewDirector';
import 'bootstrap'; // import bootstrap elements and js
import '../styles/main.scss';

const init = () => {
  viewDirectorBasedOnUserAuthStatus();
};

init();
