import axios from 'axios';

// Function to get CSRF token from cookies
const getCsrfToken = () => {
    const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken=')).split('=')[1];
    console.log('CSRF Token:', csrfToken); // Check token value
    return csrfToken;
  };
  

// Set the CSRF token for all Axios requests
axios.defaults.headers.common['X-CSRFToken'] = getCsrfToken();

export default axios;
  