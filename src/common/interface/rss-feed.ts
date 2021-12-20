// https://cyber.harvard.edu/rss/rss.html
// https://support.google.com/podcast-publishers/answer/9889544#zippy=%2Crecommended-categories

import {IRssItem} from './rss-item'
import {Rfc822Date} from '../types/rfc-822-date-string'

export interface IRssFeed {
    title: string
    link: string
    description: string
    atomLink: string
    lastBuildDate: Rfc822Date

    ttl?: number
    language?: string
    image?: string
    items?: IRssItem[]

    itunes_owner?: {
        email: string
    }
    itunes_author?: string
    itunes_category?: string
    itunes_image?: string
}
