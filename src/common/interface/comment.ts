import {IUser} from './user'
import {Reactions} from './reactions'

export interface IComment {
    id: number
    user: IUser | null
    body?: string
    reactions?: Reactions
}
