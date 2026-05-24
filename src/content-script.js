(() => {
  const HISTORY_PAUSED_BORDER_ID = "incognito-lite-paused-border";
  const HISTORY_PAUSED_FRAME_ID = "incognito-lite-paused-frame";
  const HISTORY_PAUSED_OLD_STYLE_ID = "incognito-lite-paused-style";
  const HISTORY_PAUSED_KEY = "paused";
  const HISTORY_PAUSED_VERSION = "2";
  const BASE_DEVICE_PIXEL_RATIO = window.devicePixelRatio || 1;
  const extensionApi = globalThis.browser || globalThis.chrome;
  const HISTORY_PAUSED_STYLE = `
    :host {
      all: initial !important;
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      min-width: 100vw !important;
      min-height: 100vh !important;
      max-width: none !important;
      max-height: none !important;
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      background: transparent !important;
      overflow: hidden !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      contain: strict !important;
      isolation: isolate !important;
    }

    :host([popover]) {
      inset: 0 !important;
    }

    #${HISTORY_PAUSED_FRAME_ID} {
      all: initial !important;
      position: absolute !important;
      inset: 0 !important;
      box-sizing: border-box !important;
      pointer-events: none !important;
      box-shadow:
        inset 0 0 var(--incognito-lite-glow-tight-blur, 8px) var(--incognito-lite-glow-tight-spread, 1px) rgba(217, 48, 37, 0.48),
        inset 0 0 var(--incognito-lite-glow-mid-blur, 20px) var(--incognito-lite-glow-mid-spread, 5px) rgba(217, 48, 37, 0.3),
        inset 0 0 var(--incognito-lite-glow-wide-blur, 38px) var(--incognito-lite-glow-wide-spread, 10px) rgba(217, 48, 37, 0.16) !important;
    }
  `;

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

  function getZoomAdjustedPixels(pixels) {
    const devicePixelRatio = window.devicePixelRatio || BASE_DEVICE_PIXEL_RATIO;
    const zoomRatio = devicePixelRatio / BASE_DEVICE_PIXEL_RATIO;

    if (!Number.isFinite(zoomRatio) || zoomRatio <= 0) return `${pixels}px`;

    return `${Math.max(pixels / zoomRatio, 0.5).toFixed(2)}px`;
  }

  function updateGlowMetrics(border) {
    border.style.setProperty("--incognito-lite-glow-tight-blur", getZoomAdjustedPixels(8));
    border.style.setProperty("--incognito-lite-glow-tight-spread", getZoomAdjustedPixels(1));
    border.style.setProperty("--incognito-lite-glow-mid-blur", getZoomAdjustedPixels(20));
    border.style.setProperty("--incognito-lite-glow-mid-spread", getZoomAdjustedPixels(5));
    border.style.setProperty("--incognito-lite-glow-wide-blur", getZoomAdjustedPixels(38));
    border.style.setProperty("--incognito-lite-glow-wide-spread", getZoomAdjustedPixels(10));
  }

  function showInTopLayer(border) {
    if (!border.showPopover) return;

    border.setAttribute("popover", "manual");

    try {
      border.showPopover();
    } catch (error) {
      console.debug("Could not move paused indicator to top layer", error);
    }
  }

  function createPausedBorder() {
    const border = document.createElement("div");
    const shadowRoot = border.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    const frame = document.createElement("div");

    border.id = HISTORY_PAUSED_BORDER_ID;
    border.dataset.incognitoLitePausedBorderVersion = HISTORY_PAUSED_VERSION;
    border.setAttribute("aria-hidden", "true");
    frame.id = HISTORY_PAUSED_FRAME_ID;
    style.textContent = HISTORY_PAUSED_STYLE;

    shadowRoot.append(style, frame);
    document.documentElement.appendChild(border);
    showInTopLayer(border);
    updateGlowMetrics(border);

    return border;
  }

  function setPausedBorder(paused) {
    const existingBorder = document.getElementById(HISTORY_PAUSED_BORDER_ID);
    document.getElementById(HISTORY_PAUSED_OLD_STYLE_ID)?.remove();

    if (!paused) {
      existingBorder?.remove();
      return;
    }

    if (existingBorder) {
      if (existingBorder.dataset.incognitoLitePausedBorderVersion !== HISTORY_PAUSED_VERSION) {
        existingBorder.remove();
        createPausedBorder();
        return;
      }

      showInTopLayer(existingBorder);
      updateGlowMetrics(existingBorder);
      return;
    }

    createPausedBorder();
  }

  function updateExistingBorderMetrics() {
    const existingBorder = document.getElementById(HISTORY_PAUSED_BORDER_ID);

    if (existingBorder) {
      updateGlowMetrics(existingBorder);
    }
  }

  async function syncPausedBorder() {
    const result = await callApi(extensionApi.storage.local, "get", { [HISTORY_PAUSED_KEY]: false });
    setPausedBorder(result[HISTORY_PAUSED_KEY]);
  }

  if (!window.incognitoLitePausedBorderLoaded) {
    window.incognitoLitePausedBorderLoaded = true;

    extensionApi.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[HISTORY_PAUSED_KEY]) return;

      setPausedBorder(changes[HISTORY_PAUSED_KEY].newValue);
    });

    window.addEventListener("resize", updateExistingBorderMetrics, { passive: true });
    window.visualViewport?.addEventListener("resize", updateExistingBorderMetrics, { passive: true });
  }

  syncPausedBorder().catch(console.error);
})();
