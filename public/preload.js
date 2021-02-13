const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld(
    "requires",
    {
        fs: require("fs"),
        ipcRenderer: ipcRenderer,
    }
);