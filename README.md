# electron-quick-start

**Clone and run for a quick way to see Electron with Bootstrap, jQuery, and ipcRender-ipcMain communication in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/tutorial/quick-start) within the Electron documentation.

Contains Electron 5.0.8 integration with the Bootstrap 4.3 and jQuery 3.4.1 CDNs.


## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/developerblue/electron-bootstrap-jquery-quick-start
# Go into the repository
cd electron-bootstrap-jquery-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Fixes Used for Integration

- [Built ontop of the electron-quick-start application](https://github.com/electron/electron-quick-start) - Electron-quick-start project
- [Fixes Electron require() is not defined in client rederer](https://stackoverflow.com/questions/44391448/electron-require-is-not-defined) - Enables nodeIntegration on the client renderer process
- [Fixes Electron jQuery/$ is not defined in client renderer](https://stackoverflow.com/questions/32621988/electron-jquery-is-not-defined) - Fixes issues from the way Electron imports all 3rd party libraries
- [Contains examples of communicating between ipcMain and ipcRenderer](https://electronjs.org/docs/api/ipc-main) - Showcases communication between the ipcMain and ipcRenderer

## Electron License

[CC0 1.0 (Public Domain)](LICENSE.md)
