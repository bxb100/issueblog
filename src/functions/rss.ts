import {GithubKit} from "../common/clazz/github-kit";
import {Issue} from "../common/clazz/issue";
import {IRssFeed} from "../common/interface/rss-feed";
import art from "art-template";
import * as fs from "fs";
import {Release} from "../common/clazz/release";

export async function rss(
    this: GithubKit<any>,
    issues: Issue[]
): Promise<void> {

    const feeds: IRssFeed = {
        atomLink: `https://github.com/${this.owner}/${this.repo}/feed.xml`,
        description: `RSS feed of ${this.owner}'s ${this.repo}`,
        link: `https://github.com/${this.owner}/${this.repo}`,
        title: `RSS feed of ${this.owner}'s ${this.repo}`,
        lastBuildDate: new Date().toUTCString(),
    };
    feeds.items = []
    // insert issues
    for (const issue of issues) {
        const content = issue.body && await this.renderMarkdown(issue.body) || ""
        feeds.items.push({
            title: issue.title,
            description: content,
            pubDate: new Date(issue.updated_at || new Date()).toUTCString(),
            link: issue.html_url,
            author: this.owner,
            category: issue.getLabels(this),
        })
    }

    // insert release
    const releases: Release[] = await this.getAllReleases()
    for (const release of releases) {
        const podcastInfo = await release.convertToPodcastInfo(this);
        if (podcastInfo == null) {
            continue
        }
        feeds.itunes_author = this.owner
        feeds.items.push({
            title: podcastInfo.title,
            description: podcastInfo.content,
            link: release.html_url,
            author: this.owner,
            pubDate: new Date(release.published_at || new Date()).toUTCString(),
            enclosure: release.assets[0] && {
                url: release.assets[0].browser_download_url,
                length: release.assets[0].size + '',
                type: release.assets[0].content_type,
            },
            category: "Podcast",
            itunes_item_image: podcastInfo.image
        })
    }

    // generate rss xml file
    let rssXml = art('./view/rss.art', feeds);
    fs.writeFileSync('./feed.xml', rssXml);
}
