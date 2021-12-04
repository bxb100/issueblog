import {IssuesUtil} from '../src/util/issue'
import {add_md_friends} from '../src/functions/friend-process'
import {context} from '@actions/github'
import * as core from '@actions/core'
import {Comment} from '../src/common/clazz/comment'
import {randomInt} from 'crypto'

const FRIENDS_TABLE_TITLE = '\n## 友情链接\n'
const FRIENDS_TABLE_HEAD = '| Name | Link | Desc |\n| ---- | ---- | ---- |\n'

jest.mock('@actions/github')
jest.spyOn(core, 'debug').mockImplementation(() => {
})
Object.defineProperty(context, 'repo', {
    get: jest.fn(() => ({
        owner: 'owner',
        repo: 'repo'
    }))
})

const utils = new IssuesUtil('123')
const getIssuesMock = jest.spyOn(utils, 'getIssues')
const isHeartBySelfMock = jest.spyOn(utils, 'isHeartBySelf')
const getIssueCommentsMock = jest.spyOn(utils, 'getIssueComments')

const delay = <T>(result: T): Promise<T> => new Promise(resolve => {
    setTimeout(() => resolve(result), randomInt(500, 3000))
})

test('test generate string', async () => {
    const issueResult =
        '{"status":200,"url":"https://api.github.com/repos/bxb100/gitlog/issues?state=open&creator=bxb100&per_page=100&direction=desc&page=1","headers":{"access-control-allow-origin":"*","access-control-expose-headers":"ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, Deprecation, Sunset","cache-control":"private, max-age=60, s-maxage=60","connection":"close","content-encoding":"gzip","content-security-policy":"default-src \'none\'","content-type":"application/json; charset=utf-8","date":"Fri, 03 Dec 2021 14:18:18 GMT","etag":"W/\\"89c34686b9605808917129700dccd51dad13cda2e9ff8ac6df07d0c5f7572bcd\\"","referrer-policy":"origin-when-cross-origin, strict-origin-when-cross-origin","server":"GitHub.com","strict-transport-security":"max-age=31536000; includeSubdomains; preload","transfer-encoding":"chunked","vary":"Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With","x-content-type-options":"nosniff","x-frame-options":"deny","x-github-media-type":"github.v3; format=json","x-github-request-id":"0401:15CF:E96C:34ACF:61AA272A","x-ratelimit-limit":"1000","x-ratelimit-remaining":"411","x-ratelimit-reset":"1638542445","x-ratelimit-resource":"core","x-ratelimit-used":"589","x-xss-protection":"0"},"data":[{"url":"https://api.github.com/repos/bxb100/gitlog/issues/5","repository_url":"https://api.github.com/repos/bxb100/gitlog","labels_url":"https://api.github.com/repos/bxb100/gitlog/issues/5/labels{/name}","comments_url":"https://api.github.com/repos/bxb100/gitlog/issues/5/comments","events_url":"https://api.github.com/repos/bxb100/gitlog/issues/5/events","html_url":"https://github.com/bxb100/gitlog/issues/5","id":1070591252,"node_id":"I_kwDOGeduZc4_z-0U","number":5,"title":"测试友情链接","user":{"login":"bxb100","id":20685961,"node_id":"MDQ6VXNlcjIwNjg1OTYx","avatar_url":"https://avatars.githubusercontent.com/u/20685961?v=4","gravatar_id":"","url":"https://api.github.com/users/bxb100","html_url":"https://github.com/bxb100","followers_url":"https://api.github.com/users/bxb100/followers","following_url":"https://api.github.com/users/bxb100/following{/other_user}","gists_url":"https://api.github.com/users/bxb100/gists{/gist_id}","starred_url":"https://api.github.com/users/bxb100/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bxb100/subscriptions","organizations_url":"https://api.github.com/users/bxb100/orgs","repos_url":"https://api.github.com/users/bxb100/repos","events_url":"https://api.github.com/users/bxb100/events{/privacy}","received_events_url":"https://api.github.com/users/bxb100/received_events","type":"User","site_admin":false},"labels":[{"id":3608407632,"node_id":"LA_kwDOGeduZc7XE-5Q","url":"https://api.github.com/repos/bxb100/gitlog/labels/Friends","name":"Friends","color":"0E8A16","default":false,"description":"测试友链生成"}],"state":"open","locked":false,"assignee":null,"assignees":[],"milestone":null,"comments":2,"created_at":"2021-12-03T13:26:11Z","updated_at":"2021-12-03T14:18:04Z","closed_at":null,"author_association":"OWNER","active_lock_reason":null,"body":"## 格式: \\r\\n> 冒号为中文冒号 ：\\r\\n```\\r\\n名字：xxxxxx\\r\\n链接：xxxxxx\\r\\n描述：xxxxxx\\r\\n```","reactions":{"url":"https://api.github.com/repos/bxb100/gitlog/issues/5/reactions","total_count":0,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":0,"rocket":0,"eyes":0},"timeline_url":"https://api.github.com/repos/bxb100/gitlog/issues/5/timeline","performed_via_github_app":null}]}'
    getIssuesMock.mockReturnValue(delay(JSON.parse(issueResult).data))
    const reactions =
        '{"status":200,"url":"https://api.github.com/repos/bxb100/gitlog/issues/comments/985522169/reactions?content=heart","headers":{"access-control-allow-origin":"*","access-control-expose-headers":"ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, Deprecation, Sunset","cache-control":"private, max-age=60, s-maxage=60","connection":"close","content-encoding":"gzip","content-security-policy":"default-src \'none\'","content-type":"application/json; charset=utf-8","date":"Fri, 03 Dec 2021 14:18:18 GMT","etag":"W/\\"a8d230e4d7d9c6be18088cf7c04fae7e8fffa5c503cadd71b9f4f3122c5eca10\\"","referrer-policy":"origin-when-cross-origin, strict-origin-when-cross-origin","server":"GitHub.com","strict-transport-security":"max-age=31536000; includeSubdomains; preload","transfer-encoding":"chunked","vary":"Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With","x-content-type-options":"nosniff","x-frame-options":"deny","x-github-media-type":"github.v3; param=squirrel-girl-preview; format=json","x-github-request-id":"0404:52A5:6919C:D112A:61AA272A","x-ratelimit-limit":"1000","x-ratelimit-remaining":"408","x-ratelimit-reset":"1638542445","x-ratelimit-resource":"core","x-ratelimit-used":"592","x-xss-protection":"0"},"data":[{"id":139612066,"node_id":"REA_lALOGeduZc46vd_5zghST6I","user":{"login":"bxb100","id":20685961,"node_id":"MDQ6VXNlcjIwNjg1OTYx","avatar_url":"https://avatars.githubusercontent.com/u/20685961?v=4","gravatar_id":"","url":"https://api.github.com/users/bxb100","html_url":"https://github.com/bxb100","followers_url":"https://api.github.com/users/bxb100/followers","following_url":"https://api.github.com/users/bxb100/following{/other_user}","gists_url":"https://api.github.com/users/bxb100/gists{/gist_id}","starred_url":"https://api.github.com/users/bxb100/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bxb100/subscriptions","organizations_url":"https://api.github.com/users/bxb100/orgs","repos_url":"https://api.github.com/users/bxb100/repos","events_url":"https://api.github.com/users/bxb100/events{/privacy}","received_events_url":"https://api.github.com/users/bxb100/received_events","type":"User","site_admin":false},"content":"heart","created_at":"2021-12-03T14:14:10Z"}]}'
    isHeartBySelfMock.mockReturnValue(delay(JSON.parse(reactions).data))
    const comments =
        '{"status":200,"url":"https://api.github.com/repos/bxb100/gitlog/issues/5/comments","headers":{"access-control-allow-origin":"*","access-control-expose-headers":"ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, Deprecation, Sunset","cache-control":"private, max-age=60, s-maxage=60","connection":"close","content-encoding":"gzip","content-security-policy":"default-src \'none\'","content-type":"application/json; charset=utf-8","date":"Fri, 03 Dec 2021 14:18:18 GMT","etag":"W/\\"5defe22b599b4e27277d96d6a3de76371e0ddbbec27c85db5beb578dd9fb9c7c\\"","referrer-policy":"origin-when-cross-origin, strict-origin-when-cross-origin","server":"GitHub.com","strict-transport-security":"max-age=31536000; includeSubdomains; preload","transfer-encoding":"chunked","vary":"Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With","x-content-type-options":"nosniff","x-frame-options":"deny","x-github-media-type":"github.v3; format=json","x-github-request-id":"0403:11A5:42D11:8E719:61AA272A","x-ratelimit-limit":"1000","x-ratelimit-remaining":"409","x-ratelimit-reset":"1638542445","x-ratelimit-resource":"core","x-ratelimit-used":"591","x-xss-protection":"0"},"data":[{"url":"https://api.github.com/repos/bxb100/gitlog/issues/comments/985522169","html_url":"https://github.com/bxb100/gitlog/issues/5#issuecomment-985522169","issue_url":"https://api.github.com/repos/bxb100/gitlog/issues/5","id":985522169,"node_id":"IC_kwDOGeduZc46vd_5","user":{"login":"bxb100","id":20685961,"node_id":"MDQ6VXNlcjIwNjg1OTYx","avatar_url":"https://avatars.githubusercontent.com/u/20685961?v=4","gravatar_id":"","url":"https://api.github.com/users/bxb100","html_url":"https://github.com/bxb100","followers_url":"https://api.github.com/users/bxb100/followers","following_url":"https://api.github.com/users/bxb100/following{/other_user}","gists_url":"https://api.github.com/users/bxb100/gists{/gist_id}","starred_url":"https://api.github.com/users/bxb100/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bxb100/subscriptions","organizations_url":"https://api.github.com/users/bxb100/orgs","repos_url":"https://api.github.com/users/bxb100/repos","events_url":"https://api.github.com/users/bxb100/events{/privacy}","received_events_url":"https://api.github.com/users/bxb100/received_events","type":"User","site_admin":false},"created_at":"2021-12-03T13:29:22Z","updated_at":"2021-12-03T14:18:04Z","author_association":"OWNER","body":"名字：FriendsA3\\r\\n链接：https://blog.duanfei.org\\r\\n描述：跑步的朋友","reactions":{"url":"https://api.github.com/repos/bxb100/gitlog/issues/comments/985522169/reactions","total_count":2,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":1,"rocket":0,"eyes":1},"performed_via_github_app":null},{"url":"https://api.github.com/repos/bxb100/gitlog/issues/comments/985553669","html_url":"https://github.com/bxb100/gitlog/issues/5#issuecomment-985553669","issue_url":"https://api.github.com/repos/bxb100/gitlog/issues/5","id":985553669,"node_id":"IC_kwDOGeduZc46vlsF","user":{"login":"bxb100","id":20685961,"node_id":"MDQ6VXNlcjIwNjg1OTYx","avatar_url":"https://avatars.githubusercontent.com/u/20685961?v=4","gravatar_id":"","url":"https://api.github.com/users/bxb100","html_url":"https://github.com/bxb100","followers_url":"https://api.github.com/users/bxb100/followers","following_url":"https://api.github.com/users/bxb100/following{/other_user}","gists_url":"https://api.github.com/users/bxb100/gists{/gist_id}","starred_url":"https://api.github.com/users/bxb100/starred{/owner}{/repo}","subscriptions_url":"https://api.github.com/users/bxb100/subscriptions","organizations_url":"https://api.github.com/users/bxb100/orgs","repos_url":"https://api.github.com/users/bxb100/repos","events_url":"https://api.github.com/users/bxb100/events{/privacy}","received_events_url":"https://api.github.com/users/bxb100/received_events","type":"User","site_admin":false},"created_at":"2021-12-03T14:13:39Z","updated_at":"2021-12-03T14:14:19Z","author_association":"OWNER","body":"名字：FriendsA4\\r\\n链接：https://blog.duanfei.org\\r\\n描述：跑步的朋友","reactions":{"url":"https://api.github.com/repos/bxb100/gitlog/issues/comments/985553669/reactions","total_count":1,"+1":0,"-1":0,"laugh":0,"hooray":0,"confused":0,"heart":1,"rocket":0,"eyes":0},"performed_via_github_app":null}]}'
    getIssueCommentsMock.mockImplementation(async issue => {
        if (issue.number === 5) {
            return delay(Comment.cast(JSON.parse(comments).data))
        }
        return []
    })

    let result = ''
    result += await add_md_friends.call(utils, await utils.getIssues(1), result)
    expect(result).toEqual(
        `${FRIENDS_TABLE_TITLE}${FRIENDS_TABLE_HEAD}` +
        '| FriendsA3 | https://blog.duanfei.org | 跑步的朋友 |\n' +
        '| FriendsA4 | https://blog.duanfei.org | 跑步的朋友 |\n'
    )
// worst case
}, 10000)
