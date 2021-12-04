import {getConfig} from '../src/util/config'
import * as core from '@actions/core'
import {ZodError} from 'zod'

jest.mock('@actions/core')
const coreMock = jest.spyOn(core, 'getInput')

test('basic get config', () => {
    const config = {
        md_header:
            '## GitLog\n' +
            'My personal blog using issues and GitHub Actions\n' +
            '[RSS Feed](https://raw.githubusercontent.com/bxb100/gitlog/master/feed.xml)',
        github_token: '1234567',
        issue_number: '1'
    }
    // @ts-ignore
    coreMock.mockImplementation(k => config[k])

    expect(getConfig()).toHaveProperty('md_header')
    expect(getConfig()).toHaveProperty('github_token')
    expect(getConfig()).toHaveProperty('issue_number')

    expect(getConfig().md_header).toEqual(
        '## GitLog\nMy personal blog using issues and GitHub Actions\n[RSS Feed](https://raw.githubusercontent.com/bxb100/gitlog/master/feed.xml)'
    )
    expect(getConfig().github_token).toEqual('1234567')
    expect(getConfig().issue_number).toEqual('1')
})

test('not empty check', () => {
    const config = {}
    // @ts-ignore
    coreMock.mockImplementation(k => config[k])
    expect(() => getConfig()).toThrow(ZodError)
})

test('not empty check2', () => {
    const config = {md_header: '', github_token: ''}
    // @ts-ignore
    coreMock.mockImplementation(k => config[k])
    expect(() => getConfig()).toThrow(ZodError)
})

test('optional check', () => {
    const config = {
        md_header: 'cs',
        github_token: 'cs'
    }
    // @ts-ignore
    coreMock.mockImplementation(k => config[k])
    expect(getConfig()).not.toHaveProperty('issue_number')
})
