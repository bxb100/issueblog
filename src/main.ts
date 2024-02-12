import * as core from '@actions/core'
import {getModifiedUnstagedFiles, getUnstagedFiles} from './util/git'
import {exec} from '@actions/exec'
import {getConfig} from './util/config'
import path from 'path'
import {Processor} from './common/clazz/processor'

// because of the run in dist dir
export const rootPath = path.resolve(__dirname, '../')

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
    await new Processor(config)
        .process()
        .then(async p => Promise.all([p.files()]))
        .catch(err => core.setFailed(`process failed: ${err}`))

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

    // 4. 存储变更文件名等待提交
    core.startGroup('Committing with metadata')
    const alreadyEditedFiles: string[] = JSON.parse(process.env.FILES || '[]')
    const files: string[] = [...alreadyEditedFiles, ...editedFilenames]

    core.info(`alreadyEditedFiles: \n${JSON.stringify(alreadyEditedFiles)}`)
    core.info(`editedFiles: \n${JSON.stringify(editedFilenames)}`)
    core.exportVariable('FILES', files)
    core.endGroup()
}

run().catch(error => {
    core.setFailed(`Workflow failed! ${error.message}`)
})
