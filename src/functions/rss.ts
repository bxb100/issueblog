import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import {IRssFeed} from '../common/interface/rss-feed'
import {Release} from '../common/clazz/release'
import {rootPath} from '../main'
import {template} from '../util/template'
import {Context} from '../common/clazz/context'

export async function rss(context: Context): Promise<void> {
    const config = context.config
    const kit = context.kit
    const issues = context.essayIssues
    const feeds: IRssFeed = {
        atomLink: `https://github.com/${kit.owner}/${kit.repo}/feed.xml`,
        description: `RSS feed of ${config.blog_author}'s ${kit.repo}`,
        link: `https://github.com/${kit.owner}/${kit.repo}`,
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
            link: issue.html_url,
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
    fs.writeFileSync('./feed.xml', rssXml)

    const xslPath = path.resolve(rootPath, './view/rss.xsl')
    const xsl = fs.readFileSync(xslPath, 'utf8')
    fs.writeFileSync('./rss.xsl', xsl)
}
