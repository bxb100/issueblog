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
    // ignore issue with empty label or
    // label equal ignore case _LINKS_, _TOP_ or _TODO_
    const filterIssues = issues.filter(
        issue =>
            !issue.labels
                .map(l => Issue.getLabelValue(l))
                .map(l => l && l.toLowerCase())
                .some(l => {
                    return (
                        l === '' ||
                        l === Constant.LINKS.toLowerCase() ||
                        l === Constant.TOP.toLowerCase() ||
                        l === Constant.TODO.toLowerCase()
                    )
                })
    )
    for (const issue of filterIssues) {
        for (const label of issue.labels) {
            const labelValue = Issue.getLabelValue(label)
            if (labelValue) {
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
    kit.sectionMap.set(Constant.EACH_LABEL, labelSection)
}
