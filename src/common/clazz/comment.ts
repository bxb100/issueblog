import {GithubKit} from './github-kit'
import {IComment} from '../interface/comment'
import {IUser} from '../interface/user'
import {Reactions} from '../interface/reactions'

export class Comment implements IComment {
    readonly id: number
    readonly user: IUser | null
    readonly reactions: Reactions | undefined

    constructor(comment: Readonly<IComment>) {
        this.id = comment.id
        this.user = comment.user
        this._body = comment.body
        this.reactions = comment.reactions
    }

    private _body: string | null | undefined

    get body(): string | undefined | null {
        return this._body
    }

    set body(body: string | undefined | null) {
        this._body = body
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
