export interface IBookmark {
    id: string
    user_id: string
    title: string
    url: string
    last_visited: Date
    tags_fk: Array<string>
    active: boolean
    // collectionName: string
}

export interface IBookmarkRequestPayload extends Omit<IBookmark, "id" | "last_visited"> { }
