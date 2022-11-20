import * as core from '@actions/core'
import {Constant} from '../common/clazz/constant'
import {Issue} from '../common/clazz/issue'
import {wrapDetails} from '../util/util'
import {BlogContext} from '../common/clazz/blogContext'

export async function add_md_label(context: BlogContext): Promise<void> {
    const issues = context.essayIssues

    const bucket: {[k: string]: Issue[]} = {}
    for (const issue of issues) {
        for (const label of issue.labels) {
            const labelValue = Issue.getLabelValue(label)
            // skip save `top` label to bucket
            if (
                labelValue &&
                labelValue.toLowerCase() !== Constant.FIXED_TOP.toLowerCase()
            ) {
                if (!bucket[labelValue]) {
                    bucket[labelValue] = []
                }
                bucket[labelValue].push(issue)
            }
        }
    }
    const anchorNumber: number = parseInt(context.config.anchor_number)

    let labelSection = ''
    for (const key of Object.keys(bucket).sort((a, b) => a.localeCompare(b))) {
        labelSection += `\n## ${key}\n`
        const issueList = bucket[key]

        labelSection += wrapDetails(
            issueList.slice(0, anchorNumber),
            issueList.slice(anchorNumber),
            i => i.mdIssueInfo()
        )
    }
    core.debug(`labelSection: ${labelSection}`)
    context.sectionMap.set(Constant.AGG_EACH_LABEL, labelSection)
}
