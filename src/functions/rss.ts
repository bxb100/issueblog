import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import {IRssFeed} from '../common/interface/rss-feed'
import {Release} from '../common/clazz/release'
import {rootPath} from '../main'
import {template} from '../util/template'
import {BlogContext} from '../common/clazz/blog-context'
import {backupFileName} from '../util/util'
import {Issue} from '../common/clazz/issue'

function linkTemplate(issue: Issue): string {
    const formatter = (i: number): string =>
        i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping: false})
    // hexo 模版是 /:year/:month/:day/:title/
    const date = new Date(issue.created_at || new Date())
    return `/${date.getFullYear()}/${formatter(
        date.getMonth() + 1
    )}/${backupFileName(issue).replace('.md', '')}`
}

export async function rss(context: BlogContext): Promise<void> {
    const config = context.config
    const kit = context.kit
    const issues = context.essayIssues

    const feeds: IRssFeed = {
        atomLink: `${config.blog_url}/feed.xml`,
        description: `RSS feed of ${config.blog_author}'s ${kit.repo}`,
        link: `${config.blog_url}`,
        title: `${config.blog_author}'s Blog`,
        lastBuildDate: new Date().toUTCString(),
        itunes_image: config.blog_image_url,
        image: config.blog_image_url
    }
    feeds.items = []
    // insert issues
    for (const issue of issues) {
        const content =
            (issue.body && (await kit.renderMarkdown(issue.body))) || ''
        feeds.items.push({
            title: issue.title,
            description: content,
            pubDate: new Date(issue.updated_at || new Date()).toUTCString(),
            link: linkTemplate(issue),
            author: kit.owner,
            category: issue.getLabelName(config.unlabeled_title)
        })
    }

    // insert release
    const releases: Release[] = await kit.getAllReleases()
    for (const release of releases) {
        const podcastInfo = await release.convertToPodcastInfo(kit)
        if (podcastInfo == null) {
            continue
        }
        feeds.itunes_author = kit.owner
        const audio = {
            description: podcastInfo.content,
            author: kit.owner,
            category: 'Podcast',
            itunes_item_image: podcastInfo.image
        }
        const pubTime = new Date(release.published_at || new Date()).getTime()
        for (let i = 0; i < release.assets.length; i++) {
            const asset = release.assets[i]
            feeds.items.push(
                Object.assign(
                    {},
                    {
                        ...audio,
                        title: `${podcastInfo.title}-${i}`,
                        pubDate: new Date(pubTime - i * 1000).toUTCString(),
                        link: `${release.html_url}?p=${i}`,
                        enclosure: asset && {
                            url: asset.browser_download_url,
                            length: `${asset.size}`,
                            type: asset.content_type
                        }
                    }
                )
            )
        }
    }

    feeds.items.sort(
        (a, b) =>
            new Date(b.pubDate || 0).getTime() -
            new Date(a.pubDate || 0).getTime()
    )

    core.debug(JSON.stringify(feeds, null, 2))
    // generate rss xml file
    const rssXml = template(feeds)

    fs.writeFileSync(path.join(config.save_feed_path, 'feed.xml'), rssXml)
    const xslPath = path.resolve(rootPath, './view/rss.xsl')
    const xsl = fs.readFileSync(xslPath, 'utf8')
    fs.writeFileSync(path.join(config.save_feed_path, 'rss.xsl'), xsl)
}
