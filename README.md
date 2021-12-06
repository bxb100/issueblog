<p align="center">
  <img src="https://img.shields.io/github/release/bxb100/issueblog.svg?style=flat-square" alt='release'>
  <img src="https://img.shields.io/github/release-date/bxb100/issueblog.svg?style=flat-square" alt='release-date'>
</p>

# Issue Blog GitHub Action

Issue Blog is a GitHub Action that creates a blog from issues. It will search all issues to build a blog, the block section of blog is the issue label name.

Special label:
 * **Todo**: It will display at the todo category.
 * **Friends**: If you give a heart reaction to the comment, it will be added to the link category, rule see [THIS](#friends)
 * **Top**: It will display at the top category.

Inspired by [GitBlog](https://github.com/yihong0618/gitblog) and other projects.[^1][^2][^3]

## Examples

check out the [example repository](https://github.com/bxb100/issueblog-test)

## Usage

In the repository where you wish to build blog, create `.github/workflows/issue_blog.yml`. the following example show the issue and issue comments event trigger fired, It will generate `README.md`, `feed.xml`, `rss.xls` and backup markdown files.

```yaml
name: 'Generate Blog'
on:
  workflow_dispatch:
  issues:
    types: [opened, edited]
  issue_comment:
    types: [created, edited]
concurrency: 
  # just run one action at a time
  group: ${{ github.workflow }}
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2 #  Check out the repository, so it can read the files it and do other operations
      - name: Generate README
        uses: bxb100/issueblog@v1.0.2
        with:
          # define the README.md file first line
          md_header: "## GitLog\nMy personal blog using issues and GitHub Actions\n[RSS Feed](https://bxb100.github.io/blog/feed.xml)"
```
### Advanced Usage
If you want to generate podcast rss, you can create the release, rules see [THIS](#release).

You can define `blog_image_url` to customized your rss image.

You can enable __GitHub Page__ (`branch main in /root`) to show human-readable [RSS](https://bxb100.github.io/issueblog-test/feed.xml).

## Inputs

### `github_token` (optional)
The GitHub token used to create an authenticated client, the default `github.token` auth scope is current repository.[^6]

### `md_header` (optional)
The header of `README.md`, default:
```markdown
## GitLog\nMy personal blog using issues and GitHub Actions\n[RSS Feed](https://raw.githubusercontent.com/${{ github.repository }}/master/feed.xml)
```

### `blog_image_url` (optional)
The image url of the blog, default is `https://raw.githubusercontent.com/${{ github.repository }}/master/blog.png`, that means the image is in the root of the repository.

### `issue_number` (optional)
The event issue number, default is `{{ github.event.number }}`, that not using currently.

### `recent_limit` (optional)
The recent category limit, default is `10`.

### `anchor_number` (optional)
The number of each category to show, default is `5`.

### `links_title` (optional)
The title of the links, default is `Links`.

### `recent_title` (optional)
The title of the recent category, default is `Recent`.

### `top_title` (optional)
The title of the top category, default is `Top`.

### `unlabeled_title` (optional)
Not using now.


## Rules:
<a name="friends"></a>
### `friends` ( [demo](https://github.com/bxb100/issueblog-test/issues/1) )
```markdown
名字：兔子鮮笙
链接：https://tuzi.moe
描述：20 岁的天才少年
```

<a name="release"></a>
### `release` ( [demo](https://github.com/bxb100/issueblog-test/releases/tag/ep34) )
* Upload the mp3 file to the release.
* Write content like this:
```markdown
podcast title
---
![podcast image](https://example.com/img.png)
---
description
```

## Licence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)


[^1]: https://github.com/githubocto/flat
[^2]: https://github.com/actions/typescript-action
[^3]: https://github.com/actions/toolkit
[^4]: https://github.com/actions/stale
[^5]: https://github.com/DIYgod/RSSHub
[^6]: https://docs.github.com/en/actions/security-guides/automatic-token-authentication
