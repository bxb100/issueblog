import * as core from '@actions/core'
import {Constant} from '../common/clazz/constant'
import {Issue} from '../common/clazz/issue'
import {wrapDetails} from '../util/util'
import {Context} from '../common/clazz/context'

export async function add_md_label(context: Context): Promise<void> {
    const issues = context.essayIssues

    const bucket: {[k: string]: Issue[]} = {}

    if (context.config.unlabeled_title) {
        bucket[context.config.unlabeled_title] = []
    }

    for (const issue of issues) {
        if (issue.labels.length === 0 && context.config.unlabeled_title) {
            bucket[context.config.unlabeled_title].push(issue)
            continue
        }
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
