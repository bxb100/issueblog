import {IssuesKit} from '../common/clazz/issue-kit'
import {Issue} from '../common/clazz/issue'
import {FRIEND_ISSUE_LABEL} from './friend-process'
import {TOP_ISSUE_LABEL} from './top-process'
import {TODO_ISSUE_LABEL} from './todo-process'
import {wrapDetails} from '../util/util'

const UN_LABEL_ISSUE_KEY = '无题'

export async function add_md_label(
    this: IssuesKit<string>,
    issues: Issue[]
): Promise<void> {

    const bucket: {[k: string]: Issue[]} = {}
    issues.forEach(i => {
        const labels = i.labels.map(l => {
            if (typeof l === 'object') {
                return l.name || UN_LABEL_ISSUE_KEY
            }
            return l
        }).filter(l => l !== FRIEND_ISSUE_LABEL && l !== TOP_ISSUE_LABEL && l !== TODO_ISSUE_LABEL)

        // ignore issue without label or
        // label in FRIEND_ISSUE_LABEL or TOP_ISSUE_LABEL or TODO_ISSUE_LABEL
        labels.forEach(l => {
            if (!bucket[l]) {
                bucket[l] = []
            }
            bucket[l].push(i)
        })
    })
    const anchorNumber: number = parseInt(this.config.anchor_number)

    for (const key of Object.keys(bucket).sort()) {
        this.result += `\n## ${key}\n`
        const issues = bucket[key]

        this.result += wrapDetails(
            issues.slice(0, anchorNumber),
            issues.slice(anchorNumber),
            i => i.mdIssueInfo()
        )
    }
}
