const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    on(channel, func) {
      const validChannels = ['ipc-example', 'path'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    getPath() {
      ipcRenderer.send('path');
    },
    getPathOnce(channel, func) {
      const validChannels = ['path'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
    async isValidPath(arg) {
      return ipcRenderer.invoke('path', arg);
    },
    async changeFilenames(arg) {
      return ipcRenderer.invoke('change-files', arg);
    },
    async generateTxtFile(arg) {
      return ipcRenderer.invoke('view-filenames', arg);
    },
  },
});
