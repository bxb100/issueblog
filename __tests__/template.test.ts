import {template} from '../src/util/template'

const testData = '{\n' +
    '  "atomLink": "https://github.com/bxb100/issueblog-test/feed.xml",\n' +
    '  "description": "RSS feed of bxb100\'s issueblog-test",\n' +
    '  "link": "https://github.com/bxb100/issueblog-test",\n' +
    '  "title": "bxb100\'s Blog",\n' +
    '  "lastBuildDate": "Wed, 08 Dec 2021 13:46:26 GMT",\n' +
    '  "itunes_image": "https://cdn.jsdelivr.net/gh/bxb100/issueblog-test/blog.png",\n' +
    '  "image": "https://cdn.jsdelivr.net/gh/bxb100/issueblog-test/blog.png",\n' +
    '  "items": [\n' +
    '    {\n' +
    '      "title": "测试文章 2",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sun, 05 Dec 2021 20:09:30 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/22",\n' +
    '      "author": "bxb100",\n' +
    '      "category": "CSSCSCS"\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "测试一个文章",\n' +
    '      "description": "<h2>\\n<a id=\\"user-content-啦啦啦啦啦\\" class=\\"anchor\\" href=\\"#%E5%95%A6%E5%95%A6%E5%95%A6%E5%95%A6%E5%95%A6\\" aria-hidden=\\"true\\"><span aria-hidden=\\"true\\" class=\\"octicon octicon-link\\"></span></a>啦啦啦啦啦</h2>\\n<p>打的就爱上了</p>\\n<ul>\\n<li>1</li>\\n<li>2</li>\\n<li>3</li>\\n<li>4</li>\\n</ul>\\n<hr>\\n<table>\\n<thead>\\n<tr>\\n<th>a</th>\\n<th>b</th>\\n</tr>\\n</thead>\\n<tbody>\\n<tr>\\n<td>1</td>\\n<td>2</td>\\n</tr>\\n</tbody>\\n</table>\\n",\n' +
    '      "pubDate": "Sun, 05 Dec 2021 20:04:10 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/21",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "测试"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "备份测试 1-改名测试 1",\n' +
    '      "description": "<p>cscscc sc sc sa C</p>\\n",\n' +
    '      "pubDate": "Sun, 05 Dec 2021 12:33:27 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/20",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "todo 测试 2",\n' +
    '      "description": "<ul>\\n<li>[x] 1</li>\\n<li>[x] 2</li>\\n</ul>\\n",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:49:43 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/19",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "Todo"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "todo 测试",\n' +
    '      "description": "<ul>\\n<li>[ ] undone</li>\\n<li>[x] done</li>\\n<li>[x] done2</li>\\n</ul>\\n",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:47:31 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/18",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "Todo"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 7",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:11:30 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/17",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 6",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:11:23 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/16",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 5",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:09:22 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/15",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 4",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:09:13 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/14",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 3",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:06:41 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/13",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 2",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:06:35 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/12",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 1",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:06:29 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/11",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "测试隐藏 label 6",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:01:19 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/10",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "2021"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "测试隐藏 label 5",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:01:05 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/9",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "2021"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "测试隐藏 label 4",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:00:54 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/8",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "2021"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "测试隐藏 label 3",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:00:42 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/7",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "2021"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "测试隐藏 label 2",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 17:00:31 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/6",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "2021"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "测试隐藏 label 1",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Sun, 05 Dec 2021 09:45:03 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/5",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "2021",\n' +
    '        "two"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "无 label 测试",\n' +
    '      "description": "<p>cscscs</p>\\n",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 16:05:44 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/4",\n' +
    '      "author": "bxb100",\n' +
    '      "category": []\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "置顶测试 2",\n' +
    '      "description": "<p>测试测试测试测试从 s</p>\\n",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 15:19:37 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/3",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "Top"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "置顶测试 1",\n' +
    '      "description": "<p>cscscs</p>\\n",\n' +
    '      "pubDate": "Sat, 04 Dec 2021 15:19:12 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/2",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "Top"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "友链测试",\n' +
    '      "description": "",\n' +
    '      "pubDate": "Wed, 08 Dec 2021 08:52:45 GMT",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/issues/1",\n' +
    '      "author": "bxb100",\n' +
    '      "category": [\n' +
    '        "Friends"\n' +
    '      ]\n' +
    '    },\n' +
    '    {\n' +
    '      "title": "Ep 34. 和 lepture 聊聊他的产品，以及做个人开发的体验",\n' +
    '      "description": "<p>如果喜欢我们的节目，欢迎通过爱发电打赏支持：<a href=\\"https://afdian.net/@pythonhunter\\" rel=\\"nofollow\\">https://afdian.net/@pythonhunter</a>\\n本期我们和 lepture 聊了聊他的两个项目：Typlog 和 Authlib。lepture 分享了他作为个人开发者的一些经验。\\n本期于 2020 年录制，有些信息可能已经过时。关于这两个项目的情况请以官网为准。</p>\\n<p>嘉宾 lepture\\n主播 Adam Wen laike9m</p>\\n<p>链接</p>\\n<ul>\\n<li>Typlog Authlib Typlog 上的第一个播客 <a href=\\"http://nirokita.cn/\\" rel=\\"nofollow\\">http://nirokita.cn/</a>\\n</li>\\n<li>lepture｜Typlog 作者：中文世界最大的悲剧便是封闭</li>\\n</ul>\\n",\n' +
    '      "link": "https://github.com/bxb100/issueblog-test/releases/tag/ep34",\n' +
    '      "author": "bxb100",\n' +
    '      "pubDate": "Sun, 05 Dec 2021 14:41:32 GMT",\n' +
    '      "enclosure": {\n' +
    '        "url": "https://github.com/bxb100/issueblog-test/releases/download/ep34/8361664978_836589.mp3",\n' +
    '        "length": "39938400",\n' +
    '        "type": "audio/mpeg"\n' +
    '      },\n' +
    '      "category": "Podcast",\n' +
    '      "itunes_item_image": "https://user-images.githubusercontent.com/20685961/144750682-8b5d34c6-f7e1-411d-9d8e-fd30d949cb1b.png"\n' +
    '    }\n' +
    '  ],\n' +
    '  "itunes_author": "bxb100"\n' +
    '}\n'

test('testTemplate', async () => {
  // simple test

  const result = template(JSON.parse(testData))
  console.log(result)
  expect(result).toContain('<![CDATA[测试文章 2]]>')
  expect(result).toContain('<category>测试</category>')
  expect(result).toContain('<guid isPermaLink="false">https://github.com/bxb100/issueblog-test/issues/20</guid>')
  expect(result).toContain('url="https://github.com/bxb100/issueblog-test/releases/download/ep34/8361664978_836589.mp3"')
  expect(result).toContain('tunes:image href="https://user-images.githubusercontent.com/20685961/144750682-8b5d34c6-f7e1-411d-9d8e-fd30d949cb1b.png"')
  expect(result).toContain('<![CDATA[<p>如果喜欢我们的节目，欢迎通过爱发电打赏支持：')
  expect(result).toContain('<pubDate>Sun, 05 Dec 2021 14:41:32 GMT</pubDate>')
  expect(result).toContain('<category>Podcast</category>')
  expect(result).toContain('<category>two</category>')
  expect(result).toContain('<![CDATA[测试隐藏 label 1]]>')
});
