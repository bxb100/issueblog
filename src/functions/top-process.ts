import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'

export const TOP_ISSUE_LABEL = 'Top'
export const TOP_ISSUE_TITLE = '\n## 置顶文章\n'

export async function add_md_top(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {

    const selfTopIssues = issues
        .filter(issue => issue.containsLabel(TOP_ISSUE_LABEL) && issue.isOwnBy(this.owner))

    if (selfTopIssues.length <= 0) {
        return
    }

    this.result += TOP_ISSUE_TITLE
    this.result += selfTopIssues.map(i => i.mdIssueInfo()).join('')
}
