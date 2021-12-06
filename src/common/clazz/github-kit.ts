import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {Comment} from './comment'
import {Config} from '../../util/config'
import {GitHub} from '@actions/github/lib/utils'
import {IComment} from '../interface/comment'
import {IIssue} from '../interface/issue'
import {IRelease} from '../interface/release'
import {Issue} from './issue'
import {ProcessFunction} from '../types/process-function'
import {Reaction} from '../interface/reaction'
import {ReactionContent} from '../enum/reaction-content'
import {Release} from './release'

export class GithubKit<T> {
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
            content
        })
        core.debug(`reactions:\n\n${JSON.stringify(reactions)}\n\n`)
        return reactions.data
    }

    async getIssueComments(issue: IIssue): Promise<Comment[]> {
        const comments = await this.client.rest.issues.listComments({
            owner: this.owner,
            repo: this.repo,
            issue_number: issue.number,
            per_page: 100
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

    async getRelease(page: number): Promise<IRelease[]> {
        const releases = await this.client.rest.repos.listReleases({
            owner: this.owner,
            repo: this.repo,
            per_page: 100,
            page
        })
        core.debug(`releases:\n\n${JSON.stringify(releases)}\n\n`)
        return releases.data
    }

    async getAllReleases(): Promise<Release[]> {
        let page = 1
        let releases: IRelease[] = []
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const result = await this.getRelease(page)
            if (result.length === 0) {
                break
            }
            releases = releases.concat(result)
            page++
        }
        return Release.cast(releases)
    }

    async renderMarkdown(markdown: string): Promise<string> {
        // noinspection ES6RedundantAwait,TypeScriptValidateJSTypes
        const rendered = await this.client.rest.markdown.render({
            text: markdown,
            mode: 'markdown'
        })
        core.debug(`rendered:\n\n${JSON.stringify(rendered)}\n\n`)
        return rendered.data
    }

    async getAllIssues(): Promise<Issue[]> {
        let page = 1
        let issues: Issue[] = []
        // eslint-disable-next-line no-constant-condition
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

    async processIssues(...functions: ProcessFunction<T>[]): Promise<T> {
        const issues: Issue[] = await this.getAllIssues()
        for (const f of functions) {
            try {
                // sub method path under the src
                await f.call(this, issues)
            } catch (error) {
                core.warning(`${f.name} run error: ${error}`)
            }
        }
        return this.result
    }
}
