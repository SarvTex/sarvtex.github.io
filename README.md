# sarvtex.github.io

My personal blog, live at <https://sarvtex.github.io>.

It's a small hand-written [Jekyll](https://jekyllrb.com/) site with no theme gem and no JavaScript framework.
Everything that controls how it looks and behaves is in this repository and is meant to be
read and changed. This README covers three things:

1. **[Everyday use](#1-everyday-use)**: writing posts, pinning, tags, images, art.
2. **[How it works](#2-how-it-works)**: what each file does and how a Markdown file becomes a web page.
3. **[Tutorial / learning path](#3-tutorial--learning-path)**: step-by-step guides and human-made
   courses for each technology used here, in the order I'd learn them, plus small exercises on this site.

---

## 1. Everyday use

### Run the site on your computer

```bash
bundle install          # once, installs Jekyll and friends (see Gemfile)
bash tools/run.sh       # serves at http://127.0.0.1:4000 and rebuilds on every save
bash tools/test.sh      # production build + broken-link check (what GitHub runs)
```

Pushing to `main` publishes the site automatically (see [Deploying](#deploying)).

### Write a post

Create `_posts/YYYY-MM-DD-some-title.md`. The date in the file name matters, because Jekyll uses it for ordering:

```markdown
---
title: My post
subtitle: A short tagline, shown under the title and on the "New" page.  # optional
date: 2026-10-01 14:00:00 -0300
tags: [research, notes]      # each tag gets an expandable entry in the sidebar
pin: true                    # optional: list under "Pinned" (newest 3 shown)
description: Summary for search engines and link previews. # optional
bg_closed: true                                          # optional: start with the image column hidden
---

## First section

Text in **Markdown**. Inline math: $$a^2 + b^2 = c^2$$.

$$
\sum_{n=1}^\infty \frac{1}{n^2} = \frac{\pi^2}{6}
$$
```

`_posts/2026-09-27-formatting-demo.md` shows every supported element (math, code, tables…).
Delete it once you don't need it.

> **Math tip:** use `$$…$$` both inline and for display blocks. kramdown (the Markdown
> converter) protects what's inside `$$` from Markdown formatting, so `a_1` stays a subscript and
> doesn't become italics. The block form is `$$` on their own lines. The symbols you can use are listed at
> [KaTeX: supported functions](https://katex.org/docs/supported.html).

### Background images (right column)

Every image in `assets/img/bg/` is stacked in the right column, which scrolls slowly upward in a
loop (`background.speed` in `_config.yml`, in pixels per second; it pauses on hover).

To add images, drop `.jpg / .png / .webp / .avif / .svg` files into `assets/img/bg/` and delete the
`placeholder-*.svg` files. Any shape works; each image is shown full-width at its own height. Keep them under ~500 KB each
([Squoosh](https://squoosh.app/) is good for shrinking them).
The column is hidden on screens narrower than 1100 px, so phones don't download the images.
Visitors can hide it with the `>` button at its top (remembered per browser); the text stays where it is.
The Art page starts with it hidden (`bg_closed: true`).

### Art gallery

1. Put the image in `assets/img/art/`.
2. Add an entry to `_data/art.yml` (file, title, and optionally date and description).

### About me / Links

Plain Markdown: edit `pages/about.md` and `pages/links.md`.

### Other settings (`_config.yml`)

- `header_name`: the big name in the red header bar. `title` is the browser-tab name (the same on every page) and
  the site name in search results, and `tagline` is the small italic text beside the header name.
- `theme_mode`: default color scheme for new visitors (`system`, `light`, or `dark`). Visitors can
  switch with the moon/sun button, and their choice is remembered in their browser.
- `sidebar.pinned_max`, `sidebar.tag_recent`: how many pinned posts, and how many posts per tag, the sidebar shows.

> `_config.yml` is **not** reloaded by `tools/run.sh`. Restart it after editing that file.

---

## 2. How it works

### The big picture

```
 you write                 Jekyll builds (on GitHub, or locally)             visitors get
 ─────────                 ──────────────────────────────────────            ────────────
 _posts/*.md  ──┐
 pages/*.md   ──┤  kramdown: Markdown → HTML
                ├─► Liquid: pour that HTML into a layout  ──────────────►  _site/**/index.html
 _layouts/    ──┤     (default.html = sidebar + header + background)
 _includes/   ──┘
 _sass/ + assets/css/style.scss ── Sass → one CSS file ────────────────►  _site/assets/css/style.css
 assets/js/main.js ─────────────── copied as-is ────────────────────────►  _site/assets/js/main.js
```

Jekyll is a **static site generator**. It runs once, turns your Markdown into plain HTML files, and
the result is uploaded to GitHub Pages. There's no server-side code and no database. Anything
dynamic, such as dark mode, the collapsing sidebar, or rotating backgrounds, happens in the visitor's
browser through `assets/js/main.js`.

### File map

| Path | What it is |
|------|------------|
| `_config.yml` | Site settings. Also read by the templates as `site.*` (e.g. `site.title`). |
| `_posts/` | Blog posts. The file name must start with a date. |
| `pages/` | Stand-alone pages (About, Links, Art, Tags). `permalink:` sets each one's URL. |
| `index.html` | The "New" page: list of all posts, newest first. |
| `_layouts/default.html` | The skeleton of **every** page: sidebar, header, content, background column. |
| `_layouts/post.html` | Wraps a post: title, metadata line (author · date · tags), grey rule. |
| `_layouts/page.html` | Same, for pages. |
| `_includes/head.html` | `<head>`: fonts, KaTeX, CSS, and a tiny script that applies dark mode *before* the page paints (no white flash). |
| `_includes/sidebar.html` | Builds the sidebar: New / Pinned / About / Art / Links / tags. |
| `_includes/background.html` | Decides which background image(s) a page gets. |
| `_data/art.yml` | The list of artworks. Available in templates as `site.data.art`. |
| `_sass/_base.scss` | **Colors and fonts** (CSS variables), including the dark-mode palette. Start here to restyle. |
| `_sass/_layout.scss` | Where things sit: header, content column, background column, phone layout. |
| `_sass/_sidebar.scss` | Sidebar look, collapse animation, phone drawer. |
| `_sass/_content.scss` | Article typography, code blocks, post lists, gallery, lightbox. |
| `_sass/_syntax.scss` | Code-highlighting colors, generated by `rougify style github.light/github.dark`. |
| `assets/js/main.js` | All interactivity (sidebar, dark mode, backgrounds, math, lightbox). Commented by section. |
| `_plugins/posts-lastmod-hook.rb` | Reads git history so a post shows "updated <date>" when it was edited later. |
| `.github/workflows/pages-deploy.yml` | The GitHub Actions recipe that builds, checks, and publishes the site. |
| `_site/` | Build output. Generated, never edit, not committed. |

### Three ideas worth understanding

**Front matter.** The `---` block at the top of a file. It makes Jekyll process the file, and the
values become variables: `title:` in a post is `page.title` in the layout.
Even `assets/css/style.scss` has an (empty) front matter block, which is what tells Jekyll to compile it.

**Liquid.** The `{{ … }}` and `{% … %}` in `_layouts/` and `_includes/`. `{{ page.title }}` prints a
value, and `{% for post in site.posts %}` loops. Everything happens at build time, so visitors only
receive the resulting HTML. For example, `_includes/sidebar.html` finds pinned posts with
`site.posts | where: "pin", true`.

**CSS variables + a `data-theme` attribute = dark mode.** `_sass/_base.scss` defines colors once
(`--panel`, `--text`, …) and redefines them under `html[data-theme="dark"]`. The toggle button just
flips that attribute, and every color on the page follows. The same pattern with classes on `<html>`
(`sidebar-collapsed`, `sidebar-open`) drives the sidebar.

### Deploying

On every push to `main`, `.github/workflows/pages-deploy.yml` runs on GitHub's machines:
install Ruby → `jekyll build` → `htmlproofer` (fails the deploy if an internal link or image is
broken) → publish `_site/` to GitHub Pages. Watch it under the repository's **Actions** tab.
(Repo *Settings → Pages → Source* must be set to **GitHub Actions**.)

### What comes from the internet

Loaded from CDNs at view time, so there's nothing to install:
[Computer Modern web fonts](https://github.com/aaaakshat/cm-web-fonts),
which is also the bold header name (to use another font there, load it in
`_includes/head.html`, e.g. from [Google Fonts](https://fonts.google.com/), and set `--font-name` in
`_sass/_base.scss`), and [KaTeX](https://katex.org/) (on posts only).

---

## 3. Tutorial / learning path

Each step lists an official step-by-step guide, some human-made courses or videos, and an
exercise you can do on this site. If you can already do a step, skip it.

### Step 0: Git and GitHub (how changes get published)

- [Learn Git Branching](https://learngitbranching.js.org/): interactive, visual, in the browser.
- [Pro Git book](https://git-scm.com/book/en/v2): free; chapters 1–3 are enough.
- [GitHub Skills](https://skills.github.com/): short hands-on courses inside real repos.

*Exercise:* edit `pages/about.md`, commit, push, and watch the **Actions** tab deploy it.

### Step 1: Markdown (what you write posts in)

- [Markdown Guide: getting started](https://www.markdownguide.org/getting-started/) and its
  [cheat sheet](https://www.markdownguide.org/cheat-sheet/).
- [kramdown syntax](https://kramdown.gettalong.org/syntax.html): the exact dialect Jekyll uses
  (adds footnotes, definition lists, `{: .class}` attributes, math).

*Exercise:* write a real post with a table, a footnote, and an equation.

### Step 2: HTML and CSS fundamentals

- [MDN: Learn web development](https://developer.mozilla.org/en-US/docs/Learn_web_development):
  Mozilla's structured course and the best reference on the web.
- [The Odin Project: Foundations](https://www.theodinproject.com/paths/foundations/courses/foundations):
  free, project-based, and community-run.
- [freeCodeCamp](https://www.freecodecamp.org/learn/): the *Responsive Web Design* certification
  is interactive, runs in the browser, and is free.
- [Kevin Powell on YouTube](https://www.youtube.com/@KevinPowell): the most approachable CSS teacher around.

*Exercise:* open the site, right-click → **Inspect**, and change `--panel` on `:root` live in DevTools.
Then make it permanent in `_sass/_base.scss`.

### Step 3: CSS layout (flexbox, grid, media queries)

This site's layout is a **grid** (top bar across; sidebar + content below; content + background
inside), with **flexbox** lining up the items inside the top bar. The phone version is a **media query**.
The sidebar animation works by animating one CSS variable, `--sb-current` (see the comment at the top
of `_sass/_layout.scss`).

- [Flexbox Froggy](https://flexboxfroggy.com/) and [Grid Garden](https://cssgridgarden.com/): games, about 30 minutes each.
- CSS-Tricks guides: [Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) and
  [Grid](https://css-tricks.com/snippets/css/complete-guide-grid/). Worth keeping open as references.
- MDN: [Using CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
  (the variables behind dark mode) and
  [Using media queries](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries).
- [web.dev: Learn CSS](https://web.dev/learn/css): Google's free course, one topic per chapter.

*Exercise:* in `_sass/_layout.scss`, change `$bp-bg` so the background column survives down to 900 px.

### Step 4: Sass (the `.scss` files)

Sass is CSS plus conveniences: nesting, `$variables`, and splitting into files.

- [Sass basics](https://sass-lang.com/guide/): one page, covers everything used here.

*Exercise:* find `$corner` in `_sass/_layout.scss`. It's the rounded inside corner where the top bar
meets the sidebar. Set it to `2rem` and watch the curve grow.

### Step 5: Jekyll and Liquid (how pages are assembled)

- **Official step-by-step tutorial:** [Jekyll: Step by Step](https://jekyllrb.com/docs/step-by-step/01-setup/).
  Ten short lessons that build a site from zero, covering the same concepts as this repo. Do this one.
- [CloudCannon's Jekyll tutorial](https://cloudcannon.com/tutorials/jekyll-tutorial/): a written
  and video course by people who build Jekyll tools.
- Reference: [Front matter](https://jekyllrb.com/docs/front-matter/) ·
  [Variables (`site`, `page`, …)](https://jekyllrb.com/docs/variables/) ·
  [Data files](https://jekyllrb.com/docs/datafiles/) ·
  [Jekyll's extra Liquid filters](https://jekyllrb.com/docs/liquid/filters/) ·
  [Liquid language](https://shopify.github.io/liquid/basics/introduction/).
- [Jekyll resources page](https://jekyllrb.com/resources/): community tutorials and video series.

*Exercises:*
1. Add a "Now" entry to the sidebar: create `pages/now.md` with `permalink: /now/`, then copy the
   "Links" `<li>` in `_includes/sidebar.html`.
2. Show a reading-time estimate in `_layouts/post.html`
   (hint: `content | number_of_words | divided_by: 200`).

### Step 6: JavaScript in the browser

`assets/js/main.js` uses only the basics: `querySelector`, `addEventListener`, `classList`,
`localStorage`, `setInterval`, and `matchMedia`.

- [MDN: JavaScript, dynamic client-side scripting](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting).
- [javascript.info](https://javascript.info/): a thorough, well-written modern tutorial. Part 1 is
  the language and Part 2 is the browser (DOM, events).
- MDN reference: [`localStorage`](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
  [`matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia),
  [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog) (the art lightbox).

*Exercise:* make the rotating background pause while the mouse is over it
(hint: `mouseenter`/`mouseleave` on `.bg-panel` and a `paused` flag checked inside `setInterval`).

### Step 7: GitHub Pages and Actions (deployment)

- [GitHub Pages docs](https://docs.github.com/en/pages) and specifically
  [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages),
  which is what `.github/workflows/pages-deploy.yml` does.
- [GitHub Actions docs](https://docs.github.com/en/actions).

*Exercise:* read `pages-deploy.yml` top to bottom. Every step should now make sense.

---

## Credits

Originally generated from the [Chirpy starter](https://github.com/cotes2020/chirpy-starter)
(MIT), then replaced with this custom layout. Fonts: Computer Modern (SIL OFL).
Code colors: Rouge's GitHub theme.
