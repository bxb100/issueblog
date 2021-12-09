import {GithubKit} from './github-kit'
import {IComment} from '../interface/comment'
import {IUser} from '../interface/user'
import {Reactions} from '../interface/reactions'

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

    async isHeartBySelf(util: GithubKit): Promise<boolean> {
        if (this._existHeartReaction()) {
            return util.isHeartBySelf(this)
        }
        return Promise.resolve(false)
    }

    private _existHeartReaction(): boolean {
        return (this.reactions?.heart || 0) >= 1
    }
}
