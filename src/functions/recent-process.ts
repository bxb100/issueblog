import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'

export const RECENT_ISSUE_TITLE = '\n## 最近更新\n'

export async function add_md_recent(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {
    let  limit = parseInt(this.config.recent_limit)

    const recentIssues = issues
        .filter(issue => issue.isOwnBy(this.owner))
        .slice(0, limit)

    this.result += RECENT_ISSUE_TITLE
    this.result += recentIssues.map(i => i.mdIssueInfo()).join('')
}
