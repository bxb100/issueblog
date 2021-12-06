import * as core from '@actions/core'
import {exec} from '@actions/exec'

const run = async (): Promise<void> => {
    core.startGroup('Post cleanup script')

    if (process.env.HAS_RUN_POST_JOB) {
        core.notice('Files already committed')
        core.endGroup()
        return
    }

    const files = JSON.parse(process.env.FILES || '[]')

    const date = new Date().toISOString()
    const meta = JSON.stringify(
        {
            date,
            files
        },
        undefined,
        2
    )
    const msg = `Refresh README AND BACK UP (${date})`

    // Don't want to commit if there aren't any files changed!
    if (!files.length) {
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
