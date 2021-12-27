import * as core from '@actions/core'
import {Config} from '../util/config'
import {Constant} from '../common/clazz/constant'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'

export const RECENT_ISSUE_TITLE = (config: Config): string =>
    `\n## ${config.recent_title}\n`

export async function add_md_recent(
    kit: GithubKit,
    issues: Issue[]
): Promise<void> {
    const limit = parseInt(kit.config.recent_limit)

    const recentIssues = issues.slice(0, limit)

    let recentSection: string = RECENT_ISSUE_TITLE(kit.config)
    recentSection += recentIssues.map(i => i.mdIssueInfo()).join('')
    core.debug(`recentSection: ${recentSection}`)

    kit.sectionMap.set(Constant.FIXED_RECENT, recentSection)
}
