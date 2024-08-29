import { app, BrowserWindow, session, ipcMain, BrowserWindowConstructorOptions } from 'electron';
import { ElectronBlocker } from '@cliqz/adblocker-electron';
import fetch from 'cross-fetch';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'Daily Shinto Affirmation Quotes & Education',
    icon: path.join(__dirname, 'assets/icons/icon.png'), // Attribution: https://www.flaticon.com/free-icon/shinto_7299026
    webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
      },
    autoHideMenuBar: true,
  });

  // Set up the ad blocker
  const blocker = await ElectronBlocker.fromPrebuiltAdsAndTracking(fetch);
  blocker.enableBlockingInSession(session.defaultSession);

  // Load the index.html file
  await mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Load the URL
  // await mainWindow.loadURL('https://www.mimusubi.com/'); // Don't need it right now

  // Prevent opening new windows
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Handle URL or block it
    console.log(`Blocked popup attempt to: ${url}`);
    return { action: 'deny' }; // Block the popup
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
