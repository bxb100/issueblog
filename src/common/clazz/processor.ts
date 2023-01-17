import {Context} from './context'
import {Constant} from './constant'
import fs from 'fs'
import {add_md_friends} from '../../functions/links-process'
import {add_md_top} from '../../functions/top-process'
import {add_md_recent} from '../../functions/recent-process'
import {add_md_todo} from '../../functions/todo-process'
import {add_md_label} from '../../functions/label-process'
import {rss} from '../../functions/rss'
import {files} from '../../functions/files'
import {GithubKit} from './github-kit'
import {Config} from '../../util/config'

export class Processor {
    readonly config: Config

    constructor(config: Config) {
        this.config = config
    }

    writeReadMe(context: Context): Processor {
        const constant = new Constant(this.config.md_header)
        fs.writeFileSync(
            'README.md',
            constant.convertBlogContent(context.sectionMap)
        )
        return this
    }

    async process(): Promise<Processor> {
        const context = await this.init()

        return Promise.all([
            add_md_friends(context),
            add_md_top(context),
            add_md_recent(context),
            add_md_todo(context),
            add_md_label(context)
        ]).then(
            () => this.writeReadMe(context),
            err => {
                throw err
            }
        )
    }

    async rss(): Promise<Processor> {
        await rss(await this.init())
        return this
    }

    async files(): Promise<Processor> {
        await files(await this.init())
        return this
    }

    deleteAllFiles(): Processor {
        fs.rmdirSync(this.config.save_md_path)
        return this
    }

    private context: Context | null = null

    private async init(): Promise<Context> {
        if (this.context == null) {
            const kit = new GithubKit(this.config.github_token)
            this.context = new Context(
                await kit.getAllIssues(),
                kit,
                this.config
            )
        }
        return this.context
    }
}
