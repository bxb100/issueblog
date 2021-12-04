import {IComment} from '../interface/comment'
import {Reactions} from '../interface/reactions'
import {IUser} from '../interface/user'
import {IssuesUtil} from '../../util/issue-kit'

export class Comment implements IComment {

    readonly id: number
    readonly user: IUser | null
    readonly reactions: Reactions | undefined
    readonly body: string | undefined

    constructor(comment: Readonly<IComment>) {
        this.id = comment.id
        this.user = comment.user
        this.body = comment.body
        this.reactions = comment.reactions
    }

    static cast(comments: Readonly<IComment[]>): Comment[] {
        return comments.map((c: IComment): Comment => new Comment(c))
    }

    isHeartBySelf(util: IssuesUtil): Promise<boolean> {
        if (this._existHeartReaction()) {
            return util.isHeartBySelf(this)
        }
        return Promise.resolve(false)
    }

    private _existHeartReaction(): boolean {
        return this.reactions?.heart === 1
    }
}
