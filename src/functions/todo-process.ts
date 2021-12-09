import * as core from '@actions/core'
import {Constant} from '../common/clazz/constant'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'
import {wrapDetails} from '../util/util'

export const TODO_ISSUE_TITLE = '## TODO\n'

export async function add_md_todo(
    kit: GithubKit,
    issues: Issue[]
): Promise<void> {
    const todoIssues = issues.filter(issue => issue.containLabel(Constant.TODO))

    if (todoIssues.length === 0) {
        return
    }

    let todoSection: string = TODO_ISSUE_TITLE

    for (const todoIssue of todoIssues) {
        const {title, undone, done} = parse(todoIssue)
        todoSection += `TODO list from ${title}\n`
        todoSection += wrapDetails(undone, done, s => `${s}\n`)
    }
    core.debug(`TODO section: ${todoSection}`)
    kit.sectionMap.set(Constant.TODO, todoSection)
}

function parse(issue: Issue): {
    title: string
    undone: string[]
    done: string[]
} {
    const lines = issue.bodyToLines()
    const undone = lines.filter(line => line.startsWith('- [ ]'))
    const done = lines.filter(line => line.startsWith('- [x]'))

    if (undone.length === 0) {
        return {
            title: `[${issue.title}](${issue.html_url}) all done`,
            undone,
            done
        }
    }

    return {
        title: `[${issue.title}](${issue.html_url})--${undone.length} jobs to do--${done.length} jobs done`,
        undone,
        done
    }
}
