import * as core from '@actions/core'
import {Comment} from '../common/clazz/comment'
import {Config} from '../util/config'
import {Constant} from '../common/clazz/constant'
import {IComment} from '../common/interface/comment'
import {BlogContext} from '../common/clazz/blogContext'

// -----------------------------------------------------------------------------
/**
 * name:xxxxxx
 * link:xxxxxx
 * desc:xxxxxx
 */
// -----------------------------------------------------------------------------
export const FRIENDS_TABLE_HEAD =
    '| Name | Link | Desc |\n| ---- | ---- | ---- |\n'

export const friendTableTitle = (config: Config): string =>
    `\n## ${config.links_title}\n`
const friendTableTemplate = (
    name: string,
    link: string,
    desc: string
): string => `| ${name} | ${link} | ${desc} |\n`
const friendRegex = (str: string): RegExpExecArray | [] =>
    /(\w+):(.+)/.exec(str) || []

function _makeFriendTableString(comment: IComment): string {
    const dict: {[k: string]: string} = {}
    // eslint-disable-next-line github/array-foreach
    comment.body
        ?.split('\n')
        .filter(line => line.trim() !== '')
        .map(line => friendRegex(line))
        .filter(s => s !== null && s.length > 2)
        .forEach(s => (dict[s[1]] = s[2].trim()))

    if (dict) {
        core.debug(`_makeFriendTableString:\n\n${JSON.stringify(dict)}\n\n`)
        return friendTableTemplate(dict['name'], dict['link'], dict['desc'])
    }
    return ''
}

export async function add_md_friends(context: BlogContext): Promise<void> {
    const friendIssues = context.getIssues(Constant.FIXED_LINKS)

    const all: Promise<string[]>[] = []
    for (const issue of friendIssues) {
        all.push(
            context.kit
                .getIssueComments(issue)
                .then(async (comments: Comment[]) => {
                    const approved: IComment[] = []
                    for (const comment of comments) {
                        if (await comment.isHeartBySelf(context.kit)) {
                            approved.push(comment)
                        }
                    }
                    return approved
                })
                .then(approved => approved.map(_makeFriendTableString))
        )
    }
    const stringArray = await Promise.all(all).then(arr => arr.flat())
    if (stringArray.length <= 0) {
        return core.info("No friend's now.")
    }

    let friendSection: string = friendTableTitle(context.config)
    friendSection += FRIENDS_TABLE_HEAD
    friendSection += stringArray.join('')
    core.debug(`add_md_friends:\n\n${friendSection}\n\n`)

    context.sectionMap.set(Constant.FIXED_LINKS, friendSection)
}
