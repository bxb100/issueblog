import {context} from '@actions/github'
import {GithubKit} from '../src/common/clazz/github-kit'
import {randomInt} from 'crypto'
import fs from 'fs'
import {Issue} from '../src/common/clazz/issue'
import {IComment} from '../src/common/interface/comment'
import {ReactionContent} from '../src/common/enum/reaction-content'
import {Reaction} from '../src/common/interface/reaction'
import {Comment} from '../src/common/clazz/comment'

Object.defineProperty(context, 'repo', {
    get: jest.fn(() => ({
        owner: 'bxb100',
        repo: 'issueblog-test'
    }))
})

export const utils = new GithubKit(
    {
        blog_image_url: '',
        blog_author: '',
        links_title: '',
        recent_title: '',
        top_title: '',
        unlabeled_title: '',
        github_token: '123',
        md_header: '',
        anchor_number: '',
        recent_limit: ''
    }
)
export const getIssuesMock = jest.spyOn(utils, 'getIssues')
export const getIssueCommentReactionsMock = jest.spyOn(utils, 'getIssueCommentReactions')
export const getIssueCommentsMock = jest.spyOn(utils, 'getIssueComments')

export const delay = <T>(result: T): Promise<T> =>
    new Promise(resolve => {
        setTimeout(() => resolve(result), randomInt(500, 3000))
    })

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

test('empty', () => {})
