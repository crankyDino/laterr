import PocketBase from "pocketbase";

export const pb = new PocketBase(process.env.REPO);

pb.autoCancellation(false);
