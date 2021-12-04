import {IssuesUtil} from '../util/issue-kit'
import {Issue} from '../common/clazz/issue'

export const TODO_ISSUE_LABEL = 'Todo'
export const TODO_ISSUE_TITLE = '## TODO\n'

export async function add_md_todo(
    this: IssuesUtil<string>,
    issues: Issue[]
): Promise<void> {

    const todoIssues = issues
        .filter(issue => issue.containLabel(TODO_ISSUE_LABEL))

    if (todoIssues.length === 0) {
        return
    }

    this.result += TODO_ISSUE_TITLE
    const {title, list} = parse(todoIssues[0])
    this.result += title
    for (let string of list) {
        this.result += `${string}\n`
    }
    this.result += '\n'
}

function parse(issue: Issue): {title: string, list: string[]} {
    const lines = issue.bodyToLines()
    const undone = lines.filter(line => line.startsWith('- [ ]'))
    const done = lines.filter(line => line.startsWith('- [x]'))

    if (undone.length === 0) {
        return {
            title: `[${issue.title}](${issue.html_url}) all done\n`,
            list: []
        }
    }

    return {
        title: `[${issue.title}](${issue.html_url})--${undone.length} jobs to do--${done.length} jobs done\n`,
        list: undone.concat(done)
    }
}
