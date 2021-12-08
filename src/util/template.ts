import * as fs from 'fs'
import Handlebars from 'handlebars'
import path from 'path'
import {rootPath} from './config'

export function template(data: object): string {
    const templatePath = path.resolve(rootPath, './view/rss.handlebars')
    Handlebars.registerHelper('typeof', function (context, type) {
        return typeof context === type
    })
    const temple = Handlebars.compile(fs.readFileSync(templatePath, 'utf8'))
    return temple(data)
}
