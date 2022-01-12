import * as core from '@actions/core'
import * as fs from 'fs'
import {Metadata, MetadataInfo} from '../common/types/metadata'
import {backupFileName, compareUpdateTime, isOwnBy} from '../util/util'
import {Comment} from '../common/clazz/comment'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'

const BACKUP_PATH = './.backup/'
const METADATA_NAME = '.metadata'
const METADATA_PATH = BACKUP_PATH + METADATA_NAME

export async function backup(kit: GithubKit, issues: Issue[]): Promise<void> {
    // make sure backup directory exists
    fs.existsSync(BACKUP_PATH) || fs.mkdirSync(BACKUP_PATH)
    // make sure metadata file exists
    fs.existsSync(METADATA_PATH) || fs.writeFileSync(METADATA_PATH, '{}')
    // read metadata
    const metadata = fs.readFileSync(METADATA_PATH, 'utf8') || '{}'
    let parse: Metadata = JSON.parse(metadata)

    // filter need backup issues
    const needBackupIssues: Issue[] = []
    for (const issue of issues) {
        if (parse[issue.number]) {
            // don't use event trigger issue_number, may be the action is concurrency
            if (compareUpdateTime(parse[issue.number], issue.updated_at) < 0) {
                needBackupIssues.push(issue)
            }
        } else {
            needBackupIssues.push(issue)
        }
    }

    // backup issue
    await Promise.all(
        needBackupIssues.flatMap(async issue =>
            saveIssue(kit, issue, parse[issue.number])
        )
    )
    // update metadata
    parse = needBackupIssues.reduce((acc, issue) => {
        acc[issue.number] = {
            name: backupFileName(issue),
            createdAt: issue.created_at,
            updatedAt: issue.updated_at
        }
        return acc
    }, parse)
    core.debug(`backup metadata: ${JSON.stringify(parse)}`)
    // write metadata
    fs.writeFileSync(METADATA_PATH, JSON.stringify(parse))
}

async function saveIssue(
    kit: GithubKit,
    issue: Issue,
    info: MetadataInfo
): Promise<void> {
    const fileName = backupFileName(issue)
    if (info && fileName !== info.name) {
        // change the issue title
        // remove the old file
        fs.unlinkSync(BACKUP_PATH + info.name)
    }
    const backupPath = BACKUP_PATH + fileName
    let content = `[${issue.title}](${issue.html_url})\n\n`
    content += issue.body || 'No description provided.'
    if (issue.comments > 0) {
        // just focus on the first hundred comments
        const comments: Comment[] = await kit
            .getIssueComments(issue)
            .then(list => list.filter(c => isOwnBy(c, kit.owner)))

        for (const comment of comments) {
            content += `\n\n---\n\n`
            content += `<a id="issuecomment-${comment.id}"></a>\n`
            content += comment.body
        }
    }

    fs.writeFileSync(backupPath, content)
}
