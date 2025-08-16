import PocketBase from 'pocketbase';

const pb = new PocketBase('http://192.168.0.21');

/**
 * 
 * @param {string} email 
 * @param {string} password 
 * @returns {boolean}
 */
async function login(email,password) {
    const authData = await pb.collection('users').authWithPassword(
        email,
        password,
    );

    // after the above you can also access the auth data from the authStore
    console.log(pb.authStore.isValid);
    console.log(pb.authStore.token);
    console.log(pb.authStore.record.id);

    // "logout"
    pb.authStore.clear();
}

export {
    login
}