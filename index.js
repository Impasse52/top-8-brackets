/* 
    Since we can't access the bracket.html's DOM tree after it's been loaded
    onto OBS, this Electron app's only purpose is to modify bracket.json, in 
    the Resources folder. This file acts as the only source of truth when it 
    comes to data relative to the bracket and because of this we can let the
    bracket.html manage itself by checking the bracket.json file each few ms.
*/

const { app, BrowserWindow } = require('electron')

// ! remove before shipping
// require('electron-reload')(__dirname);

app.whenReady().then(async () => {
    const mainWindow = new BrowserWindow({
        width: 720,
        height: 370,
        resizable: false,
        icon: `${__dirname}/Resources/icons/icon.png`,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    // loads the main page
    mainWindow.loadFile('gui.html')

    // removes top bar menu
    mainWindow.removeMenu();

    // opens up dev tools
    // mainWindow.webContents.openDevTools({ mode: 'detach' })

    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
