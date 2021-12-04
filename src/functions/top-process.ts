import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'

export const TOP_ISSUE_LABEL = 'Top'
export const TOP_ISSUE_TITLE = '\n## 置顶文章\n'

export async function add_md_top(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {

    const topIssues = issues
        .filter(issue => issue.containLabel(TOP_ISSUE_LABEL))

    if (topIssues.length <= 0) {
        return
    }

    this.result += TOP_ISSUE_TITLE
    this.result += topIssues.map(i => i.mdIssueInfo()).join('')
}
