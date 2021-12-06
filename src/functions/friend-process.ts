import * as core from '@actions/core'
import {Comment} from '../common/clazz/comment'
import {Config} from '../util/config'
import {GithubKit} from '../common/clazz/github-kit'
import {IComment} from '../common/interface/comment'
import {Issue} from '../common/clazz/issue'

// -----------------------------------------------------------------------------
/**
 * name:xxxxxx
 * link:xxxxxx
 * desc:xxxxxx
 */
// -----------------------------------------------------------------------------

export const FRIEND_ISSUE_LABEL = 'Friends'
const FRIENDS_TABLE_TEMPLATE = (
    name: string,
    link: string,
    desc: string
): string => `| ${name} | ${link} | ${desc} |\n`
export const FRIENDS_TABLE_TITLE = (config: Config): string =>
    `\n## ${config.links_title}\n`
export const FRIENDS_TABLE_HEAD =
    '| Name | Link | Desc |\n| ---- | ---- | ---- |\n'

function _makeFriendTableString(comment: IComment): string {
    const dict: {[k: string]: string} = {}
    // eslint-disable-next-line github/array-foreach
    comment.body
        ?.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.split(':'))
        .filter(s => s.length >= 2)
        .forEach(s => (dict[s[0]] = s[1].trim()))
    if (dict) {
        core.debug(`_makeFriendTableString:\n\n${JSON.stringify(dict)}\n\n`)
        return FRIENDS_TABLE_TEMPLATE(dict['name'], dict['link'], dict['desc'])
    }
    return ''
}

export async function add_md_friends(
    this: GithubKit<string>,
    issues: Issue[]
): Promise<void> {
    const friendIssues = issues.filter(issue =>
        issue.containLabel(FRIEND_ISSUE_LABEL)
    )

    const all: Promise<string[]>[] = []
    for (const issue of friendIssues) {
        all.push(
            this.getIssueComments(issue)
                .then(async (comments: Comment[]) => {
                    const approved: IComment[] = []
                    for (const comment of comments) {
                        if (await comment.isHeartBySelf(this)) {
                            approved.push(comment)
                        }
                    }
                    return approved
                })
                .then(approved => approved.map(_makeFriendTableString))
        )
    }
    const stringArray = await Promise.all(all).then(arr => arr.flat())
    this.result += FRIENDS_TABLE_TITLE(this.config)
    this.result += FRIENDS_TABLE_HEAD
    this.result += stringArray.join('')
    core.debug(`add_md_friends:\n\n${this.result}\n\n`)
}
