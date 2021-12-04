import {context} from '@actions/github'
import {IssuesUtil} from '../src/util/issue-kit'
import {randomInt} from 'crypto'

Object.defineProperty(context, 'repo', {
    get: jest.fn(() => ({
        owner: 'owner',
        repo: 'repo'
    }))
})

export const utils = new IssuesUtil<string>({
    github_token: '123',
    md_header: ''
}, "")
export const getIssuesMock = jest.spyOn(utils, 'getIssues')
export const isHeartBySelfMock = jest.spyOn(utils, 'isHeartBySelf')
export const getIssueCommentsMock = jest.spyOn(utils, 'getIssueComments')

export const delay = <T>(result: T): Promise<T> => new Promise(resolve => {
    setTimeout(() => resolve(result), randomInt(500, 3000))
})
