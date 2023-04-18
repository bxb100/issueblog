import {getConfig} from '../src/util/config'
import * as core from '@actions/core'
import {ZodError} from 'zod'

jest.mock('@actions/core')
const coreMock = jest.spyOn(core, 'getInput')

const base_config = {
    md_header:
        '## GitLog\n' +
        'My personal blog using issues and GitHub Actions\n' +
        '[RSS Feed](https://raw.githubusercontent.com/bxb100/gitlog/master/feed.xml)',
    blog_author: 'blog_author',
    github_token: '1234567',
    issue_number: '1',
    recent_limit: 'recent_limit',
    anchor_number: 'anchor_number',
    links_title: 'links_title',
    recent_title: 'recent_title',
    top_title: 'top_title',
    unlabeled_title: 'unlabeled_title',
    blog_url: 'blog_url',
    save_feed_path: 'save_feed_path',
    save_md_path: 'save_md_path'
}

test('basic get config', () => {
    const config = {...base_config}
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

test('undefined check', () => {
    const config = {}
    // @ts-ignore
    coreMock.mockImplementation(k => config[k])
    expect(() => getConfig()).toThrow(ZodError)
})

test('empty value check', () => {
    const config = {...base_config, md_header: '', github_token: ''}
    // @ts-ignore
    coreMock.mockImplementation(k => config[k])
    expect(() => getConfig()).toThrow(ZodError)
})

test('optional check', () => {
    const config = {
        ...base_config,
        issue_number: undefined
    }
    // @ts-ignore
    coreMock.mockImplementation(k => config[k])
    expect(getConfig()).not.toHaveProperty('issue_number')
})
