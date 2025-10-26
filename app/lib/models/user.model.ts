export interface IUser {
    id: string
    avatar?: string
    collectionId: string
    collectionName: string
    tokenKey: string
    created: string
    email: string
    emailVisibility: boolean
    name: string
    updated: string
    verified: boolean
}

export interface IUserPayload extends Pick<IUser, "name" | "email"  | "avatar"> {
    password: string,
    passwordConfirm: string
} 