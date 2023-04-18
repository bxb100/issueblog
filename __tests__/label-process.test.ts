// @ts-ignore
import {blogContext, utils} from './base.test'
import {Constant} from '../src/common/clazz/constant'
import {add_md_label} from '../src/functions/label-process'

test('test generate string', async () => {
    await add_md_label(blogContext)
    console.log(blogContext.sectionMap.get(Constant.AGG_EACH_LABEL))
    expect(
        blogContext.sectionMap.get(Constant.AGG_EACH_LABEL)
    ).toMatchSnapshot()
    expect(blogContext.sectionMap.get(Constant.AGG_EACH_LABEL)).not.toContain(
        'links'
    )
    // worst case
}, 10000)
