import * as core from '@actions/core'
import {context, getOctokit} from '@actions/github'
import {Comment} from './comment'
import {GitHub} from '@actions/github/lib/utils'
import {IComment} from '../interface/comment'
import {IIssue} from '../interface/issue'
import {IRelease} from '../interface/release'
import {Issue} from './issue'
import {Reaction} from '../interface/reaction'
import {ReactionContent} from '../enum/reaction-content'
import {Release} from './release'

export class GithubKit {
    readonly client: InstanceType<typeof GitHub>

    constructor(token: string) {
        this.client = getOctokit(token)
    }

    get owner(): string {
        return context.repo.owner
    }

    get repo(): string {
        return context.repo.repo
    }

    async isHeartBySelf(comment: IComment): Promise<boolean> {
        const reactions = await this.getIssueCommentReactions(
            comment,
            ReactionContent.HEART
        )
        return !!reactions.find(r => r.user?.login === this.owner)
    }

    async getIssueCommentReactions(
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

    async renderMarkdown(markdown: string | undefined): Promise<string> {
        if (markdown === undefined) {
            return 'Empty'
        }
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
}
