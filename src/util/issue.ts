import {context, getOctokit} from "@actions/github"
import {GitHub} from "@actions/github/lib/utils";
import * as core from "@actions/core";
import {IIssue} from "../common/interface/issue";
import {IComment} from "../common/interface/comment";
import {Reaction} from "../common/interface/reaction";
import {ReactionContent} from "../common/enum/reaction-content";

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
        const reactions = await this.getCommentReactions(comment, ReactionContent.HEART);
        core.debug(`reactions: ${JSON.stringify(reactions)}`)
        return reactions.filter(r => r.user?.login === this.owner).length > 0
    }

    async getCommentReactions(comment: IComment, content?: ReactionContent): Promise<Reaction[]> {
        const reactions = await this.client.reactions.listForIssueComment({
            owner: this.owner,
            repo: this.repo,
            comment_id: comment.id,
            content: content
        });
        core.debug(`reactions: ${JSON.stringify(reactions)}`)
        return reactions.data;
    }

    async getIssueComments(issue: IIssue): Promise<IComment[]> {
        const comments = await this.client.issues.listComments({
            owner: this.owner,
            repo: this.repo,
            issue_number: issue.number
        })
        core.debug(`comments: ${JSON.stringify(comments)}`)
        return comments.data;
    }

    async getIssues(page: number): Promise<IIssue[]> {
        const issueResult =
            await this.client.issues.listForRepo({
                owner: this.owner,
                repo: this.repo,
                state: 'open',
                creator: this.owner,
                per_page: 100,
                direction: 'desc',
                page
            });
        core.debug(`issueResult: ${JSON.stringify(issueResult)}`)
        return issueResult.data;
    }

    async processIssues<T>(page: Readonly<number> = 1, result: T, ...functions: Function[]): Promise<T> {
        const issues: IIssue[] = await this.getIssues(page);
        if (issues.length < 0) {
            return result;
        }
        functions.forEach(f => {
            result = f.call(this, issues, result);
        });
        // Do the next page
        return this.processIssues(page + 1, result, ...functions);
    }
}
