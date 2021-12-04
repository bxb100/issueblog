import {context, getOctokit} from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'
import * as core from '@actions/core'
import {IIssue} from '../common/interface/issue'
import {IComment} from '../common/interface/comment'
import {Reaction} from '../common/interface/reaction'
import {ReactionContent} from '../common/enum/reaction-content'
import {Comment} from '../common/clazz/comment'
import {Issue} from '../common/clazz/issue'

export class IssuesUtil {
    readonly client: InstanceType<typeof GitHub>
    readonly owner: string
    readonly repo: string

    constructor(token: string) {
        this.client = getOctokit(token)
        this.owner = context.repo.owner
        this.repo = context.repo.repo
    }

    async isHeartBySelf(comment: IComment): Promise<boolean> {
        const reactions = await this.getCommentReactions(
            comment,
            ReactionContent.HEART
        )
        return !!reactions.find(r => r.user?.login === this.owner)
    }

    async getCommentReactions(
        comment: IComment,
        content?: ReactionContent
    ): Promise<Reaction[]> {
        const reactions = await this.client.rest.reactions.listForIssueComment({
            owner: this.owner,
            repo: this.repo,
            comment_id: comment.id,
            content: content
        })
        core.debug(`reactions:\n\n${JSON.stringify(reactions)}\n\n`)
        return reactions.data
    }

    async getIssueComments(issue: IIssue): Promise<Comment[]> {
        const comments = await this.client.rest.issues.listComments({
            owner: this.owner,
            repo: this.repo,
            issue_number: issue.number
        })
        core.debug(`comments:\n\n${JSON.stringify(comments)}\n\n`)
        return Comment.cast(comments.data)
    }

    async getIssues(page: number): Promise<Issue[]> {
        const issueResult = await this.client.rest.issues.listForRepo({
            owner: this.owner,
            repo: this.repo,
            state: 'open',
            creator: this.owner,
            per_page: 100,
            direction: 'desc',
            page
        })
        core.info(`issueResult:\n\n${JSON.stringify(issueResult.data)}\n\n`)
        return Issue.cast(issueResult.data)
    }

    async processIssues<T>(
        page: Readonly<number> = 1,
        result: T,
        ...functions: Function[]
    ): Promise<T> {
        const issues: Issue[] = await this.getIssues(page)
        if (issues.length <= 0) {
            return result
        }
        for (const f of functions) {
            result = await f.call(this, issues, result)
        }
        // Do the next page
        return this.processIssues(page + 1, result, ...functions)
    }
}
