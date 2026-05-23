# Incognito Lite

A small Firefox extension that removes visited `http://` and `https://` pages
from local Firefox history while enabled.

This is not private browsing. It does not hide activity from websites, accounts,
downloads, DNS, your ISP, your network, or anything outside Firefox history.

## Features

- Toolbar toggle for history deletion mode.
- State persists across browser reloads.
- Icon changes when deletion mode is active.
- Red page border while active.
- Ignores non-web pages such as `about:` and extension URLs.
- Runs locally. No analytics, tracking, or network service.

## Usage

Click the toolbar button:

- White dot: normal Firefox history.
- Red pause icon: matching visits are removed from local history.

When enabled, Incognito Lite also tries to remove the current active web page
from history.

## Install Locally

1. Open Firefox at `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. Select `manifest.json` from this folder.
4. Pin `Incognito Lite` to the toolbar if needed.

Temporary add-ons are removed when Firefox restarts.

## Development

```sh
npm install --global web-ext
web-ext run
web-ext lint
```

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
- `<all_urls>`: run on normal web pages.

The extension does not send URLs, settings, analytics, or other data anywhere.

## Package

```sh
zip -r incognito-lite-1.0.0.zip manifest.json background.js content-script.js icon-paused.svg icon-unpaused.svg README.md PRIVACY.md amo-listing.md
```

Do not commit release zip files.

## License

No license file is currently included.
