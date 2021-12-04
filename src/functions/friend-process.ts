import {IssuesUtil} from '../util/issue-kit'
import {IComment} from '../common/interface/comment'
import * as core from '@actions/core'
import {Comment} from '../common/clazz/comment'
import {Issue} from '../common/clazz/issue'

// -----------------------------------------------------------------------------
/**
 * 格式如下:
 * 冒号为中文冒号 ：
 *
 * 名字：xxxxxx
 * 链接：xxxxxx
 * 描述：xxxxxx
 */
// -----------------------------------------------------------------------------

export const FRIEND_TABLE_HEAD = 'Friends'
const FRIENDS_TABLE_TEMPLATE = (name: string, link: string, desc: string) =>
    `| ${name} | ${link} | ${desc} |\n`
export const FRIENDS_TABLE_TITLE = '## 友情链接\n'
export const FRIENDS_TABLE_HEAD = '| Name | Link | Desc |\n| ---- | ---- | ---- |\n'

function _makeFriendTableString(comment: IComment): string {
    const dict: {[k: string]: string} = {}
    comment.body
        ?.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.split('：'))
        .filter(s => s.length >= 2)
        .forEach(s => dict[s[0]] = s[1].trim())
    core.debug(`_makeFriendTableString:\n\n${JSON.stringify(dict)}\n\n`)
    return FRIENDS_TABLE_TEMPLATE(dict['名字'], dict['链接'], dict['描述'])
}

export async function add_md_friends(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {

    const friendIssues = issues.filter(issue => issue.containsLabel(FRIEND_TABLE_HEAD))

    const all: Promise<string[]>[] = []
    for (let issue of friendIssues) {
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
    this.result += FRIENDS_TABLE_TITLE
    this.result += FRIENDS_TABLE_HEAD
    this.result += stringArray.join('')
    core.debug(`add_md_friends:\n\n${this.result}\n\n`)
}
