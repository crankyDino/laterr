import PocketBase from 'pocketbase';

const pb = new PocketBase('http://192.168.0.21');

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean}
 */
async function login(email:string, password:string) {
  try {
    const authData = await pb.collection('users').authWithPassword(
      email,
      password,
    );
    
    // after the above you can also access the auth data from the authStore
    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    console.log(pb.authStore.record?.id);
    
    // Don't clear the auth store - this logs the user out!
    // pb.authStore.clear();
    
    return pb.authStore.isValid;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

export  {
    login
}

// // Note: You'll need to include PocketBase in your extension
// // Add to manifest.json web_accessible_resources or use a CDN version

// let pb;

// // Initialize PocketBase
// try {
//     // For Chrome extension, you might need to load PocketBase differently
//     // Option 1: If you have PocketBase as a file in your extension
//     if (typeof PocketBase !== 'undefined') {
//         pb = new PocketBase('http://192.168.0.21:8090');
//     } else {
//         console.error('PocketBase not loaded. Make sure to include it in your extension.');
//     }
// } catch (error) {
//     console.error('Failed to initialize PocketBase:', error);
// }

// /**
//  * Authenticates user with email and password
//  * @param {string} email 
//  * @param {string} password 
//  * @returns {Promise<{success: boolean, data?: any, error?: string}>}
//  */
// export async function login(email, password) {
//     // Validate inputs
//     if (!email || !password) {
//         return {
//             success: false,
//             error: 'Email and password are required'
//         };
//     }

//     if (!pb) {
//         return {
//             success: false,
//             error: 'Authentication service not initialized'
//         };
//     }

//     try {
//         console.log('Attempting login for:', email);
        
//         const authData = await pb.collection('users').authWithPassword(email, password);
        
//         console.log('Login successful');
//         console.log('Auth valid:', pb.authStore.isValid);
//         console.log('User ID:', pb.authStore.record?.id);
        
//         return {
//             success: true,
//             data: {
//                 token: pb.authStore.token,
//                 user: pb.authStore.record,
//                 isValid: pb.authStore.isValid
//             }
//         };
        
//     } catch (error) {
//         console.error('Login failed:', error);
        
//         // Handle specific PocketBase errors
//         let errorMessage = 'Login failed';
        
//         if (error.status === 400) {
//             errorMessage = 'Invalid email or password';
//         } else if (error.status === 401) {
//             errorMessage = 'Authentication failed';
//         } else if (error.status === 403) {
//             errorMessage = 'Account access denied';
//         } else if (!navigator.onLine) {
//             errorMessage = 'No internet connection';
//         } else {
//             errorMessage = error.message || 'Login failed';
//         }
        
//         return {
//             success: false,
//             error: errorMessage
//         };
//     }
// }

// /**
//  * Signs up a new user
//  * @param {string} email 
//  * @param {string} password 
//  * @param {string} passwordConfirm 
//  * @param {Object} additionalData 
//  * @returns {Promise<{success: boolean, data?: any, error?: string}>}
//  */
// export async function signup(email, password, passwordConfirm, additionalData = {}) {
//     if (!email || !password || !passwordConfirm) {
//         return {
//             success: false,
//             error: 'All fields are required'
//         };
//     }

//     if (password !== passwordConfirm) {
//         return {
//             success: false,
//             error: 'Passwords do not match'
//         };
//     }

//     if (!pb) {
//         return {
//             success: false,
//             error: 'Authentication service not initialized'
//         };
//     }

//     try {
//         const userData = {
//             email,
//             password,
//             passwordConfirm,
//             ...additionalData
//         };

//         const record = await pb.collection('users').create(userData);
        
//         console.log('Signup successful:', record.id);
        
//         return {
//             success: true,
//             data: record
//         };
        
//     } catch (error) {
//         console.error('Signup failed:', error);
        
//         let errorMessage = 'Signup failed';
        
//         if (error.status === 400) {
//             if (error.data?.email) {
//                 errorMessage = 'Email is already taken';
//             } else if (error.data?.password) {
//                 errorMessage = 'Password requirements not met';
//             } else {
//                 errorMessage = 'Invalid signup data';
//             }
//         }
        
//         return {
//             success: false,
//             error: errorMessage
//         };
//     }
// }

// /**
//  * Logs out the current user
//  * @returns {Promise<{success: boolean}>}
//  */
// export async function logout() {
//     try {
//         if (pb) {
//             pb.authStore.clear();
//             console.log('User logged out successfully');
//         }
        
//         return { success: true };
//     } catch (error) {
//         console.error('Logout error:', error);
//         return { success: false };
//     }
// }

// /**
//  * Checks if user is currently authenticated
//  * @returns {boolean}
//  */
// export function isAuthenticated() {
//     return pb?.authStore?.isValid || false;
// }

// /**
//  * Gets current user data
//  * @returns {Object|null}
//  */
// export function getCurrentUser() {
//     return pb?.authStore?.record || null;
// }

// /**
//  * Gets current auth token
//  * @returns {string|null}
//  */
// export function getAuthToken() {
//     return pb?.authStore?.token || null;
// }

// /**
//  * Refreshes the authentication token
//  * @returns {Promise<{success: boolean, error?: string}>}
//  */
// export async function refreshAuth() {
//     if (!pb || !pb.authStore.isValid) {
//         return {
//             success: false,
//             error: 'No valid authentication to refresh'
//         };
//     }

//     try {
//         await pb.collection('users').authRefresh();
//         return { success: true };
//     } catch (error) {
//         console.error('Auth refresh failed:', error);
//         return {
//             success: false,
//             error: 'Failed to refresh authentication'
//         };
//     }
// }