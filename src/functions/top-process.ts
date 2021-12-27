import * as core from '@actions/core'
import {Config} from '../util/config'
import {Constant} from '../common/clazz/constant'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'

export const TOP_ISSUE_TITLE = (config: Config): string =>
    `\n## ${config.top_title}\n`

export async function add_md_top(
    kit: GithubKit,
    issues: Issue[]
): Promise<void> {
    const topIssues = issues.filter(i => i.containLabel(Constant.FIXED_TOP))

    if (topIssues.length <= 0) {
        return
    }

    let topSection: string = TOP_ISSUE_TITLE(kit.config)
    topSection += topIssues.map(i => i.mdIssueInfo()).join('')
    core.debug(`topSection: ${topSection}`)

    kit.sectionMap.set(Constant.FIXED_TOP, topSection)
}
