import {IRelease} from "../interface/release";
import {IReleaseAsset} from "../interface/asset";
import {IsoDateString} from "../types/iso-date-string";
import {GithubKit} from "./github-kit";

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
        const markdownImageRegx = /!\[(.*?)\]\((.*?)\)/g;
        const defaultImage = 'https://cdn.jsdelivr.net/gh/bxb100/bxb100@master/png2.png'
        if (this.body) {
            const split = this.body.split(/\r\n---*\r\n/);
            const title = split[0];
            let image = defaultImage
            if (markdownImageRegx.test(split[1])) {
                image = markdownImageRegx.exec(split[1])?.[1] || defaultImage;
            }
            const content = await kit.renderMarkdown(split[2]);
            return {
                title,
                image,
                content,
            }
        }
        return null;
    }
}
