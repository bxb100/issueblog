import * as core from '@actions/core'
import {Constant} from '../common/clazz/constant'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'
import {wrapDetails} from '../util/util'

export async function add_md_label(
    kit: GithubKit,
    issues: Issue[]
): Promise<void> {
    const bucket: {[k: string]: Issue[]} = {}
    for (const issue of issues) {
        for (const label of issue.labels) {
            const labelValue = Issue.getLabelValue(label)
            // don't need top, todo, link category
            if (
                labelValue &&
                labelValue.toLowerCase() !== Constant.FIXED_LINKS.toLowerCase() &&
                labelValue.toLowerCase() !== Constant.FIXED_TODO.toLowerCase() &&
                labelValue.toLowerCase() !== Constant.FIXED_TOP.toLowerCase()
            ) {
                if (!bucket[labelValue]) {
                    bucket[labelValue] = []
                }
                bucket[labelValue].push(issue)
            }
        }
    }
    const anchorNumber: number = parseInt(kit.config.anchor_number)

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
    kit.sectionMap.set(Constant.AGG_EACH_LABEL, labelSection)
}
