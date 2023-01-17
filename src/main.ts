import * as core from '@actions/core'
import {
    diff,
    getModifiedUnstagedFiles,
    getUnstagedFiles,
    submodulePath
} from './util/git'
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
        .then(async p => Promise.all([p.rss(), p.files()]))
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
            if (bytes == null) {
                editedFiles.push({msg: `${filename} mark rename`})
                continue
            }
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
