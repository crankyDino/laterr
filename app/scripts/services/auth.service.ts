import PocketBase from 'pocketbase';
import type { IUserPayload } from '../../lib/models/user.model';

const pb = new PocketBase('http://192.168.0.21:80');
pb.autoCancellation(false);
const USERS = "users"

/**
 * Save auth state to Chrome storage whenever it changes
 */
pb.authStore.onChange(() => {
  console.log("on changing:",pb.authStore.token);
  
  chrome.storage.local.set({
    laterr_auth: {
      token: pb.authStore.token,
      record: pb.authStore.record,
    }
  });
});


/**
 * Initialize auth store from Chrome storage
 * @returns 
*/
export async function initAuth(): Promise<boolean> {
  return new Promise( (res) => {
    
    // console.log("on initing");
    // console.log(pb.authStore.token);
    // if(await isAuthenticated()){
    //   console.log("on authing");
    //   chrome.storage.local.get('laterr_auth', (x) => {
    //     res(pb.authStore.isValid);
    //     pb.authStore.save(x.laterr_auth.token, x.laterr_auth.record);
    //     console.log(x.laterr_auth);
    //   });
    // }
    
    
    chrome.storage.local.get('laterr_auth',async (x) => {
      console.log("content");
      console.log(x.laterr_auth);
      
      if (x.laterr_auth) {
        await isAuthenticated()
      }
      //   res(false);
      //   return;     
      
      console.log("is valid:",pb.authStore.isValid);
      res(pb.authStore.isValid);
    });
  });
}

/**
 * 
 * @param {string} identity the user email. pb is just being extra
 * @param {string} password 
 * @returns {boolean}
 */
export async function login(identity:string, password:string) {
  try { 
    
    const authData = await pb.collection('users').authWithPassword(
      identity,
      password,
    );
     
    return pb.authStore.isValid;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean}
 */
export async function signup(email:string, password:string,username:string) {
  try {

    
   const payload: IUserPayload={
   email:email,
   name:username,
   password:password,
   passwordConfirm:password
    }

const record = await pb.collection(USERS).create(payload);

await pb.collection(USERS).requestVerification(email);


    return pb.authStore.isValid;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

/**
 *  
 * @returns {boolean}
 */
export async function logout() {
  try {
    pb.authStore.clear();
    await chrome.storage.local.remove(['laterr_auth']);
    return pb.authStore.isValid;
  } catch (error) {
    console.error('Login failed:', error);
    return false;
  }
}

/**
 *  
 * @returns {boolean}
 */
export async function isAuthenticated():Promise<boolean> {
  try {
    const token = await pb.collection(USERS).authRefresh()
      return pb.authStore.isValid;
  } catch (error) {
    // console.warn('User not authenticated');
    return false;
  }
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