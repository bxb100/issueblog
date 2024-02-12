import * as core from '@actions/core'
import {exec} from '@actions/exec'
import {
    diff,
    getModifiedUnstagedFiles,
    getUnstagedFiles,
    submodulePath
} from './util/git'

const run = async (): Promise<void> => {
    core.startGroup('Post cleanup script')

    if (process.env.HAS_RUN_POST_JOB) {
        core.notice('Files already committed')
        core.endGroup()
        return
    }

    // 3. monitor file changes
    core.startGroup('Monitor file changes')
    const newUnstagedFiles = await getUnstagedFiles()
    const modifiedUnstagedFiles = await getModifiedUnstagedFiles()
    const editedFilenames = [...newUnstagedFiles, ...modifiedUnstagedFiles]
    core.info(`newUnstagedFiles: \n${newUnstagedFiles}`)
    core.info(`modifiedUnstagedFiles: \n${modifiedUnstagedFiles}`)
    core.info(`editedFilenames: \n${editedFilenames}`)
    core.endGroup()

    // 4. calculate diff and add to git
    core.startGroup('Calculate diff')
    const editedFiles = []
    const submodules = await submodulePath()
    core.info(`submodules: ${submodules}`)
    for (const filename of editedFilenames) {
        if (filename.startsWith('.github')) {
            // skip GitHub Actions files
            continue
        }
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

    // 5. commit and push
    const date = new Date().toISOString()
    const meta = JSON.stringify(
        {
            date,
            editedFiles
        },
        undefined,
        2
    )
    const msg = `Refresh README AND BACK UP (${date})`

    // Don't want to commit if there aren't any files changed!
    if (!editedFiles.length) {
        core.notice('No files changed')
        core.endGroup()
        return
    }

    // these should already be staged, in main.ts
    core.info(`Committing "${msg}"`)
    core.debug(meta)
    await exec('git', ['commit', '-m', `${msg}\n${meta}`])
    await exec('git', ['push'])
    core.info(`Pushed!`)
    core.exportVariable('HAS_RUN_POST_JOB', 'true')

    core.endGroup()
}

run().catch(error => {
    core.setFailed(`Post script failed! ${error.message}`)
})
