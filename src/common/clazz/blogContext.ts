import {GithubKit} from './github-kit'
import {Constant} from './constant'
import fs from 'fs'
import {Issue} from './issue'
import {Config} from '../../util/config'

export class BlogContext {
    readonly kit: GithubKit
    readonly issues: Issue[] = []
    readonly config: Config
    readonly sectionMap = new Map<string, string>()
    readonly essayIssues: Issue[] = []

    constructor(kit: GithubKit, issues: Issue[], config: Config) {
        this.kit = kit
        this.issues = issues
        this.config = config
        this.essayIssues = BlogContext.getEssayIssues(issues)
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

    writeReadMe(): void {
        const constant = new Constant(this.kit.getConfig().md_header)
        fs.writeFileSync(
            'README.md',
            constant.convertBlogContent(this.sectionMap)
        )
    }
}
