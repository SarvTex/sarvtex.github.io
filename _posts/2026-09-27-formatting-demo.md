---
title: Formatting demo
date: 2026-09-27 10:00:00 -0300
subtitle: Everything a post can contain, in one place.
tags: [meta, demo]
pin: true                 # shows under "Pinned" in the sidebar (max 3)
description: A tour of what a post can contain — delete this file whenever you like.
# bg_closed: true          # start with the image column hidden on this page
---

This post shows the building blocks available when writing. Look at its source in
`_posts/2026-09-27-formatting-demo.md` to see the Markdown behind each part.

## Text

Regular paragraphs, *italic*, **bold**, `inline code`, and [links](https://jekyllrb.com/).

> A block quote, for when someone else said it better.

- a bullet list
- with two items

1. and a numbered
2. one

## Math

Inline math uses double dollars inside a sentence: $$e^{i\pi} + 1 = 0$$.
A display equation is a `$$ … $$` block on its own lines:

$$
\int_{-\infty}^{\infty} e^{-x^2}\,dx = \sqrt{\pi}
$$

## Code

```python
def fib(n: int) -> int:
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
```

## Tables

| Symbol | Meaning        |
|--------|----------------|
| $$\alpha$$ | learning rate |
| $$\beta$$  | momentum      |
