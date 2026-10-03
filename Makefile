# Usage:
#   make new-post                      # asks for the title
#   make new-post title="My post"      # or pass it directly

SHELL := /bin/bash
# same as `timezone` in _config.yml
export TZ := America/Sao_Paulo
# passed through the environment so quotes in the title survive
export title

.PHONY: new-post
new-post:
	@if [ -z "$$title" ]; then read -rp "Post title: " title; fi; \
	if [ -z "$$title" ]; then echo "No title given, nothing created."; exit 1; fi; \
	slug=$$(echo "$$title" | iconv -f utf-8 -t ascii//TRANSLIT 2>/dev/null || echo "$$title"); \
	slug=$$(echo "$$slug" | tr '[:upper:]' '[:lower:]' | sed -E 's/[^a-z0-9]+/-/g; s/^-+|-+$$//g'); \
	file="_posts/$$(date +%Y-%m-%d)-$$slug.md"; \
	if [ -e "$$file" ]; then echo "$$file already exists, not overwriting."; exit 1; fi; \
	{ \
	  echo "---"; \
	  echo "title: \"$${title//\"/\\\"}\""; \
	  echo "date: $$(date '+%Y-%m-%d %H:%M:%S %z')"; \
	  echo "subtitle:            # optional one-liner under the title"; \
	  echo "tags: []             # e.g. [research, notes]"; \
	  echo "# pin: true          # show it under \"Pinned\" in the sidebar"; \
	  echo "# image: /assets/img/posts/thumb.png   # homepage thumbnail (default: first image)"; \
	  echo "# description:       # summary for search engines and link previews"; \
	  echo "# bg_closed: true    # start with the image column hidden"; \
	  echo "---"; \
	  echo; \
	  echo "Write here."; \
	} > "$$file"; \
	echo "Created $$file"
