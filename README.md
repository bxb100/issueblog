<!--suppress HtmlDeprecatedAttribute-->
<p align="center">
  <img src="https://img.shields.io/github/release/bxb100/issueblog.svg?style=flat-square" alt='release'>
  <img src="https://img.shields.io/github/release-date/bxb100/issueblog.svg?style=flat-square" alt='release-date'>
</p>

# Issue Blog GitHub Action

This project is a GitHub Action-powered blog. It's creating a blog from issues and tags.

It will search all your issues to build a blog. The issue's label will be the category name.

Special Label (ignore case):

* **Todo**: The `TODO` category.
* **Links**: The `Links` category. If you give a heart reaction :heart: to the comment, it will be added to the link
  category, rule see [#links](#links)
* **Top**: The `Top` category.

Inspired by [GitBlog](https://github.com/yihong0618/gitblog) and other projects.[^1][^2][^3][^4][^5]

## Examples

check out the [example repository](https://github.com/bxb100/issueblog-test)

## Usage

In the repository where you wish to build a blog, create `.github/workflows/issue_blog.yml`. The following example shows
the issue and issue's comments event trigger fired. It will generate `README.md`, `feed.xml`, `rss.xls`, and backup
markdown files.

```yaml
name: 'Generate Blog'
on:
  workflow_dispatch:
  issues:
    types: [ opened, edited ]
  issue_comment:
    types: [ created, edited ]
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
        uses: bxb100/issueblog@v1 # Prefer to use the latest version
        with:
          # Define the README.md header content
          md_header: "## GitLog\nMy personal blog using issues and GitHub Actions\n[RSS Feed](https://bxb100.github.io/blog/feed.xml)"
```

### Advanced Usage

If you want to generate podcast RSS, you can create the release, rules see [#release](#release).

You can define `blog_image_url` to customize your RSS image.

You can enable __GitHub Page__ (`branch main in /root`) to show
human-readable [RSS](https://bxb100.github.io/issueblog-test/feed.xml).

## Inputs

### `github_token` (optional)

The GitHub token used to create an authenticated client, the default `github.token` auth scope is the current
repository.[^6]

### `blog_author` (optional)

The author name of the blog, the default is `${{ github.repository_owner }}`.

### `md_header` (optional)

The header of `README.md`, default:

```markdown
## GitLog

My personal blog using issues and GitHub Actions [RSS Feed](https://raw.githubusercontent.com/${{ github.repository
}}/master/feed.xml)
```

([YAML multiple lines](https://stackoverflow.com/questions/3790454/how-do-i-break-a-string-in-yaml-over-multiple-lines))

### `blog_image_url` (optional)

The image url of the blog, default is

`https://cdn.jsdelivr.net/gh/${{ github.repository }}/blog.png`

that means the image is at the root of the repository.

### `blog_url` (optional)

The deployment url of the blog, default is

`https://${{ github.repository_owner }}.github.io/${{ github.repository_name }}`

current support Hexo

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

Group the no labeled issues to the unlabeled category, default ignore.

## Rules:

<a id="links"></a>

### `links` ( [demo](https://github.com/bxb100/issueblog-test/issues/1) )

```markdown
name:GitBlog
link:https://github.com/yihong0618/gitblog
desc:Example description
```

<a id="release"></a>

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

## Tips:

RSS only support [Hexo](https://hexo.io/docs/permalinks.html) `:year/:month/:title` permalink

## Licence

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<a id="THANKS"></a>
[^1]: https://github.com/githubocto/flat some source code
[^2]: https://github.com/actions/typescript-action action template
[^3]: https://github.com/actions/toolkit util
[^4]: https://github.com/actions/stale project structure
[^5]: https://typlog.com/featured/podcasts rss.xsl
[^6]: https://docs.github.com/en/actions/security-guides/automatic-token-authentication action env auth
