import {IIssue} from '../common/interface/issue'
import {IComment} from '../common/interface/comment'
import {WrapperToString} from "../common/types/wrapper-to-string";
import {Issue} from "../common/clazz/issue";

export function isOwnBy(obj: IIssue | IComment, username: string): boolean {
    return obj.user?.login === username
}

export function wrapDetails<T>(shows: T[], hides: T[], wrapper: WrapperToString<T>): string {
    let result: string = ''

    if (shows.length != 0) {
        result += shows.map(wrapper).join('')
    }

    if (hides.length != 0) {
        result += '<details><summary>MORE</summary>'
        result += '\n\n'

        result += hides.map(wrapper).join('')

        result += '</details>'
        result += '\n'
    }
    result += '\n'
    return result
}

export function backupFileName(issue: Issue): string {
    return `${issue.number}-${issue.title.replace(' ', '.')}.md`;
}
