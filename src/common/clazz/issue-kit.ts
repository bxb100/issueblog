import {context, getOctokit} from '@actions/github'
import {GitHub} from '@actions/github/lib/utils'
import * as core from '@actions/core'
import {IIssue} from '../interface/issue'
import {IComment} from '../interface/comment'
import {Reaction} from '../interface/reaction'
import {ReactionContent} from '../enum/reaction-content'
import {Comment} from './comment'
import {Issue} from './issue'
import {Config} from '../../util/config'

export class IssuesKit<T> {

    readonly client: InstanceType<typeof GitHub>
    readonly owner: string
    readonly repo: string
    readonly config: Config
    result: T

    constructor(config: Config, initResult: T) {
        this.config = config
        this.client = getOctokit(config.github_token)
        this.owner = context.repo.owner
        this.repo = context.repo.repo
        this.result = initResult
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
        core.debug(`issueResult:\n\n${JSON.stringify(issueResult.data)}\n\n`)
        return Issue.cast(issueResult.data)
    }

    async getAllIssues(): Promise<Issue[]> {
        let page = 1
        let issues: Issue[] = []
        while (true) {
            const result = await this.getIssues(page)
            if (result.length === 0) {
                break
            }
            issues = issues.concat(result)
            page++
        }
        return issues
    }

    async processIssues(...functions: Function[]): Promise<T> {
        const issues: Issue[] = await this.getAllIssues()
        for (const f of functions) {
            try {
                await f.call(this, issues)
            } catch (error) {
                core.warning(`${f.name} run error: ${error}`)
            }
        }
        return this.result
    }
}
