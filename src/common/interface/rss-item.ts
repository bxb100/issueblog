import {Rfc822Date} from '../types/rfc-822-date-string'

export interface IRssItem {
    title: string
    description: string
    link: string
    author?: string
    pubDate?: Rfc822Date
    enclosure?: {
        url: string
        length: string
        type: string
    }
    guid?: {
        isPermaLink?: boolean
        url: string
    }
    category?: string | string[]

    itunes_item_image?: string
    itunes_duration?: string
}
