import {Config} from '../util/config'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'

export const RECENT_ISSUE_TITLE = (config: Config): string =>
    `\n## ${config.recent_title}\n`

export async function add_md_recent(
    this: GithubKit<string>,
    issues: Issue[]
): Promise<void> {
    const limit = parseInt(this.config.recent_limit)

    const recentIssues = issues.slice(0, limit)

    this.result += RECENT_ISSUE_TITLE(this.config)
    this.result += recentIssues.map(i => i.mdIssueInfo()).join('')
}
