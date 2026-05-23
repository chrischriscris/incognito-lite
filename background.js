const PAUSED_KEY = "paused";
const ICON_UNPAUSED = "icon-unpaused.svg";
const ICON_PAUSED = "icon-paused.svg";

function shouldHandleTab(tab) {
  return tab.id && tab.url && shouldDeleteUrl(tab.url);
}

async function getPaused() {
  const result = await browser.storage.local.get({ [PAUSED_KEY]: false });
  return result[PAUSED_KEY];
}

async function setUi(paused) {
  await browser.browserAction.setTitle({
    title: paused ? "Incognito Lite: history paused" : "Incognito Lite"
  });

  await browser.browserAction.setBadgeText({
    text: ""
  });

  await browser.browserAction.setBadgeBackgroundColor({
    color: "#d93025"
  });

  await browser.browserAction.setIcon({
    path: paused ? ICON_PAUSED : ICON_UNPAUSED
  });
}

function shouldDeleteUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

async function deleteFromHistory(url) {
  if (!shouldDeleteUrl(url)) return;
  if (!(await getPaused())) return;

  await browser.history.deleteUrl({ url });
}

async function injectPausedIndicator(tabId) {
  try {
    await browser.tabs.executeScript(tabId, {
      file: "content-script.js",
      runAt: "document_start"
    });
  } catch (error) {
    console.warn("Could not update paused indicator for tab", tabId, error);
  }
}

async function syncPausedIndicator() {
  const tabs = await browser.tabs.query({});
  await Promise.all(tabs.filter(shouldHandleTab).map((tab) => injectPausedIndicator(tab.id)));
}

browser.browserAction.onClicked.addListener(async () => {
  const paused = !(await getPaused());
  await browser.storage.local.set({ [PAUSED_KEY]: paused });
  await setUi(paused);
  await syncPausedIndicator();

  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  if (paused && tabs[0]?.url) {
    await deleteFromHistory(tabs[0].url);
  }
});

browser.history.onVisited.addListener((historyItem) => {
  deleteFromHistory(historyItem.url).catch(console.error);
});

browser.webNavigation.onCommitted.addListener((details) => {
  deleteFromHistory(details.url).catch(console.error);
});

getPaused()
  .then(async (paused) => {
    await setUi(paused);
    if (paused) {
      await syncPausedIndicator();
    }
  })
  .catch(console.error);
