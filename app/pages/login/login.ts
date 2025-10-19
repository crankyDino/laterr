import { validateForm } from "../../scripts/handlers/form.handler";




function submit() {
    const form = (document.getElementById("login-form") as HTMLFormElement)
    // const isValid = window.formHandler.validateForm(form)
    console.log(validateForm(form,()=>{}));


    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;

    console.log(
        username,
        password,
        email
    );

    // login(email,password)
}


function logger() {
    console.log("here we go again");
}


(() => {

    console.log('hey im login loading here');

    var _action = 'login';

    function init() {
        // const form = document.getElementById("login-form")
        (document.getElementById('btn-submit') as HTMLButtonElement).onclick = submit;
        // login(email,password)
    }

    init()
})();


// content.js or your main script

// import { validateForm } from './handlers/form.handler.js';
// import { login, signup, isAuthenticated } from './services/auth.service.js';

// class LoginManager {
//     constructor() {
//         this.form = null;
//         this.isSignupMode = false;
//         this.init();
//     }

//     init() {
//         // Wait for DOM to be ready
//         if (document.readyState === 'loading') {
//             document.addEventListener('DOMContentLoaded', () => this.setupForm());
//         } else {
//             this.setupForm();
//         }
//     }

//     setupForm() {
//         this.form = document.getElementById('login-form');

//         if (!this.form) {
//             console.log('Login form not found on this page');
//             return;
//         }

//         console.log('Setting up login form validation');

//         // Initialize form validation
//         validateForm(this.form);

//         // Listen for successful validation
//         this.form.addEventListener('formValidated', (event) => {
//             if (event.detail.isValid) {
//                 this.handleFormSubmit();
//             }
//         });

//         // Setup mode toggle if exists
//         const toggleBtn = document.getElementById('toggle-mode');
//         if (toggleBtn) {
//             toggleBtn.addEventListener('click', () => this.toggleMode());
//         }
//     }

//     async handleFormSubmit() {
//         const formData = this.getFormData();

//         if (!formData) {
//             console.error('Could not get form data');
//             return;
//         }

//         try {
//             this.setLoading(true);

//             let result;
//             if (this.isSignupMode) {
//                 result = await signup(
//                     formData.email,
//                     formData.password,
//                     formData.confirm,
//                     { username: formData.username }
//                 );
//             } else {
//                 result = await login(formData.email || formData.username, formData.password);
//             }

//             if (result.success) {
//                 this.handleSuccess(result.data);
//             } else {
//                 this.handleError(result.error);
//             }

//         } catch (error) {
//             console.error('Form submission error:', error);
//             this.handleError('An unexpected error occurred');
//         } finally {
//             this.setLoading(false);
//         }
//     }

//     getFormData() {
//         if (!this.form) return null;

//         const formData = new FormData(this.form);
//         return {
//             username: formData.get('username'),
//             email: formData.get('email'),
//             password: formData.get('password'),
//             confirm: formData.get('confirm')
//         };
//     }

//     handleSuccess(data) {
//         console.log('Authentication successful:', data);

//         // Show success message
//         this.showMessage('Success! Redirecting...', 'success');

//         // Redirect or close popup
//         setTimeout(() => {
//             if (chrome.tabs) {
//                 // If this is a popup, close it
//                 window.close();
//             } else {
//                 // If this is a content script, redirect
//                 window.location.href = '/dashboard';
//             }
//         }, 1500);
//     }

//     handleError(error) {
//         console.error('Authentication failed:', error);
//         this.showMessage(error, 'error');
//     }

//     showMessage(message, type = 'info') {
//         // Create or update message element
//         let messageEl = document.querySelector('.auth-message');
//         if (!messageEl) {
//             messageEl = document.createElement('div');
//             messageEl.className = 'auth-message';
//             this.form.insertBefore(messageEl, this.form.firstChild);
//         }

//         messageEl.textContent = message;
//         messageEl.className = `auth-message auth-message--${type}`;

//         // Auto-hide after 5 seconds for non-error messages
//         if (type !== 'error') {
//             setTimeout(() => {
//                 messageEl.style.display = 'none';
//             }, 5000);
//         }
//     }

//     setLoading(isLoading) {
//         const submitBtn = this.form.querySelector('[type="submit"]');
//         if (submitBtn) {
//             submitBtn.disabled = isLoading;
//             submitBtn.textContent = isLoading ? 'Please wait...' :
//                 (this.isSignupMode ? 'Sign Up' : 'Login');
//         }
//     }

//     toggleMode() {
//         this.isSignupMode = !this.isSignupMode;

//         // Toggle visibility of signup-only fields
//         const emailField = document.querySelector('[name="email"]')?.closest('.form__group');
//         const confirmField = document.querySelector('[name="confirm"]')?.closest('.form__group');

//         if (emailField) {
//             emailField.style.display = this.isSignupMode ? 'block' : 'none';
//         }
//         if (confirmField) {
//             confirmField.style.display = this.isSignupMode ? 'block' : 'none';
//         }

//         // Update button text
//         const toggleBtn = document.getElementById('toggle-mode');
//         if (toggleBtn) {
//             toggleBtn.textContent = this.isSignupMode ? 'Login' : 'Sign Up';
//         }
//     }
// }

// // Initialize when the script loads
// new LoginManager();

// // Also check if user is already authenticated
// if (isAuthenticated()) {
//     console.log('User is already authenticated');
//     // Handle already authenticated state
// }