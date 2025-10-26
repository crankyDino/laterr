import { pb } from "./repo.service";
import type { IBookmark, IBookmarkRequestPayload } from "../../lib/models/bookmark.model";

// fetch a paginated records list
// const resultList = await pb.collection('bookmarks').getList(1, 50, );

// you can also fetch all records at once via getFullList
export async function getBookmarks(): Promise<Array<IBookmark>> {
    return await pb.collection('bookmarks').getFullList({ filter: 'active = true' });
}

export async function createBookmark(payload: IBookmarkRequestPayload): Promise<IBookmark> {
    return await pb.collection('bookmarks').create<IBookmark>(payload);
}

export async function updateBookmark(id: string, payload: IBookmarkRequestPayload): Promise<IBookmark> {
    payload.active = false;
    return await pb.collection('bookmarks').update<IBookmark>(id, payload);
}
// or fetch only the first record that matches the specified filter
// const record = await pb.collection('bookmarks').getFirstListItem('someField="test"', {
//     expand: 'relField1,relField2.subRelField',
// });

