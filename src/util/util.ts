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
    return `${issue.number}-${issue.title.replace(/\t|\s/g, '_')}.md`
}

export function compareUpdateTime(a: MetadataInfo, b: IsoDateString): number {
    return new Date(a.updatedAt).getTime() - Date.parse(b)
}

export function unifyReferToNumber(issue: Issue, comments: IComment[]): string {
    let n = 1
    const referenceLinks: string[] = []

    function replaceReferenceLink(content: Issue | IComment): void {
        if (!content.body) return
        // remove all the reference links
        for (const ref of content.body.match(/\[\^\d](?!:)/gm) || []) {
            const number = ref.slice(2, -1)
            const rg = RegExp(`\\[\\^${number}]:\\s*.+`, 'gm')
            // eslint-disable-next-line github/array-foreach
            content.body.match(rg)?.forEach(link => {
                content.body = content.body?.replace(link, '')
                referenceLinks.push(link.replace(/(^\[\^\d+]:\s*)/, ''))
            })
            content.body = content.body.replace(ref, `[^${n++}]`)
        }
    }

    replaceReferenceLink(issue)

    for (const comment of comments) {
        replaceReferenceLink(comment)
    }

    return referenceLinks.reduce((p, c, index) => {
        return `${p}\n[^${index + 1}]: ${c}`
    }, '')
}
