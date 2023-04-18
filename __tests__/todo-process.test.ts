// @ts-ignore
import {blogContext} from './base.test'
import {Constant} from '../src/common/clazz/constant'
import {add_md_todo} from '../src/functions/todo-process'

test('test generate string', async () => {
    await add_md_todo(blogContext)
    expect(blogContext.sectionMap.get(Constant.FIXED_TODO)).toMatchSnapshot()
    // worst case
}, 10000)
