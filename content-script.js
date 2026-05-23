(() => {
  if (window.incognitoLitePausedBorderLoaded) {
    return;
  }

  window.incognitoLitePausedBorderLoaded = true;

  const HISTORY_PAUSED_BORDER_ID = "incognito-lite-paused-border";
  const HISTORY_PAUSED_STYLE_ID = "incognito-lite-paused-style";
  const HISTORY_PAUSED_KEY = "paused";

  function ensurePausedStyle() {
    if (document.getElementById(HISTORY_PAUSED_STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = HISTORY_PAUSED_STYLE_ID;
    style.textContent = `
      #${HISTORY_PAUSED_BORDER_ID} {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        pointer-events: none;
        box-sizing: border-box;
        border: 4px solid rgba(217, 48, 37, 0.92);
        box-shadow:
          inset 0 0 0 2px rgba(255, 255, 255, 0.72),
          inset 0 0 18px rgba(217, 48, 37, 0.65),
          0 0 24px rgba(217, 48, 37, 0.8);
      }
    `;

    (document.head || document.documentElement).appendChild(style);
  }

  function setPausedBorder(paused) {
    const existingBorder = document.getElementById(HISTORY_PAUSED_BORDER_ID);

    if (!paused) {
      existingBorder?.remove();
      return;
    }

    ensurePausedStyle();

    if (existingBorder) return;

    const border = document.createElement("div");
    border.id = HISTORY_PAUSED_BORDER_ID;
    border.setAttribute("aria-hidden", "true");
    document.documentElement.appendChild(border);
  }

  async function syncPausedBorder() {
    const result = await browser.storage.local.get({ [HISTORY_PAUSED_KEY]: false });
    setPausedBorder(result[HISTORY_PAUSED_KEY]);
  }

  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local" || !changes[HISTORY_PAUSED_KEY]) return;

    setPausedBorder(changes[HISTORY_PAUSED_KEY].newValue);
  });

  syncPausedBorder().catch(console.error);
})();
