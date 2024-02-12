export type MetadataInfo = {
    name: string
    issueNumber: number
    createdAt: string
    updatedAt: string
}

export type Metadata = {
    [issueNumber: number]: MetadataInfo
}
