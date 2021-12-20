import {Config} from '../util/config'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'

export const TOP_ISSUE_LABEL = 'Top'
export const TOP_ISSUE_TITLE = (config: Config): string =>
    `\n## ${config.top_title}\n`

export async function add_md_top(
    this: GithubKit<string>,
    issues: Issue[]
): Promise<void> {
    const topIssues = issues.filter(issue =>
        issue.containLabel(TOP_ISSUE_LABEL)
    )

    if (topIssues.length <= 0) {
        return
    }

    this.result += TOP_ISSUE_TITLE(this.config)
    this.result += topIssues.map(i => i.mdIssueInfo()).join('')
}
