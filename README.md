# Incognito Lite

A small Firefox extension that adds a toolbar toggle for temporarily removing visited pages from local browser history.

When enabled, it keeps your normal browser session intact, so you stay logged into sites. It does not clear cookies, cache, downloads, website-side history, search-account history, DNS logs, ISP logs, or network logs.

## Load In Firefox

1. Open `about:debugging#/runtime/this-firefox`.
2. Click `Load Temporary Add-on...`.
3. Select `manifest.json` from this folder.
4. Use the toolbar button. It shows a white dot when history is normal and a pause icon when history is paused.

If it does not appear, open the extensions button/puzzle-piece menu, right-click `Incognito Lite`, and choose `Pin to Toolbar`. You can also open `Customize Toolbar...` and drag the icon into the toolbar.

## Use

Click the toolbar button to toggle history deletion.

When the icon is the red pause symbol, local history is being auto-deleted for normal `http` and `https` pages. Click again to resume normal history.

## Notes

Firefox extensions cannot truly stop history from being written before it happens. This extension removes matching URLs immediately after navigation/history events fire.

For a production add-on package, use Mozilla's `web-ext` tool:

```sh
npm install --global web-ext
web-ext lint
web-ext run
```

## Publishing Checklist

Use these details when submitting to Mozilla Add-ons.

Name: `Incognito Lite`

Summary: `Temporarily auto-removes visited pages from local Firefox history while enabled.`

Description: `Incognito Lite adds a simple toolbar toggle for automatically deleting local Firefox history entries while enabled. It keeps your normal browser session active, so you can stay logged into sites without opening a private window. It is not full private browsing and does not hide activity from websites, search engines, networks, ISPs, DNS providers, or account-level search history.`

Permissions explanation: `The history permission is used to delete local history entries while the extension is enabled. The tabs and webNavigation permissions are used to detect page navigation and update/delete the current visited URL. The storage permission is used only to save whether the toggle is enabled.`
