import {IsoDateString} from "./iso-date-string";

export type MetadataInfo = {
    name: string,
    createdAt: string,
    updatedAt: string
}

export type Metadata = {
    [issueNumber: number]: MetadataInfo
}

export function compareUpdateTime(a: MetadataInfo, b: IsoDateString): number {
    return new Date(a.updatedAt).getTime() - Date.parse(b);
}
