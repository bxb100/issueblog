import {IIssue} from '../common/interface/issue'
import {IComment} from '../common/interface/comment'

export function isOwnBy(obj: IIssue | IComment, username: string): boolean {
    return obj.user?.login === username
}

type wrapper<T> = (value: T) => string

export function wrapDetails<T>(shows: T[], hides: T[], wrapper: wrapper<T>): string {
    let result: string = ''

    if (shows.length != 0) {
        result += shows.map(wrapper).join('')
    }

    if (hides.length != 0) {
        result += '<details><summary>显示更多</summary>'
        result += '\n'

        result += hides.map(wrapper).join('')

        result += '</details>'
        result += '\n'
    }
    result += '\n'
    return result
}
