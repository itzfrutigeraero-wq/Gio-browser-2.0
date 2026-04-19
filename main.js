const { app, BrowserWindow, session, dialog } = require('electron');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // 🌐 Your Gio Browser homepage (replace this)
  const HOME_URL = "https://gio-performance.preview.emergentagent.com/";

  win.loadURL(HOME_URL);

  // 🛡️ Simple safety system
  const blockedSites = [
    "sketchy-download",
    "free-crack",
    "keygen",
    "virus"
  ];

  function isDanger(url) {
    return blockedSites.some(b => url.includes(b));
  }

  // 🚨 Intercept navigation (like Chrome safety system)
  win.webContents.on('will-navigate', (event, url) => {
    if (isDanger(url)) {
      event.preventDefault();

      const choice = dialog.showMessageBoxSync(win, {
        type: "warning",
        buttons: ["Go Back", "Proceed"],
        defaultId: 0,
        title: "⚠️ Safety Warning",
        message: "This site may be unsafe and can be tricking you to download malware.",
        detail: url
      });

      if (choice === 1) {
        win.loadURL(url);
      }
    }
  });

  // 📥 Download protection
  session.defaultSession.on('will-download', (event, item) => {
    const url = item.getURL();

    if (isDanger(url)) {
      item.cancel();

      dialog.showErrorBox(
        "Blocked Download",
        "This file was blocked for safety reasons."
      );
    }
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
