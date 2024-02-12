import * as core from '@actions/core'
import * as fs from 'fs'
import {Metadata, MetadataInfo} from '../common/types/metadata'
import {
    backupFileName,
    compareUpdateTime,
    isOwnBy,
    unifyReferToNumber
} from '../util/util'
import {Comment} from '../common/clazz/comment'
import {GithubKit} from '../common/clazz/github-kit'
import {Issue} from '../common/clazz/issue'
import {BlogContext} from '../common/clazz/blog-context'
import path from 'path'

const METADATA_NAME = '.metadata'

export async function files(context: BlogContext): Promise<void> {
    const kit = context.kit
    const issues = context.essayIssues
    const BACKUP_PATH = path.join(context.config.save_md_path, '/')
    const METADATA_PATH = METADATA_NAME
    // make sure backup directory exists
    fs.existsSync(BACKUP_PATH) || fs.mkdirSync(BACKUP_PATH, {recursive: true})
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
            saveIssue(kit, issue, parse[issue.number], BACKUP_PATH)
        )
    )
    // update metadata
    parse = needBackupIssues.reduce((acc, issue) => {
        acc[issue.number] = {
            name: backupFileName(issue),
            issueNumber: issue.number,
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
    info: MetadataInfo,
    BACKUP_PATH: string
): Promise<void> {
    const fileName = backupFileName(issue)
    if (info && fileName !== info.name) {
        // change the issue title
        // remove the old file
        fs.unlinkSync(BACKUP_PATH + info.name)
    }
    let comments: Comment[] = []
    if (issue.comments > 0) {
        // just focus on the first hundred comments
        comments = await kit
            .getIssueComments(issue)
            .then(list => list.filter(c => isOwnBy(c, kit.owner)))
    }
    const bottomLinks = unifyReferToNumber(issue, comments)

    const backupPath = BACKUP_PATH + fileName
    let tags: string
    if (issue.labels.length === 0) {
        tags = '\t- uncategorized\n'
    } else {
        tags = issue.labels
            .map(label => Issue.getLabelValue(label))
            .filter(Boolean)
            .map(label => `\t- ${label}\n`)
            .join('')
    }

    // hexo simple post template
    const createAt = new Date(issue.created_at).toISOString()
    const updateAt = new Date(issue.updated_at).toISOString()
    // hexo not support : in title
    const mdTitle = issue.title.replace(/:/g, ' ')
    let content = `
---
title: ${mdTitle}
pubDatetime: ${createAt}
modDatetime: ${updateAt}
url: ${issue.html_url}
tags:
${tags}
---
    
    `
    content += issue.body || ''
    for (const comment of comments) {
        content += `\n\n---\n\n`
        content += `<a id='issuecomment-${comment.id}'></a>\n`
        content += comment.body
    }
    content += `\n${bottomLinks}`
    fs.writeFileSync(backupPath, content)
}
