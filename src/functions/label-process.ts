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
        const labels = issue.labels
            .map(l => Issue.getLabelValue(l) || kit.config.unlabeled_title)
            .filter(
                l =>
                    l !== Constant.FRIEND &&
                    l !== Constant.TOP &&
                    l !== Constant.TODO
            )

        // ignore issue without label or
        // label in FRIEND_ISSUE_LABEL or TOP_ISSUE_LABEL or TODO_ISSUE_LABEL
        for (const label of labels) {
            if (!bucket[label]) {
                bucket[label] = []
            }
            bucket[label].push(issue)
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
