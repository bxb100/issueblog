import {add_md_friends, FRIENDS_TABLE_HEAD, friendTableTitle} from '../src/functions/friend-process'
import {Comment} from '../src/common/clazz/comment'
import {Issue} from '../src/common/clazz/issue'
// @ts-ignore
import {delay, getIssueCommentReactionsMock, getIssueCommentsMock, getIssuesMock, utils} from './base.test'
import * as fs from 'fs'
import {ReactionContent} from '../src/common/enum/reaction-content'
import {Reaction} from '../src/common/interface/reaction'
import {IComment} from '../src/common/interface/comment'

test('test generate string', async () => {

    const issueResult = fs.readFileSync('./__tests__/mock/list-repo-issue.json', 'utf8')
    getIssuesMock.mockReturnValue(delay(Issue.cast(JSON.parse(issueResult))))
    getIssueCommentReactionsMock.mockImplementation((comment: IComment, content?: ReactionContent): Promise<Reaction[]> => {
            if (comment.id === 986013801) {
                return delay(JSON.parse(fs.readFileSync('./__tests__/mock/issue-comment-986013801-reactions.json', 'utf8')))
            }
            if (comment.id === 986020479) {
                return delay(JSON.parse(fs.readFileSync('./__tests__/mock/issue-comment-986020479-reactions.json', 'utf8')))
            }
            return Promise.resolve([])
        })
    const comments = fs.readFileSync('./__tests__/mock/issue-1-comments.json', 'utf8')
    getIssueCommentsMock.mockImplementation(async issue => {
        if (issue.number === 1) {
            return delay(Comment.cast(JSON.parse(comments)))
        }
        return []
    })

    await add_md_friends.call(utils, await utils.getIssues(1))
    expect(utils.result).toEqual(
        `${friendTableTitle(utils.config)}${FRIENDS_TABLE_HEAD}` +
        '| 兔子鮮笙 | https://tuzi.moe | 20 岁的天才少年 |\n' +
        '| 兔子鮮笙 | https://tuzi.moe | desc\\:测试 |\n'
    )
    // worst case
}, 10000)
