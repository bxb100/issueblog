import {IUser} from './user'
import {Reactions} from './reactions'
import {IContent} from './issue'

export interface IComment extends IContent {
    id: number
    user: IUser | null
    reactions?: Reactions
}
