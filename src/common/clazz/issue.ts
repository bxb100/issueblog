import {GithubKit} from './github-kit'
import {IAssignee} from '../interface/assignee'
import {IIssue} from '../interface/issue'
import {ILabel} from '../interface/label'
import {IMilestone} from '../interface/milestone'
import {IUser} from '../interface/user'
import {IsoDateString} from '../types/iso-date-string'

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
    readonly body: string | null | undefined

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
        this.body = data.body

        // easy way get yyyy-MM-dd
        this.created_at_sub = this.created_at.substring(0, 10)
    }

    static cast(data: IIssue[]): Issue[] {
        return data.map(d => new Issue(d))
    }

    static getLabelValue(label: string | ILabel): string | undefined {
        if (typeof label === 'object') {
            return label.name
        }
        return label
    }

    getLabelName(kit: GithubKit): string[] {
        return this.labels
            .map(l => Issue.getLabelValue(l) || kit.config.unlabeled_title)
            .filter(Boolean)
    }

    containLabel(label: string): boolean {
        label = label.toLowerCase().trim()
        return this.labels.some(
            l => Issue.getLabelValue(l)?.toLowerCase() === label
        )
    }

    bodyToLines(): string[] {
        return this.body?.split('\n').map(line => line.trim()) || []
    }

    mdIssueInfo(): string {
        return `- [${this.title}](${this.html_url})---${this.created_at_sub}\n`
    }
}
