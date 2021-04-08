// Modules to control application life and create native browser window
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const glob = require('glob')
const TEMPLATE_GENERATOR =  require('./menuTemplate')

const DEBUG = /--debug/.test(process.argv[2])

let mainWindow = null

function initialize() {
    loadFiles()

    function createWindow() {
        // Create the browser window.
        const WINDOW_OPTIONS = {
            width: 784,
            minWidth: 784,
            height: 380,
            minHeight: 380,
            title: app.getName(),
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                enableRemoteModule: true
            }
        }

        // menu template
        const MENU = TEMPLATE_GENERATOR.generatesMenuTemplate()
        const MAIN_MENU = Menu.buildFromTemplate(MENU)
        Menu.setApplicationMenu(MAIN_MENU)

        // and load the index.html of the app.
        mainWindow = new BrowserWindow(WINDOW_OPTIONS)
        mainWindow.loadFile('index.html')

        // Launch fullscreen with DevTools open, usage: yarn run debug
        if (DEBUG) {
            mainWindow.webContents.openDevTools()
            mainWindow.maximize()
        }

        mainWindow.on('closed', () => {
            mainWindow = null
        })
    }

    app.whenReady().then(() => {
        createWindow()
    })

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

}

// Require each JS file in the main-process/renderer-process dir
function loadFiles() {
    const MAIN_PROCESS_FILES = glob.sync(path.join(__dirname, 'main-process/**/*.js'))
    MAIN_PROCESS_FILES.forEach((file) => {
        require(file)
    })
}

initialize()
