import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'

const TOP_ISSUE_LABEL = 'Top'
const TOP_ISSUE_TITLE = '\n## 置顶文章\n'

function _makeTopString(issue: Issue): string {
    return `- [${issue.title}](${issue.html_url})---${issue.created_at_sub}\n`
}

export async function add_md_top(
    this: IssuesUtil,
    issues: Issue[],
    result: string
): Promise<string> {

    const selfTopIssues = issues
        .filter(issue => issue.containsLabel(TOP_ISSUE_LABEL) && issue.isOwnBy(this.owner))

    if (selfTopIssues.length <= 0) {
        return result
    }

    result += TOP_ISSUE_TITLE
    result += selfTopIssues.map(_makeTopString).join('')
    return result
}
