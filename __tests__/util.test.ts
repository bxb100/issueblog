// @ts-ignore
import fs from 'fs'
import {Issue} from '../src/common/clazz/issue'
import {Comment} from '../src/common/clazz/comment'
import {unifyReferToNumber} from '../src/util/util'
import {context} from '@actions/github'
import {IComment} from '../src/common/interface/comment'

test('test unifyReferToNumber', async () => {
    const issue: Issue = new Issue(
        JSON.parse(fs.readFileSync('./__tests__/mock/refer-issue.json', 'utf8'))
    )

    const comments = Comment.cast(
        JSON.parse(
            fs.readFileSync(
                './__tests__/mock/refer-issue-comments.json',
                'utf8'
            )
        )
    )

    expect(unifyReferToNumber(issue, comments)).toMatchSnapshot()
    expect(issue.body).toMatchSnapshot()
    for (let comment of comments) {
        expect(comment.body).toMatchSnapshot()
    }
})

test('test bug gh59', async () => {
    const content = fs.readFileSync('./__tests__/mock/bug-gh59.md', 'utf8')
    const arr = content.split('[//]: # ()')

    const issue = {
        body: arr[0]
    } as Issue

    const comments = arr.splice(1).map(c => {
        return {body: c} as IComment
    })

    expect(unifyReferToNumber(issue, comments)).toMatchSnapshot()
    expect(issue.body).toMatchSnapshot()
    for (let comment of comments) {
        expect(comment.body).toMatchSnapshot()
    }
})
