import {
    add_md_friends,
    FRIENDS_TABLE_HEAD,
    friendTableTitle
} from '../src/functions/links-process'
// @ts-ignore
import {blogContext, utils, config} from './base.test'
import {Constant} from '../src/common/clazz/constant'

test('test generate string', async () => {
    await add_md_friends(blogContext)
    expect(blogContext.sectionMap.get(Constant.FIXED_LINKS)).toMatchSnapshot()
    expect(blogContext.sectionMap.get(Constant.FIXED_LINKS)).toEqual(
        `${friendTableTitle(config)}${FRIENDS_TABLE_HEAD}` +
            '| 兔子鮮笙 | https://tuzi.moe | 20 岁的天才少年 |\n' +
            '| 兔子鮮笙 | https://tuzi.moe | desc\\:测试 |\n'
    )
    // worst case
}, 10000)
