import * as core from '@actions/core'
import {Config} from '../util/config'
import {Constant} from '../common/clazz/constant'
import {BlogContext} from '../common/clazz/blog-context'

export const RECENT_ISSUE_TITLE = (config: Config): string =>
    `\n## ${config.recent_title}\n`

export async function add_md_recent(context: BlogContext): Promise<void> {
    const limit = parseInt(context.config.recent_limit)

    const recentIssues = context.essayIssues.slice(0, limit)

    let recentSection: string = RECENT_ISSUE_TITLE(context.config)
    recentSection += recentIssues.map(i => i.mdIssueInfo()).join('')
    core.debug(`recentSection: ${recentSection}`)

    context.sectionMap.set(Constant.FIXED_RECENT, recentSection)
}
