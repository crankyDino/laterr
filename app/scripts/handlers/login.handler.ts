

// function initLoginPage() {
//     const loginForm = document.getElementById('login-form') as HTMLFormElement;
//     const submitBtn = document.getElementById('btn_submit');

//     if (!loginForm || !submitBtn) {
//         // Not a login page, exit
//         return;
//     }

//     console.log('Login page detected, setting up handlers');

//     // Wait for other scripts to load
//     // setTimeout(() => {
//     //     if (window) {
//     //         submitBtn.onclick = function () {
//     //             const isValid: boolean = validateForm(loginForm, (x: any) => {
//     //                 console.log(x);
//     //              })!;
//     //             console.log('Form valid:', isValid);

//     //             if (isValid) {
//     //                 // Handle login here
//     //                 const email = (loginForm.querySelector('[name="email"]') as HTMLInputElement).value;
//     //                 const password = (loginForm.querySelector('[name="password"]') as HTMLInputElement).value;
//     //                 console.log('Ready to login:', email);
//     //             }
//     //         };
//     //         console.log('✅ Login form initialized');
//     //     } else {
//     //         console.error('Form handler not available');
//     //     }
//     // }, 100);
// }

// Initialize when DOM is ready
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initLoginPage);
// } else {
//     initLoginPage();
// }