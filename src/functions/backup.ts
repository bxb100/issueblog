import {IssuesKit} from "../common/clazz/issue-kit";
import {Issue} from "../common/clazz/issue";
import * as fs from 'fs';
import {compareUpdateTime, Metadata} from "../common/types/metadata";
import {backupFileName, isOwnBy} from "../util/util";
import {Comment} from "../common/clazz/comment";
import * as core from '@actions/core';

const BACKUP_PATH = './backup/';
const METADATA_NAME = '.metadata'
const METADATA_PATH = BACKUP_PATH + METADATA_NAME;

export async function backup(
    this: IssuesKit<any>,
    issues: Issue[]
): Promise<void> {
    // make sure backup directory exists
    fs.existsSync(BACKUP_PATH) || fs.mkdirSync(BACKUP_PATH);
    // make sure metadata file exists
    fs.existsSync(METADATA_PATH) || fs.writeFileSync(METADATA_PATH, '');
    // read metadata
    const metadata = fs.readFileSync(METADATA_PATH, 'utf8');
    let parse: Metadata = JSON.parse(metadata);

    // filter need backup issues
    const needBackupIssues: Issue[] = []
    for (const issue of issues) {
        if (parse[issue.number]) {
            if (compareUpdateTime(parse[issue.number], issue.updated_at) < 0) {
                needBackupIssues.push(issue);
            }
        } else {
            needBackupIssues.push(issue);
        }
    }

    // backup issue
    const flatMap: Promise<void>[] = needBackupIssues.flatMap(issue => saveIssue(this, issue));
    await Promise.all(flatMap);
    // update metadata
    parse = needBackupIssues.reduce((acc, issue) => {
        acc[issue.number] = {
            name: backupFileName(issue),
            createdAt: issue.created_at,
            updatedAt: issue.updated_at
        }
        return acc;
    }, parse);
    core.debug(`backup metadata: ${JSON.stringify(parse)}`);
    // write metadata
    fs.writeFileSync(METADATA_PATH, JSON.stringify(parse));
}

async function saveIssue(kit: IssuesKit<any>, issue: Issue): Promise<void> {
    const backupPath = BACKUP_PATH + backupFileName(issue);
    let content: string = `[${issue.title}](${issue.html_url})\n\n`;
    content += issue.body
    if (issue.comments > 0) {
        // just focus on the first hundred comments
        const comments: Comment[] = await kit.getIssueComments(issue)
            .then(comments => comments.filter(c => isOwnBy(c, kit.owner)));

        for (const comment of comments) {
            content += `\n\n---\n\n`
            content += comment.body
        }
    }
    fs.writeFileSync(backupPath, content);
}
