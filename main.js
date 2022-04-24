const { app, BrowserWindow, Menu, globalShortcut } = require("electron")
const path = require('path')
process.env.NODE_ENV = "development"

const isDev = process.env.NODE_ENV !== "production"
const isMac = process.platform === "darwin"

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: 600,
    height: 600,
    icon: path.join(__dirname, `assets/icons/Icon_256x256.png`),
    resizable: isDev,
    backgroundColor: "white"
  })

  mainWindow.loadFile("./app/index.html")
}

const menu = [
    ...(isMac ? [{ role: 'appMenu'}] : []),
  {
    label: 'File',
    submenu: [{
      label: 'Quit',
      accelerator: 'CmdOrCtrl+W',
      click: () => app.quit()
    }]
  },
]

app.on("ready", () => {
  createMainWindow()

  // 메뉴 달아보기
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

  // 전역 숏컷
  globalShortcut.register('CmdOrCtrl+R', () => mainWindow.reload())
  globalShortcut.register(isMac ? 'Command+Alt+I' : 'Ctrl+Shift+I', () => mainWindow.toggleDevTools())

  mainWindow.on('ready', () => mainWindow = null)
})

app.on('window-all-closed', () => {
  if(!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if(BrowserWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})