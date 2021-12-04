import {IIssue} from '../interface/issue'
import {IMilestone} from '../interface/milestone'
import {IsoDateString} from '../types/iso-date-string'
import {IAssignee} from '../interface/assignee'
import {ILabel} from '../interface/label'
import {IUser} from '../interface/user'

export class Issue implements IIssue {

    readonly assignees: IAssignee[] | null | undefined
    readonly comments: number
    readonly created_at: IsoDateString
    readonly created_at_sub: string
    readonly labels: (string | ILabel)[]
    readonly locked: boolean
    readonly milestone: IMilestone | null | undefined
    readonly number: number
    readonly pull_request: Object | null | undefined
    readonly state: string
    readonly title: string
    readonly updated_at: IsoDateString
    readonly user: IUser | null
    readonly html_url: string

    constructor(data: IIssue) {
        this.assignees = data.assignees
        this.comments = data.comments
        this.created_at = data.created_at
        this.labels = data.labels
        this.locked = data.locked
        this.milestone = data.milestone
        this.number = data.number
        this.pull_request = data.pull_request
        this.state = data.state
        this.title = data.title
        this.updated_at = data.updated_at
        this.user = data.user
        this.html_url = data.html_url

        // easy way get yyyy-MM-dd
        this.created_at_sub = this.created_at.substring(0, 10)
    }

    static cast(data: IIssue[]): Issue[] {
        return data.map(data => new Issue(data))
    }

    containLabel(label: string): boolean {
        return this.labels.some(l => {
            if (typeof l === 'string') {
                return l === label
            } else if (typeof l === 'object') {
                return l.name === label
            }
            return false
        })
    }

    isOwnBy(username: string): boolean {
        return this.user?.login === username
    }

    mdIssueInfo() {
        return `- [${this.title}](${this.html_url})---${this.created_at_sub}\n`
    }
}
