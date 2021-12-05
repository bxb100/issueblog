// https://cyber.harvard.edu/rss/rss.html
// https://support.google.com/podcast-publishers/answer/9889544#zippy=%2Crecommended-categories

export interface IRssFeed {

    title: string;
    link: string;
    description: string;
    atomLink: string;
    lastBuildDate: Rfc822Date;

    ttl?: number;
    language?: string;
    image?: RssImage;
    items?: RssItem[];

    itunes_owner?: RssOwner
    itunes_author?: string;
    itunes_category?: string;
    itunes_image?: RssImage;
}

export type RssOwner = {
    email: string;
}

export type RssImage = {
    title: string;
    url: string;
    link: string;
}

export type RssItem = {
    title: string;
    description: string;
    link: string;
    author?: string;
    pubDate?: Rfc822Date;
    enclosure?: RssEnclosure;
    guid?: RssGuid;
    category?: string | string[]

    itunes_item_image?: string;
    itunes_duration?: string;
}

export type Rfc822Date = string;

export type RssGuid = {
    isPermaLink?: boolean;
    url: string
}

export type RssEnclosure = {
    url: string;
    length: string;
    type: string;
}
