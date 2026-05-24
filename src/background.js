const PAUSED_KEY = "paused";
const extensionApi = globalThis.browser || globalThis.chrome;
const actionApi = extensionApi.action || extensionApi.browserAction;
const RETRY_DELETE_DELAYS_MS = [250, 1000];
const ICON_UNPAUSED = extensionApi.action
  ? {
      16: "icons/icon-unpaused-16.png",
      32: "icons/icon-unpaused-32.png",
      48: "icons/icon-unpaused-48.png",
      128: "icons/icon-unpaused-128.png"
    }
  : "icons/icon-unpaused.svg";
const ICON_PAUSED = extensionApi.action
  ? {
      16: "icons/icon-paused-16.png",
      32: "icons/icon-paused-32.png",
      48: "icons/icon-paused-48.png",
      128: "icons/icon-paused-128.png"
    }
  : "icons/icon-paused.svg";

function callApi(apiObject, methodName, ...args) {
  const apiFunction = apiObject[methodName].bind(apiObject);

  if (globalThis.browser) {
    return apiFunction(...args);
  }

  return new Promise((resolve, reject) => {
    apiFunction(...args, (result) => {
      const error = extensionApi.runtime.lastError;

      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve(result);
    });
  });
}

function shouldHandleTab(tab) {
  return tab.id && tab.url && shouldDeleteUrl(tab.url);
}

function delay(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

async function getPaused() {
  const result = await callApi(extensionApi.storage.local, "get", { [PAUSED_KEY]: false });
  return result[PAUSED_KEY];
}

async function setUi(paused) {
  try {
    await callApi(actionApi, "setTitle", {
      title: paused ? "Incognito Lite: history paused" : "Incognito Lite"
    });

    await callApi(actionApi, "setBadgeText", {
      text: ""
    });

    await callApi(actionApi, "setBadgeBackgroundColor", {
      color: "#d93025"
    });

    await callApi(actionApi, "setIcon", {
      path: paused ? ICON_PAUSED : ICON_UNPAUSED
    });
  } catch (error) {
    console.warn("Could not update toolbar state", error);
  }
}

function shouldDeleteUrl(url) {
  return url.startsWith("http://") || url.startsWith("https://");
}

async function deleteFromHistory(url) {
  if (!shouldDeleteUrl(url)) return;
  if (!(await getPaused())) return;

  await callApi(extensionApi.history, "deleteUrl", { url });
}

async function deleteFromHistoryWithRetries(url) {
  await deleteFromHistory(url);

  for (const retryDelay of RETRY_DELETE_DELAYS_MS) {
    await delay(retryDelay);
    await deleteFromHistory(url);
  }
}

async function injectPausedIndicator(tabId) {
  try {
    if (extensionApi.scripting?.executeScript) {
      await callApi(extensionApi.scripting, "executeScript", {
        target: { tabId },
        files: ["src/content-script.js"]
      });
      return;
    }

    await callApi(extensionApi.tabs, "executeScript", tabId, {
      file: "src/content-script.js",
      runAt: "document_start"
    });
  } catch (error) {
    console.warn("Could not update paused indicator for tab", tabId, error);
  }
}

async function syncPausedIndicator() {
  const tabs = await callApi(extensionApi.tabs, "query", {});
  await Promise.all(tabs.filter(shouldHandleTab).map((tab) => injectPausedIndicator(tab.id)));
}

actionApi.onClicked.addListener(async () => {
  const paused = !(await getPaused());
  await callApi(extensionApi.storage.local, "set", { [PAUSED_KEY]: paused });
  await setUi(paused);
  await syncPausedIndicator();

  const tabs = await callApi(extensionApi.tabs, "query", { currentWindow: true, active: true });
  if (paused && tabs[0]?.url) {
    await deleteFromHistoryWithRetries(tabs[0].url);
  }
});

extensionApi.history.onVisited.addListener((historyItem) => {
  deleteFromHistoryWithRetries(historyItem.url).catch(console.error);
});

extensionApi.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;

  deleteFromHistoryWithRetries(details.url).catch(console.error);
});

extensionApi.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status !== "complete" || !tab.url) return;

  deleteFromHistoryWithRetries(tab.url).catch(console.error);
});

getPaused()
  .then(async (paused) => {
    await setUi(paused);
    if (paused) {
      await syncPausedIndicator();
    }
  })
  .catch(console.error);
