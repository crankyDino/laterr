export interface IUser {
    avatar?: string
    collectionId: string
    collectionName: string
    tokenKey: string
    created: string
    email: string
    emailVisibility: boolean
    id: string
    name: string
    updated: string
    verified: boolean
}


export interface IUserPayload extends Pick<IUser, "name" | "email"  | "avatar"> {
    password: string,
    passwordConfirm: string
} 