import * as core from '@actions/core'
import * as fs from 'fs'
import * as path from 'path'
import {GithubKit} from '../common/clazz/github-kit'
import {IRssFeed} from '../common/interface/rss-feed'
import {Issue} from '../common/clazz/issue'
import {Release} from '../common/clazz/release'
import {rootPath} from '../main'
import {template} from '../util/template'

export async function rss(kit: GithubKit, issues: Issue[]): Promise<void> {
    const feeds: IRssFeed = {
        atomLink: `https://github.com/${kit.owner}/${kit.repo}/feed.xml`,
        description: `RSS feed of ${kit.config.blog_author}'s ${kit.repo}`,
        link: `https://github.com/${kit.owner}/${kit.repo}`,
        title: `${kit.config.blog_author}'s Blog`,
        lastBuildDate: new Date().toUTCString(),
        itunes_image: kit.config.blog_image_url,
        image: kit.config.blog_image_url
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
            category: issue.getLabels(kit)
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
        feeds.items.push({
            title: podcastInfo.title,
            description: podcastInfo.content,
            link: release.html_url,
            author: kit.owner,
            pubDate: new Date(release.published_at || new Date()).toUTCString(),
            enclosure: release.assets[0] && {
                url: release.assets[0].browser_download_url,
                length: `${release.assets[0].size}`,
                type: release.assets[0].content_type
            },
            category: 'Podcast',
            itunes_item_image: podcastInfo.image
        })
    }

    core.debug(JSON.stringify(feeds, null, 2))
    // generate rss xml file
    const rssXml = template(feeds)
    fs.writeFileSync('./feed.xml', rssXml)

    const xslPath = path.resolve(rootPath, './view/rss.xsl')
    const xsl = fs.readFileSync(xslPath, 'utf8')
    fs.writeFileSync('./rss.xsl', xsl)
}
