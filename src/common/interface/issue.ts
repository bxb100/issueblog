import {IAssignee} from './assignee'
import {ILabel} from './label'
import {IMilestone} from './milestone'
import {IUser} from './user'
import {IsoDateString} from '../types/iso-date-string'

export interface IIssue {
    title: string
    number: number
    created_at: IsoDateString
    updated_at: IsoDateString
    labels: (string | ILabel)[]
    pull_request?: Object | null
    state: string
    locked: boolean
    milestone?: IMilestone | null
    user: IUser | null
    assignees?: IAssignee[] | null
    comments: number
    html_url: string
    body?: string | null
}
