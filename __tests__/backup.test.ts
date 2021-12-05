import * as fs from 'fs';

test("test create chinese filename file", () => {
    fs.writeFileSync(
        './测试.md',
        'ceshi'
    )
})
