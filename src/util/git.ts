// noinspection SpellCheckingInspection

import * as core from '@actions/core'
import {GitStatus} from '../common/types/git-status'
import {exec} from '@actions/exec'
import path from 'path'
import {statSync} from 'fs'

export async function gitStatus(): Promise<GitStatus[]> {
    core.debug('Getting gitStatus()')
    let output = ''
    await exec('git', ['status', '-s'], {
        listeners: {
            stdout: (data: Buffer) => {
                output += data.toString()
            }
        }
    })
    core.debug(`=== output was:\n${output}`)
    return output
        .split('\n')
        .map(l => l.trim())
        .filter(l => l !== '')
        .map(l => {
            const chunks = l.split(/\s+/)
            return {
                flag: chunks[0],
                path: chunks[1]
            } as GitStatus
        })
}

async function getHeadSize(filePath: string): Promise<number | undefined> {
    let raw = ''
    const exitCode = await exec('git', ['cat-file', '-s', `HEAD:${filePath}`], {
        listeners: {
            stdline: (data: string) => {
                raw += data
            }
        }
    })
    core.debug(`raw cat-file output: ${exitCode} '${raw}'`)
    if (exitCode === 0) {
        return parseInt(raw, 10)
    }
}

async function diffSize(file: GitStatus): Promise<number | null> {
    switch (file.flag) {
        case 'M': {
            const stat = statSync(file.path)
            core.debug(
                `Calculating diff for ${JSON.stringify(file)}, with size ${
                    stat.size
                }b`
            )

            // get old size and compare
            const oldSize = await getHeadSize(file.path)
            const delta =
                oldSize === undefined ? stat.size : stat.size - oldSize
            core.debug(
                ` ==> ${file.path} modified: old ${oldSize}, new ${stat.size}, delta ${delta}b `
            )
            return delta
        }
        case 'A': {
            const stat = statSync(file.path)
            core.debug(
                `Calculating diff for ${JSON.stringify(file)}, with size ${
                    stat.size
                }b`
            )

            core.debug(` ==> ${file.path} added: delta ${stat.size}b`)
            return stat.size
        }
        case 'D': {
            const oldSize = await getHeadSize(file.path)
            const delta = oldSize === undefined ? 0 : oldSize
            core.debug(` ==> ${file.path} deleted: delta ${delta}b`)
            return delta
        }
        case 'R': {
            core.debug(` ==> ${file.path} rename to ${file.path2}`)
            return null
        }
        default: {
            throw new Error(
                `Encountered an unexpected file status in git: ${file.flag} ${file.path}`
            )
        }
    }
}

export async function diff(filename: string): Promise<number | null> {
    const statuses = await gitStatus()
    core.debug(
        `Parsed statuses: ${statuses.map(s => JSON.stringify(s)).join(', ')}`
    )
    const status = statuses.find(s => path.relative(s.path, filename) === '')
    if (typeof status === 'undefined') {
        core.info(`No status found for ${filename}, aborting.`)
        return 0 // there's no change to the specified file
    }
    return await diffSize(status)
}

const lsFile = async (
    commandLine: string,
    args?: string[]
): Promise<string[]> => {
    const raw: string[] = []
    await exec(commandLine, args, {
        listeners: {
            stdline: (data: string) => {
                raw.push(data.trim())
            }
        }
    })
    return raw.filter(l => l !== '')
}

export async function getUnstagedFiles(): Promise<string[]> {
    return lsFile('git', ['ls-files', '--others', '--exclude-standard'])
}

export async function getModifiedUnstagedFiles(): Promise<string[]> {
    return lsFile('git', ['ls-files', '-m'])
}

export async function submodulePath(): Promise<string[]> {
    const raw: string[] = []
    await exec('git', ['ls-files', '-s'], {
        listeners: {
            stdline: (data: string) => {
                if (data.trim().startsWith('160000')) {
                    raw.push(data.trim().split('\t')[1])
                }
            }
        }
    })
    return raw
}
