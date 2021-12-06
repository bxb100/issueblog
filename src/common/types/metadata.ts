export type MetadataInfo = {
    name: string
    createdAt: string
    updatedAt: string
}

export type Metadata = {
    [issueNumber: number]: MetadataInfo
}
