import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'
import {FRIEND_ISSUE_LABEL} from './friend-process'
import {TOP_ISSUE_LABEL} from './top-process'

const UN_LABEL_ISSUE_KEY = '无题'

export async function add_md_label(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {

    const otherIssues = issues
        .filter(issues => issues.notContainLabels(FRIEND_ISSUE_LABEL, TOP_ISSUE_LABEL))

    const bucket: {[k: string]: Issue[]} = {}
    bucket[UN_LABEL_ISSUE_KEY] = []
    otherIssues.forEach(i => {
        const labels = i.labels.map(l => {
            if (typeof l === 'object') {
                return l.name
            }
            return l
        })

        labels.forEach(l => {
            if (l === undefined) {
                bucket[UN_LABEL_ISSUE_KEY].push(i)
            } else {
                if (bucket[l] === undefined) {
                    bucket[l] = []
                }
                bucket[l].push(i)
            }
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
