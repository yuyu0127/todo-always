const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld(
    "electron",
    {
        fs: require("fs"),
        ipcRenderer: ipcRenderer,
        closeWindow: () => ipcRenderer.send('close-window'),
        minimizeWindow: () => ipcRenderer.send('minimize-window'),
        toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top'),
        authenticate: () => ipcRenderer.invoke('auth-start'),
    }
);