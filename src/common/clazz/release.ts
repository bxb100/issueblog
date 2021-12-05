import {IRelease} from "../interface/release";
import {IReleaseAsset} from "../interface/asset";
import {IsoDateString} from "../types/iso-date-string";
import {GithubKit} from "./github-kit";
import * as core from "@actions/core"

export class Release implements IRelease {

    assets: IReleaseAsset[];
    body: string | null | undefined;
    created_at: IsoDateString;
    html_url: string;
    published_at: IsoDateString | null;
    url: string;

    constructor(data: IRelease) {
        this.assets = data.assets;
        this.body = data.body;
        this.created_at = data.created_at;
        this.html_url = data.html_url;
        this.published_at = data.published_at;
        this.url = data.url;
    }

    static cast(releases: IRelease[]) {
        return releases.map(release => new Release(release));
    }

    async convertToPodcastInfo(kit: GithubKit<any>): Promise<Podcast | null> {

        // noinspection RegExpRedundantEscape
        const markdownImageRegx = /!\[.*?\]\((.*?)\)/;
        const defaultImage = 'https://cdn.jsdelivr.net/gh/bxb100/bxb100@master/png2.png'
        if (this.body) {
            const split = this.body.split(/\r\n---+\r\n/);
            core.debug(`convertToPodcastInfo: ${split}`)
            const title = split[0];
            const regexes = split[1].match(markdownImageRegx)
            const image = regexes && regexes[1]
            const content = await kit.renderMarkdown(split[2]);
            return {
                title,
                image: image || defaultImage,
                content: content,
            }
        }
        return null;
    }
}
