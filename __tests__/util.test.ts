// @ts-ignore
import fs from 'fs'
import {Issue} from '../src/common/clazz/issue'
import {Comment} from '../src/common/clazz/comment'
import {unifyReferToNumber} from '../src/util/util'

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

