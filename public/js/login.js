// Get the email and password input fields
const signupForm = document.getElementById('signupForm')
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const emailError = document.getElementById('emailError');
const submitButton = document.getElementById('submitButton')
const validationMessage = document.getElementById('validationMessage')


signupForm.addEventListener('submit', function (event) {
    validationMessage.textContent = ''; 

    if ( !emailInput.value || !passwordInput.value) {
        validationMessage.textContent = 'All fields are required';
        event.preventDefault(); 
    }
 } );

// Add event listener to password input field

passwordInput.addEventListener('focus', function() {
const email = emailInput.value;

if (!validateEmail(email)) {
    emailError.textContent = 'Please enter a valid email';
    submitButton.disabled = true;
} else {
    emailError.textContent = '';
    submitButton.disabled = false;
}
});

// Email validation function


function validateEmail(email) {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
return emailRegex.test(email);
}