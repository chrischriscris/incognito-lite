# Repository Guidelines

## Project Structure & Module Organization

This repository contains a small Firefox extension. `manifest.json` defines add-on metadata, permissions, background scripts, icons, and Firefox compatibility. `background.js` contains the toolbar toggle, persisted pause state, icon updates, and history deletion hooks. `content-script.js` contains the in-page paused indicator. `icon-paused.svg` and `icon-unpaused.svg` are toolbar assets. `README.md`, `PRIVACY.md`, and `amo-listing.md` document usage, privacy behavior, and Mozilla Add-ons listing copy. Packaged release zips are generated artifacts and should not be committed.

There is no separate `src/` or `tests/` directory. Keep new code close to the existing extension surface unless the project grows enough to justify more folders.

## Build, Test, and Development Commands

- `web-ext lint`: validates the extension for Firefox and Mozilla Add-ons submission.
- `web-ext run`: launches Firefox with the extension loaded for local testing.
- Manual load: open `about:debugging#/runtime/this-firefox`, choose `Load Temporary Add-on...`, then select `manifest.json`.
- Package example: `zip -r incognito-lite-1.0.0.zip manifest.json background.js content-script.js icon-paused.svg icon-unpaused.svg README.md PRIVACY.md amo-listing.md`

Install Mozilla's tooling with `npm install --global web-ext` if it is not already available.

## Coding Style & Naming Conventions

Use plain JavaScript compatible with Firefox Manifest V2 background scripts. Follow `background.js`: two-space indentation, double quotes, semicolons, `const` for constants, and `async`/`await` for browser APIs. Name constants in `UPPER_SNAKE_CASE`, functions in `camelCase`, and keep event handlers small by delegating to named helpers.

Do not introduce a build step unless it clearly improves maintainability. Prefer direct, readable browser-extension code over framework dependencies.

## Testing Guidelines

There is no automated test suite yet. Before submitting changes, run `web-ext lint` and manually test in Firefox. Verify the toolbar icon toggles, pause state persists across reloads, and `http`/`https` visits are removed from local history only while paused. Check that non-web URLs such as `about:` pages are ignored.

If tests are added later, place them under `tests/` and name files after behavior, for example `history-deletion.test.js`.

## Commit & Pull Request Guidelines

The current history uses short, imperative commit messages such as `bootstrap - firts implementation`. Keep future messages concise and action-oriented, for example `fix paused icon state`.

Pull requests should include a brief description, manual test results, any permission or privacy impact, and screenshots only when UI or icon behavior changes. Note whether the packaged zip was generated for release testing.

## Security & Configuration Tips

Treat permission changes as high-impact. If `manifest.json` permissions change, update `README.md`, `amo-listing.md`, and `PRIVACY.md` so users and reviewers understand why.
