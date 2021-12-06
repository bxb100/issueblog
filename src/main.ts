import * as core from '@actions/core'
import * as fs from 'fs'
import {
    diff,
    getModifiedUnstagedFiles,
    getUnstagedFiles,
    submodulePath
} from './util/git'
import {GithubKit} from './common/clazz/github-kit'
import {add_md_friends} from './functions/friend-process'
import {add_md_label} from './functions/label-process'
import {add_md_recent} from './functions/recent-process'
import {add_md_todo} from './functions/todo-process'
import {add_md_top} from './functions/top-process'
import {backup} from './functions/backup'
import {exec} from '@actions/exec'
import {getConfig} from './util/config'
import {rss} from './functions/rss'

async function run(): Promise<void> {
    core.info('[INFO] quick start: https://github.com/bxb100/gitlog')

    // 1. 配置 git 和 action input 信息
    core.startGroup('Configuration')
    const config = getConfig()
    // is anyway to set other bot?
    const username = 'github-actions[bot]'
    await exec('git', ['config', 'user.name', username])
    await exec('git', [
        'config',
        'user.email',
        'github-actions[bot]@users.noreply.github.com'
    ])
    await exec('git', ['config', 'core.quotePath', 'false'])
    core.endGroup()

    // 2. 处理 issues
    core.startGroup('Process issues')
    const issuesUtil: GithubKit<string> = new GithubKit(
        config,
        config.md_header
    )
    const text: string = await issuesUtil.processIssues(
        add_md_friends,
        add_md_top,
        add_md_recent,
        add_md_label,
        add_md_todo,
        backup,
        rss
    )
    fs.writeFileSync('README.md', text)
    core.endGroup()

    // 3. 暂存需要提交的文件
    core.startGroup('Monitor file changes')
    const newUnstagedFiles = await getUnstagedFiles()
    const modifiedUnstagedFiles = await getModifiedUnstagedFiles()
    const editedFilenames = [...newUnstagedFiles, ...modifiedUnstagedFiles]
    core.info(`newUnstagedFiles: \n${newUnstagedFiles}`)
    core.info(`modifiedUnstagedFiles: \n${modifiedUnstagedFiles}`)
    core.info(`editedFilenames: \n${editedFilenames}`)
    core.endGroup()

    // 4. 计算是否有修改
    core.startGroup('Calculate diff')
    const editedFiles = []
    const submodules = await submodulePath()
    core.info(`submodules: ${submodules}`)
    for (const filename of editedFilenames) {
        core.debug(`git adding ${filename}…`)
        await exec('git', ['add', filename])
        if (submodules.includes(filename)) {
            editedFiles.push({name: filename, submodule: true})
        } else {
            const bytes = await diff(filename)
            editedFiles.push({name: filename, deltaBytes: bytes})
        }
    }
    core.endGroup()

    // 5. 存储变更文件等待 POST 提交
    core.startGroup('Committing with metadata')
    const alreadyEditedFiles = JSON.parse(process.env.FILES || '[]')
    const files = [...alreadyEditedFiles, ...editedFiles]

    core.info(`alreadyEditedFiles: \n${JSON.stringify(alreadyEditedFiles)}`)
    core.info(`editedFiles: \n${JSON.stringify(editedFiles)}`)
    core.exportVariable('FILES', files)
    core.endGroup()
}

run().catch(error => {
    core.setFailed(`Workflow failed! ${error.message}`)
})
