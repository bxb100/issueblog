import {IUser} from './user'

export interface Reaction {
    user: IUser | null
    content: string
}
