import * as core from '@actions/core'
import * as z from 'zod'

// schema
const keys = ['github_token', 'md_header', 'issue_number']

const commonConfigSchema = z.object({
    github_token: z.string(),
    md_header: z.string(),
    issue_number: z.string().optional()
})

export type Config = z.infer<typeof commonConfigSchema>
/**
 * 将 action.yml 中的 input 入参转换为对象
 *
 * @returns {Config} 映射的对象
 */
export function getConfig(): Config {
    const raw: {[key: string]: string} = {}

    keys.forEach(key => {
        const v = core.getInput(key)
        if (v) {
            raw[key] = v
        }
    })

    core.debug(`Raw config: ${JSON.stringify(raw)}`)
    return commonConfigSchema.parse(raw)
}
