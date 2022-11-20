import * as core from '@actions/core'
import {Config} from '../util/config'
import {Constant} from '../common/clazz/constant'
import {BlogContext} from '../common/clazz/blogContext'

export const TOP_ISSUE_TITLE = (config: Config): string =>
    `\n## ${config.top_title}\n`

export async function add_md_top(context: BlogContext): Promise<void> {
    const topIssues = context.getIssues(Constant.FIXED_TOP)

    if (topIssues.length <= 0) {
        return
    }

    let topSection: string = TOP_ISSUE_TITLE(context.config)
    topSection += topIssues.map(i => i.mdIssueInfo()).join('')
    core.debug(`topSection: ${topSection}`)

    context.sectionMap.set(Constant.FIXED_TOP, topSection)
}
