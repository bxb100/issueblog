import {GithubKit} from './github-kit'
import {Constant} from './constant'
import {Issue} from './issue'
import {Config} from '../../util/config'

export class Context {
    readonly kit: GithubKit
    readonly issues: Issue[] = []
    readonly sectionMap = new Map<string, string>()
    readonly essayIssues: Issue[] = []
    readonly config: Config

    constructor(issues: Issue[], kit: GithubKit, config: Config) {
        this.kit = kit
        this.issues = issues
        this.essayIssues = Context.getEssayIssues(issues)
        this.config = config
    }

    getIssues(label: string): Issue[] {
        if (label) {
            return this.issues.filter(issue => issue.hasLabel(label))
        }
        return this.issues
    }

    private static getEssayIssues(issues: Issue[]): Issue[] {
        return issues.filter(
            issue =>
                !(
                    issue.hasLabel(Constant.FIXED_LINKS) ||
                    issue.hasLabel(Constant.FIXED_TODO)
                )
        )
    }
}
