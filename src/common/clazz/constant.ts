export class Constant {
    static readonly FRIEND = 'Friends'
    static readonly TOP = 'Top'
    static readonly RECENT = 'Recent'
    static readonly TODO = 'Todo'
    static readonly EACH_LABEL = 'Label'

    readonly header: string

    constructor(header: string) {
        this.header = header
    }

    convertBlogContent(map: Map<string, string>): string {
        let content: string = this.header
        content += map.get(Constant.FRIEND) || ''
        content += map.get(Constant.TOP) || ''
        content += map.get(Constant.RECENT) || ''
        content += map.get(Constant.EACH_LABEL) || ''
        content += map.get(Constant.TODO) || ''
        return content
    }
}
