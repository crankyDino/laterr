import PocketBase from "pocketbase";
import type { IUserPayload } from "../../lib/models/user.model";
import { goLogin } from "../handlers/login.handler";

const pb = new PocketBase("http://192.168.0.21:80");
pb.autoCancellation(false);
const USERS = "users";

/**
 * Save auth state to Chrome storage whenever it changes
 */
pb.authStore.onChange(() => {
  console.log("on changing:", pb.authStore.token);

  chrome.storage.local.set({
    laterr_auth: {
      token: pb.authStore.token,
      record: pb.authStore.record,
    },
  });
});

/**
 * Initialize auth store from Chrome storage
 * @returns
 */
export async function initAuth(): Promise<boolean> {
  return new Promise((res) => {
    chrome.storage.local.get("laterr_auth", async (x) => {
      if (!x.laterr_auth) { res(false); }

      pb.authStore.save(x.laterr_auth.token, x.laterr_auth.record);

      await pb.collection(USERS).authRefresh();
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
export async function login(identity: string, password: string) {
  try {
    const authData = await pb
      .collection("users")
      .authWithPassword(identity, password);

    return pb.authStore.isValid;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}

/**
 *
 * @param {string} email
 * @param {string} password
 * @returns {boolean}
 */
export async function signup(
  email: string,
  password: string,
  username: string
) {
  try {
    const payload: IUserPayload = {
      email: email,
      name: username,
      password: password,
      passwordConfirm: password,
    };

    const record = await pb.collection(USERS).create(payload);

    await pb.collection(USERS).requestVerification(email);

    return pb.authStore.isValid;
  } catch (error) {
    console.error("Login failed:", error);
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
    await chrome.storage.local.remove(["laterr_auth"]);
    goLogin();
    return pb.authStore.isValid;
  } catch (error) {
    console.error("Login failed:", error);
    return false;
  }
}

/**
 *
 * @returns {boolean}
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    if (!pb.authStore.token) { return false; }

    await pb.collection(USERS).authRefresh();

    return pb.authStore.isValid;
  } catch (error) {
    // console.warn('User not authenticated');
    return false;
  }
}

