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
    const referenceLinks: string[] = []
    const otherReferenceLinks: string[] = []
    let index = 1

    function replaceReferenceLink(content: Issue | IComment): void {
        if (!content.body) return
        const mapping = new Map<string, string>()
        const referLinks: string[] = []

        // eslint-disable-next-line github/array-foreach
        content.body.match(/\[\^\w+]:\s*.+/g)?.forEach(link => {
            content.body = content.body?.replace(link, '')
            referLinks.push(link)
        })

        for (const ref of content.body.match(/\[\^\d](?!:)/g) || []) {
            // if not add prefix `$$`, it will recursive replace
            content.body = content.body.replace(ref, `[^$-${index}]`)
            mapping.set(ref, `[^${index}]`)
            index++
        }
        content.body = content.body?.replace(/\^\$-/g, '^')

        // order the reference links
        for (const ref of mapping.keys()) {
            for (const link of referLinks) {
                if (link.startsWith(ref)) {
                    referenceLinks.push(
                        link.replace(ref, mapping.get(ref) || '')
                    )
                    // remove from link
                    referLinks.splice(referLinks.indexOf(link), 1)
                    break
                }
            }
        }
        // some other not with number reference links
        if (referLinks.length !== 0) {
            otherReferenceLinks.push(...referLinks)
        }
    }

    replaceReferenceLink(issue)
    // eslint-disable-next-line github/array-foreach
    comments.forEach(replaceReferenceLink)

    // add them to the top of the links
    referenceLinks.unshift(...otherReferenceLinks)
    return referenceLinks.reduce((p, c) => {
        return `${p}\n${c}`
    }, '')
}
