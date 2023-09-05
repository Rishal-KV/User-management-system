const signupForm = document.getElementById('signupForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmPassword');
const validationMessage = document.getElementById('validationMessage');

signupForm.addEventListener('submit', function (event) {
    validationMessage.textContent = ''; 

    if (!usernameInput.value || !emailInput.value || !passwordInput.value || !confirmPasswordInput.value) {
        validationMessage.textContent = 'All fields are required';
        event.preventDefault(); 
    } else if (passwordInput.value !== confirmPasswordInput.value) {
        validationMessage.textContent = 'Passwords do not match';
        event.preventDefault(); 
    } else if (usernameInput.value.length <= 3) {
        validationMessage.textContent = 'Username must be greater than 3 characters';
        event.preventDefault(); 
    }
});