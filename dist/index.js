"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const adblocker_electron_1 = require("@cliqz/adblocker-electron");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const path_1 = __importDefault(require("path"));
let mainWindow = null;
const createWindow = () => __awaiter(void 0, void 0, void 0, function* () {
    mainWindow = new electron_1.BrowserWindow({
        width: 1280,
        height: 720,
        title: 'Daily Shinto Affirmation Quotes & Education',
        icon: path_1.default.join(__dirname, 'assets/icons/icon.png'), // Attribution: https://www.flaticon.com/free-icon/shinto_7299026
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        autoHideMenuBar: true,
    });
    // Set up the ad blocker
    const blocker = yield adblocker_electron_1.ElectronBlocker.fromPrebuiltAdsAndTracking(cross_fetch_1.default);
    blocker.enableBlockingInSession(electron_1.session.defaultSession);
    // Load the index.html file
    yield mainWindow.loadFile(path_1.default.join(__dirname, 'index.html'));
    // Load the URL
    //await mainWindow.loadURL('https://www.mimusubi.com/');
    // Prevent opening new windows
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        // Handle URL or block it
        console.log(`Blocked popup attempt to: ${url}`);
        return { action: 'deny' }; // Block the popup
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
