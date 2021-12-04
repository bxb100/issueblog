import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'
import {FRIEND_ISSUE_LABEL} from './friend-process'
import {TOP_ISSUE_LABEL} from './top-process'

const UN_LABEL_ISSUE_KEY = '无题'

export async function add_md_label(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {

    const bucket: {[k: string]: Issue[]} = {}
    issues.forEach(i => {
        const labels = i.labels.map(l => {
            if (typeof l === 'object') {
                return l.name || UN_LABEL_ISSUE_KEY
            }
            return l
        }).filter(l => l !== FRIEND_ISSUE_LABEL && l !== TOP_ISSUE_LABEL)

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
        let i = 0
        for (; i < issues.length; i++) {
            if (i === anchorNumber) {
                this.result += '<details><summary>显示更多</summary>\n'
                this.result += '\n'
            }
            this.result += issues[i].mdIssueInfo()
        }
        // because the last i++
        if (i > anchorNumber) {
            this.result += '</details>\n'
            this.result += '\n'
        }
    }
}
