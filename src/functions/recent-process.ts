import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'

export const RECENT_ISSUE_LIMIT_DEFAULT = 5
export const RECENT_ISSUE_TITLE = '## 最近更新\n'

export async function add_md_recent(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {
    let limit = RECENT_ISSUE_LIMIT_DEFAULT
    if (this.config.recent_limit) {
        limit = parseInt(this.config.recent_limit)
    }

    const recentIssues = issues
        .filter(issue => issue.isOwnBy(this.owner))
        .slice(0, limit)

    this.result += RECENT_ISSUE_TITLE
    this.result += recentIssues.map(i => i.mdIssueInfo()).join('')
}
