# Incognito Lite AMO Listing Draft

## Summary

Temporarily auto-removes visited pages from local Firefox history while enabled.

## Description

Incognito Lite adds a simple toolbar toggle for automatically deleting local Firefox history entries while enabled.

It keeps your normal browser session active, so you can stay logged into sites without opening a private window. Click the toolbar icon once to pause local history. Click again to resume normal history.

The icon shows a white dot when local history is normal and a pause symbol when history deletion is active. Regular web pages also show a red glow border while history deletion is active.

Important: Incognito Lite is not full private browsing. It only removes local Firefox history entries. It does not hide activity from websites, search engines, networks, ISPs, DNS providers, account-level search history, downloads, cookies, or cache.

## Permissions Explanation

History: used to delete local history entries while pause mode is enabled.

Tabs and webNavigation: used to detect page navigation, remove the current visited URL from local history, and show the paused indicator on open web tabs.

Storage: used only to save whether the toolbar toggle is enabled.

Host access: used so normal http and https page visits can be detected and removed from local history, and so those pages can show the paused indicator while pause mode is enabled.

## Privacy Policy

Incognito Lite does not collect, transmit, sell, or share any personal data. All behavior happens locally in Firefox.
