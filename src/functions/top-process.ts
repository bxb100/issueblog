import {IssuesKit} from '../common/clazz/issue-kit'
import {Issue} from '../common/clazz/issue'
import {Config} from "../util/config";

export const TOP_ISSUE_LABEL = 'Top'
export const TOP_ISSUE_TITLE = (config: Config) => `\n## ${config.top_title}\n`

export async function add_md_top(
    this: IssuesKit<string>,
    issues: Issue[]
): Promise<void> {

    const topIssues = issues
        .filter(issue => issue.containLabel(TOP_ISSUE_LABEL))

    if (topIssues.length <= 0) {
        return
    }

    this.result += TOP_ISSUE_TITLE(this.config)
    this.result += topIssues.map(i => i.mdIssueInfo()).join('')
}
