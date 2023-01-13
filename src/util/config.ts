import * as core from '@actions/core'
import * as z from 'zod'

// schema
const keys = [
    'github_token',
    'blog_author',
    'md_header',
    'issue_number',
    'recent_limit',
    'anchor_number',
    'links_title',
    'recent_title',
    'top_title',
    'unlabeled_title',
    'blog_image_url'
]

const commonConfigSchema = z.object({
    github_token: z.string(),
    blog_author: z.string().default('repository_owner'),
    md_header: z.string(),
    issue_number: z.string().optional(),
    recent_limit: z.string().default('5'),
    anchor_number: z.string().default('5'),
    links_title: z.string(),
    recent_title: z.string(),
    top_title: z.string(),
    unlabeled_title: z.string(),
    blog_image_url: z.string().default('blog.png'),
    blog_url: z.string().optional()
})

export type Config = z.infer<typeof commonConfigSchema>

/**
 * 将 action.yml 中的 input 入参转换为对象
 *
 * @returns {Config} 映射的对象
 */
export function getConfig(): Config {
    const raw: {[key: string]: string} = {}

    for (const key of keys) {
        const v = core.getInput(key)
        if (v) {
            raw[key] = v
        }
    }

    core.debug(`Raw config: ${JSON.stringify(raw)}`)
    return commonConfigSchema.parse(raw)
}
