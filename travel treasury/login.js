const switchers = [...document.querySelectorAll('.switcher')]

switchers.forEach(item => {
	item.addEventListener('click', function() {
		switchers.forEach(item => item.parentElement.classList.remove('is-active'))
		this.parentElement.classList.add('is-active')
	})
})
// script.js
// const login = document.getElementById('login');
// const formssection = document.getElementById('forms-section');

// login.addEventListener('click', () => {
//   formssection.classList.remove('hidden');
// });

// const loginForm = document.getElementById('loginForm');
// loginForm.addEventListener('submit', (event) => {
//   event.preventDefault();  // Prevent the form from submitting (for demonstration purposes)

//   // Perform login logic here
//   // You would typically send the login data to a server for validation
//   console.log('Login submitted!');

//   // Reset form and hide login form container
//   loginForm.reset();
//   loginFormContainer.classList.add('hidden');
// });
// Function to toggle the visibility of the login form
// Remove the existing code related to toggling classes

// Function to toggle the visibility of the login form


function toggleLoginForm() {
  const formsSection = document.querySelector('.forms-section');
  const mainContent = document.getElementById('main-content'); // Added this line
  formsSection.classList.toggle('active');

  // Toggle the 'blurred' class on the main content
  mainContent.classList.toggle('blurred');
}

function closeLoginForm() {
  const formsSection = document.getElementById('loginForm');
  const mainContent = document.getElementById('main-content');

  formsSection.classList.add('hidden');
  mainContent.classList.remove('blurred');
}


