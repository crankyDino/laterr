import type { IUser, IUserPayload } from "../../lib/models/user.model";
import { goLogin } from "../handlers/login.handler";
import { pb } from "./repo.service";

const COLLECTION_USERS = "users";

/**
 * Save auth state to Chrome storage whenever it changes
 */
pb.authStore.onChange(() => {
  console.log("on changing:", pb.authStore.token);

  // TO-DO: use ephemeral store...eventually
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
  return new Promise((res) => {
    chrome.storage.local.get("laterr_auth", async (x) => {
      if (!x.laterr_auth || Object.values(x.laterr_auth).some(x => x === null)) {
        res(false);
        return;
      }

      pb.authStore.save(x.laterr_auth?.token, x.laterr_auth?.record);

      await pb.collection(COLLECTION_USERS).authRefresh();
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

    const record = await pb.collection(COLLECTION_USERS).create(payload);

    await pb.collection(COLLECTION_USERS).requestVerification(email);

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
    await chrome.storage.local.remove("laterr_auth");
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

    await pb.collection(COLLECTION_USERS).authRefresh();

    return pb.authStore.isValid;
  } catch (error) {
    // console.warn('User not authenticated');
    return false;
  }
}

/**
 *
 * @returns {IUser | null}
 */
export async function getCurrentUser(): Promise<IUser | null> {
  try {
    if (!pb.authStore.token) { return null; }

    await pb.collection(COLLECTION_USERS).authRefresh();

    return pb.authStore.record! as IUser;
  } catch (error) {
    // console.warn('User not authenticated');
    return null;
  }
}

