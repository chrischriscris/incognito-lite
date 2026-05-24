# Incognito Lite

A small Chrome and Firefox extension that removes visited `http://` and
`https://` pages from local browser history while enabled.

This is not private browsing. It does not hide activity from websites, accounts,
downloads, DNS, your ISP, your network, or anything outside local browser
history.

Requires Chrome with Manifest V3 support or Firefox 140 or newer.

## Features

- Toolbar toggle for history deletion mode.
- State persists across browser reloads.
- Icon changes when deletion mode is active.
- Red page border while active.
- Ignores non-web pages such as `about:` and extension URLs.
- Runs locally. No analytics, tracking, or network service.

## Usage

Click the toolbar button:

- White dot: normal browser history.
- Red pause icon: matching visits are removed from local history.

When enabled, Incognito Lite also tries to remove the current active web page
from history.

## Install Locally in Firefox

1. Open Firefox at `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. Select `manifest.json` from this folder.
4. Pin `Incognito Lite` to the toolbar if needed.

Temporary add-ons are removed when Firefox restarts.

## Install Locally in Chrome

1. Open Chrome at `chrome://extensions`.
2. Enable `Developer mode`.
3. Click `Load unpacked`.
4. Run `./scripts/package-chrome.sh`.
5. Select `dist/chrome/incognito-lite`.
6. Pin `Incognito Lite` to the toolbar if needed.

## Development

```sh
npm install --global web-ext
web-ext run
web-ext lint
```

For Chrome, use `chrome://extensions` and reload the unpacked extension after
editing files.

Project layout:

- `manifest.json`: Firefox extension manifest.
- `manifest.chrome.json`: Chrome extension manifest used by the Chrome package script.
- `src/`: background and content scripts.
- `icons/`: Firefox SVG icons and Chrome PNG icons.
- `scripts/`: packaging helpers.
- `dist/`: generated packages and unpacked Chrome output; do not commit.

Manual checks before release:

- Toolbar icon toggles correctly.
- Pause state survives extension reloads.
- `http://` and `https://` visits are removed only while active.
- `about:` and other non-web URLs are ignored.
- Red page border appears only while active.

## Permissions

- `history`: delete matching local history entries.
- `storage`: remember the toggle state.
- `tabs`: inspect tab URLs and update the indicator.
- `webNavigation`: detect page navigations.
- `scripting`: update the visible paused indicator in already-open tabs.
- `<all_urls>`: run on normal web pages.

The extension does not send URLs, settings, analytics, or other data anywhere.

## Package

Firefox:

```sh
./scripts/package-firefox.sh
```

Chrome:

```sh
./scripts/package-chrome.sh
```

Do not commit release zip files.

## License

No license file is currently included.
