<!--suppress HtmlDeprecatedAttribute-->
<p align="center">
  <img src="https://img.shields.io/github/release/bxb100/issueblog.svg?style=flat-square" alt='release'>
  <img src="https://img.shields.io/github/release-date/bxb100/issueblog.svg?style=flat-square" alt='release-date'>
</p>

# Issue Blog GitHub Action

Issue Blog is a GitHub Action that creates a blog from issues. It will search all your issues to build a blog, the issue label name will be category name.

Special label:
* **Todo**: The `TODO` category.
* **Friends**: The `Links` category. If you give a heart reaction to the comment, it will be added to the link category, rule see [#friends](#friends)
* **Top**: The `Top` category.

Inspired by [GitBlog](https://github.com/yihong0618/gitblog) and other projects.[^1][^2][^3][^4][^5]

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
        uses: bxb100/issueblog@v1.0.5 # Prefer to use the latest version
        with:
          # Define the README.md header content
          md_header: "## GitLog\nMy personal blog using issues and GitHub Actions\n[RSS Feed](https://bxb100.github.io/blog/feed.xml)"
```
### Advanced Usage
If you want to generate podcast rss, you can create the release, rules see [#release](#release).

You can define `blog_image_url` to customized your rss image.

You can enable __GitHub Page__ (`branch main in /root`) to show human-readable [RSS](https://bxb100.github.io/issueblog-test/feed.xml).

## Inputs

### `github_token` (optional)
The GitHub token used to create an authenticated client, the default `github.token` auth scope is current repository.[^7]

### `blog_author` (optional)
The author name of the blog, the default is `${{ github.repository_owner }}`.

### `md_header` (optional)
The header of `README.md`, default:
```markdown
## GitLog\nMy personal blog using issues and GitHub Actions\n[RSS Feed](https://raw.githubusercontent.com/${{ github.repository }}/master/feed.xml)
```

### `blog_image_url` (optional)
The image url of the blog, default is

`https://raw.githubusercontent.com/${{ github.repository }}/master/blog.png`

that means the image is in the root of the repository.

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
name:GitBlog
link:https://github.com/yihong0618/gitblog
desc:Example description
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
[^6]: https://typlog.com/featured/podcasts
[^7]: https://docs.github.com/en/actions/security-guides/automatic-token-authentication
