(() => {
  const HISTORY_PAUSED_BORDER_ID = "incognito-lite-paused-border";
  const HISTORY_PAUSED_STYLE_ID = "incognito-lite-paused-style";
  const HISTORY_PAUSED_KEY = "paused";
  const HISTORY_PAUSED_STYLE = `
    #${HISTORY_PAUSED_BORDER_ID} {
      position: fixed;
      inset: 0;
      z-index: 2147483647;
      pointer-events: none;
      box-sizing: border-box;
      box-shadow:
        inset 0 0 8px 1px rgba(217, 48, 37, 0.48),
        inset 0 0 20px 5px rgba(217, 48, 37, 0.3),
        inset 0 0 38px 10px rgba(217, 48, 37, 0.16);
    }
  `;

  function ensurePausedStyle() {
    let style = document.getElementById(HISTORY_PAUSED_STYLE_ID);

    if (!style) {
      style = document.createElement("style");
      style.id = HISTORY_PAUSED_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }

    style.textContent = HISTORY_PAUSED_STYLE;
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

  if (!window.incognitoLitePausedBorderLoaded) {
    window.incognitoLitePausedBorderLoaded = true;

    browser.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[HISTORY_PAUSED_KEY]) return;

      setPausedBorder(changes[HISTORY_PAUSED_KEY].newValue);
    });
  }

  syncPausedBorder().catch(console.error);
})();
