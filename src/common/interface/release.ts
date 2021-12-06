import {IReleaseAsset} from './asset'
import {IsoDateString} from '../types/iso-date-string'

export interface IRelease {
    url: string
    html_url: string
    created_at: IsoDateString
    published_at: IsoDateString | null

    body?: string | null
    assets: IReleaseAsset[]
}
