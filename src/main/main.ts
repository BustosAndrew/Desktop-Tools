/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

// updates every filename within the directory/subdirectories if any contains characters that are searched for
// either replaces/deletes the matching characters within a filename
// returns the number of filenames changed, if any
const fileUpdater = (contents: string[], arg: any[], numChanged: number) => {
  contents.forEach((content) => {
    const resolvedContent = path.resolve(arg[0], content); // arg[0] = path passed in by user
    const stat = fs.statSync(resolvedContent);
    if (stat.isDirectory()) {
      const newPath: string = arg[0] + '\\' + content;
      const folder: string[] = fs.readdirSync(newPath);
      numChanged = fileUpdater(
        folder,
        [newPath, arg[1], arg[2], arg[3]],
        numChanged
      ); // arg[1] = characters being searched, arg[2] = characters to replace with
    } else if (content.indexOf(arg[1]) !== -1) {
      let newFilename = '';
      // arg[3] = replaceAll?
      if (arg[3]) newFilename = content.replaceAll(arg[1], arg[2]);
      else newFilename = content.replace(arg[1], arg[2]);
      // replacing old file path with new one
      fs.renameSync(arg[0] + '\\' + content, arg[0] + '\\' + newFilename);
      numChanged += 1;
    }
  });
  return numChanged;
};

// updates every folder name within the directory/subdirectories if any contains characters that are searched for
// either replaces/deletes the matching characters within a folder name
// returns the number of folder names changed, if any
const folderUpdater = (contents: string[], arg: any[], numChanged: number) => {
  if (!contents) return 0;

  contents.forEach((content) => {
    const resolvedContent = path.resolve(arg[0], content); // arg[0] = path passed in by user
    const stat = fs.statSync(resolvedContent);
    if (!stat.isDirectory()) {
      return;
    }

    if (content.indexOf(arg[1]) !== -1) {
      let newFolderName = '';
      // arg[3] = replaceAll?
      if (arg[3]) newFolderName = content.replaceAll(arg[1], arg[2]);
      else newFolderName = content.replace(arg[1], arg[2]);
      // replacing old file path with new one
      fs.renameSync(arg[0] + '\\' + content, arg[0] + '\\' + newFolderName);
      // console.log(newFolderName);
      numChanged += 1;
      const newPath: string = arg[0] + '\\' + newFolderName;
      const folder: string[] = fs.readdirSync(newPath);
      numChanged = folderUpdater(
        folder,
        [newPath, arg[1], arg[2], arg[3]],
        numChanged
      ); // arg[1] = characters being searched, arg[2] = characters to replace with
    } else {
      const newPath: string = arg[0] + '\\' + content;
      const folder: string[] = fs.readdirSync(newPath);
      numChanged = folderUpdater(
        folder,
        [newPath, arg[1], arg[2], arg[3]],
        numChanged
      );
    }
  });
  return numChanged;
};

// will print every filename in the directory/subdirectories
const viewFiles = (contents: string[], dir: string, txtOutput: string) => {
  contents.forEach((content) => {
    const resolvedContent = path.resolve(dir, content);
    const stat = fs.statSync(resolvedContent);
    if (stat.isDirectory()) {
      return; // continue;
    }
    txtOutput += dir + '\\' + content + '\n';
  });

  contents.forEach((content) => {
    const resolvedContent = path.resolve(dir, content);
    const stat = fs.statSync(resolvedContent);
    if (stat.isDirectory()) {
      const newDir: string = dir + '\\' + content;
      const folder: string[] = fs.readdirSync(newDir);
      txtOutput = viewFiles(folder, newDir, txtOutput); // if there are more filenames within a subfolder, run this func again inside it
    }
  });
  return txtOutput;
};

// will print every folder name in the directory/subdirectories
const viewFolders = (contents: string[], dir: string, txtOutput: string) => {
  contents.forEach((content) => {
    const resolvedContent = path.resolve(dir, content);
    const stat = fs.statSync(resolvedContent);
    if (!stat.isDirectory()) {
      return;
    }
    txtOutput += dir + '\\' + content + '\n';
    const newDir: string = dir + '\\' + content;
    const folder: string[] = fs.readdirSync(newDir);
    txtOutput = viewFolders(folder, newDir, txtOutput); // if there are more folders within a subfolder, run this func again inside it
  });
  return txtOutput;
};

// template code (ignore)
ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg + 'po'));
  event.reply('ipc-example', msgTemplate('pong'));
});

// nothing passed into arg
ipcMain.on('path', async (event, arg) => {
  // console.log(arg);
  if (mainWindow !== null) {
    // opens a file explorer to select a folder
    dialog
      .showOpenDialog(mainWindow, {
        properties: ['openDirectory'],
      })
      .then(({ filePaths }) => {
        event.reply('path', filePaths[0]); // filePaths[0] = folder selected
        console.log(filePaths);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

// returns number of filenames changed, if any
ipcMain.handle('change-files', async (event, arg) => {
  let numChanged = 0;
  const contents = fs.readdirSync(arg[0]); // arg[0] = valid folder path
  numChanged = fileUpdater(contents, arg, numChanged);
  return { status: 'Success', numChanged: numChanged };
});

// returns number of folder names changed, if any
ipcMain.handle('change-folders', async (event, arg) => {
  let numChanged = 0;
  const contents = fs.readdirSync(arg[0]); // arg[0] = valid folder path
  numChanged = folderUpdater(contents, arg, numChanged);
  return { status: 'Success', numChanged: numChanged };
});

// returns filenames if a valid path is passed into arg
ipcMain.handle('path', async (event, arg) => {
  try {
    const filenames = fs.readdirSync(arg);
    return filenames;
  } catch (error) {
    return 'Invalid folder path!';
  }
});

// returns the txt file location once generated or an error
// lists either filenames/folder names
ipcMain.handle('view-contents', async (event, arg) => {
  if (!fs.existsSync(app.getPath('desktop') + '/logs')) {
    fs.mkdirSync(app.getPath('desktop') + '/logs');
  }

  try {
    let txtOutput = '';
    app.setAppLogsPath(app.getPath('desktop') + '/logs');
    const logsPath: string = app.getPath('logs');
    const contents = fs.readdirSync(arg[0]); // arg[0] = valid folder path
    txtOutput +=
      'Contents of directory ' + arg[0] + ' and its subdirectories:\n';
    // arg[2] = viewFolders (true/false)
    if (arg[2]) txtOutput = viewFolders(contents, arg[0], txtOutput);
    else txtOutput = viewFiles(contents, arg[0], txtOutput);
    fs.writeFileSync(logsPath + '/' + arg[1], txtOutput); // arg[1] = passed in txt filename
    return logsPath; // txt file location
  } catch (error) {
    return error;
  }
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 728,
    height: 728,
    maximizable: false,
    fullscreenable: false,
    resizable: false,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
