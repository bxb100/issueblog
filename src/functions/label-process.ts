import {FRIEND_ISSUE_LABEL} from './friend-process'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'
import {TODO_ISSUE_LABEL} from './todo-process'
import {TOP_ISSUE_LABEL} from './top-process'
import {wrapDetails} from '../util/util'

export async function add_md_label(
    this: GithubKit<string>,
    issues: Issue[]
): Promise<void> {
    const bucket: {[k: string]: Issue[]} = {}
    for (const issue of issues) {
        const labels = issue.labels
            .map(l => {
                if (typeof l === 'object') {
                    return l.name || this.config.unlabeled_title
                }
                return l
            })
            .filter(
                l =>
                    l !== FRIEND_ISSUE_LABEL &&
                    l !== TOP_ISSUE_LABEL &&
                    l !== TODO_ISSUE_LABEL
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
    const anchorNumber: number = parseInt(this.config.anchor_number)

    for (const key of Object.keys(bucket).sort((a, b) => a.localeCompare(b))) {
        this.result += `\n## ${key}\n`
        const issueList = bucket[key]

        this.result += wrapDetails(
            issueList.slice(0, anchorNumber),
            issueList.slice(anchorNumber),
            i => i.mdIssueInfo()
        )
    }
}
