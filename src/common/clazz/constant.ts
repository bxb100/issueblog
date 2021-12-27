export class Constant {
    static readonly FIXED_LINKS = 'Links'
    static readonly FIXED_TOP = 'Top'
    static readonly FIXED_TODO = 'Todo'
    static readonly FIXED_RECENT = 'Recent'

    static readonly AGG_EACH_LABEL = 'Label'

    readonly header: string

    constructor(header: string) {
        this.header = header
    }

    convertBlogContent(map: Map<string, string>): string {
        let content: string = this.header
        content += map.get(Constant.FIXED_LINKS) || ''
        content += map.get(Constant.FIXED_TOP) || ''
        content += map.get(Constant.FIXED_RECENT) || ''
        content += map.get(Constant.AGG_EACH_LABEL) || ''
        content += map.get(Constant.FIXED_TODO) || ''
        return content
    }
}
