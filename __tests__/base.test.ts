import {context} from '@actions/github'
import {GithubKit} from '../src/common/clazz/github-kit'
import {randomInt} from 'crypto'

Object.defineProperty(context, 'repo', {
    get: jest.fn(() => ({
        owner: 'owner',
        repo: 'repo'
    }))
})

export const utils = new GithubKit<string>({
    links_title: "", recent_title: "", top_title: "", unlabeled_title: "",
    github_token: '123',
    md_header: '',
    anchor_number: '', recent_limit: ''
}, '')
export const getIssuesMock = jest.spyOn(utils, 'getIssues')
export const isHeartBySelfMock = jest.spyOn(utils, 'isHeartBySelf')
export const getIssueCommentsMock = jest.spyOn(utils, 'getIssueComments')

export const delay = <T>(result: T): Promise<T> => new Promise(resolve => {
    setTimeout(() => resolve(result), randomInt(500, 3000))
})

test("empty", () => {
})
