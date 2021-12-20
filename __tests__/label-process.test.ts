import {FRIENDS_TABLE_HEAD, friendTableTitle} from '../src/functions/links-process'
// @ts-ignore
import {utils} from './base.test'
import {Constant} from '../src/common/clazz/constant'
import {add_md_label} from '../src/functions/label-process'

test('test generate string', async () => {

    await add_md_label(utils, await utils.getIssues(1))
    console.log(utils.sectionMap.get(Constant.EACH_LABEL))

    expect(utils.sectionMap.get(Constant.EACH_LABEL)).not.toContain('links')
    // worst case
}, 10000)
