import {GithubKit} from '../clazz/github-kit'
import {Issue} from '../clazz/issue'

export type ProcessFunction<T> = (
    this: GithubKit<T>,
    issues: Issue[]
) => Promise<void>
