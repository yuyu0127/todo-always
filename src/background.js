'use strict'

import { app, protocol, BrowserWindow, Tray, Menu, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const { OAUTH_CLIENT } = require('./secrets');
const { OAuth2Client } = require('google-auth-library');
const isDevelopment = process.env.NODE_ENV !== 'production'

const fs = require('fs')
const path = require("path")
let tray = null
let win = null


const initOAuthClient = () => {
  return new OAuth2Client({
    clientId: OAUTH_CLIENT.client_id,
    clientSecret: OAUTH_CLIENT.client_secret,
    redirectUri: 'urn:ietf:wg:oauth:2.0:oob',
  });
};

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow() {
  createConfigIfNotExists()
  // Create the browser window.
  win = new BrowserWindow({
    ...getBounds(),
    frame: false,
    transparent: true,
    skipTaskbar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    }
  })

  ipcMain.on('close-window', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });
  ipcMain.on('minimize-window', () => {
    win.minimize()
  });

  ipcMain.handle('auth-start', async () => {
    const client = initOAuthClient();
    const url = client.generateAuthUrl({
      scope: ['https://www.googleapis.com/auth/tasks'],
    });
    const auth = new BrowserWindow({ x: 0, y: 0, useContentSize: true });
    const code = await getOAuthCodeByInteraction(auth, url);
    const response = await client.getToken(code);
    return response.tokens;
  });

  ipcMain.handle('toggle-always-on-top', () => {
    win.setAlwaysOnTop(!win.isAlwaysOnTop())
    return win.isAlwaysOnTop()
  });

  win.on('close', () => {
    fs.writeFileSync('restore.json', JSON.stringify(win.getBounds()))
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    // if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

async function createTray() {
  let imgFilePath
  if (process.platform === 'win32') { // Windows
    imgFilePath = __dirname + '/images/icon.ico'
  }
  else { // macOS
    imgFilePath = __dirname + '/images/icon.png'
  }
  const contextMenu = Menu.buildFromTemplate([
    { label: '表示', click: () => win.focus() },
    { label: '終了', role: 'quit' },
  ])
  tray = new Tray(imgFilePath)
  tray.setToolTip('ToDo Always')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => win.focus())
}

function getBounds() {
  let bounds = null;
  try {
    bounds = JSON.parse(fs.readFileSync('restore.json', { encoding: 'utf8' }))
  } catch (e) {
    bounds = { width: 310, height: 280 }
  }
  return bounds;
}

function getOAuthCodeByInteraction(interactionWindow, authPageURL) {
  interactionWindow.loadURL(authPageURL, { userAgent: 'Chrome' });
  return new Promise((resolve, reject) => {
    const onclosed = () => {
      reject('Interaction ended intentionally ;(');
    };
    interactionWindow.on('closed', onclosed);
    interactionWindow.on('page-title-updated', (ev) => {
      const url = new URL(ev.sender.getURL());
      if (url.searchParams.get('approvalCode')) {
        interactionWindow.removeListener('closed', onclosed);
        interactionWindow.close();
        return resolve(url.searchParams.get('approvalCode'));
      }
      if ((url.searchParams.get('response') || '').startsWith('error=')) {
        interactionWindow.removeListener('closed', onclosed);
        interactionWindow.close();
        return reject(url.searchParams.get('response'));
      }
    });
  });
}

function createConfigIfNotExists() {
  if (!fs.existsSync('config.json')) {
    const defaultConfig = {
      "hideDeletedTask": true,
      "hideDoneTask": false,
      "sortByDeadline": true,
      "sortByStatus": true,
      "appearances": {
        "main.background.color": "16, 16, 16",
        "main.background.alpha": 0.9,
        "main.foreground.color": "255, 255, 255",
        "main.foreground.alpha": 0.8,
        "quiet.foreground.color": "255, 255, 255",
        "quiet.foreground.alpha": 0.3,
        "highlighted.foreground.color": "255, 32, 32",
        "highlighted.foreground.alpha": 0.9,
        "modal.background.color": "32, 32, 32",
        "modal.background.alpha": 0.9,
        "theme.color": "108, 192, 228",
        "theme.alpha": 0.8,
        "bar.background.color": "32, 64, 80",
        "bar.background.alpha": 0.9,
        "bar.foreground.color": "255, 255, 255",
        "bar.foreground.alpha": 0.5
      },
      "localize": {
        "taskNamePlaceholder": "タスクを入力しよう！",
        "taskNameNotSet": "タスク未設定",
        "deadlineNotSet": "締切なし",
        "dateFormat": "M/D(dd) HH:mm",
        "day": "日",
        "hour": "時間",
        "min": "分",
        "sec": "秒",
        "remainingFormat": "あと %s",
        "overFormat": "%s 超過"
      }
    }
    fs.writeFileSync('config.json', JSON.stringify(defaultConfig, null, '    '))
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  createTray()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
