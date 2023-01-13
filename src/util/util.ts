import {IComment} from '../common/interface/comment'
import {IIssue} from '../common/interface/issue'
import {IsoDateString} from '../common/types/iso-date-string'
import {Issue} from '../common/clazz/issue'
import {MetadataInfo} from '../common/types/metadata'
import {WrapperToString} from '../common/types/wrapper-to-string'

export function isOwnBy(obj: IIssue | IComment, username: string): boolean {
    return obj.user?.login === username
}

export function wrapDetails<T>(
    shows: T[],
    hides: T[],
    wrapper: WrapperToString<T>
): string {
    let result = ''

    if (shows.length !== 0) {
        result += shows.map(wrapper).join('')
    }

    if (hides.length !== 0) {
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
    return `${issue.number}.md`
}

export function compareUpdateTime(a: MetadataInfo, b: IsoDateString): number {
    return new Date(a.updatedAt).getTime() - Date.parse(b)
}
